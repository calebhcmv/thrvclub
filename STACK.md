# STACK.md — THRVCLUB

## 1. Decisão de Stack Final

Este documento é a fonte única de verdade da stack técnica do THRVCLUB.

O THRVCLUB é uma área de membros pessoal para centralizar cursos, organizar conteúdo por módulos e aulas, acompanhar progresso e assistir vídeos incorporados de plataformas externas. O MVP deve ser simples, rápido, seguro e hospedado na Vercel.

---

## 2. Stack Oficial

### Framework
- Next.js 14+ ou superior
- App Router
- React Server Components por padrão
- Server Actions para mutações internas

### Linguagem
- TypeScript em modo strict

### UI
- Tailwind CSS
- shadcn/ui
- lucide-react

### Banco de Dados
- Neon PostgreSQL

### ORM
- Drizzle ORM

### Autenticação
- Neon Auth (powered by Better Auth)
- Pacote: `@neondatabase/auth`
- Import server-side: `@neondatabase/auth/next/server`

### Deploy
- Vercel

### Conteúdo Externo
- YouTube via embed
- VK Video via embed
- Outras plataformas via link externo

---

## 3. Decisões Técnicas Fechadas

### Neon Auth é obrigatório

O projeto usa Neon Auth como solução oficial de autenticação.

Motivos:
- Usuários, sessões e configuração de auth ficam no próprio Neon.
- A autenticação acompanha branches do banco.
- Reduz a separação entre auth e banco.
- Combina bem com preview environments.

> ⚠️ Neon Auth está em Beta. Para MVP pessoal/interno, isso é aceitável. Evitar customizações avançadas de auth por ora.

### Não usar Auth.js neste projeto

Auth.js/NextAuth não deve ser usado. A decisão oficial é centralizar autenticação com Neon Auth.

### Drizzle em vez de Prisma

Drizzle ORM é leve, type-safe e adequado para serverless com Neon.

### Server Actions em vez de API Routes

Usar Server Actions para CRUD interno. API Routes só existem quando exigidas pelo Neon Auth.

---

## 4. Arquitetura Geral

```
Usuário
  ↓
Next.js App Router na Vercel
  ↓
Neon Auth SDK
  ↓
Sessão validada no servidor
  ↓
Server Components / Server Actions
  ↓
Drizzle ORM
  ↓
Neon PostgreSQL
```

---

## 5. Auth Architecture

### Arquivo de instância server-side

```
lib/auth/server.ts
```

```ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  authUrl: process.env.NEON_AUTH_URL,
  jwksUrl: process.env.NEON_AUTH_JWKS_URL,
});
```

### Rota de Auth

```
app/api/auth/[...path]/route.ts
```

Essa rota é permitida porque faz parte da integração do Neon Auth. Não criar outras API Routes para CRUD.

---

## 6. Modelo de Dados do MVP

### Schema: neon_auth

Gerenciado automaticamente pelo Neon Auth. Não editar manualmente.

### Schema: public (produto)

#### courses
Tabela principal. Agrupa módulos.

```
id            uuid, pk
user_id       text, not null (referência ao neon_auth)
title         text, not null
description   text
thumbnail_url text
status        enum: draft | published | archived
created_at    timestamp
updated_at    timestamp
```

#### modules
Grupos de aulas dentro de um curso.

```
id          uuid, pk
course_id   uuid, fk → courses.id
title       text, not null
position    integer
created_at  timestamp
updated_at  timestamp
```

#### lessons
Aulas individuais com vídeo incorporado.

```
id             uuid, pk
module_id      uuid, fk → modules.id
title          text, not null
description    text
video_provider enum: youtube | vk | none
embed_url      text
duration_sec   integer
position       integer
created_at     timestamp
updated_at     timestamp
```

#### enrollments
Matrícula de um usuário em um curso.

```
id           uuid, pk
user_id      text, not null
course_id    uuid, fk → courses.id
enrolled_at  timestamp
```

#### user_progress
Progresso do usuário por aula.

```
id           uuid, pk
user_id      text, not null
lesson_id    uuid, fk → lessons.id
completed    boolean, default false
completed_at timestamp
```

---

## 7. Enumerações

### status (course)
```
draft | published | archived
```

### video_provider
```
youtube | vk | none
```

---

## 8. Embed de Vídeo

### YouTube — parâmetros obrigatórios

