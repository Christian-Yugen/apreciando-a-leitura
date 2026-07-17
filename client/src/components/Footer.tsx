import { Link } from "wouter";
import { BookOpen, Mail, Pen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span className="font-serif text-base font-bold text-foreground">Apreciando a Leitura</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Resenhas literárias, análises e serviços de revisão por Elaise G. Lima — escritora de fantasia e ficção cristã.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Navegação</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <Link href="/resenhas" className="text-sm text-muted-foreground hover:text-primary transition-colors">Resenhas</Link>
              <Link href="/acervo-historico" className="text-sm text-muted-foreground hover:text-primary transition-colors">Acervo Histórico</Link>
              <Link href="/sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre a Autora</Link>
              <Link href="/meus-livros" className="text-sm text-muted-foreground hover:text-primary transition-colors">Meus Livros</Link>
              <Link href="/servicos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Serviços</Link>
              <Link href="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contato</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contato</h3>
            <a
              href="mailto:elaiselima@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              elaiselima@gmail.com
            </a>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Pen className="w-4 h-4" />
              Serviços de revisão disponíveis
            </div>
          </div>
        </div>

        <div className="gold-divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Apreciando a Leitura. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Elaise G. Lima — Escritora &amp; Revisora
          </p>
        </div>
      </div>
    </footer>
  );
}
