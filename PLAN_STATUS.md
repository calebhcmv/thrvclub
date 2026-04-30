# PLAN_STATUS.md — THRVCLUB

Status auditado linha por linha do novo PLAN.

## Fase 1 — Foundation
- [x] Next.js App Router + TypeScript strict
- [x] Tailwind CSS
- [ ] shadcn/ui configurado (não há evidência de setup oficial completo)
- [x] lucide-react instalado
- [ ] Estrutura de pastas exatamente igual ao PLAN (há variações)
- [ ] Setup Neon/Vercel confirmado (depende de console externo)
- [ ] Variáveis em Vercel Production confirmadas (externo)
- [ ] `.env.local` confirmado (arquivo local não versionado)
- [ ] `npm run lint` passa (não validado neste ambiente)
- [ ] `npx tsc --noEmit` passa (não validado neste ambiente)
- [ ] `npm run build` passa (não validado neste ambiente)

## Fase 2 — Autenticação
- [x] Dependências de auth/db/zod/drizzle presentes
- [x] `lib/auth/server.ts` implementado
- [x] `app/api/auth/[...path]/route.ts` implementado
- [x] Página `login`
- [ ] Página `signup` (faltando)
- [x] Fluxo de logout (link para sign-out)
- [x] `middleware.ts` protegendo `/members/*` e `/admin/*`

## Fase 3 — Banco de Dados
- [x] `lib/db/index.ts` com Neon + Drizzle
- [ ] `user_profiles` conforme PLAN (atualmente tabela `users` com campos extras)
- [x] Tabelas `courses`, `modules`, `lessons`, `enrollments`, `user_progress`
- [x] Índices principais criados
- [x] `drizzle.config.ts` aponta para schema e DATABASE_URL
- [ ] `db:push` executado e validado (depende de ambiente Neon)
- [ ] `scripts/seed-admin.ts` com `user_id` explícito (hoje existe `db/seed.ts` diferente)

## Fase 4 — Controle de Acesso
- [ ] Sincronização automática pós-login para criar role member (não implementado explicitamente)
- [x] `requireSession()`
- [ ] `requireAdmin()` helper dedicado (há `requireAdminRole`, não helper completo único)
- [x] Proteção server-side nas páginas `/members/*`
- [x] Proteção server-side nas páginas `/admin/*`
- [ ] Isolamento por `userId` em 100% das queries sensíveis (parcial)

## Fase 5 — Validação com Zod
- [ ] Em `lib/validations/` (atualmente está em `schemas/`)
- [x] Schemas de course/module/lesson/progress existem
- [x] Regras de title/embedUrl/provider/status/position aplicadas
- [x] Actions passam por validação Zod

## Fase 6 — Queries de Leitura
- [ ] Arquivo único `lib/db/queries.ts` (hoje está distribuído em `lib/*/queries.ts`)
- [x] Queries de leitura existem para cursos/progresso/admin
- [ ] Nenhum Server Component faz query fora deste arquivo único (padrão do PLAN ainda não atendido)

## Fase 7 — Server Actions
- [x] `createCourse`, `updateCourse`
- [ ] `deleteCourse` (faltando)
- [x] `createModule`
- [ ] `updateModule`, `deleteModule` (faltando)
- [x] `createLesson`, `updateLesson`, `deleteLesson`
- [x] `markLessonComplete`, `markLessonIncomplete`
- [x] Fluxo geral com sessão + Zod + autorização + Drizzle + revalidate

## Fase 8 — UI Componentes Base
- [x] `EmptyState`
- [x] `DeleteButton`
- [x] `ProgressBar`
- [x] `MemberHeader`, `CourseCard`, `LessonCard`, `ModuleAccordion`
- [x] `AdminSidebar`, `CourseForm`, `LessonForm`
- [x] `VideoEmbed` com overlay `pointer-events: none`

## Fase 9 — UI Páginas
- [ ] `app/page.tsx` redirecionando dinamicamente por sessão (hoje é página estática)
- [x] `login`
- [ ] `signup` faltando
- [x] Rotas members principais implementadas
- [x] Rotas admin principais implementadas
- [x] Sem mock data

## Fase 10 — QA e Hardening
- [ ] Auditoria formal completa registrada (não existe relatório fechado)
- [x] Security headers adicionados
- [x] Error boundary global
- [ ] Loading states em ações assíncronas (parcial)
- [ ] Feedback de mutação (toast/redirect) completo (parcial)
- [ ] Form errors inline completos (parcial)
- [ ] Checklist técnico executado com evidência no ambiente atual

## Fase 11 — Deploy Final
- [ ] Variáveis em Vercel Production confirmadas
- [ ] `db:push` produção executado
- [ ] Seed admin produção executado
- [ ] Deploy final validado
- [ ] Fluxo E2E produção validado

---

## Resumo
O projeto está **parcialmente aderente** ao novo PLAN. Há base forte implementada, porém ainda restam gaps estruturais para 100% de conformidade.