```
https://www.youtube.com/embed/{VIDEO_ID}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1
```

| Parâmetro | Efeito |
|---|---|
| `rel=0` | Remove vídeos relacionados |
| `modestbranding=1` | Remove logo do YouTube |
| `showinfo=0` | Remove título e canal |
| `iv_load_policy=3` | Remove anotações/cards |
| `controls=1` | Mantém controles do player |

### VK Video — parâmetros obrigatórios

```
https://vk.com/video_ext.php?oid={OID}&id={ID}&hd=2&js_api=1&no_share=1&__ref=no_ref
```

| Parâmetro | Efeito |
|---|---|
| `hd=2` | Força qualidade alta |
| `js_api=1` | Ativa controle via JS |
| `no_share=1` | Remove botão de compartilhar |
| `__ref=no_ref` | Remove referência externa |

### Estrutura HTML do player

```html
<div class="video-wrapper" style="position: relative;">
  <iframe src="..." allowfullscreen />
  <!-- Overlay cobre logos de plataforma sem bloquear os controles -->
  <div class="video-overlay" style="
    position: absolute;
    top: 0; right: 0;
    width: 80px; height: 40px;
    background: black;
    z-index: 10;
    pointer-events: none;
  " />
</div>
```

> ⚠️ `pointer-events: none` é obrigatório no overlay. Sem ele, os controles do player ficam bloqueados.

---

## 9. Variáveis de Ambiente

```env
# Banco de dados — NUNCA expor ao client
DATABASE_URL=postgresql://...

# Neon Auth — configuração server-side
NEON_AUTH_URL=https://...neonauth...
NEON_AUTH_JWKS_URL=https://...neonauth.../jwks.json
NEON_AUTH_COOKIE_SECRET=<string hexadecimal, mínimo 32 chars>

# Neon Auth — exposta ao client (prefixo NEXT_PUBLIC_)
NEXT_PUBLIC_NEON_AUTH_URL=<mesmo valor de NEON_AUTH_URL>

# App
NEXT_PUBLIC_APP_URL=https://seudominio.vercel.app
```

> Como gerar o COOKIE_SECRET:
> ```bash
> openssl rand -hex 32
> ```
> Ou use uma string hexadecimal aleatória de 64 caracteres.

---

## 10. Dependências Principais

```bash
# Auth
npm install @neondatabase/auth@latest

# Banco
npm install drizzle-orm @neondatabase/serverless

# Validação
npm install zod

# UI
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge

# Dev
npm install -D drizzle-kit
```

Para shadcn/ui:

```bash
npx shadcn@latest init
```

---

## 11. Estrutura de Diretórios

```
app/
  (auth)/
    login/
      page.tsx
    signup/
      page.tsx
  (members)/
    members/
      page.tsx          ← dashboard do membro
      library/
        page.tsx
      search/
        page.tsx
      courses/
        [courseId]/
          page.tsx
          [lessonId]/
            page.tsx
  (admin)/
    admin/
      page.tsx          ← dashboard admin
      courses/
        page.tsx
        new/
          page.tsx
        [courseId]/
          edit/
            page.tsx
      users/
        page.tsx
  api/
    auth/
      [...path]/
        route.ts        ← integração Neon Auth (única API Route permitida)
  layout.tsx
  page.tsx              ← redireciona para /members

actions/
  courses.ts
  lessons.ts
  progress.ts

components/
  ui/                   ← shadcn/ui
  shared/
  courses/
  members/
  admin/

lib/
  auth/
    server.ts
  db/
    index.ts
    schema.ts
  validations/
    course.ts
    lesson.ts

middleware.ts
drizzle.config.ts
```

---

## 12. Deploy — Checklist

- [ ] Neon Auth habilitado no projeto Neon
- [ ] Todas as 5 variáveis de ambiente configuradas na Vercel (Production)
- [ ] Migrações aplicadas (`npm run db:push`)
- [ ] Dados iniciais inseridos (`npm run db:seed`)
- [ ] Build local passou (`npm run build`)
- [ ] Lint passou (`npm run lint`)
- [ ] TypeScript sem erros (`npx tsc --noEmit`)

---

## 13. Fora do Escopo do MVP

Não implementar:
- Upload de vídeos
- Hospedagem própria de mídia
- Sistema de pagamentos
- Comentários
- Certificados
- Marketplace
- Multi-tenant complexo
- Integrações automáticas com Udemy/Coursera
