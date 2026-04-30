# THRVCLUB

Projeto alinhado ao plano oficial (`STACK.md`, `INITIAL.md`, `RULES.md`, `PLAN.md`).

## Stack
- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Neon Auth
- Neon PostgreSQL
- Drizzle ORM
- Zod

## Variáveis obrigatórias
- `DATABASE_URL`
- `NEON_AUTH_URL`
- `NEON_AUTH_JWKS_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEXT_PUBLIC_NEON_AUTH_URL`

## Scripts principais
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run db:generate`
- `npm run db:push`
- `npm run seed:admin`
