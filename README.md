# THRVCLUB

Base inicial da reestruturação do THRVCLUB com stack oficial:

- Next.js App Router
- TypeScript strict
- Neon Auth
- Neon PostgreSQL
- Drizzle ORM
- Tailwind CSS

## Como rodar localmente

1. Instale dependências:
   ```bash
   npm install
   ```
2. Copie o ambiente:
   ```bash
   cp .env.example .env.local
   ```
3. Preencha as variáveis do Neon Auth e Neon DB.
4. Rode o app:
   ```bash
   npm run dev
   ```

## Estrutura base criada

- `lib/auth/server.ts`: instância oficial do Neon Auth server-side
- `app/api/auth/[...path]/route.ts`: handlers de auth
- `lib/db/schema.ts`: schema inicial do MVP em Drizzle
- `lib/db/index.ts`: conexão com banco
