import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "./supabase";

export type Review = {
  id: number;
  legacyId: string | null;
  slug: string | null;
  title: string;
  author: string;
  genre: string | null;
  labels: string[] | null;
  reviewDate: string;
  content: string;
  coverImageUrl: string | null;
  purchaseLink: string | null;
  sourceUrl: string | null;
  excerpt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Book = {
  id: number;
  title: string;
  synopsis: string;
  coverImageUrl: string | null;
  purchaseLink: string | null;
  series: string | null;
  createdAt: string;
  updatedAt: string;
};

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

export function useReviews(input?: { limit?: number; genre?: string; search?: string }) {
  return useQuery({
    queryKey: ["reviews", input],
    queryFn: async () => {
      let query = supabase.from("reviews").select("*").order("reviewDate", { ascending: false });
      if (input?.genre) query = query.eq("genre", input.genre);
      if (input?.search) {
        const value = input.search.replace(/[,%()]/g, " ").trim();
        if (value) query = query.or(`title.ilike.%${value}%,author.ilike.%${value}%`);
      }
      if (input?.limit) query = query.limit(input.limit);
      return unwrap(await query) as Review[];
    },
  });
}

export function useReview(id: number) {
  return useQuery({
    queryKey: ["review", id],
    enabled: Number.isFinite(id),
    queryFn: async () => unwrap(await supabase.from("reviews").select("*").eq("id", id).maybeSingle()) as Review | null,
  });
}

export function useReviewGenres() {
  return useQuery({
    queryKey: ["review-genres"],
    queryFn: async () => {
      const rows = unwrap(await supabase.from("reviews").select("genre").not("genre", "is", null)) as Array<{ genre: string }>;
      return Array.from(new Set(rows.map((row) => row.genre))).sort((a, b) => a.localeCompare(b, "pt-BR"));
    },
  });
}

export function useReviewStats() {
  return useQuery({
    queryKey: ["review-stats"],
    queryFn: async () => {
      const result = await supabase
        .from("reviews")
        .select("reviewDate", { count: "exact" })
        .order("reviewDate", { ascending: true });
      const rows = unwrap(result) as Array<{ reviewDate: string }>;
      return {
        total: result.count ?? rows.length,
        firstPublication: rows[0]?.reviewDate ?? null,
        lastPublication: rows.at(-1)?.reviewDate ?? null,
      };
    },
  });
}

export function useReviewYears() {
  return useQuery({
    queryKey: ["review-years"],
    queryFn: async () => {
      const rows = unwrap(await supabase.from("reviews").select("reviewDate").order("reviewDate", { ascending: false })) as Array<{ reviewDate: string }>;
      return Array.from(new Set(rows.map((row) => new Date(row.reviewDate).getFullYear())));
    },
  });
}

export function useReviewsByYearMonth(year: number | null, month: number | null) {
  return useQuery({
    queryKey: ["reviews-by-date", year, month],
    enabled: year !== null,
    queryFn: async () => {
      const start = new Date(Date.UTC(year!, month ? month - 1 : 0, 1));
      const end = month
        ? new Date(Date.UTC(year!, month, 1))
        : new Date(Date.UTC(year! + 1, 0, 1));
      return unwrap(await supabase.from("reviews").select("*").gte("reviewDate", start.toISOString()).lt("reviewDate", end.toISOString()).order("reviewDate", { ascending: false })) as Review[];
    },
  });
}

export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => unwrap(await supabase.from("books").select("*").order("createdAt", { ascending: false })) as Book[],
  });
}

export function useContactMutation() {
  return useMutation({
    mutationFn: async (input: { name: string; email: string; subject: string; message: string }) => {
      unwrap(await supabase.from("contact_requests").insert(input));
      return { success: true as const };
    },
  });
}

export function useQuoteMutation() {
  return useMutation({
    mutationFn: async (input: { name: string; email: string; serviceType: string; wordCount?: string; description: string }) => {
      unwrap(await supabase.from("quote_requests").insert(input));
      return { success: true as const };
    },
  });
}
