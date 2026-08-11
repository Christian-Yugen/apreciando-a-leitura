#!/usr/bin/env node
import "dotenv/config";
import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Defina VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env local.",
  );
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const reviews = JSON.parse(await fs.readFile("data/blogger-posts.json", "utf8"));
const rows = reviews.map((review) => ({
  legacyId: review.legacyId ?? null,
  slug: review.slug ?? null,
  title: review.title,
  author: review.author,
  genre: review.genre ?? null,
  labels: Array.isArray(review.labels) ? review.labels : [],
  reviewDate: review.reviewDate,
  content: review.content,
  coverImageUrl: review.coverImageUrl ?? null,
  purchaseLink: review.purchaseLink ?? null,
  sourceUrl: review.sourceUrl ?? null,
  excerpt: review.excerpt ?? null,
}));

for (let offset = 0; offset < rows.length; offset += 100) {
  const batch = rows.slice(offset, offset + 100);
  const { error } = await supabase
    .from("reviews")
    .upsert(batch, { onConflict: "legacyId" });
  if (error) throw error;
  console.log(`Resenhas importadas: ${Math.min(offset + batch.length, rows.length)}/${rows.length}`);
}

console.log("Importação para o Supabase concluída.");

