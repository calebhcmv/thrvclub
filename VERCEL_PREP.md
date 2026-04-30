# VERCEL_PREP.md — Checklist final antes de conectar a Vercel

## 1) Variáveis obrigatórias (Production)
- `DATABASE_URL`
- `NEON_AUTH_URL`
- `NEON_AUTH_JWKS_URL`
- `NEON_AUTH_COOKIE_SECRET`
- `NEXT_PUBLIC_NEON_AUTH_URL`

## 2) Comandos obrigatórios locais
```bash
npm run predeploy
npm run lint
npm run typecheck
npm run build
```

## 3) Migração e seed
```bash
npm run db:push
SEED_ADMIN_USER_ID=<neon_user_id> npm run seed:admin
```

## 4) Validações funcionais mínimas
1. Login em `/login`
2. Acesso negado para `/members` sem sessão
3. Acesso negado para `/admin` sem role admin
4. Admin cria curso > módulo > aula
5. Membro marca aula como concluída

## 5) Pós-conexão Vercel
- Confirmar build green
- Confirmar `/api/auth/*` respondendo
- Confirmar rotas `(auth)`, `(members)` e `(admin)`
