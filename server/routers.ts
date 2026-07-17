import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  reviews: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional(), genre: z.string().optional(), search: z.string().optional() }).optional())
      .query(async ({ input }) => {
        if (input?.search || input?.genre) {
          return db.searchReviews(input.search ?? "", input.genre);
        }
        if (input?.limit) {
          return db.getRecentReviews(input.limit);
        }
        return db.getAllReviews();
      }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getReviewById(input.id);
      }),

    byYearMonth: publicProcedure
      .input(z.object({ year: z.number(), month: z.number().optional() }))
      .query(async ({ input }) => {
        return db.getReviewsByYearAndMonth(input.year, input.month);
      }),

    years: publicProcedure.query(async () => {
      return db.getReviewYears();
    }),

    genres: publicProcedure.query(async () => {
      return db.getDistinctGenres();
    }),

    stats: publicProcedure.query(async () => {
      return db.getReviewStats();
    }),
  }),

  books: router({
    list: publicProcedure.query(async () => {
      return db.getBooks();
    }),

    byId: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getBookById(input.id);
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        subject: z.string().min(2),
        message: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        try {
          await notifyOwner({
            title: `Novo contato: ${input.subject}`,
            content: `Nome: ${input.name}\nE-mail: ${input.email}\n\nMensagem:\n${input.message}`,
          });
          return { success: true };
        } catch (err) {
          console.error("[Contact] Notification failed:", err);
          return { success: false, error: "Falha ao enviar notificação. Tente novamente ou envie um e-mail direto para elaiselima@gmail.com" };
        }
      }),
  }),

  quote: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        serviceType: z.string().min(2),
        wordCount: z.string().optional(),
        description: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        try {
          await notifyOwner({
            title: `Solicitação de orçamento: ${input.serviceType}`,
            content: `Nome: ${input.name}\nE-mail: ${input.email}\nTipo de serviço: ${input.serviceType}\nContagem de palavras: ${input.wordCount ?? "N/A"}\n\nDescrição:\n${input.description}`,
          });
          return { success: true };
        } catch (err) {
          console.error("[Quote] Notification failed:", err);
          return { success: false, error: "Falha ao enviar notificação. Tente novamente ou envie um e-mail direto para elaiselima@gmail.com" };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
