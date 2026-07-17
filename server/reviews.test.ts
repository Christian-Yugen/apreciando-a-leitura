import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  getRecentReviews: vi.fn().mockResolvedValue([
    { id: 1, title: "Diga-me baixinho", author: "Colleen Hoover", genre: "Romance", reviewDate: new Date("2026-07-03"), content: "Full review text", excerpt: "Short excerpt", coverImageUrl: "https://example.com/cover.jpg", purchaseLink: "https://amzn.to/test" },
  ]),
  getAllReviews: vi.fn().mockResolvedValue([
    { id: 1, title: "Diga-me baixinho", author: "Colleen Hoover", genre: "Romance", reviewDate: new Date("2026-07-03"), content: "Full review text", excerpt: "Short excerpt", coverImageUrl: "https://example.com/cover.jpg", purchaseLink: "https://amzn.to/test" },
  ]),
  getReviewById: vi.fn().mockResolvedValue({
    id: 1, title: "Diga-me baixinho", author: "Colleen Hoover", genre: "Romance", reviewDate: new Date("2026-07-03"), content: "Full review text", excerpt: "Short excerpt", coverImageUrl: "https://example.com/cover.jpg", purchaseLink: "https://amzn.to/test",
  }),
  searchReviews: vi.fn().mockResolvedValue([]),
  getReviewsByYearAndMonth: vi.fn().mockResolvedValue([]),
  getReviewYears: vi.fn().mockResolvedValue([2026, 2025, 2024]),
  getDistinctGenres: vi.fn().mockResolvedValue(["Romance", "Fantasia"]),
  getBooks: vi.fn().mockResolvedValue([
    { id: 1, title: "Quando as Luzes se Apagam", synopsis: "Synopsis text", coverImageUrl: "https://example.com/book.jpg", purchaseLink: "https://amzn.to/book", series: "Trilogia - Livro 3" },
  ]),
  getBookById: vi.fn().mockResolvedValue({
    id: 1, title: "Quando as Luzes se Apagam", synopsis: "Synopsis text", coverImageUrl: "https://example.com/book.jpg", purchaseLink: "https://amzn.to/book", series: "Trilogia - Livro 3",
  }),
}));

// Mock notification — vi.hoisted ensures the mock fn exists before vi.mock factory runs
const { mockNotify } = vi.hoisted(() => ({
  mockNotify: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("./_core/notification", () => ({
  notifyOwner: mockNotify,
}));

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("reviews router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("list returns recent reviews with limit", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.reviews.list({ limit: 6 });
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Diga-me baixinho");
  });

  it("list returns all reviews without limit", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.reviews.list({});
    expect(result).toHaveLength(1);
  });

  it("byId returns a single review", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.reviews.byId({ id: 1 });
    expect(result?.title).toBe("Diga-me baixinho");
  });

  it("years returns list of years", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.reviews.years();
    expect(result).toEqual([2026, 2025, 2024]);
  });

  it("genres returns distinct genres", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.reviews.genres();
    expect(result).toEqual(["Romance", "Fantasia"]);
  });
});

describe("books router", () => {
  it("list returns all books", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.books.list();
    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Quando as Luzes se Apagam");
  });

  it("byId returns a single book", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.books.byId({ id: 1 });
    expect(result?.title).toBe("Quando as Luzes se Apagam");
  });
});

describe("contact router", () => {
  it("submit returns success when notification succeeds", async () => {
    mockNotify.mockResolvedValue(undefined);
    const caller = appRouter.createCaller(createContext());
    const result = await caller.contact.submit({
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "This is a test message that is long enough.",
    });
    expect(result).toEqual({ success: true });
  });

  it("submit returns failure when notification fails", async () => {
    mockNotify.mockRejectedValue(new Error("Network error"));
    const caller = appRouter.createCaller(createContext());
    const result = await caller.contact.submit({
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      message: "This is a test message that is long enough.",
    });
    expect(result.success).toBe(false);
  });
});

describe("quote router", () => {
  it("submit returns success when notification succeeds", async () => {
    mockNotify.mockResolvedValue(undefined);
    const caller = appRouter.createCaller(createContext());
    const result = await caller.quote.submit({
      name: "Test User",
      email: "test@example.com",
      serviceType: "Revisão de Textos",
      wordCount: "50000",
      description: "This is a test description for the quote request.",
    });
    expect(result).toEqual({ success: true });
  });

  it("submit returns failure when notification fails", async () => {
    mockNotify.mockRejectedValue(new Error("Network error"));
    const caller = appRouter.createCaller(createContext());
    const result = await caller.quote.submit({
      name: "Test User",
      email: "test@example.com",
      serviceType: "Revisão de Textos",
      wordCount: "50000",
      description: "This is a test description for the quote request.",
    });
    expect(result.success).toBe(false);
  });
});
