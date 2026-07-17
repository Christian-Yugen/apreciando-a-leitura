import { and, desc, eq, gte, like, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, reviews, books } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Reviews =====

export async function getRecentReviews(limit: number = 6) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(desc(reviews.reviewDate)).limit(limit);
}

export async function getAllReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(desc(reviews.reviewDate));
}

export async function getReviewById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getReviewsByGenre(genre: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.genre, genre)).orderBy(desc(reviews.reviewDate));
}

export async function searchReviews(query: string, genre?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (query) {
    conditions.push(or(
      like(reviews.title, `%${query}%`),
      like(reviews.author, `%${query}%`),
    ));
  }
  if (genre && genre !== "all") {
    conditions.push(eq(reviews.genre, genre));
  }
  if (conditions.length === 0) {
    return db.select().from(reviews).orderBy(desc(reviews.reviewDate));
  }
  return db.select().from(reviews)
    .where(conditions.length === 1 ? conditions[0]! : and(...conditions))
    .orderBy(desc(reviews.reviewDate));
}

export async function getReviewsByYearAndMonth(year: number, month?: number) {
  const db = await getDb();
  if (!db) return [];
  if (month !== undefined) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);
    return db.select().from(reviews)
      .where(and(gte(reviews.reviewDate, startDate), lte(reviews.reviewDate, endDate)))
      .orderBy(desc(reviews.reviewDate));
  }
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59);
  return db.select().from(reviews)
    .where(and(gte(reviews.reviewDate, startDate), lte(reviews.reviewDate, endDate)))
    .orderBy(desc(reviews.reviewDate));
}

export async function getReviewYears() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    year: sql<number>`YEAR(${reviews.reviewDate})`,
  }).from(reviews).groupBy(sql`YEAR(${reviews.reviewDate})`).orderBy(sql`YEAR(${reviews.reviewDate}) DESC`);
  return result.map((r: { year: number }) => r.year);
}

export async function getDistinctGenres() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({
    genre: reviews.genre,
  }).from(reviews).groupBy(reviews.genre);
  return result.map((r: { genre: string | null }) => r.genre).filter((g): g is string => g !== null);
}

// ===== Books =====

export async function getBooks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(books).orderBy(desc(books.createdAt));
}

export async function getBookById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(books).where(eq(books.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
