# Project TODO: Apreciando a Leitura v2

## Banco de Dados & Backend
- [x] Atualizar schema.ts com tabelas reviews e books
- [x] Gerar migração e aplicar SQL no banco
- [x] Criar seed com 7+ resenhas reais do blog (textos completos)
- [x] Criar seed com 4 livros autorais da Elaise G. Lima
- [x] Implementar queries em db.ts (reviews, books, search, archive)
- [x] Implementar routers tRPC (reviews, books, contact, quote)
- [x] Integrar notificação por e-mail nos formulários (elaiselima@gmail.com)

## Design System
- [x] Configurar paleta roxo profundo + dourado no index.css
- [x] Adicionar fontes elegantes (Cormorant Garamond + Inter) no index.html
- [x] Implementar Header sticky com logo tipográfico e menu responsivo
- [x] Implementar Footer com links internos e e-mail de contato

## Páginas Frontend
- [x] Home: hero assimétrico premium + resenhas recentes visíveis + seção sobre autora + CTA serviços
- [x] Resenhas: grid visual de cards com capas, filtros por gênero, busca combinada, estados vazios
- [x] Detalhe da Resenha: layout editorial com capa, texto integral, link Amazon
- [x] Sobre: biografia completa de Elaise G. Lima + e-mail de contato
- [x] Meus Livros: 4 livros reais com capa, sinopse e link Amazon
- [x] Serviços: descrição profissional, metodologia em etapas, formulário de orçamento via tRPC
- [x] Acervo Histórico: navegação por ano/mês (2011-2026), exibição de resenhas
- [x] Contato: formulário integrado via tRPC com notificação por e-mail

## Rotas & Configuração
- [x] Configurar todas as rotas no App.tsx
- [x] Garantir responsividade em todas as páginas
- [x] Testes vitest para routers (10 testes passando)

## Restrições
- [x] E-mail de contato: elaiselima@gmail.com em todos os formulários
- [x] Títulos dos livros e resenhas exatos conforme blog original
- [x] Textos completos das resenhas no seed (não resumos)
- [x] Acervo cobrindo 2011 a 2026
