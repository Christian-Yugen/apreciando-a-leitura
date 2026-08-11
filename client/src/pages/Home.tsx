import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Feather,
  Loader2,
  Quote,
  Sparkles,
  Star,
} from "lucide-react";
import { useReviews, useReviewStats } from "@/lib/queries";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatYear(date?: Date | string | null) {
  if (!date) return "2011";
  return String(new Date(date).getFullYear());
}

function ReviewImage({
  src,
  alt,
  className = "",
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`cinema-image-placeholder ${className}`}
      >
        <BookOpen className="h-10 w-10" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export default function Home() {
  const { data: reviewsData, isLoading } = useReviews({
    limit: 7,
  });
  const { data: stats } = useReviewStats();

  const reviews = reviewsData ?? [];
  const featured = reviews[0];
  const archiveTotal = stats?.total ?? 611;
  const firstYear = formatYear(stats?.firstPublication);
  const lastYear = formatYear(stats?.lastPublication);

  return (
    <div className="overflow-hidden bg-background">
      <section className="cinema-hero relative min-h-[96svh] text-white">
        {featured?.coverImageUrl ? (
          <ReviewImage
            src={featured.coverImageUrl}
            alt=""
            className="cinema-hero-image absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="cinema-hero-fallback absolute inset-0" />
        )}

        <div className="cinema-hero-vignette absolute inset-0" />
        <div className="cinema-grain absolute inset-0" />
        <div className="cinema-frame absolute inset-4 hidden border border-white/10 md:block" />

        <div className="container relative flex min-h-[96svh] flex-col justify-between pb-9 pt-28 md:pb-12 md:pt-36">
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.38em] text-white/55 sm:text-[10px]">
            <span>Literatura · crítica · imaginação</span>
            <span className="hidden sm:block">Arquivo editorial {firstYear}—{lastYear}</span>
          </div>

          <div className="grid items-end gap-12 py-16 lg:grid-cols-[1.3fr_.7fr] lg:py-20">
            <div className="max-w-5xl">
              <div className="cinema-reveal mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold md:text-[11px]">
                <span className="h-px w-10 bg-gold/70" />
                Uma revista literária digital
              </div>

              <h1 className="display-title cinema-reveal cinema-reveal-delay max-w-5xl text-[clamp(4.2rem,11vw,10.5rem)] leading-[0.76] tracking-[-0.078em]">
                Apreciando
                <span className="block translate-x-[.1em] italic text-gold">
                  a Leitura
                </span>
              </h1>

              <p className="cinema-reveal cinema-reveal-delay-2 mt-10 max-w-2xl text-base leading-8 text-white/70 md:text-xl md:leading-9">
                Um acervo de leituras observadas de perto. Resenhas, ensaios e
                descobertas com profundidade e sensibilidade por
                <span className="text-white"> Elaise G. Lima</span>.
              </p>

              <div className="cinema-reveal cinema-reveal-delay-3 mt-10 flex flex-wrap gap-4">
                <Link href="/resenhas" className="cinema-button inline-flex h-13 items-center px-8 text-xs uppercase tracking-[0.2em]">
                  Explorar o acervo <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
                <Link href="/sobre" className="cinema-outline-button inline-flex h-13 items-center px-8 text-xs uppercase tracking-[0.2em]">
                  Conheça a autora
                </Link>
              </div>
            </div>

            <aside className="cinema-feature-card hidden lg:block">
              <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-white/45">
                Última publicação
              </p>
              {featured ? (
                <Link href={`/resenhas/${featured.id}`} className="group block">
                  <p className="font-serif text-3xl leading-[1.05] text-white transition-colors group-hover:text-gold">
                    {featured.title}
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/45">
                    <span>{featured.genre || "Literatura"}</span>
                    <span className="h-px w-6 bg-gold/70" />
                    <span>{formatDate(featured.reviewDate)}</span>
                  </div>
                  <p className="mt-6 line-clamp-3 text-sm leading-7 text-white/60">
                    {featured.excerpt || featured.content}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-gold">
                    Ler publicação
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ) : (
                <p className="text-sm leading-7 text-white/55">
                  Uma curadoria de leituras para atravessar o tempo.
                </p>
              )}
            </aside>
          </div>

          <div className="grid items-end gap-6 border-t border-white/15 pt-6 md:grid-cols-[1fr_auto_1fr]">
            <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-white/45">
              <span><strong className="font-serif text-2xl font-normal text-white">{archiveTotal}</strong><br />publicações</span>
              <span><strong className="font-serif text-2xl font-normal text-white">{Number(lastYear) - Number(firstYear) + 1}</strong><br />anos de acervo</span>
            </div>
            <a href="#curadoria" className="hidden flex-col items-center gap-2 text-[9px] uppercase tracking-[0.28em] text-white/40 md:flex">
              Descobrir <ArrowDown className="h-4 w-4 animate-bounce" />
            </a>
            <p className="max-w-sm text-xs leading-6 text-white/45 md:justify-self-end md:text-right">
              Fantasia, ficção cristã, romance, clássicos e histórias que deixam marcas.
            </p>
          </div>
        </div>
      </section>

      <section id="curadoria" className="relative py-24 md:py-36">
        <div className="container">
          <div className="mb-16 grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <div>
              <p className="eyebrow">Curadoria recente</p>
              <h2 className="section-title mt-4">Leituras que permanecem.</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground md:justify-self-end md:text-lg">
              Cada publicação é tratada como uma janela: contexto, atmosfera,
              interpretação e a experiência humana escondida entre as páginas.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="border border-border py-24 text-center">
              <BookOpen className="mx-auto mb-4 h-10 w-10 opacity-25" />
              <p className="text-muted-foreground">Nenhuma resenha disponível.</p>
            </div>
          ) : (
            <div className="editorial-grid">
              {reviews.slice(0, 6).map((review, index) => (
                <Link
                  key={review.id}
                  href={`/resenhas/${review.id}`}
                  className={`editorial-card group ${index === 0 ? "editorial-card-featured" : ""}`}
                >
                  <article className="relative h-full min-h-[380px] overflow-hidden bg-ink">
                    <ReviewImage
                      src={review.coverImageUrl}
                      alt={`Imagem da publicação ${review.title}`}
                      className="absolute inset-0 h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-[1.045]"
                    />
                    <div className="editorial-card-overlay absolute inset-0" />
                    <div className="absolute left-6 top-6 text-[9px] uppercase tracking-[0.28em] text-white/55">
                      0{index + 1}
                    </div>
                    <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center border border-white/25 bg-black/10 text-white backdrop-blur transition duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-black">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-7 md:p-9">
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-white/60 md:text-[10px]">
                        <span>{review.genre || "Literatura"}</span>
                        <span className="h-px w-6 bg-gold/80" />
                        <span>{formatDate(review.reviewDate)}</span>
                      </div>
                      <h3 className="font-serif text-3xl leading-[1.02] text-white md:text-4xl">
                        {review.title}
                      </h3>
                      <p className="mt-5 hidden max-w-xl line-clamp-2 text-sm leading-6 text-white/65 md:block">
                        {review.excerpt || review.content}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-end">
            <Link href="/resenhas" className="text-link">
              Ver todas as publicações <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="archive-band border-y border-border py-20 md:py-24">
        <div className="container grid gap-10 lg:grid-cols-[.65fr_1.35fr] lg:items-center">
          <div>
            <p className="eyebrow">Uma história em capítulos</p>
            <h2 className="mt-5 font-serif text-5xl leading-[.92] tracking-[-.045em] md:text-7xl">
              Quinze anos de memória literária.
            </h2>
          </div>
          <div>
            <div className="archive-years" aria-label="Período do acervo">
              {[2011, 2014, 2017, 2020, 2023, 2026].map((year) => (
                <span key={year}>{year}</span>
              ))}
            </div>
            <p className="mt-8 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              O acervo acompanha mudanças de gosto, fases da escrita e encontros com
              centenas de livros. Agora, toda essa trajetória pode ser explorada por ano,
              mês, gênero e palavra-chave.
            </p>
            <Link href="/acervo-historico" className="text-link mt-8">
              Percorrer a linha do tempo <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-ink py-24 text-white md:py-32">
        <div className="container grid gap-16 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-md">
            <div className="author-art aspect-[4/5] p-8 md:p-10">
              <div className="flex h-full flex-col justify-between border border-white/10 p-7 md:p-8">
                <Feather className="h-9 w-9 text-gold" />
                <div>
                  <Quote className="mb-5 h-8 w-8 text-white/20" />
                  <p className="font-serif text-3xl italic leading-tight text-white/90 md:text-4xl">
                    “Ler é permitir que outra voz reorganize o silêncio dentro de nós.”
                  </p>
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                  Elaise G. Lima
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 h-28 w-28 border-b border-r border-gold/60" />
          </div>

          <div>
            <p className="eyebrow text-gold">A autora por trás das páginas</p>
            <h2 className="section-title mt-5 max-w-3xl text-white">
              Escrita com propósito. Leitura com profundidade.
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-white/62">
              Escritora de fantasia e ficção cristã, blogueira literária e revisora.
              Elaise transforma leitura em encontro: com a obra, com o autor e com
              aquilo que o texto desperta em quem lê.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                [`${archiveTotal}`, "publicações"],
                ["04", "livros publicados"],
                ["15+", "anos de trajetória"],
              ].map(([value, label]) => (
                <div key={label} className="border-t border-white/15 pt-5">
                  <p className="font-serif text-4xl text-gold">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/sobre" className="cinema-button inline-flex h-12 items-center px-7 text-xs uppercase tracking-[0.16em]">
                Conheça sua trajetória
              </Link>
              <Link href="/meus-livros" className="cinema-outline-button inline-flex h-12 items-center px-7 text-xs uppercase tracking-[0.16em]">
                Descubra seus livros
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container">
          <div className="service-panel relative overflow-hidden border border-border bg-card px-7 py-16 md:px-16 md:py-24">
            <Sparkles className="absolute right-10 top-10 h-28 w-28 text-primary/[0.04]" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-6 flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="eyebrow">Serviços editoriais</p>
                <h2 className="section-title mt-4 max-w-3xl">
                  Seu texto merece chegar ao leitor em sua melhor forma.
                </h2>
                <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                  Revisão cuidadosa, leitura crítica e atenção à voz autoral — com
                  rigor técnico sem apagar a identidade do texto.
                </p>
              </div>
              <Link href="/servicos" className="cinema-button inline-flex h-14 items-center px-8 text-sm">
                Solicitar uma avaliação <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
