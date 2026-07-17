# APRECIANDO A LEITURA
# UX Architecture
Versão 1.0

> Documento extraído do Design System v1.0.

# 1. Objetivo

Este documento define a arquitetura da experiência do usuário do projeto
Apreciando a Leitura.

Enquanto o Design System responde **como a interface é construída**,
este documento responde **como o usuário percorre o sistema**.

---

# 2. Princípios da Experiência

- O usuário deve descobrir, nunca apenas procurar.
- Toda página conduz naturalmente para outra.
- Não existem becos sem saída.
- O conteúdo é protagonista.
- A navegação deve ser intuitiva, calma e editorial.

---

# 3. Arquitetura da Informação

Entidades principais:

- Home
- Biblioteca
- Livro
- Resenha
- Autor
- Coleção
- Série
- Editora
- Timeline
- Busca
- Newsletter

Fluxo principal:

Home
→ Biblioteca
→ Livro
→ Resenha
→ Autor
→ Coleção
→ Novo Livro

---

# 4. Estrutura Global

Home
├── Biblioteca
├── Coleções
├── Autores
├── Livros
├── Resenhas
├── Timeline
├── Busca
└── Sobre

---

# 5. Jornadas

## Visitante

Home → Explorar → Livro → Resenha → Newsletter

## Leitor recorrente

Busca → Livro → Autor → Coleção → Nova leitura

---

# 6. Arquitetura das páginas

## Home

Objetivo:
Despertar curiosidade.

Blocos:

- Hero
- Coleção em destaque
- Últimas leituras
- Coleções
- Autores
- Timeline
- Newsletter

## Biblioteca

Objetivo:
Organizar memória editorial.

Blocos:

- Hero
- Exploração
- Coleções
- Timeline
- Filtros

## Livro

Objetivo:
Responder "vale a pena conhecer esta obra?"

Fluxo:

Hero
→ Contexto
→ Resenha
→ Informações
→ Livros relacionados

## Resenha

Fluxo:

Hero
→ Resumo
→ Texto
→ Citações
→ Notas
→ Continue explorando

## Autor

Fluxo:

Hero
→ Biografia
→ Livros
→ Resenhas
→ Coleções

## Busca

Resultados agrupados por:

- Livros
- Autores
- Resenhas
- Coleções
- Etiquetas

Nunca apresentar lista única.

---

# 7. Descoberta

Todo conteúdo deve responder:

"O que o leitor provavelmente desejará ler agora?"

Essa resposta gera automaticamente os blocos de continuidade.

---

# 8. Sistema de Continuidade

Toda página termina iniciando outra.

Nunca existe ponto final.

Sempre existe uma nova descoberta.

---

# 9. Navegação Semântica

O mesmo livro pode ser encontrado por:

- Busca
- Autor
- Coleção
- Timeline
- Gênero
- Etiqueta

Todos convergem para o mesmo conteúdo.

---

# 10. Estados da Experiência

- Descoberta
- Exploração
- Leitura
- Continuidade
- Retorno

---

# 11. UX Checklist

Toda página deve responder:

- O usuário sabe onde está?
- Sabe o próximo passo?
- Existe continuidade?
- Há excesso de informação?
- O conteúdo é protagonista?

---

# 12. Conteúdo migrado do Design System

Este documento passa a ser responsável por todo o conteúdo anteriormente
presente no Design System referente a:

- Sistema Editorial de Layouts (Parte IV)
- Fluxo Editorial
- Sistema de Continuidade
- Navegação Semântica
- Jornada de navegação
- Arquitetura das páginas
- Descoberta de conteúdo
- Estrutura da Home
- Biblioteca
- Livro
- Resenha
- Autor
- Busca

Esses tópicos devem ser removidos do Design System para evitar duplicação.

---

Versão: 1.0
Status: Aprovado