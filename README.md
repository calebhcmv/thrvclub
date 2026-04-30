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

## Vercel (produção)

Você não precisa rodar `npm` manualmente na Vercel. A plataforma instala dependências e builda automaticamente via lockfile.

### Variáveis obrigatórias

- `NEON_AUTH_URL`
- `NEON_AUTH_JWKS_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEXT_PUBLIC_NEON_AUTH_URL`
- `DATABASE_URL`

## Status do roadmap

- ✅ Fase 1: base da stack e limpeza do legado
- ✅ Fase 2: auth, proteção de rotas, CRUD admin de cursos/módulos/aulas e fluxo members inicial
- ✅ Fase 3: consolidação de UX base (layouts dedicados, empty state, not-found)
- ✅ Fase 4: hardening final (validação central de env, login/logout Neon Auth explícito e revisão final de estrutura)
