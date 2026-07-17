import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/88 backdrop-blur-xl">
      <div className="container flex h-[76px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-4">
          <div className="brand-mark"><span>A</span><span>L</span></div>
          <div className="leading-none">
            <span className="block font-serif text-xl font-semibold tracking-tight">Apreciando a Leitura</span>
            <span className="mt-1.5 block text-[9px] uppercase tracking-[0.34em] text-muted-foreground">por Elaise G. Lima</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => {
            const active = location === link.href || (link.href !== "/" && location.startsWith(link.href));
            return <Link key={link.href} href={link.href} className={`nav-link ${active ? "nav-link-active" : ""}`}>{link.label}</Link>;
          })}
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden"><MenuIcon className="h-5 w-5" /><span className="sr-only">Abrir menu</span></Button></SheetTrigger>
          <SheetContent side="right" className="w-[88vw] max-w-[380px] bg-background p-8">
            <div className="brand-mark mb-12"><span>A</span><span>L</span></div>
            <nav className="flex flex-col">
              {navLinks.map((link, index) => <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="flex items-center justify-between border-b border-border py-5 font-serif text-2xl"><span>{link.label}</span><span className="text-xs text-muted-foreground">0{index + 1}</span></Link>)}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
