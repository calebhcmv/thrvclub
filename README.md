# THRVCLUB

Estrutura reescrita com stack oficial (`STACK.md` + `RULES.md` + `INITIAL.md`).

## Stack
- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Neon Auth
- Neon PostgreSQL
- Drizzle ORM
- Zod

## Variáveis obrigatórias
- `NEON_AUTH_URL`
- `NEON_AUTH_JWKS_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEXT_PUBLIC_NEON_AUTH_URL`
- `DATABASE_URL`

## Scripts
- `npm run dev`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run check`
- `npm run db:generate`
- `npm run db:push`

## CI/CD
Pipeline configurada em `.github/workflows/ci.yml` para:
1. instalar dependências
2. rodar typecheck
3. rodar lint
4. validar build

## Status do roadmap
- ✅ Fase 1
- ✅ Fase 2
- ✅ Fase 3
- ✅ Fase 4
- ✅ Fase 5 (go-live readiness: CI + scripts de validação + configuração Drizzle)

- ✅ Fase 6 (produção/observabilidade base: healthcheck, boundary global de erro e security headers)

## Operação
- Healthcheck: `GET /api/health`
- Erros globais: `app/error.tsx`
- Security headers: `next.config.ts`
- ✅ Fase 7 (governança e rastreabilidade: trilha de auditoria das ações críticas)
- ✅ Fase 8 (release readiness: seed inicial, smoke check e runbook de release)
