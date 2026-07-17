import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, ArrowRight, Calendar, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const ALL_YEARS = Array.from({ length: 2026 - 2011 + 1 }, (_, i) => 2026 - i);

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function Archive() {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const queryInput = useMemo(() => {
    if (selectedYear !== null) {
      return { year: selectedYear, month: selectedMonth ?? undefined };
    }
    return undefined;
  }, [selectedYear, selectedMonth]);

  const { data: reviewsData, isLoading } = trpc.reviews.byYearMonth.useQuery(
    queryInput ?? { year: 0 },
    { enabled: selectedYear !== null }
  );

  const reviews = reviewsData ?? [];

  const handleYearClick = (year: number) => {
    if (selectedYear === year) {
      setSelectedYear(null);
      setSelectedMonth(null);
    } else {
      setSelectedYear(year);
      setSelectedMonth(null);
    }
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.10_285)] text-primary-foreground py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium tracking-widest uppercase text-accent">Navegação Temporal</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold">Acervo Histórico</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Explore todas as resenhas publicadas desde 2011. Navegue por ano e mês para encontrar leituras do seu interesse.
          </p>
        </div>
      </section>

      {/* Archive Navigation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Year & Month Navigation */}
            <div className="md:col-span-4 space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground mb-4">Anos</h2>
                <div className="flex flex-wrap gap-2">
                  {ALL_YEARS.map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      size="sm"
                      className="rounded-lg"
                      onClick={() => handleYearClick(year)}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedYear !== null && (
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="font-serif text-lg font-semibold text-foreground">Meses de {selectedYear}</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {MONTHS.map((month, idx) => (
                      <Button
                        key={month}
                        variant={selectedMonth === idx + 1 ? "default" : "ghost"}
                        size="sm"
                        className="rounded-lg text-xs"
                        onClick={() => handleMonthClick(idx + 1)}
                      >
                        {month.substring(0, 3)}
                      </Button>
                    ))}
                  </div>
                  {selectedMonth !== null && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground"
                      onClick={() => setSelectedMonth(null)}
                    >
                      Ver todas de {selectedYear}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Reviews List */}
            <div className="md:col-span-8">
              {selectedYear === null ? (
                <div className="text-center py-20 space-y-4">
                  <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                  <div>
                    <p className="text-xl text-foreground font-medium">Selecione um ano</p>
                    <p className="text-sm text-muted-foreground mt-1">Escolha um ano à esquerda para visualizar as resenhas daquele período.</p>
                  </div>
                </div>
              ) : isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-20 space-y-4">
                  <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto" />
                  <div>
                    <p className="text-xl text-foreground font-medium">Nenhuma resenha encontrada</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedMonth !== null
                        ? `Não há resenhas em ${MONTHS[selectedMonth - 1]} de ${selectedYear}.`
                        : `Não há resenhas registradas para ${selectedYear}.`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>Mostrando</span>
                    <Badge variant="secondary" className="rounded">
                      {reviews.length} resenha(s)
                    </Badge>
                    {selectedMonth !== null && (
                      <span>em {MONTHS[selectedMonth - 1]} de {selectedYear}</span>
                    )}
                    {selectedMonth === null && <span>em {selectedYear}</span>}
                  </div>
                  {reviews.map((review) => (
                    <Link key={review.id} href={`/resenhas/${review.id}`} className="block">
                      <Card className="group flex flex-row items-center gap-4 p-4 card-hover cursor-pointer border-border/50 hover:border-primary/30">
                        {review.coverImageUrl && (
                          <div className="flex-shrink-0 w-16 h-24 rounded overflow-hidden bg-muted">
                            <img src={review.coverImageUrl} alt={`Capa: ${review.title}`} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground mb-1">{formatDate(review.reviewDate)}</p>
                          <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{review.title}</h3>
                          <p className="text-sm text-muted-foreground/80">por {review.author}</p>
                          {review.genre && <Badge variant="outline" className="mt-1 text-xs">{review.genre}</Badge>}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
