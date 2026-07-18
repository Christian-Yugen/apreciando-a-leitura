# APRECIANDO A LEITURA
# Product Design System
Versão 2.0 — Fundação Cinematográfica

---

## 1. Direção visual

O produto adota uma linguagem editorial cinematográfica escura.

A experiência deve transmitir:

- profundidade;
- memória;
- sofisticação;
- silêncio visual;
- conforto prolongado de leitura.

O sistema não imita interfaces de streaming. A referência cinematográfica está na luz, no contraste, na composição e no ritmo.

---

## 2. Paleta oficial

### Fundos

- Cinema Black: `#080A0B`
- Panel: `#0E1112`
- Raised Panel: `#121617`

### Texto

- Ivory: `#F3EEE5`
- Reading Text: `#D7D0C6`
- Muted: `#99958E`

### Destaque

- Gold: `#D6A44B`
- Soft Gold: `#B7863C`
- Pale Gold: `#E5C17B`

### Linhas

- Cinema Line: `rgba(238, 222, 194, 0.12)`

O branco puro deve ser evitado em grandes áreas para reduzir brilho e fadiga.

---

## 3. Uso psicológico das cores

O preto cria foco e reduz ruído periférico.

O marfim mantém legibilidade sem o impacto agressivo do branco puro.

O dourado orienta a atenção. Deve aparecer apenas em:

- item ativo;
- chamada principal;
- foco de teclado;
- pequenos ícones;
- linhas editoriais;
- estados de interação.

O dourado nunca deve ocupar grandes superfícies.

---

## 4. Tipografia

### Editorial

Cormorant Garamond.

Uso:

- títulos;
- citações;
- nomes de livros;
- destaques narrativos.

### Interface

Inter.

Uso:

- navegação;
- filtros;
- metadados;
- formulários;
- textos auxiliares.

### Leitura longa

Georgia ou serif equivalente.

Largura recomendada: 62 a 74 caracteres por linha.

---

## 5. Hierarquia

Toda página deve apresentar:

1. contexto;
2. título dominante;
3. descrição curta;
4. conteúdo principal;
5. continuação ou próximo passo.

A hierarquia deve ser percebida antes da leitura detalhada.

---

## 6. Superfícies

Cards convencionais devem ser evitados.

Preferir:

- painéis editoriais;
- linhas finas;
- blocos integrados ao fundo;
- imagens como fonte de luz e profundidade;
- bordas discretas.

Sombras devem ampliar a profundidade, nunca simular objetos flutuantes de SaaS.

---

## 7. Espaçamento

O sistema utiliza espaço para criar ritmo, não vazio excessivo.

- entre título e descrição: curto;
- entre blocos editoriais: médio;
- entre grandes capítulos da página: amplo;
- dentro de painéis: compacto e respirável.

Evitar múltiplos espaços verticais grandes em sequência.

---

## 8. Imagens

Imagens devem possuir função narrativa.

Aplicar quando necessário:

- vinheta;
- degradê para leitura do texto;
- recorte cinematográfico;
- sombra profunda;
- iluminação quente discreta.

Nunca reduzir contraste a ponto de prejudicar a capa ou a fotografia.

---

## 9. Estados interativos

Hover:

- pequena elevação;
- aumento discreto de contraste;
- borda dourada suave.

Ativo:

- texto marfim;
- linha dourada;
- indicação persistente.

Foco:

- contorno dourado de 2 px;
- afastamento de 4 px.

---

## 10. Acessibilidade

- contraste mínimo WCAG AA;
- navegação completa por teclado;
- foco sempre visível;
- nenhuma informação transmitida apenas por cor;
- respeito a `prefers-reduced-motion`;
- tamanho mínimo confortável para controles.

---

## 11. Componentes globais

### Header

Escuro, translúcido e integrado à página.

### Footer

Escuro, contínuo e sem ruptura visual.

### Botões

Dourado para ação primária. Contorno escuro para ação secundária.

### Formulários

Campos grafite, texto marfim, borda discreta e foco dourado.

---

## 12. Regra de consistência

Nenhuma página deve introduzir novos tons de preto, dourado ou marfim sem atualização deste documento.

A fundação global deve ser reutilizada antes da criação de estilos locais.
