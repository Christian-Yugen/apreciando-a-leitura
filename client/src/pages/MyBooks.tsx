import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Loader2, ArrowRight, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function MyBooks() {
  const { data: booksData, isLoading } = trpc.books.list.useQuery();
  const books = booksData ?? [];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="editorial-internal-hero relative overflow-hidden px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium tracking-widest uppercase text-accent">Obras Autorais</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold">Meus Livros</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Conheça as obras de fantasia e ficção cristã escritas por Elaise G. Lima
          </p>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : books.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto" />
              <p className="text-xl text-foreground font-medium">Nenhum livro encontrado</p>
              <p className="text-sm text-muted-foreground">Em breve, mais obras de Elaise G. Lima estarão disponíveis.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-8">
                Mostrando <span className="font-semibold text-foreground">{books.length}</span> obra(s)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                  <Card key={book.id} className="group flex flex-col overflow-hidden card-hover border-border/50 hover:border-primary/30">
                    {book.coverImageUrl && (
                      <div className="relative h-72 overflow-hidden bg-muted">
                        <img src={book.coverImageUrl} alt={`Capa: ${book.title}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {book.series && (
                          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-0 text-xs">
                            {book.series}
                          </Badge>
                        )}
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors line-clamp-2">{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4 flex-1">
                      <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">{book.synopsis}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      {book.purchaseLink ? (
                        <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button className="w-full rounded-lg">
                            Comprar <ExternalLink className="ml-2 w-4 h-4" />
                          </Button>
                        </a>
                      ) : (
                        <Button variant="outline" className="w-full rounded-lg text-muted-foreground" disabled>
                          Link em Breve
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-card/40 py-16 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Acompanhe as Novidades</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fique atento aos próximos lançamentos de Elaise G. Lima. Explore também suas resenhas e análises literárias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/resenhas" className="inline-block"><Button size="lg" className="rounded-lg">Ler Resenhas <ArrowRight className="ml-2 w-4 h-4" /></Button></Link>
            <Link href="/sobre" className="inline-block"><Button size="lg" variant="outline" className="rounded-lg">Sobre a Autora</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
