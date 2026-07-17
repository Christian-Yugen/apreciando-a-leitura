#!/usr/bin/env node
/**
 * Migração oficial do Blogger para o novo Apreciando a Leitura.
 *
 * Busca TODAS as postagens pelo feed público do Blogger, pagina os resultados
 * e preserva título, data, URL original, marcadores, conteúdo e imagens.
 *
 * Correções importantes:
 * - imagens envolvidas por links do Blogger são convertidas corretamente;
 * - URLs gigantes não aparecem soltas no texto;
 * - imagens Base64 não são usadas como capa;
 * - a importação usa transação e pode ser executada novamente sem duplicar.
 *
 * Uso:
 *   pnpm migrate:blogger
 *   pnpm migrate:blogger -- --write-db
 */

import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import mysql from "mysql2/promise";

const BLOG_URL =
  process.env.BLOGGER_URL || "https://www.apreciandoaleitura.com";

const OUTPUT = path.resolve("data/blogger-posts.json");
const PAGE_SIZE = 150;

const decode = (value = "") =>
  value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCharCode(Number(code)),
    );

/**
 * Converte o HTML legado para Markdown limpo.
 *
 * A ordem das substituições é intencional:
 * 1. trata primeiro imagens que estão dentro de links;
 * 2. depois imagens comuns;
 * 3. só então links de texto.
 *
 * Isso evita Markdown inválido como:
 * [![](imagem)](url-gigantesca)
 * que alguns renderizadores exibem como "[blocked]" e URL solta.
 */
function htmlToMarkdown(html = "") {
  return decode(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")

    // Imagem envolvida em link: mantém somente a imagem.
    .replace(
      /<a\b[^>]*href=["'][^"']*["'][^>]*>\s*<img\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/a>/gi,
      "\n\n![]($1)\n\n",
    )

    // Imagem comum.
    .replace(
      /<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi,
      "\n\n![]($1)\n\n",
    )

    // Links textuais: preserva o texto visível.
    .replace(
      /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
      "[$2]($1)",
    )

    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, "**$2**")
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, "*$2*")
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "\n- $1")
    .replace(/<(br\s*\/?|\/p|\/div|\/blockquote)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")

    // Remove resíduos específicos de conversões antigas.
    .replace(/^\s*\[blocked\]\s*$/gim, "")
    .replace(/^\s*]\s*$/gim, "")
    .replace(/^\s*\(\s*https?:\/\/[^)]+\s*\)\s*$/gim, "")

    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Retorna somente uma URL externa HTTP/HTTPS válida para uso como capa.
 * Imagens data:image/... seguem no conteúdo, mas não são usadas na Home.
 */
