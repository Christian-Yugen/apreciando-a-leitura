import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/resenhas", label: "Resenhas" },
  { href: "/acervo-historico", label: "Acervo" },
  { href: "/sobre", label: "Autora" },
  { href: "/meus-livros", label: "Livros" },
  { href: "/servicos", label: "Serviços" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="cinematic-header sticky top-0 z-50 w-full">
      <div className="container flex h-[74px] items-center justify-between md:h-[82px]">
        <Link href="/" className="group flex items-center gap-3.5" aria-label="Apreciando a Leitura — página inicial">
          <div className="brand-mark brand-mark-light" aria-hidden="true">
            <span>A</span><span>L</span>
          </div>
          <div className="leading-none">
            <span className="block font-serif text-[1.12rem] font-medium tracking-[-0.02em] text-cinema-ivory md:text-xl">
              Apreciando a Leitura
            </span>
            <span className="mt-1.5 block text-[8px] uppercase tracking-[0.34em] text-cinema-muted">
              por Elaise G. Lima
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
          {navLinks.map((link) => {
            const active = location === link.href || location.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link nav-link-light ${active ? "nav-link-active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-cinema-ivory hover:bg-white/5 hover:text-gold lg:hidden"
              aria-label="Abrir menu"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="cinematic-drawer w-[90vw] max-w-[410px] p-8 text-cinema-ivory">
            <div className="brand-mark brand-mark-light mb-12" aria-hidden="true"><span>A</span><span>L</span></div>
            <p className="mb-7 text-[10px] uppercase tracking-[0.3em] text-cinema-muted">Navegação</p>
            <nav className="flex flex-col">
              {navLinks.map((link, index) => {
                const active = location === link.href || location.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center justify-between border-b border-white/10 py-5 font-serif text-3xl transition-colors ${active ? "text-gold" : "text-cinema-ivory"}`}
                  >
                    <span className="transition-colors group-hover:text-gold">{link.label}</span>
                    <span className="text-[10px] tracking-[0.2em] text-white/30">0{index + 1}</span>
                  </Link>
                );
              })}
            </nav>
            <p className="mt-12 max-w-xs text-sm leading-7 text-cinema-muted">
              Resenhas, ensaios e memória literária desde 2011.
            </p>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
