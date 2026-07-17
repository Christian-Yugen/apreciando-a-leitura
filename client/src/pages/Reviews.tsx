import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, Loader2, ArrowRight, Filter } from "lucide-react";
import { trpc } from "@/lib/trpc";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function Reviews() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");

  const { data: genresData } = trpc.reviews.genres.useQuery();
  const genres = genresData ?? [];

  const input = useMemo(() => ({
    search: search || undefined,
    genre: genre === "all" ? undefined : genre,
  }), [search, genre]);

  const { data: reviewsData, isLoading } = trpc.reviews.list.useQuery(input);
  const reviews = reviewsData ?? [];

  return (
    <div className="flex flex-col">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 px-4 sm:px-6 lg:px-8 border-b border-border/30">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <p className="text-sm text-accent font-medium uppercase tracking-widest">Acervo de Resenhas</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground">Resenhas Literárias</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Análises aprofundadas de livros que merecem ser lidos. Filtre por gênero ou busque por título e autor.
          </p>
        </div>
      </section>

      {/* Filters & Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou autor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-lg"
              />
            </div>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger className="sm:w-56 rounded-lg">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os gêneros</SelectItem>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            {isLoading ? "Carregando..." : `${reviews.length} resenha(s) encontrada(s)`}
          </p>

          {/* Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto" />
              <div>
                <p className="text-xl text-foreground font-medium">Nenhuma resenha encontrada</p>
                <p className="text-sm text-muted-foreground mt-1">Tente ajustar a busca ou o filtro selecionado.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => { setSearch(""); setGenre("all"); }}
                className="rounded-lg"
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Link key={review.id} href={`/resenhas/${review.id}`} className="block">
                  <Card className="h-full overflow-hidden card-hover cursor-pointer border-border/50 hover:border-primary/30">
                    {review.coverImageUrl && (
                      <div className="relative h-56 overflow-hidden bg-muted">
                        <img src={review.coverImageUrl} alt={`Capa: ${review.title}`} className="w-full h-full object-cover" />
                        {review.genre && (
                          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0">
                            {review.genre}
                          </Badge>
                        )}
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <p className="text-xs text-muted-foreground">{formatDate(review.reviewDate)}</p>
                      <CardTitle className="text-lg font-serif line-clamp-2 group-hover:text-primary transition-colors">{review.title}</CardTitle>
                      <p className="text-sm text-muted-foreground/80">por {review.author}</p>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{review.excerpt || review.content}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Ler resenha <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
