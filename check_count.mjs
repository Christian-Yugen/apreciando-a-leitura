import { drizzle } from "drizzle-orm/mysql2";
import { reviews } from "./drizzle/schema.ts";
import { count } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

try {
  const result = await db.select({ count: count() }).from(reviews);
  console.log(`✅ Total de resenhas no banco: ${result[0].count}`);
} catch (err) {
  console.error("❌ Erro:", err.message);
}
