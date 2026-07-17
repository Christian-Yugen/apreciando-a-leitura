import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Feather, Loader2, Quote, Sparkles, Star } from "lucide-react";
import { trpc } from "@/lib/trpc";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function Home() {
  const { data: reviewsData, isLoading } = trpc.reviews.list.useQuery({ limit: 7 });
  const reviews = reviewsData ?? [];
  const featured = reviews[0];

  return (
    <div className="overflow-hidden bg-background">
      <section className="cinema-hero relative min-h-[88svh] border-b border-white/10 text-white">
        {featured?.coverImageUrl && (
          <img
            src={featured.coverImageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover opacity-30 scale-105"
          />
        )}
        <div className="cinema-hero-vignette absolute inset-0" />
        <div className="cinema-grain absolute inset-0" />

        <div className="relative container flex min-h-[88svh] flex-col justify-between py-10 md:py-16">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.38em] text-white/55">
            <span>Literatura • crítica • imaginação</span>
            <span className="hidden sm:block">Desde 2011</span>
          </div>

          <div className="grid items-end gap-12 py-20 lg:grid-cols-[1.35fr_.65fr]">
            <div className="max-w-5xl">
              <div className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-gold">
                <span className="h-px w-10 bg-gold/70" />
                Uma experiência editorial
              </div>
              <h1 className="display-title max-w-4xl text-[clamp(4rem,10vw,9rem)] leading-[0.78] tracking-[-0.075em]">
                Apreciando
                <span className="block translate-x-[.12em] italic text-gold">a Leitura</span>
              </h1>
              <p className="mt-10 max-w-2xl text-base leading-8 text-white/68 md:text-xl">
                Histórias observadas de perto. Resenhas com profundidade, beleza e sensibilidade por
                <span className="text-white"> Elaise G. Lima</span>.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/resenhas">
                  <Button size="lg" className="cinema-button h-13 rounded-none px-8 text-xs uppercase tracking-[0.2em]">
                    Entrar no acervo <ArrowRight className="ml-3 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sobre">
                  <Button size="lg" variant="outline" className="h-13 rounded-none border-white/20 bg-white/5 px-8 text-xs uppercase tracking-[0.2em] text-white backdrop-blur hover:bg-white/10 hover:text-white">
                    Conheça a autora
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden border-l border-white/15 pl-8 lg:block">
              <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-white/45">Em destaque</p>
              {featured ? (
                <Link href={`/resenhas/${featured.id}`} className="group block">
                  <p className="font-serif text-3xl leading-tight text-white transition-colors group-hover:text-gold">{featured.title}</p>
                  <p className="mt-3 text-sm text-white/50">{featured.author}</p>
                  <p className="mt-6 line-clamp-3 text-sm leading-7 text-white/60">{featured.excerpt || featured.content}</p>
                  <span className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-gold">
                    Ler agora <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ) : (
                <p className="text-sm text-white/55">Uma curadoria de leituras para atravessar o tempo.</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 border-t border-white/15 pt-6 text-xs text-white/45 sm:grid-cols-3">
            <span>Resenhas e ensaios literários</span>
            <span className="sm:text-center">Fantasia • ficção cristã • clássicos</span>
            <span className="sm:text-right">Revisão profissional de textos</span>
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-36">
        <div className="container">
          <div className="mb-16 grid gap-8 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <div>
              <p className="eyebrow">Curadoria recente</p>
              <h2 className="section-title mt-4">Leituras que permanecem.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:justify-self-end md:text-lg">
              Cada resenha é construída como uma janela: contexto, atmosfera, interpretação e a experiência humana escondida entre as páginas.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : reviews.length === 0 ? (
            <div className="border border-border py-24 text-center"><BookOpen className="mx-auto mb-4 h-10 w-10 opacity-25" /><p className="text-muted-foreground">Nenhuma resenha disponível.</p></div>
          ) : (
            <div className="editorial-grid">
              {reviews.slice(0, 6).map((review, index) => (
                <Link key={review.id} href={`/resenhas/${review.id}`} className={`editorial-card group ${index === 0 ? "editorial-card-featured" : ""}`}>
                  <div className="relative h-full min-h-[360px] overflow-hidden bg-neutral-900">
                    {review.coverImageUrl && <img src={review.coverImageUrl} alt={`Capa de ${review.title}`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                      <div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-white/60">
                        <span>{review.genre || "Literatura"}</span><span className="h-px w-6 bg-gold/80" /><span>{formatDate(review.reviewDate)}</span>
                      </div>
                      <h3 className="font-serif text-3xl leading-[1.05] text-white md:text-4xl">{review.title}</h3>
                      <p className="mt-3 text-sm text-white/55">por {review.author}</p>
                      <p className="mt-5 hidden max-w-xl line-clamp-2 text-sm leading-6 text-white/65 md:block">{review.excerpt || review.content}</p>
                    </div>
                    <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center border border-white/25 bg-black/10 text-white backdrop-blur transition group-hover:border-gold group-hover:text-gold">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-end">
            <Link href="/resenhas" className="text-link">Ver todas as resenhas <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-ink py-24 text-white md:py-32">
        <div className="container grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-md">
            <div className="aspect-[4/5] border border-white/15 bg-[radial-gradient(circle_at_40%_25%,rgba(190,152,86,.25),transparent_30%),linear-gradient(145deg,#251d2d,#0b0a0d)] p-10">
              <div className="flex h-full flex-col justify-between border border-white/10 p-8">
                <Feather className="h-9 w-9 text-gold" />
                <div>
                  <Quote className="mb-5 h-8 w-8 text-white/20" />
                  <p className="font-serif text-3xl italic leading-tight text-white/90">“Ler é permitir que outra voz reorganize o silêncio dentro de nós.”</p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Elaise G. Lima</p>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 h-28 w-28 border-b border-r border-gold/60" />
          </div>

          <div>
            <p className="eyebrow text-gold">A autora por trás das páginas</p>
            <h2 className="section-title mt-5 max-w-3xl text-white">Escrita com propósito. Leitura com profundidade.</h2>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-white/62">
              Escritora de fantasia e ficção cristã, blogueira literária e revisora. Elaise transforma leitura em encontro: com a obra, com o autor e com aquilo que o texto desperta em quem lê.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                ["15+", "anos de acervo"],
                ["04", "livros publicados"],
                ["01", "olhar singular"],
              ].map(([value, label]) => (
                <div key={label} className="border-t border-white/15 pt-5">
                  <p className="font-serif text-4xl text-gold">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/sobre"><Button className="cinema-button rounded-none px-7">Conheça sua trajetória</Button></Link>
              <Link href="/meus-livros"><Button variant="outline" className="rounded-none border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">Descubra seus livros</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-36">
        <div className="container">
          <div className="relative overflow-hidden border border-border bg-card px-7 py-16 md:px-16 md:py-24">
            <Sparkles className="absolute right-10 top-10 h-28 w-28 text-primary/[0.04]" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-6 flex gap-1 text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}</div>
                <p className="eyebrow">Serviços editoriais</p>
                <h2 className="section-title mt-4 max-w-3xl">Seu texto merece chegar ao leitor em sua melhor forma.</h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">Revisão cuidadosa, leitura crítica e atenção à voz autoral — com rigor técnico sem apagar a identidade do texto.</p>
              </div>
              <Link href="/servicos"><Button size="lg" className="cinema-button h-14 rounded-none px-8">Solicitar uma avaliação <ArrowRight className="ml-3 h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
