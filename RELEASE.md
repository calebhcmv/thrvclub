# Release Runbook — THRVCLUB

## Pré-requisitos
- Variáveis obrigatórias configuradas na Vercel
- Migrações aplicadas no Neon
- Build verde no CI

## Passos de release
1. Garantir PR aprovado e branch `main` atualizada.
2. Rodar checks locais (opcional):
   - `npm run check`
3. Aplicar migrações:
   - `npm run db:generate`
   - `npm run db:push`
4. (Opcional) Seed de admin inicial:
   - `SEED_ADMIN_EMAIL=admin@thrvclub.com npm run seed`
5. Validar produção com smoke check:
   - `SMOKE_BASE_URL=https://seu-dominio.com npm run smoke`

## Critérios de aceite de release
- `/api/health` retorna 200
- `/login` acessível
- `/members` e `/admin` protegidas para não autenticados
- Ações de CRUD e progresso sem erro
