# Apreciando a Leitura — Plano de migração e evolução

## Diagnóstico do blog atual

O site atual é um arquivo editorial valioso, ativo desde maio de 2011. O conteúdo está organizado cronologicamente no Blogger e reúne resenhas, primeiras impressões, textos autorais, divulgação de livros e registros da trajetória da autora. A força está no acervo e na voz pessoal; as limitações estão na navegação, descoberta do conteúdo, hierarquia visual, pesquisa, SEO técnico e apresentação profissional dos serviços e livros.

## Posicionamento do novo site

O novo Apreciando a Leitura será um **portal literário autoral**, e não uma simples reprodução de blog. A experiência deve combinar revista cultural, biblioteca digital e portfólio profissional.

### Pilares
1. **Acervo vivo:** todo conteúdo desde 2011 pesquisável por título, palavra, ano, marcador e tipo.
2. **Autoridade:** páginas claras para autora, livros publicados, serviços editoriais e contato.
3. **Experiência editorial premium:** grandes imagens, tipografia elegante, ritmo cinematográfico e leitura confortável.
4. **Preservação:** data, conteúdo, imagens, categorias e URL original mantidos durante a migração.
5. **Descoberta:** relacionados, mais lidos, coleções temáticas, linha do tempo e busca instantânea.

## Arquitetura de informação

- Início
- Resenhas
- Acervo 2011–2026
- Coleções e temas
- Livros de Elaise G. Lima
- Sobre a autora
- Serviços de revisão
- Contato

Cada publicação terá título, data original, autoria, marcadores, imagem de destaque, texto integral, link canônico e referência da publicação original.

## Direção visual

- Visual editorial cinematográfico, com predominância de preto quente, marfim, vinho e dourado suave.
- Serifas expressivas nos títulos e sans-serif limpa na interface.
- Home em capítulos: destaque editorial, últimas leituras, acervo em números, livros da autora, manifesto e serviços.
- Microinterações discretas; nenhuma animação deve prejudicar leitura ou desempenho.
- Imagens responsivas, carregamento progressivo e excelente experiência móvel.

## Migração técnica

O script `scripts/import-blogger.mjs` usa o feed oficial do Blogger e pagina automaticamente até importar todas as postagens existentes. Ele não depende de gerar manualmente URLs mensais.

Campos preservados:
- identificador legado;
- título;
- data original;
- conteúdo integral convertido para Markdown;
- primeira imagem e imagens internas;
- marcadores do Blogger;
- URL original;
- slug estável.

### Execução

```bash
pnpm install
pnpm db:push
pnpm migrate:blogger
pnpm migrate:blogger -- --write-db
pnpm dev
```

## Critérios de aceite antes da publicação

- Quantidade do feed igual à quantidade importada.
- Primeiro e último posts conferidos manualmente.
- Amostra de pelo menos 3 posts por ano comparada com o Blogger.
- Nenhum registro fictício do antigo `archive_reviews.json` inserido.
- Redirecionamentos 301 das URLs antigas para as novas.
- Sitemap, canonical, Open Graph, Schema.org e Search Console configurados.
- Backup do Blogger e do banco realizado antes da troca de domínio.
