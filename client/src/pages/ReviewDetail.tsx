import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ExternalLink, Calendar, User, Tag, Archive } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ReviewDetail() {
  const { id } = useParams<{ id: string }>();
  const reviewId = parseInt(id);
  const { data: review, isLoading } = trpc.reviews.byId.useQuery({ id: reviewId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-foreground">Resenha não encontrada</h1>
        <p className="text-muted-foreground">A resenha que você procura não existe ou foi removida.</p>
        <Link href="/resenhas"><Button variant="outline" className="rounded-lg">Voltar para Resenhas</Button></Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero with cover */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.10_285)] text-primary-foreground py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto">
          <Link href="/resenhas" className="inline-flex items-center gap-2 text-sm text-primary-foreground/70 hover:text-accent transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Voltar para Resenhas
            </Link>
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {review.coverImageUrl && (
              <div className="md:col-span-4">
                <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-accent/20">
                  <img src={review.coverImageUrl} alt={`Capa: ${review.title}`} className="w-full object-cover" />
                </div>
              </div>
            )}
            <div className="md:col-span-8 space-y-4">
              {review.genre && (
                <Badge className="bg-accent text-accent-foreground border-0">{review.genre}</Badge>
              )}
              <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight">{review.title}</h1>
              <p className="text-xl text-accent italic">por {review.author}</p>
              <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/70 pt-2">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(review.reviewDate)}</span>
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> Resenha por Elaise G. Lima</span>
                {review.genre && <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> {review.genre}</span>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-border/50">
            <CardContent className="p-6 md:p-10">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <Streamdown>{review.content}</Streamdown>
              </div>
            </CardContent>
          </Card>

          {review.sourceUrl && (
            <div className="mt-8 flex justify-center">
              <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="rounded-full text-muted-foreground">
                  <Archive className="mr-2 w-4 h-4" /> Ver publicação original preservada
                </Button>
              </a>
            </div>
          )}

          {/* Purchase Link */}
          {review.purchaseLink && (
            <div className="mt-8 p-6 rounded-xl bg-accent/10 border border-accent/20 text-center">
              <p className="text-sm text-muted-foreground mb-3">Interessado em ler este livro?</p>
              <a href={review.purchaseLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="rounded-lg">
                  Comprar na Amazon <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between items-center">
            <Link href="/resenhas" className="inline-block"><Button variant="outline" className="rounded-lg"><ArrowLeft className="mr-2 w-4 h-4" /> Todas as Resenhas</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
