import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Archive,
  BookOpen,
  Calendar,
  Clock3,
  ExternalLink,
  Loader2,
  Quote,
  Tag,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function estimateReadingTime(content: string) {
  const words = content.replace(/\s+/g, " ").trim().split(" ").length;
  return Math.max(1, Math.ceil(words / 210));
}

function removeLeadingCover(content: string, cover?: string | null) {
  if (!cover) return content;
  const escaped = cover.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return content
    .replace(new RegExp(`^\\s*!\\[[^\\]]*\\]\\(${escaped}\\)\\s*`, "i"), "")
    .trim();
}

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: review, isLoading } = trpc.reviews.byId.useQuery({
    id: Number(id),
  });
  const { data: recent = [] } = trpc.reviews.list.useQuery({ limit: 8 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      setProgress(height ? (scrollY / height) * 100 : 0);
    };
    addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => removeEventListener("scroll", updateProgress);
  }, []);

  const related = useMemo(
    () => recent.filter((item) => item.id !== review?.id).slice(0, 3),
    [recent, review?.id],
  );

  if (isLoading) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="container py-32 text-center">
        <h1 className="font-serif text-5xl">Publicação não encontrada.</h1>
        <Link href="/resenhas" className="text-link mt-8">
          Voltar ao acervo
        </Link>
      </div>
    );
  }

  const readingTime = estimateReadingTime(review.content);
  const cleanContent = removeLeadingCover(review.content, review.coverImageUrl);

  return (
    <article className="editorial-article">
      <div
        className="fixed left-0 top-0 z-[100] h-[2px] bg-gold transition-[width]"
        style={{ width: `${progress}%` }}
      />

      <header className="article-hero relative overflow-hidden bg-ink text-white">
        {review.coverImageUrl && (
          <img
            src={review.coverImageUrl}
            alt=""
            className="absolute inset-0 h-full w-full scale-110 object-cover opacity-25 blur-[3px]"
          />
        )}
        <div className="cinema-hero-vignette absolute inset-0" />
        <div className="cinema-grain absolute inset-0" />

        <div className="container relative z-10 py-16 md:py-24">
          <Link
            href="/resenhas"
            className="mb-10 inline-flex items-center gap-2 text-xs uppercase tracking-[.2em] text-white/60 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Acervo
          </Link>

          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-center">
            <div className="article-cover-stage">
              {review.coverImageUrl ? (
                <img
                  src={review.coverImageUrl}
                  alt={`Capa de ${review.title}`}
                  className="aspect-[2/3] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[2/3] place-items-center border border-white/15 bg-white/5">
                  <BookOpen className="h-10 w-10 text-white/30" />
                </div>
              )}
            </div>

            <div>
              <p className="eyebrow !text-gold">{review.genre || "Literatura"}</p>
              <h1 className="mt-5 max-w-5xl font-serif text-[clamp(3.6rem,7vw,8rem)] font-medium leading-[.84] tracking-[-.065em]">
                {review.title}
              </h1>
              <p className="mt-7 font-serif text-2xl italic text-gold">
                por {review.author}
              </p>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-white/15 pt-6 text-[10px] uppercase tracking-[.16em] text-white/55">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(review.reviewDate)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {readingTime} min de leitura
                </span>
                {review.genre && (
                  <span className="flex items-center gap-2">
                    <Tag className="h-4 w-4" /> {review.genre}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="article-reading-stage">
        <div className="container article-magazine-grid">
          <aside className="article-left-rail">
            <div className="article-rail-sticky">
              <p className="eyebrow">Crítica & memória</p>
              <p className="mt-4 font-serif text-2xl leading-tight">
                Apreciando a Leitura
              </p>
              <div className="mt-8 h-px bg-border" />
              <dl className="mt-8 space-y-6 text-xs">
                <div>
                  <dt className="uppercase tracking-[.15em] text-muted-foreground">
                    Publicado
                  </dt>
                  <dd className="mt-2 font-serif text-base">
                    {formatDate(review.reviewDate)}
                  </dd>
                </div>
                <div>
                  <dt className="uppercase tracking-[.15em] text-muted-foreground">
                    Tempo
                  </dt>
                  <dd className="mt-2 font-serif text-base">
                    {readingTime} minutos
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          <main className="article-main-column">
            {review.excerpt && (
              <div className="article-deck">
                <Quote className="h-6 w-6 text-gold" />
                <p>{review.excerpt}</p>
              </div>
            )}

            <div className="article-prose prose prose-lg max-w-none dark:prose-invert">
              <Streamdown>{cleanContent}</Streamdown>
            </div>

            {review.sourceUrl && (
              <a
                href={review.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="article-source-link"
              >
                <span className="flex items-center gap-3">
                  <Archive className="h-4 w-4" /> Publicação original preservada
                </span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </main>

          <aside className="article-right-rail">
            <div className="article-rail-sticky">
              <span className="article-reading-index">{Math.round(progress)}%</span>
              <p className="mt-2 text-[10px] uppercase tracking-[.17em] text-muted-foreground">
                da leitura
              </p>
              <div className="mt-8 h-32 w-px bg-border">
                <div
                  className="w-px bg-gold transition-[height]"
                  style={{ height: `${progress}%` }}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="article-related bg-ink text-white">
          <div className="container py-20 md:py-28">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow !text-gold">Continue explorando</p>
                <h2 className="mt-4 font-serif text-[clamp(3rem,6vw,6rem)] font-medium leading-none tracking-[-.055em]">
                  Outras leituras que permanecem.
                </h2>
              </div>
              <Link href="/resenhas" className="text-link text-white">
                Ver acervo completo <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="related-story-grid mt-8">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/resenhas/${item.id}`}
                  className="related-story"
                >
                  <div className="related-story-media">
                    {item.coverImageUrl ? (
                      <img src={item.coverImageUrl} alt="" loading="lazy" />
                    ) : (
                      <div className="cinema-image-placeholder h-full w-full">
                        <BookOpen className="h-8 w-8" />
                      </div>
                    )}
                    <div className="editorial-card-overlay absolute inset-0" />
                  </div>
                  <div className="relative z-10 mt-5">
                    <p className="text-[10px] uppercase tracking-[.16em] text-gold">
                      {item.genre || "Literatura"}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl leading-[1.02]">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
