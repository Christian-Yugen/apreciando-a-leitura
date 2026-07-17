#!/usr/bin/env node
/**
 * Migração oficial do Blogger para o novo Apreciando a Leitura.
 * Busca TODAS as postagens pelo feed público do Blogger, pagina os resultados,
 * preserva título, data, URL original, marcadores, conteúdo e imagens.
 *
 * Uso:
 *   pnpm migrate:blogger
 *   pnpm migrate:blogger -- --write-db
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import mysql from 'mysql2/promise';

const BLOG_URL = process.env.BLOGGER_URL || 'https://www.apreciandoaleitura.com';
const OUTPUT = path.resolve('data/blogger-posts.json');
const PAGE_SIZE = 150;

const decode = (value = '') => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

function htmlToMarkdown(html = '') {
  return decode(html)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi, '\n\n![]($1)\n\n')
    .replace(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, '*$2*')
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<(br|\/p|\/div|\/blockquote)>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function firstImage(html = '', entry = {}) {
  const media = entry['media$thumbnail']?.url;
  if (media) return media.replace(/\/s72-c\//, '/s1200/');
  return html.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? null;
}

function sourceUrl(entry) {
  return entry.link?.find(link => link.rel === 'alternate')?.href ?? null;
}

function slugFromUrl(url, title) {
  const fromUrl = url?.match(/\/\d{4}\/\d{2}\/([^/?#]+)\.html/)?.[1];
  if (fromUrl) return fromUrl;
  return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 180);
}

function normalizeEntry(entry) {
  const rawHtml = entry.content?.$t ?? entry.summary?.$t ?? '';
  const content = htmlToMarkdown(rawHtml);
  const url = sourceUrl(entry);
  const labels = (entry.category ?? []).map(item => item.term).filter(Boolean);
  const published = entry.published?.$t ?? entry.updated?.$t;
  const title = decode(entry.title?.$t ?? 'Sem título');
  const excerpt = content.replace(/!\[\]\([^)]*\)/g, '').slice(0, 320).trim();

  return {
    legacyId: entry.id?.$t ?? url,
    slug: slugFromUrl(url, title),
    title,
    author: 'Elaise G. Lima',
    genre: labels[0] ?? 'Literatura',
    labels,
    reviewDate: published,
    excerpt,
    content,
    coverImageUrl: firstImage(rawHtml, entry),
    purchaseLink: null,
    sourceUrl: url,
    source: 'blogger',
  };
}

async function fetchAllPosts() {
  const posts = [];
  let startIndex = 1;
  while (true) {
    const url = `${BLOG_URL}/feeds/posts/default?alt=json&max-results=${PAGE_SIZE}&start-index=${startIndex}`;
    console.log(`Buscando postagens ${startIndex}–${startIndex + PAGE_SIZE - 1}...`);
    const response = await fetch(url, { headers: { 'user-agent': 'ApreciandoALeitura-Migrator/1.0' } });
    if (!response.ok) throw new Error(`Blogger respondeu ${response.status}: ${response.statusText}`);
    const json = await response.json();
    const entries = json.feed?.entry ?? [];
    posts.push(...entries.map(normalizeEntry));
    if (entries.length < PAGE_SIZE) break;
    startIndex += PAGE_SIZE;
  }
  return posts.sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate));
}

async function writeDatabase(posts) {
  if (!process.env.DATABASE_URL) throw new Error('Defina DATABASE_URL para usar --write-db.');
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    for (const post of posts) {
      await connection.execute(`
        INSERT INTO reviews
          (legacyId, slug, title, author, genre, labels, reviewDate, excerpt, content, coverImageUrl, purchaseLink, sourceUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          slug=VALUES(slug), title=VALUES(title), author=VALUES(author), genre=VALUES(genre),
          labels=VALUES(labels), reviewDate=VALUES(reviewDate), excerpt=VALUES(excerpt),
          content=VALUES(content), coverImageUrl=VALUES(coverImageUrl), sourceUrl=VALUES(sourceUrl), updatedAt=NOW()
      `, [post.legacyId, post.slug, post.title, post.author, post.genre, JSON.stringify(post.labels),
        new Date(post.reviewDate), post.excerpt, post.content, post.coverImageUrl, post.purchaseLink, post.sourceUrl]);
    }
  } finally {
    await connection.end();
  }
}

const posts = await fetchAllPosts();
await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
await fs.writeFile(OUTPUT, JSON.stringify(posts, null, 2));
console.log(`\n${posts.length} postagens reais gravadas em ${OUTPUT}.`);
console.log(`Período: ${posts.at(-1)?.reviewDate?.slice(0, 10)} a ${posts[0]?.reviewDate?.slice(0, 10)}.`);
if (process.argv.includes('--write-db')) {
  await writeDatabase(posts);
  console.log('Banco de dados atualizado com sucesso.');
}
