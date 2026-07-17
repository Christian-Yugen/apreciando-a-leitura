import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, Send, MessageCircle, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Mensagem enviada com sucesso! Elaise responderá em breve.");
        setName(""); setEmail(""); setSubject(""); setMessage("");
      } else {
        toast.error(data.error || "Erro ao enviar mensagem.");
      }
    },
    onError: () => {
      toast.error("Erro ao enviar mensagem. Tente novamente ou envie um e-mail direto para elaiselima@gmail.com");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error("Preencha todos os campos.");
      return;
    }
    contactMutation.mutate({ name, email, subject, message });
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
            <span className="text-xs font-medium tracking-widest uppercase text-accent">Fale Conosco</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold">Contato</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Tem alguma dúvida, sugestão ou quer conversar sobre livros? Envie uma mensagem.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Info */}
            <div className="md:col-span-5 space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Vamos Conversar</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Seja para tirar dúvidas sobre resenhas, falar sobre serviços de revisão, sugerir livros para leitura ou simplesmente compartilhar sua paixão pela literatura — sua mensagem é sempre bem-vinda.
                </p>
              </div>
              <Card className="border-border/50 bg-accent/5">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">E-mail direto</p>
                      <a href="mailto:elaiselima@gmail.com" className="text-foreground font-medium hover:text-primary transition-colors">elaiselima@gmail.com</a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Resposta</p>
                      <p className="text-foreground font-medium">Em até 48 horas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <div className="md:col-span-7">
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
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto *</Label>
                      <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Sobre o que deseja falar?" className="rounded-lg" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Escreva sua mensagem aqui..." className="rounded-lg min-h-[160px]" required />
                    </div>
                    <Button type="submit" size="lg" className="w-full rounded-lg" disabled={contactMutation.isPending}>
                      {contactMutation.isPending ? (
                        <><Loader2 className="mr-2 w-4 h-4 animate-spin" /> Enviando...</>
                      ) : (
                        <>Enviar Mensagem <Send className="ml-2 w-4 h-4" /></>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
