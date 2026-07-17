import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

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

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function ImageFallback({ title }: { title: string }) {
  return (
    <div className="archive-cover-fallback" aria-label={`Sem capa para ${title}`}>
      <BookOpen className="h-8 w-8" />
      <span>{title.slice(0, 1)}</span>
    </div>
  );
}

export default function Archive() {
  const { data: years = [], isLoading: loadingYears } =
    trpc.reviews.years.useQuery();
  const { data: stats } = trpc.reviews.stats.useQuery();

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    if (selectedYear === null && years.length > 0) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  const queryInput = useMemo(
    () => ({ year: selectedYear ?? 0, month: selectedMonth ?? undefined }),
    [selectedYear, selectedMonth],
  );

  const { data: reviews = [], isLoading } =
    trpc.reviews.byYearMonth.useQuery(queryInput, {
      enabled: selectedYear !== null,
    });

  const currentYearIndex = selectedYear ? years.indexOf(selectedYear) : -1;
  const olderYear = currentYearIndex >= 0 ? years[currentYearIndex + 1] : undefined;
  const newerYear = currentYearIndex > 0 ? years[currentYearIndex - 1] : undefined;

  const selectYear = (year: number) => {
    setSelectedYear(year);
    setSelectedMonth(null);
  };

  return (
    <div className="editorial-page flex flex-col">
      <section className="editorial-internal-hero archive-cinema-hero relative overflow-hidden px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="cinema-grain absolute inset-0" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow !text-gold">Arquivo editorial · desde 2011</p>
            <h1 className="mt-5 max-w-4xl font-serif text-[clamp(4rem,9vw,8.8rem)] font-medium leading-[.82] tracking-[-.065em]">
              Quinze anos de memória literária.
            </h1>
          </div>
          <div className="max-w-sm border-l border-white/15 pl-7 pb-2">
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
                  {years.length || "—"}
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
              years.map((year) => (
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

        <div className="container py-10 md:py-14">
          <div className="archive-month-bar">
            <button
              type="button"
              className={`archive-month-button ${selectedMonth === null ? "is-active" : ""}`}
              onClick={() => setSelectedMonth(null)}
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
                  setSelectedMonth(selectedMonth === index + 1 ? null : index + 1)
                }
              >
                {month.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">
                {selectedMonth
                  ? `${MONTHS[selectedMonth - 1]} · ${selectedYear}`
                  : `Edição anual · ${selectedYear ?? ""}`}
              </p>
              <h2 className="mt-3 font-serif text-[clamp(3rem,6vw,6rem)] font-medium leading-none tracking-[-.055em]">
                {reviews.length} histórias encontradas.
              </h2>
            </div>
            <div className="flex items-center gap-5 text-xs uppercase tracking-[.16em]">
              <button
                type="button"
                disabled={!newerYear}
                onClick={() => newerYear && selectYear(newerYear)}
                className="archive-step disabled:opacity-25"
              >
                <ChevronLeft className="h-4 w-4" /> Mais recente
              </button>
              <button
                type="button"
                disabled={!olderYear}
                onClick={() => olderYear && selectYear(olderYear)}
                className="archive-step disabled:opacity-25"
              >
                Mais antigo <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid min-h-[420px] place-items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="archive-empty">
              <Calendar className="h-8 w-8" />
              <h3>Nenhuma publicação neste recorte.</h3>
              <p>Escolha outro mês ou retorne à visão do ano completo.</p>
            </div>
          ) : (
            <div className="archive-story-grid mt-8">
              {reviews.map((review, index) => (
                <Link
                  key={review.id}
                  href={`/resenhas/${review.id}`}
                  className={`archive-story-card ${index === 0 ? "archive-story-lead" : ""}`}
                >
                  <div className="archive-story-media">
                    {review.coverImageUrl ? (
                      <img
                        src={review.coverImageUrl}
                        alt={`Capa de ${review.title}`}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                          event.currentTarget.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div className={review.coverImageUrl ? "hidden" : ""}>
                      <ImageFallback title={review.title} />
                    </div>
                    <div className="archive-story-shade" />
                    <span className="archive-story-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="archive-story-copy">
                    <p className="archive-story-date">{formatDate(review.reviewDate)}</p>
                    <h3>{review.title}</h3>
                    <p className="archive-story-excerpt">
                      {review.excerpt || `Uma leitura registrada no acervo de ${selectedYear}.`}
                    </p>
                    <div className="archive-story-footer">
                      <span>{review.genre || "Literatura"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
