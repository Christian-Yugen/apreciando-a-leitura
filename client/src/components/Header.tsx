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
  const onHome = location === "/";

  return (
    <header
      className={
        onHome
          ? "absolute inset-x-0 top-0 z-50 w-full border-b border-white/10 bg-black/10 text-white backdrop-blur-md"
          : "sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-xl"
      }
    >
      <div className="container flex h-[82px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-4" aria-label="Apreciando a Leitura — página inicial">
          <div className={`brand-mark ${onHome ? "brand-mark-light" : ""}`}>
            <span>A</span><span>L</span>
          </div>
          <div className="leading-none">
            <span className="block font-serif text-xl font-semibold tracking-tight">
              Apreciando a Leitura
            </span>
            <span className={`mt-1.5 block text-[9px] uppercase tracking-[0.34em] ${onHome ? "text-white/45" : "text-muted-foreground"}`}>
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
                className={`nav-link ${onHome ? "nav-link-light" : ""} ${active ? "nav-link-active" : ""}`}
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
              className={onHome ? "text-white hover:bg-white/10 hover:text-white lg:hidden" : "lg:hidden"}
            >
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[90vw] max-w-[410px] bg-ink p-8 text-white">
            <div className="brand-mark brand-mark-light mb-12"><span>A</span><span>L</span></div>
            <p className="mb-7 text-[10px] uppercase tracking-[0.3em] text-white/35">Navegação</p>
            <nav className="flex flex-col">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between border-b border-white/10 py-5 font-serif text-3xl"
                >
                  <span className="transition-colors group-hover:text-gold">{link.label}</span>
                  <span className="text-[10px] tracking-[0.2em] text-white/30">0{index + 1}</span>
                </Link>
              ))}
            </nav>
            <p className="mt-12 max-w-xs text-sm leading-7 text-white/45">
              Resenhas, ensaios e memória literária desde 2011.
            </p>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
