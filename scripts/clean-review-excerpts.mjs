#!/usr/bin/env node
/**
 * Limpa os resumos importados do Blogger sem alterar o conteúdo integral.
 *
 * Remove:
 * - imagens em Markdown;
 * - links em Markdown, preservando o texto do link;
 * - URLs soltas;
 * - imagens Base64;
 * - marcas residuais de Markdown;
 *
 * Uso:
 *   node scripts/clean-review-excerpts.mjs
 */

import "dotenv/config";
import mysql from "mysql2/promise";

const MAX_EXCERPT_LENGTH = 320;

function cleanExcerpt(value = "") {
  return String(value)
    // Remove imagens Markdown: ![alt](url)
    .replace(/!\[[^\]]*]\(\s*[^)]*\s*\)/gi, " ")

    // Mantém o texto de links Markdown: [texto](url) -> texto
    .replace(/\[([^\]]+)]\(\s*[^)]*\s*\)/gi, "$1")

    // Remove imagens Base64 completas.
    .replace(
      /data:image\/[a-z0-9.+-]+;base64,[a-z0-9+/=\s]+/gi,
      " ",
    )

    // Remove URLs HTTP/HTTPS soltas.
    .replace(/https?:\/\/[^\s<>"')\]]+/gi, " ")

    // Remove marcas comuns de Markdown.
    .replace(/(^|\s)[#>*_`~]{1,6}(?=\s|$)/g, " ")

    // Remove espaços e quebras repetidas.
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_EXCERPT_LENGTH)
    .trim();
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não foi encontrada. Confira o arquivo .env.",
  );
}

const connection = await mysql.createConnection(
  process.env.DATABASE_URL,
);

try {
  const [rows] = await connection.query(
    "SELECT id, title, content, excerpt FROM reviews ORDER BY id",
  );

  console.log(`${rows.length} publicações encontradas.`);

  await connection.beginTransaction();

  let updated = 0;

  for (const row of rows) {
    const source = row.content || row.excerpt || "";
    const excerpt = cleanExcerpt(source);

    if (excerpt !== (row.excerpt || "")) {
      await connection.execute(
        `
          UPDATE reviews
          SET excerpt = ?, updatedAt = NOW()
          WHERE id = ?
        `,
        [excerpt, row.id],
      );

      updated += 1;
    }

    if (updated > 0 && updated % 100 === 0) {
      console.log(`${updated} resumos atualizados...`);
    }
  }

  await connection.commit();

  console.log(
    `Concluído: ${updated} de ${rows.length} resumos foram atualizados.`,
  );
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  await connection.end();
}
