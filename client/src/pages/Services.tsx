import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pen, BookOpen, FileCheck, Sparkles, CheckCircle, Loader2, Send } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const services = [
  {
    icon: Pen,
    title: "Revisão de Textos",
    description: "Revisão ortográfica, gramatical e de pontuação, garantindo que seu texto esteja livre de erros e pronto para publicação.",
  },
  {
    icon: BookOpen,
    title: "Revisão Literária",
    description: "Análise aprofundada de enredo, personagens, ritmo e coerência narrativa, com sugestões para aprimorar a qualidade da obra.",
  },
  {
    icon: FileCheck,
    title: "Revisão de Formatação",
    description: "Verificação de formatação, padronização de estilo e preparação do documento para publicação em diferentes plataformas.",
  },
];

const steps = [
  { num: "01", title: "Contato Inicial", desc: "Você envia sua solicitação com informações sobre o projeto: tipo de texto, contagem de palavras e prazo desejado." },
  { num: "02", title: "Análise e Orçamento", desc: "Analiso o material e envio um orçamento detalhado com prazo de entrega e valor dos serviços." },
  { num: "03", title: "Revisão", desc: "Realizo a revisão completa do texto, marcando correções e sugestões de forma clara e organizada." },
  { num: "04", title: "Entrega", desc: "Entrego o texto revisado junto com um relatório das alterações principais e sugestões finais." },
];

export default function Services() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [description, setDescription] = useState("");

  const quoteMutation = trpc.quote.submit.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Solicitação enviada com sucesso! Elaise entrará em contato em breve.");
        setName(""); setEmail(""); setServiceType(""); setWordCount(""); setDescription("");
      } else {
        toast.error(data.error || "Erro ao enviar solicitação.");
      }
    },
    onError: () => {
      toast.error("Erro ao enviar solicitação. Tente novamente ou envie um e-mail direto para elaiselima@gmail.com");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !serviceType || !description) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    quoteMutation.mutate({ name, email, serviceType, wordCount, description });
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary to-[oklch(0.25_0.10_285)] text-primary-foreground py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium tracking-widest uppercase text-accent">Serviços Profissionais</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold">Serviços de Revisão</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Revisão profissional de textos com atenção aos detalhes, domínio da língua portuguesa e sensibilidade literária.
          </p>
        </div>
      </section>

      {/* Services Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">O Que Ofereço</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Serviços especializados para autores, estudantes e profissionais que valorizam a qualidade do texto.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.title} className="border-border/50 card-hover">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="bg-card/40 py-16 px-4 sm:px-6 lg:px-8 border-y border-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Como Trabalho</h2>
            <p className="text-muted-foreground">Um processo estruturado em 4 etapas para garantir a melhor revisão do seu texto.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.num} className="relative space-y-3">
                <div className="font-serif text-4xl font-bold text-accent/40">{step.num}</div>
                <h3 className="font-serif text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Solicite um Orçamento</h2>
            <p className="text-muted-foreground">Preencha o formulário e receba uma proposta personalizada.</p>
          </div>
          <Card className="border-border/50">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" className="rounded-lg" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className="rounded-lg" required />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Tipo de Serviço *</Label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Revisão de Textos">Revisão de Textos</SelectItem>
                        <SelectItem value="Revisão Literária">Revisão Literária</SelectItem>
                        <SelectItem value="Revisão de Formatação">Revisão de Formatação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wordCount">Contagem de Palavras (opcional)</Label>
                    <Input id="wordCount" value={wordCount} onChange={(e) => setWordCount(e.target.value)} placeholder="Ex: 50.000 palavras" className="rounded-lg" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição do Projeto *</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Conte sobre seu projeto: gênero, prazo, objetivos..." className="rounded-lg min-h-[120px]" required />
                </div>
                <Button type="submit" size="lg" className="w-full rounded-lg" disabled={quoteMutation.isPending}>
                  {quoteMutation.isPending ? (
                    <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Enviando...</>
                  ) : (
                    <>Enviar Solicitação <Send className="ml-2 w-4 h-4" /></>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Após enviar, Elaise G. Lima entrará em contato via e-mail com o orçamento.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
