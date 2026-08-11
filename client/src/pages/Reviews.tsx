import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, BookOpen, Filter, Loader2, Search } from "lucide-react";
import { useReviewGenres, useReviews } from "@/lib/queries";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Reviews() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const { data: genresData } = useReviewGenres();
  const input = useMemo(() => ({ search: search || undefined, genre: genre === "all" ? undefined : genre }), [search, genre]);
  const { data, isLoading } = useReviews(input);
  const reviews = data ?? [];

  return <div className="editorial-page">
    <section className="editorial-internal-hero relative overflow-hidden px-4 py-24 text-white sm:px-6 lg:px-8">
      <div className="cinema-grain absolute inset-0" />
      <div className="container relative z-10 grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
        <div><p className="eyebrow !text-gold">Biblioteca editorial</p><h1 className="mt-6 max-w-4xl font-serif text-[clamp(4rem,9vw,8rem)] font-medium leading-[.82] tracking-[-.065em]">Leituras que<br/><em className="text-gold">permanecem.</em></h1></div>
        <p className="max-w-lg border-l border-white/20 pl-6 text-base leading-8 text-white/65">Um arquivo vivo de crítica, descoberta e memória literária. Encontre uma obra por título, autoria ou atmosfera.</p>
      </div>
    </section>

    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="container">
        <div className="editorial-filter-bar grid gap-4 border-y border-border py-6 md:grid-cols-[1fr_280px]">
          <div className="relative"><Search className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar no acervo" className="h-14 rounded-none border-0 border-b bg-transparent pl-8 text-base shadow-none focus-visible:ring-0"/></div>
          <Select value={genre} onValueChange={setGenre}><SelectTrigger className="h-14 rounded-none border-0 border-b bg-transparent shadow-none"><Filter className="mr-2 h-4 w-4"/><SelectValue placeholder="Categoria"/></SelectTrigger><SelectContent><SelectItem value="all">Todas as categorias</SelectItem>{(genresData??[]).map(g=><SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="flex items-end justify-between py-10"><div><p className="eyebrow">Curadoria completa</p><h2 className="mt-3 font-serif text-4xl md:text-6xl">{isLoading ? "Consultando..." : `${reviews.length} publicações`}</h2></div></div>
        {isLoading ? <div className="grid min-h-72 place-items-center"><Loader2 className="h-7 w-7 animate-spin"/></div> : reviews.length===0 ? <div className="grid min-h-80 place-items-center border border-border"><div className="text-center"><BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground"/><p className="font-serif text-3xl">Nenhuma leitura encontrada.</p></div></div> :
        <div className="editorial-library-grid">{reviews.map((r,i)=><Link key={r.id} href={`/resenhas/${r.id}`} className={`library-story group ${i===0?'library-story-featured':''}`}>
          <div className="absolute inset-0 bg-ink">{r.coverImageUrl && <img src={r.coverImageUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/>}<div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"/></div>
          <div className="relative z-10 mt-auto p-6 md:p-8"><div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[.22em] text-white/60"><span>{r.genre||'Literatura'}</span><span>{formatDate(r.reviewDate)}</span></div><h3 className="max-w-2xl font-serif text-3xl leading-none tracking-tight text-white md:text-4xl">{r.title}</h3><p className="mt-4 line-clamp-2 max-w-xl text-sm leading-6 text-white/65">{r.excerpt}</p><span className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[.2em] text-gold">Ler publicação <ArrowUpRight className="h-4 w-4"/></span></div>
        </Link>)}</div>}
      </div>
    </section>
  </div>;
}
