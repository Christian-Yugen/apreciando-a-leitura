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
import { useReview, useReviews } from "@/lib/queries";
import {
  createThemeVariables,
  useCinematicTheme,
} from "@/lib/cinematic";
import type { CinematicTheme } from "@/lib/cinematic";
import { Streamdown } from "streamdown";

const NEUTRAL_REVIEW_THEME: CinematicTheme = {
  palette: {
    primary: "#142126",
    secondary: "#0A1013",
    accent: "#1A2528",
    background: "#07090A",
    overlay: "rgba(5,7,8,.82)",
    glow: "rgba(20,33,38,.12)",
    shadow: "rgba(0,0,0,.78)",
    text: "#F4F1E8",
  },
  gradients: {
    background:
      "radial-gradient(ellipse 80% 65% at 25% 15%, rgba(20,31,34,.16), transparent 70%), radial-gradient(ellipse 75% 60% at 85% 70%, rgba(12,16,18,.12), transparent 72%), linear-gradient(180deg,#080A0B,#050607)",
    spotlight:
      "radial-gradient(ellipse 70% 60% at center, rgba(20,31,34,.10), transparent 72%)",
  },
  motion: {
    duration: 450,
    easing: "cubic-bezier(.22,.61,.36,1)",
  },
};

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

  const decodeUrl = (value: string) =>
    value
      .replace(/&amp;|&#0*38;|&#x0*26;/gi, "&")
      .replace(/&quot;|&#0*34;|&#x0*22;/gi, '"')
      .trim();

  const normalizeImageUrl = (value: string, base?: string) => {
    const decoded = decodeUrl(value);

    try {
      const url = new URL(decoded, base);
      url.search = "";
      url.hash = "";
      url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");

      try {
        url.pathname = decodeURIComponent(url.pathname);
      } catch {
        // Mantém o caminho original quando houver escape inválido no conteúdo.
      }

      if (/(?:blogspot|blogger|googleusercontent)\./i.test(url.hostname)) {
        url.pathname = url.pathname.replace(/\/s\d+(?:-[^/]+)?\//i, "/");
      }

      url.pathname = url.pathname.replace(/\/$/, "");

      return `${url.hostname}${url.port ? `:${url.port}` : ""}${url.pathname}`;
    } catch {
      return decoded.replace(/[?#].*$/, "").replace(/\/$/, "");
    }
  };

  const normalizedCover = normalizeImageUrl(cover);
  const leadingMarkdownImage = content.match(
    /^\s*(?:\[\s*)?!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)(?:\s*\]\([^)]*\))?/i,
  );
  const leadingHtmlImage = content.match(
    /^\s*(?:<(?:figure|div|p)\b[^>]*>\s*)?(?:<a\b[^>]*>\s*)?<img\b[^>]*\bsrc\s*=\s*(?:["']([^"']+)["']|([^\s>]+))[^>]*\/?>\s*(?:<\/a>\s*)?(?:<figcaption\b[^>]*>[\s\S]*?<\/figcaption>\s*)?(?:<\/(?:figure|div|p)>\s*)?/i,
  );
  const leadingImage = leadingMarkdownImage ?? leadingHtmlImage;
  const leadingImageUrl = leadingImage?.[1] ?? leadingImage?.[2];

  if (!leadingImage || !leadingImageUrl) return content;
  if (normalizeImageUrl(leadingImageUrl, cover) !== normalizedCover) return content;

  return content.slice(leadingImage[0].length).trimStart();
}

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: review, isLoading } = useReview(Number(id));
  const { data: recent = [] } = useReviews({ limit: 8 });
  const [progress, setProgress] = useState(0);
  const { theme: cinematicTheme } = useCinematicTheme(
    review?.coverImageUrl,
  );
  const reviewTheme = review?.coverImageUrl
    ? cinematicTheme
    : NEUTRAL_REVIEW_THEME;
  const cinematicStyle = useMemo(
    () => createThemeVariables(reviewTheme),
    [reviewTheme],
  );

  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - innerHeight;
      setProgress(height ? (scrollY / height) * 100 : 0);
    };
    addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".cinematic-footer");
    if (!footer) return;

    const variables = createThemeVariables(reviewTheme);

    Object.entries(variables).forEach(([property, value]) => {
      if (typeof value === "string") footer.style.setProperty(property, value);
    });

    return () => {
      Object.keys(variables).forEach((property) => {
        footer.style.removeProperty(property);
      });
    };
  }, [reviewTheme]);

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
    <article
      className="editorial-article review-detail-page"
      style={cinematicStyle}
    >
      <div
        className="fixed left-0 top-0 z-[100] h-[2px] bg-gold transition-[width]"
        style={{ width: `${progress}%` }}
      />

      <header className="article-hero relative overflow-hidden bg-ink text-white">
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

            <div className="article-hero-copy">
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

      <section
        className="article-editorial-strip"
        aria-label="Informações editoriais da resenha"
      >
        <div className="container article-editorial-strip-inner">
          <div className="article-editorial-signature">
            <p className="eyebrow">Crítica & memória</p>
            <p className="font-serif text-2xl leading-tight">
              Apreciando a Leitura
            </p>
          </div>

          <dl className="article-editorial-metadata">
            <div className="article-editorial-meta-item">
              <dt>Publicado</dt>
              <dd>{formatDate(review.reviewDate)}</dd>
            </div>
            <div className="article-editorial-meta-item">
              <dt>Tempo</dt>
              <dd>{readingTime} min de leitura</dd>
            </div>
            {review.genre && (
              <div className="article-editorial-meta-item">
                <dt>Categoria</dt>
                <dd>{review.genre}</dd>
              </div>
            )}
            <div className="article-editorial-meta-item">
              <dt>Progresso</dt>
              <dd>{Math.round(progress)}% da leitura</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="article-reading-stage">
        <div className="container article-magazine-grid">
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
