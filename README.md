# THRVCLUB

Estrutura base da reescrita com stack oficial definida em `STACK.md` e regras de `RULES.md`.

## Stack aplicada

- Next.js (App Router)
- TypeScript strict
- Tailwind CSS
- Neon Auth (`@neondatabase/auth`)
- Neon PostgreSQL
- Drizzle ORM
- Zod

## Status atual (pré-passo 2)

- Código legado da versão mock de members removido.
- Camadas de autenticação e banco inicializadas:
  - `lib/auth/server.ts`
  - `app/api/auth/[...path]/route.ts`
  - `lib/db/index.ts`
  - `lib/db/schema.ts`
- Rotas placeholders criadas para avanço da fase 2:
  - `/login`
  - `/members`
  - `/admin`

## Vercel (produção)

Você **não precisa rodar `npm` na Vercel manualmente**.

A Vercel instala dependências e executa build automaticamente com base no lockfile detectado (`package-lock.json`, `pnpm-lock.yaml` ou `yarn.lock`).

### Checklist para deploy

1. Conectar repositório na Vercel.
2. Definir variáveis de ambiente:
   - `NEON_AUTH_URL`
   - `NEON_AUTH_JWKS_URL`
   - `NEON_AUTH_COOKIE_SECRET`
   - `NEXT_PUBLIC_NEON_AUTH_URL`
   - `DATABASE_URL`
3. Garantir migrações aplicadas no Neon.
4. Deploy.

## Execução local (opcional)

Uso local é apenas para desenvolvimento.

1. Instale dependências (com seu gerenciador):
   - `pnpm install` **ou** `npm install` **ou** `yarn install`
2. Copie o ambiente:
   - `cp .env.example .env.local`
3. Preencha variáveis do Neon Auth e Neon DB.
4. Rode localmente:
   - `pnpm dev` **ou** `npm run dev` **ou** `yarn dev`