function firstImage(html = "", entry = {}) {
  const media = entry["media$thumbnail"]?.url?.trim();

  if (/^https?:\/\//i.test(media || "")) {
    return media.replace(/\/s72-c\//, "/s1200/");
  }

  const matches = html.matchAll(
    /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi,
  );

  for (const match of matches) {
    const src = decode(match[1] ?? "").trim();

    if (!src) continue;
    if (/^data:image\//i.test(src)) continue;
    if (!/^https?:\/\//i.test(src)) continue;

    return src;
  }

  return null;
}

function sourceUrl(entry) {
  return (
    entry.link?.find((link) => link.rel === "alternate")?.href ?? null
  );
}

function slugFromUrl(url, title) {
  const fromUrl = url?.match(
    /\/\d{4}\/\d{2}\/([^/?#]+)\.html/,
  )?.[1];

  if (fromUrl) return fromUrl;

  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

function cleanExcerpt(content = "") {
  return content
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=\s]+/gi, " ")
    .replace(/https?:\/\/[^\s<>"')\]]+/gi, " ")
    .replace(/(^|\s)[#>*_`~]{1,6}(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320)
    .trim();
}

function normalizeEntry(entry) {
  const rawHtml = entry.content?.$t ?? entry.summary?.$t ?? "";
  const content = htmlToMarkdown(rawHtml);
  const url = sourceUrl(entry);

  const labels = (entry.category ?? [])
    .map((item) => item.term)
    .filter(Boolean);

  const published = entry.published?.$t ?? entry.updated?.$t;
  const title = decode(entry.title?.$t ?? "Sem título");

  return {
    legacyId: entry.id?.$t ?? url,
    slug: slugFromUrl(url, title),
    title,
    author: "Elaise G. Lima",
    genre: labels[0] ?? "Literatura",
    labels,
    reviewDate: published,
    excerpt: cleanExcerpt(content),
    content,
    coverImageUrl: firstImage(rawHtml, entry),
    purchaseLink: null,
    sourceUrl: url,
    source: "blogger",
  };
}

async function fetchAllPosts() {
  const posts = [];
  let startIndex = 1;

  while (true) {
    const url =
      `${BLOG_URL}/feeds/posts/default` +
      `?alt=json&max-results=${PAGE_SIZE}&start-index=${startIndex}`;

    console.log(
      `Buscando postagens ${startIndex}–${startIndex + PAGE_SIZE - 1}...`,
    );

    const response = await fetch(url, {
      headers: {
        "user-agent": "ApreciandoALeitura-Migrator/1.2",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Blogger respondeu ${response.status}: ${response.statusText}`,
      );
    }

    const json = await response.json();
    const entries = json.feed?.entry ?? [];

    posts.push(...entries.map(normalizeEntry));

    if (entries.length < PAGE_SIZE) break;
    startIndex += PAGE_SIZE;
  }

  return posts.sort(
    (a, b) =>
      new Date(b.reviewDate).getTime() -
      new Date(a.reviewDate).getTime(),
  );
}

async function writeDatabase(posts) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Defina DATABASE_URL no arquivo .env para usar --write-db.",
    );
  }

  const connection = await mysql.createConnection(
    process.env.DATABASE_URL,
  );

  try {
    await connection.beginTransaction();

    for (const [index, post] of posts.entries()) {
      await connection.execute(
        `
          INSERT INTO reviews
            (
              legacyId,
              slug,
              title,
              author,
              genre,
              labels,
              reviewDate,
              excerpt,
              content,
              coverImageUrl,
              purchaseLink,
              sourceUrl
            )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            slug = VALUES(slug),
            title = VALUES(title),
            author = VALUES(author),
            genre = VALUES(genre),
            labels = VALUES(labels),
            reviewDate = VALUES(reviewDate),
            excerpt = VALUES(excerpt),
            content = VALUES(content),
            coverImageUrl = VALUES(coverImageUrl),
            purchaseLink = VALUES(purchaseLink),
            sourceUrl = VALUES(sourceUrl),
            updatedAt = NOW()
        `,
        [
          post.legacyId,
          post.slug,
          post.title,
          post.author,
          post.genre,
          JSON.stringify(post.labels),
          new Date(post.reviewDate),
          post.excerpt,
          post.content,
          post.coverImageUrl,
          post.purchaseLink,
          post.sourceUrl,
        ],
      );

      if ((index + 1) % 50 === 0 || index + 1 === posts.length) {
        console.log(
          `Banco: ${index + 1}/${posts.length} postagens processadas.`,
        );
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}

const posts = await fetchAllPosts();

await fs.mkdir(path.dirname(OUTPUT), { recursive: true });

await fs.writeFile(
  OUTPUT,
  JSON.stringify(posts, null, 2),
  "utf8",
);

console.log(
  `\n${posts.length} postagens reais gravadas em ${OUTPUT}.`,
);

console.log(
  `Período: ${posts.at(-1)?.reviewDate?.slice(0, 10)} ` +
    `a ${posts[0]?.reviewDate?.slice(0, 10)}.`,
);

const malformedContent = posts.filter((post) =>
  /\[blocked\]|^\s*]\s*$|^\s*\(\s*https?:\/\//im.test(
    post.content || "",
  ),
);

console.log(
  `Conteúdos com resíduos de URL/Markdown: ${malformedContent.length}.`,
);

if (process.argv.includes("--write-db")) {
  await writeDatabase(posts);
  console.log("Banco de dados atualizado com sucesso.");
}
