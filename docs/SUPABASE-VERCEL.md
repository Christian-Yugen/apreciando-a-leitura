# Implantação: Supabase + Vercel

## 1. Criar e preparar o Supabase

1. Crie um projeto em https://supabase.com.
2. Abra **SQL Editor** e execute `supabase/migrations/202608110001_initial_schema.sql`.
3. Em **Project Settings > API**, copie a Project URL e a chave pública `anon`/`publishable`.

## 2. Importar o acervo

Crie `.env` local a partir de `.env.example`. A `SUPABASE_SERVICE_ROLE_KEY` é usada somente pelo script local e nunca deve ser enviada ao Git ou à Vercel.

```bash
pnpm migrate:supabase
```

O script faz `upsert` pelo `legacyId`, portanto pode ser executado novamente sem duplicar resenhas.

## 3. Configurar a Vercel

Em **Settings > Environment Variables**, adicione para Production, Preview e Development:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Não adicione `SUPABASE_SERVICE_ROLE_KEY` ao frontend.

Depois, acione um novo deploy. O build permanece `pnpm exec vite build` e a saída é `dist/public`.

## 4. Segurança e operação

- Livros e resenhas têm leitura pública via RLS.
- Formulários permitem somente inserção anônima; visitantes não conseguem listar as mensagens.
- Ative CAPTCHA/Turnstile antes de divulgar amplamente os formulários para reduzir spam.
- As imagens externas do Blogger continuam referenciadas pelas URLs originais. Elas podem ser copiadas para o Supabase Storage em uma etapa posterior.
