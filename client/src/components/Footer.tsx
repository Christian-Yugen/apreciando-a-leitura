import { Link } from "wouter";
import { ArrowUpRight, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="cinematic-footer mt-auto text-cinema-ivory">
      <div className="container py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_.9fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <div className="brand-mark brand-mark-light" aria-hidden="true"><span>A</span><span>L</span></div>
              <div>
                <p className="font-serif text-2xl font-medium">Apreciando a Leitura</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-cinema-muted">por Elaise G. Lima</p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-7 text-cinema-muted">
              Uma revista literária digital construída sobre quinze anos de resenhas,
              descobertas e encontros com histórias.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a href="#" className="cinematic-icon-link" aria-label="Instagram"><Instagram className="h-4 w-4" /></a>
              <a href="mailto:elaiselima@gmail.com" className="cinematic-icon-link" aria-label="E-mail"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-cinema-muted">Navegação</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <Link href="/resenhas" className="footer-link">Resenhas</Link>
              <Link href="/acervo-historico" className="footer-link">Acervo</Link>
              <Link href="/sobre" className="footer-link">Sobre a autora</Link>
              <Link href="/meus-livros" className="footer-link">Livros</Link>
              <Link href="/servicos" className="footer-link">Serviços</Link>
              <Link href="/contato" className="footer-link">Contato</Link>
            </div>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-cinema-muted">Contato editorial</p>
            <a href="mailto:elaiselima@gmail.com" className="group inline-flex items-center gap-3 font-serif text-[clamp(1.25rem,2vw,1.65rem)]">
              <Mail className="h-4 w-4 shrink-0 text-gold" />
              <span className="border-b border-white/15 pb-1 transition-colors group-hover:text-gold">elaiselima@gmail.com</span>
            </a>
            <Link href="/servicos" className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold">
              Conheça os serviços <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-[10px] uppercase tracking-[0.16em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Apreciando a Leitura</p>
          <p>Elaise G. Lima · Escritora e revisora</p>
        </div>
      </div>
    </footer>
  );
}
