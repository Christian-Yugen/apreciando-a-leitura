import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import {
  createThemeVariables,
  useCinematicTheme,
} from "@/lib/cinematic";
import type { CinematicTheme } from "@/lib/cinematic";

const NEUTRAL_ARCHIVE_THEME: CinematicTheme = {
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

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const ARCHIVE_YEARS = Array.from(
  { length: 2026 - 2011 + 1 },
  (_, index) => 2011 + index,
);

type ArchiveReview = {
  id: number;
  title: string;
  author: string;
  genre: string | null;
  reviewDate: Date | string;
  coverImageUrl: string | null;
  excerpt: string | null;
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getMonth(date: Date | string) {
  return new Date(date).getMonth() + 1;
}

function ImageFallback({ title }: { title: string }) {
  return (
    <div
      className="archive-cover-fallback"
      role="img"
      aria-label={`Sem capa para ${title}`}
    >
      <BookOpen className="h-8 w-8" aria-hidden="true" />
      <span aria-hidden="true">{title.slice(0, 1)}</span>
    </div>
  );
}

function AnnualShelf({
  reviews,
  activeReviewId,
  onSelect,
  onClose,
}: {
  reviews: ArchiveReview[];
  activeReviewId: number | null;
  onSelect: (reviewId: number) => void;
  onClose: () => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const activeReview = reviews.find((review) => review.id === activeReviewId);

  useEffect(() => {
    if (!activeReview) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeReview, onClose]);

  const scroll = (direction: "left" | "right") => {
    railRef.current?.scrollBy({
      left: direction === "left" ? -820 : 820,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="archive-annual-shelf relative -mx-4 overflow-hidden px-4 py-8 text-white sm:-mx-6 sm:px-6 md:py-10 lg:-mx-8 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[.14] [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative z-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow !text-gold">Linha do tempo anual</p>
            <h3 className="mt-2 max-w-3xl font-serif text-3xl font-medium tracking-[-.04em] text-white md:text-4xl">
              Todas as publicações em uma única sequência.
            </h3>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="grid h-10 w-10 place-items-center border border-gold/45 bg-gold/[.04] text-gold shadow-[0_0_12px_color-mix(in_srgb,var(--gold)_12%,transparent)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:scale-105 hover:border-gold hover:bg-gold/10 hover:text-gold hover:shadow-[0_0_20px_color-mix(in_srgb,var(--gold)_32%,transparent)]"
              aria-label="Voltar na linha do tempo anual"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="grid h-10 w-10 place-items-center border border-gold/45 bg-gold/[.04] text-gold shadow-[0_0_12px_color-mix(in_srgb,var(--gold)_12%,transparent)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:scale-105 hover:border-gold hover:bg-gold/10 hover:text-gold hover:shadow-[0_0_20px_color-mix(in_srgb,var(--gold)_32%,transparent)]"
              aria-label="Avançar na linha do tempo anual"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-2 pb-10 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-7"
        >
          {reviews.map((review, index) => {
            const isActive = activeReviewId === review.id;
            const reviewMonth = getMonth(review.reviewDate);
            const previousMonth =
              index > 0 ? getMonth(reviews[index - 1].reviewDate) : null;
            const startsNewMonth = index === 0 || reviewMonth !== previousMonth;

            return (
              <article
                key={review.id}
                className={`relative w-[150px] flex-none snap-start transition-all duration-500 sm:w-[172px] md:w-[190px] ${
                  isActive ? "z-30" : "z-10"
                } ${activeReviewId && !isActive ? "opacity-45 saturate-[.7]" : "opacity-100"}`}
              >
                <div className="mb-3 min-h-[38px] border-l border-white/15 pl-3">
                  {startsNewMonth ? (
                    <>
                      <p className="text-[10px] uppercase tracking-[.18em] text-gold">
                        {MONTHS[reviewMonth - 1]}
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        {new Date(review.reviewDate).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                          },
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="pt-5 text-xs text-white/45">
                      {new Date(review.reviewDate).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                      })}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onSelect(review.id)}
                  aria-expanded={isActive}
                  className="group relative block w-full text-left focus-visible:outline-none"
                >
                  <div
                    className={`relative aspect-[2/3] overflow-hidden border bg-card transition-all duration-300 ${
                      isActive
                        ? "-translate-y-5 scale-[1.09] border-gold shadow-[0_34px_90px_-18px_rgba(190,143,58,.68)] ring-1 ring-gold/55"
                        : "border-white/12 group-hover:z-40 group-hover:-translate-y-5 group-hover:scale-[1.1] group-hover:rotate-[-.6deg] group-hover:border-gold/80 group-hover:shadow-[0_36px_80px_-22px_rgba(190,143,58,.62)]"
                    }`}
                  >
                    {review.coverImageUrl ? (
                      <img
                        src={review.coverImageUrl}
                        alt={`Capa de ${review.title}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.nextElementSibling?.classList.remove(
                            "hidden",
                          );
                        }}
                      />
                    ) : null}
                    <div
                      className={
                        review.coverImageUrl ? "hidden h-full" : "h-full"
                      }
                    >
                      <ImageFallback title={review.title} />
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute bottom-2 right-2 grid h-7 w-7 place-items-center border border-white/30 bg-black/65 text-white backdrop-blur-sm transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-black">
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-3 text-[9px] uppercase tracking-[.18em] text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Ver detalhes
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 font-serif text-base leading-tight text-white md:text-lg">
                    {review.title}
                  </p>
                  <p className="mt-1 line-clamp-1 text-[11px] uppercase tracking-[.12em] text-white/42">
                    {review.author || "Autoria não informada"}
                  </p>
                  {isActive ? (
                    <span className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[.18em] text-gold">
                      <span className="h-px w-7 bg-gold" />
                      Selecionado
                    </span>
                  ) : null}
                </button>
              </article>
            );
          })}
        </div>

        {activeReview ? (
          <section
            key={activeReview.id}
            className="archive-inline-detail"
            aria-live="polite"
            aria-labelledby="archive-modal-title"
          >
            {activeReview.coverImageUrl ? (
              <div
                className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center opacity-20 blur-2xl"
                style={{ backgroundImage: `url(${activeReview.coverImageUrl})` }}
                aria-hidden="true"
              />
            ) : null}
            <div className="archive-inline-detail-shade pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center border border-white/15 bg-black/40 text-white/65 backdrop-blur-sm transition-all hover:rotate-90 hover:border-gold hover:text-gold"
              aria-label="Fechar detalhes da publicação"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative z-10 grid gap-8 p-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 md:p-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:p-12">
                <div className="mx-auto w-full max-w-[220px] md:max-w-none">
                  <div className="aspect-[2/3] overflow-hidden border border-gold/30 bg-black shadow-[0_30px_80px_-24px_rgba(190,143,58,.55)]">
                    {activeReview.coverImageUrl ? (
                      <img
                        src={activeReview.coverImageUrl}
                        alt={`Capa de ${activeReview.title}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageFallback title={activeReview.title} />
                    )}
                  </div>
                </div>

                <div className="min-w-0 self-center">
                  <p className="text-[10px] uppercase tracking-[.2em] text-gold">
                    {activeReview.genre || "Literatura"} · {formatDate(activeReview.reviewDate)}
                  </p>
                  <h4
                    id="archive-modal-title"
                    className="mt-4 max-w-3xl font-serif text-[clamp(2.3rem,5vw,5rem)] font-medium leading-[.94] tracking-[-.05em] text-white"
                  >
                    {activeReview.title}
                  </h4>
                  <p className="mt-4 text-sm text-white/48">
                    por {activeReview.author || "Autoria não informada"}
                  </p>
                  <p className="mt-6 max-w-2xl text-sm leading-7 text-white/68 md:text-base md:leading-8">
                    {activeReview.excerpt ||
                      "Uma leitura preservada no acervo editorial do Apreciando a Leitura."}
                  </p>

                  <Link
                    href={`/resenhas/${activeReview.id}`}
                    className="group/link mt-8 inline-flex items-center gap-4 text-xs uppercase tracking-[.18em] text-gold"
                  >
                    <span className="border-b border-gold/60 pb-2 transition-colors group-hover/link:text-white">
                      Ler resenha completa
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-2" />
                  </Link>
                </div>
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
}

export default function Archive() {
  const { isLoading: loadingYears } = trpc.reviews.years.useQuery();
  const { data: stats } = trpc.reviews.stats.useQuery();

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [activeReviewId, setActiveReviewId] = useState<number | null>(null);

  const sortedYears = ARCHIVE_YEARS;

  useEffect(() => {
    if (selectedYear === null && sortedYears.length > 0) {
      setSelectedYear(sortedYears[sortedYears.length - 1]);
    }
  }, [sortedYears, selectedYear]);

  const queryInput = useMemo(
    () => ({ year: selectedYear ?? 0, month: selectedMonth ?? undefined }),
    [selectedYear, selectedMonth],
  );

  const { data: reviews = [], isLoading } = trpc.reviews.byYearMonth.useQuery(
    queryInput,
    {
      enabled: selectedYear !== null,
    },
  );

  const annualReviews = useMemo(
    () =>
      [...(reviews as ArchiveReview[])].sort(
        (a, b) =>
          new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime(),
      ),
    [reviews],
  );

  const activeReview = useMemo(
    () =>
      annualReviews.find((review) => review.id === activeReviewId) ?? null,
    [annualReviews, activeReviewId],
  );

  const { theme: cinematicTheme } = useCinematicTheme(
    activeReview?.coverImageUrl,
  );

  const archiveTheme = activeReview
    ? cinematicTheme
    : NEUTRAL_ARCHIVE_THEME;

  const cinematicStyle = useMemo(
    () => ({
      ...createThemeVariables(archiveTheme),
      backgroundImage: "var(--al-cinematic-gradient-background)",
      transition:
        "background-image var(--al-cinematic-duration) var(--al-cinematic-easing)",
    }),
    [archiveTheme],
  );

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".cinematic-footer");
    if (!footer) return;

    const variables = createThemeVariables(archiveTheme);

    Object.entries(variables).forEach(([property, value]) => {
      if (typeof value === "string") footer.style.setProperty(property, value);
    });

    return () => {
      Object.keys(variables).forEach((property) => {
        footer.style.removeProperty(property);
      });
    };
  }, [archiveTheme]);

  const currentYearIndex = selectedYear
    ? sortedYears.indexOf(selectedYear)
    : -1;
  const olderYear =
    currentYearIndex > 0 ? sortedYears[currentYearIndex - 1] : undefined;
  const newerYear =
    currentYearIndex >= 0 && currentYearIndex < sortedYears.length - 1
      ? sortedYears[currentYearIndex + 1]
      : undefined;

  const selectYear = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setActiveReviewId(null);
  };

  const selectMonth = (month: number | null) => {
    setSelectedMonth(month);
    setActiveReviewId(null);
  };

  return (
    <div
      className="editorial-page flex flex-col"
      style={cinematicStyle}
    >
      <section className="editorial-internal-hero archive-cinema-hero relative overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="cinema-grain absolute inset-0" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow !text-gold">Arquivo editorial · desde 2011</p>
            <h1 className="mt-5 max-w-4xl font-serif text-[clamp(4rem,9vw,8.8rem)] font-medium leading-[.82] tracking-[-.065em]">
              Quinze anos de memória literária.
            </h1>
          </div>
          <div className="max-w-sm border-l border-white/15 pb-2 pl-7">
            <p className="text-sm leading-7 text-white/60">
              Um acervo vivo de resenhas, primeiras impressões, ensaios e
              encontros com histórias — organizado para ser explorado, não
              apenas arquivado.
            </p>
            <div className="mt-7 flex gap-8">
              <div>
                <strong className="block font-serif text-3xl font-normal text-gold">
                  {stats?.total ?? "—"}
                </strong>
                <span className="text-[10px] uppercase tracking-[.18em] text-white/40">
                  publicações
                </span>
              </div>
              <div>
                <strong className="block font-serif text-3xl font-normal text-gold">
                  {sortedYears.length || "—"}
                </strong>
                <span className="text-[10px] uppercase tracking-[.18em] text-white/40">
                  anos catalogados
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="archive-experience bg-background">
        <div className="archive-year-rail border-b border-border">
          <div className="container flex items-center gap-2 overflow-x-auto py-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {loadingYears ? (
              <Loader2 className="my-6 h-5 w-5 animate-spin" />
            ) : (
              sortedYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => selectYear(year)}
                  className={`archive-year-button ${
                    selectedYear === year ? "is-active" : ""
                  }`}
                >
                  {year}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="container py-6 md:py-8">
          <div className="archive-month-bar">
            <button
              type="button"
              className={`archive-month-button ${
                selectedMonth === null ? "is-active" : ""
              }`}
              onClick={() => selectMonth(null)}
            >
              Ano completo
            </button>
            {MONTHS.map((month, index) => (
              <button
                key={month}
                type="button"
                className={`archive-month-button ${
                  selectedMonth === index + 1 ? "is-active" : ""
                }`}
                onClick={() =>
                  selectMonth(selectedMonth === index + 1 ? null : index + 1)
                }
              >
                {month.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">
                {selectedMonth
                  ? `${MONTHS[selectedMonth - 1]} · ${selectedYear}`
                  : `Edição anual · ${selectedYear ?? ""}`}
              </p>
              <h2 className="mt-3 font-serif text-[clamp(3rem,6vw,6rem)] font-medium leading-none tracking-[-.055em]">
                {annualReviews.length} histórias encontradas.
              </h2>
            </div>
            <div className="flex items-center gap-5 text-xs uppercase tracking-[.16em]">
              <button
                type="button"
                disabled={!olderYear}
                onClick={() => olderYear && selectYear(olderYear)}
                className="archive-step disabled:opacity-25"
              >
                <ChevronLeft className="h-4 w-4" /> Mais antigo
              </button>
              <button
                type="button"
                disabled={!newerYear}
                onClick={() => newerYear && selectYear(newerYear)}
                className="archive-step disabled:opacity-25"
              >
                Mais recente <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid min-h-[420px] place-items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : annualReviews.length === 0 ? (
            <div className="archive-empty">
              <Calendar className="h-8 w-8" />
              <h3>Nenhuma publicação neste recorte.</h3>
              <p>Escolha outro mês ou retorne à visão do ano completo.</p>
            </div>
          ) : (
            <AnnualShelf
              reviews={annualReviews}
              activeReviewId={activeReviewId}
              onSelect={(reviewId) =>
                setActiveReviewId((current) =>
                  current === reviewId ? null : reviewId,
                )
              }
              onClose={() => setActiveReviewId(null)}
            />
          )}
        </div>
      </section>
    </div>
  );
}
