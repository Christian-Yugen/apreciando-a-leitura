import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Reviews table — stores full book review content from the blog.
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  legacyId: varchar("legacyId", { length: 255 }).unique(),
  slug: varchar("slug", { length: 190 }).unique(),
  title: varchar("title", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  genre: varchar("genre", { length: 255 }),
  labels: text("labels"),
  reviewDate: timestamp("reviewDate").notNull(),
  content: text("content").notNull(),
  coverImageUrl: varchar("coverImageUrl", { length: 512 }),
  purchaseLink: varchar("purchaseLink", { length: 512 }),
  sourceUrl: varchar("sourceUrl", { length: 512 }),
  excerpt: text("excerpt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Books table — stores the author's own published books.
 */
export const books = mysqlTable("books", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  synopsis: text("synopsis").notNull(),
  coverImageUrl: varchar("coverImageUrl", { length: 512 }),
  purchaseLink: varchar("purchaseLink", { length: 512 }),
  series: varchar("series", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Book = typeof books.$inferSelect;
export type InsertBook = typeof books.$inferInsert;
