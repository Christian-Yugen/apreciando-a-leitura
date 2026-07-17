import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Pen, Award, Mail, Sparkles, Heart, BookMarked } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.10_285)] text-primary-foreground py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium tracking-widest uppercase text-accent">Sobre a Autora</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold">Elaise G. Lima</h1>
          <p className="text-xl text-accent italic">Escritora de fantasia e ficção cristã, blogueira literária e revisora</p>
        </div>
      </section>

      {/* Biography */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold text-foreground">A Jornada Literária</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Elaise G. Lima é uma apaixonada por literatura desde a infância. Sua jornada no mundo dos livros começou como leitora ávida, devorando histórias de fantasia, romance e ficção que a transportavam para mundos distantes e possibilidades infinitas. Com o tempo, a paixão por ler transformou-se em vocação: ela passou a escrever suas próprias histórias, criando universos onde anjos, vampiros e o poder do amor se entrelaçam.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Como <strong className="text-foreground">escritora de fantasia e ficção cristã</strong>, Elaise construiu um universo literário rico e envolvente. Sua série <em className="text-foreground">Cidade dos Vampiros</em> e o spin-off <em className="text-foreground">Os Renascidos</em> conquistaram leitores com narrativas que combinam sobrenatural, romance e espiritualidade. Em suas obras de ficção cristã, como <em className="text-foreground">A luz que é você</em> e <em className="text-foreground">A luz que me salva</em>, ela explora temas de superação, fé e o poder transformador do amor.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Como <strong className="text-foreground">blogueira literária</strong>, mantém o blog <em className="text-foreground">Apreciando a Leitura</em> desde 2011, onde compartilha resenhas detalhadas e análises aprofundadas de livros dos mais variados gêneros. Suas resenhas são conhecidas pela sinceridade, profundidade e pela capacidade de capturar a essência das obras sem revelar spoilers importantes.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Como <strong className="text-foreground">revisora profissional</strong>, oferece serviços de revisão de textos com atenção aos detalhes, domínio da língua portuguesa e sensibilidade literária. Seu trabalho ajuda autores a polir suas obras antes da publicação, garantindo qualidade e profissionalismo.
            </p>
          </div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-4 pt-4">
            {[
              { icon: BookOpen, title: "Leitora Ávida", desc: "15+ anos analisando literatura" },
              { icon: Pen, title: "Escritora", desc: "Autora de fantasia e ficção cristã" },
              { icon: Award, title: "Revisora", desc: "Revisão profissional de textos" },
            ].map((item) => (
              <Card key={item.title} className="text-center border-border/50 card-hover">
                <CardContent className="pt-6 pb-6">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Works Summary */}
          <div className="pt-4 space-y-4">
            <h2 className="font-serif text-3xl font-bold text-foreground">Obras Publicadas</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Elaise é autora de múltiplas obras, incluindo a trilogia <em className="text-foreground">Quando as Luzes se Apagam</em>, o livro <em className="text-foreground">Társis</em> (série Os Renascidos), e os romances <em className="text-foreground">A luz que é você</em> e <em className="text-foreground">A luz que me salva</em>. Todos disponíveis na Amazon.
            </p>
          </div>

          {/* Contact CTA */}
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-border/50 mt-8">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Mail className="w-7 h-7 text-accent" />
                </div>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">Entre em Contato</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Para serviços de revisão, parcerias literárias ou simplesmente trocar ideias sobre livros.
              </p>
              <a href="mailto:elaiselima@gmail.com">
                <Button size="lg" className="rounded-lg">
                  <Mail className="mr-2 w-4 h-4" /> elaiselima@gmail.com
                </Button>
              </a>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href="/meus-livros" className="inline-block"><Button variant="outline" className="rounded-lg"><BookMarked className="mr-2 w-4 h-4" /> Ver Meus Livros</Button></Link>
                <Link href="/servicos" className="inline-block"><Button variant="outline" className="rounded-lg"><Heart className="mr-2 w-4 h-4" /> Serviços de Revisão</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
