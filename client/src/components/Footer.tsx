import { Link } from "wouter";
import { ArrowUpRight, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-ink text-white">
      <div className="container py-16 md:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_.9fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="brand-mark brand-mark-light"><span>A</span><span>L</span></div>
              <div>
                <p className="font-serif text-2xl">Apreciando a Leitura</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-white/35">por Elaise G. Lima</p>
              </div>
            </div>
            <p className="mt-7 max-w-md text-sm leading-7 text-white/50">
              Uma revista literária digital construída sobre quinze anos de resenhas,
              descobertas e encontros com histórias.
            </p>
          </div>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-white/35">Navegação</p>
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
            <p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-white/35">Contato editorial</p>
            <a href="mailto:elaiselima@gmail.com" className="group inline-flex items-center gap-3 font-serif text-2xl">
              <Mail className="h-4 w-4 text-gold" />
              <span className="border-b border-white/15 pb-1 transition-colors group-hover:text-gold">elaiselima@gmail.com</span>
            </a>
            <Link href="/servicos" className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold">
              Conheça os serviços <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-7 text-[10px] uppercase tracking-[0.16em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Apreciando a Leitura</p>
          <p>Elaise G. Lima · Escritora e revisora</p>
        </div>
      </div>
    </footer>
  );
}
