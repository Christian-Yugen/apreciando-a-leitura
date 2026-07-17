# APRECIANDO A LEITURA
# Component Library
Versão 1.0

---

# 1. Objetivo

Este documento descreve todos os componentes reutilizáveis da interface do
Apreciando a Leitura.

Cada componente possui uma única responsabilidade.

Novos componentes somente devem ser criados quando não for possível reutilizar
um componente existente.

---

# 2. Estrutura de Documentação

Todo componente deve possuir.

- Objetivo
- Localização
- Props
- Estados
- Responsividade
- Acessibilidade
- Exemplo de utilização

---

# 3. Organização

Os componentes serão organizados em cinco grupos.

## Layout

- Header
- Footer
- Container
- Section
- Sidebar
- Hero

---

## Navegação

- Navbar
- Breadcrumb
- Pagination
- Search
- Menu
- Tabs

---

## Conteúdo

- Book Card
- Review Card
- Author Card
- Collection Card
- Timeline Card
- Quote
- Badge

---

## Formulários

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch

---

## Feedback

- Alert
- Toast
- Skeleton
- Loading
- Empty State
- Modal

---

# 4. Hero

## Objetivo

Apresentar o contexto principal da página.

## Localização

components/layout/Hero

## Props

title

subtitle

image

overlay

actions

## Estados

Default

Loading

## Responsividade

Desktop

Tablet

Mobile

---

# 5. Header

## Objetivo

Exibir navegação principal.

## Localização

components/layout/Header

## Props

transparent

sticky

search

## Estados

Default

Scrolled

Mobile

---

# 6. Footer

## Objetivo

Encerrar a navegação.

## Conteúdo

Links

Copyright

Newsletter

Redes sociais

---

# 7. Book Card

## Objetivo

Representar um livro.

## Conteúdo

Capa

Título

Autor

Ano

Coleção

## Estados

Default

Hover

Loading

---

# 8. Review Card

## Objetivo

Representar uma resenha.

## Conteúdo

Imagem

Título

Resumo

Tempo de leitura

---

# 9. Author Card

## Objetivo

Representar um autor.

---

# 10. Collection Card

## Objetivo

Representar uma coleção editorial.

---

# 11. Timeline Card

## Objetivo

Representar um período da biblioteca.

---

# 12. Button

## Variantes

Primary

Secondary

Ghost

Text

## Estados

Default

Hover

Disabled

Loading

---

# 13. Input

Tipos.

Text

Search

Email

Password

Number

---

# 14. Search

Funcionalidades.

Busca instantânea

Sugestões

Agrupamento de resultados

---

# 15. Modal

Utilização.

Apenas quando necessário.

---

# 16. Skeleton

Utilizar em carregamentos superiores a 300ms.

---

# 17. Empty State

Todo estado vazio deve apresentar.

Mensagem

Ação

Sugestão

---

# 18. Convenções

Todos os componentes devem.

- utilizar TypeScript
- possuir tipagem
- possuir documentação
- ser reutilizáveis
- seguir o Product Design System

---

# 19. Estrutura de Pastas

components/

layout/

navigation/

cards/

forms/

feedback/

shared/

---

# 20. Checklist

Antes de criar um componente verificar.

✓ Já existe?

✓ Pode ser reutilizado?

✓ Está documentado?

✓ Possui tipagem?

✓ Possui estados?

✓ É acessível?

✓ É responsivo?

---

Versão 1.0

Status: Aprovado
