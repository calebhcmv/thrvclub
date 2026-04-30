# RULES.md — THRVCLUB

## 1. Propósito

Este arquivo define as regras obrigatórias de desenvolvimento do THRVCLUB.

Qualquer IA, agente, desenvolvedor ou editor de código deve ler este documento antes de gerar, editar ou refatorar qualquer código.

**Ordem de leitura obrigatória:**
1. `STACK.md`
2. `INITIAL.md`
3. `RULES.md`

---

## 2. Stack Oficial

- Next.js 14+ com App Router
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Neon Auth (`@neondatabase/auth`)
- Neon PostgreSQL
- Drizzle ORM
- Vercel

Não substituir essas escolhas sem autorização explícita.

---

## 3. Proibições Técnicas

Não usar:

- Auth.js / NextAuth
- Prisma
- Supabase
- Firebase
- MongoDB
- `any` em TypeScript
- `// @ts-ignore`
- Banco de dados no client
- Credenciais no client
- Upload de vídeos
- Hospedagem própria de mídia
- Bibliotecas pesadas sem necessidade real
- API Routes para CRUD simples (exceto a rota do Neon Auth)

---

## 4. TypeScript

- Modo strict obrigatório
- Proibido usar `any`
- Proibido `// @ts-ignore`
- Preferir tipos explícitos em funções públicas
- Inferência permitida apenas quando o tipo for óbvio
- Validar dados externos com Zod antes de usar

---

## 5. React e Next.js

### 5.1 Server Components

Usar Server Components por padrão.

Todo componente deve ser server-side, exceto quando precisar de:
- `useState` / `useEffect`
- Eventos de clique complexos
- APIs do browser
- Estado local de formulário
- Interatividade client-side

### 5.2 Client Components

Usar `'use client'` apenas no topo do arquivo específico.

Não transformar páginas inteiras em Client Components sem necessidade.

### 5.3 Server Actions

Usar Server Actions para todas as mutações internas.

Cada Server Action deve:
1. Validar sessão via Neon Auth
2. Obter `user_id` da sessão no servidor
3. Validar input com Zod
4. Verificar autorização (role quando necessário)
5. Executar query com Drizzle
6. Retornar erro seguro (sem stack trace)
7. Revalidar rotas afetadas com `revalidatePath`

---

## 6. Autenticação

Usar `@neondatabase/auth` com import server-side via `@neondatabase/auth/next/server`.

### Configuração em lib/auth/server.ts

```ts
import { createNeonAuth } from '@neondatabase/auth/next/server';

export const auth = createNeonAuth({
  authUrl: process.env.NEON_AUTH_URL,
  jwksUrl: process.env.NEON_AUTH_JWKS_URL,
});
```

### Variáveis de ambiente obrigatórias

| Variável | Descrição |
|---|---|
| `NEON_AUTH_URL` | Auth URL do Neon Console → Auth → Configuration |
| `NEON_AUTH_JWKS_URL` | JWKS URL do Neon Console → Auth → Configuration |
| `NEON_AUTH_COOKIE_SECRET` | String hex aleatória, mínimo 32 chars |
| `NEXT_PUBLIC_NEON_AUTH_URL` | Mesmo valor de `NEON_AUTH_URL` (exposta ao client) |

### Regras de autenticação

- Validar sessão no servidor antes de qualquer ação sensível
- Nunca confiar em dados do client para identificar usuário
- Toda query sensível deve usar o `user.id` obtido da sessão
- Rotas `/members/*` redirecionam não autenticados para `/login`
- Rotas `/admin/*` exigem `role === 'admin'` validado no servidor
- Middleware pode fazer verificação básica, mas a validação final ocorre no servidor

---

## 7. Controle de Acesso por Role

O campo `role` deve estar na tabela de usuários do produto (não no `neon_auth`).

Valores: `admin` | `member`

Regras:
- Role é sincronizado após o login via Neon Auth
- Nunca aceitar `role` vindo do client
- Verificar `role` no servidor antes de qualquer ação administrativa
- Página `/admin/*` deve retornar 404 ou redirecionar para membro sem role admin

---

## 8. Banco de Dados

Usar Neon PostgreSQL com Drizzle ORM.

- Schema em `lib/db/schema.ts`
- Conexão em `lib/db/index.ts`
- Não acessar banco no client
- Não montar SQL inseguro com strings do usuário
- Usar migrations reproduzíveis
- Toda tabela do produto deve ter `created_at` e `updated_at`
- Não editar manualmente o schema `neon_auth`

### Índices recomendados

```
courses.user_id
courses.status
modules.course_id
modules.position
lessons.module_id
lessons.position
user_progress.user_id
user_progress.lesson_id
enrollments.user_id
enrollments.course_id
```

---

## 9. Segurança de Dados

Regra fundamental: **todo dado do produto deve ser isolado por `user_id`**.

Para cursos:
- Listar: filtrar por `user_id`
- Visualizar: filtrar por `id` e `user_id`
- Editar: filtrar por `id` e `user_id`
- Excluir: filtrar por `id` e `user_id`

Nunca executar mutação usando apenas `course_id` sem validar `user_id`.

Nunca aceitar `user_id` vindo do formulário ou do client.

---

## 10. Validação com Zod

Criar schemas de validação para:

- Criar curso (`title`, `description`, `status`, `thumbnail_url`)
- Editar curso
- Criar módulo (`title`, `position`, `course_id`)
- Criar aula (`title`, `embed_url`, `video_provider`, `position`, `module_id`)
- Editar aula
- Marcar aula como concluída

Regras de validação:
- `title` não pode ser vazio
- `embed_url`, quando presente, deve ser URL válida
- `video_provider` deve ser `youtube`, `vk` ou `none`
- `status` deve ser `draft`, `published` ou `archived`
- `position` deve ser inteiro positivo

---

## 11. Player de Vídeo

### YouTube

URL de embed:
```
https://www.youtube.com/embed/{VIDEO_ID}?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&controls=1
```

### VK Video

URL de embed:
```
https://vk.com/video_ext.php?oid={OID}&id={ID}&hd=2&js_api=1&no_share=1&__ref=no_ref
```

### Estrutura do componente VideoEmbed

```tsx
<div className="relative">
  <iframe
    src={embedUrl}
    className="w-full aspect-video"
    allowFullScreen
  />
  {/* Overlay: cobre logos sem bloquear controles */}
  <div
    className="absolute top-0 right-0 w-20 h-10 bg-black z-10"
    style={{ pointerEvents: 'none' }}
  />
</div>
```

> ⚠️ `pointer-events: none` é obrigatório no overlay. Sem ele, o overlay bloqueia os controles do player.

---

## 12. UI e Design

A interface deve ser:
- Limpa e minimalista
- Responsiva e mobile-first
- Sem excesso de cores
- Sem animações desnecessárias
- Com estados vazios bem tratados

Usar shadcn/ui para: Button, Card, Input, Select, Textarea, Dialog, DropdownMenu, Badge, Progress, Tabs, Accordion.

---

## 13. Nomenclatura

- Componentes: PascalCase
- Funções: camelCase
- Server Actions: camelCase
- Tabelas no banco: snake_case
- Colunas no banco: snake_case
- Propriedades TypeScript: camelCase
- Arquivos de componente: kebab-case ou PascalCase
- Arquivos de action: camelCase

---

## 14. Tratamento de Erros

- Não expor stack trace para o usuário
- Retornar mensagens simples e claras
- Logar erros no servidor quando necessário
- Diferenciar: erro de validação / erro de autenticação / erro de autorização / erro interno

---

## 15. Performance

- Evitar Client Components desnecessários
- Evitar estados globais no MVP
- Evitar libs grandes para tarefas simples
- Queries objetivas — não buscar dados que não serão exibidos
- Usar índices quando necessário

---

## 16. Acessibilidade

Regras mínimas:
- Botões com texto claro
- Inputs com labels
- Contraste adequado
- Navegação por teclado nos formulários
- Feedback visual para ações importantes

---

## 17. Checklist Antes de Finalizar Qualquer Tarefa

```bash
npm run lint
npx tsc --noEmit
npm run build
```

A tarefa só está pronta se os três comandos passarem sem erros.

---

## 18. Critérios de Aceite do MVP

O MVP só está finalizado quando:

- [ ] Login com Neon Auth funciona
- [ ] Logout funciona
- [ ] Rotas `/members/*` protegidas
- [ ] Rotas `/admin/*` protegidas por role
- [ ] Admin consegue criar curso, módulo e aula
- [ ] Embed de YouTube e VK funcionam sem distrações
- [ ] Membro consegue marcar aula como concluída
- [ ] Progresso é salvo no banco e exibido no dashboard
- [ ] Usuário não acessa dados de outro usuário
- [ ] Build passa na Vercel
- [ ] Variáveis de ambiente configuradas em produção
- [ ] Nenhum segredo exposto ao client

---

## 19. Regra para IA / Agentes / Editores de Código

Ao trabalhar neste projeto:

1. Leia `STACK.md`
2. Leia `INITIAL.md`
3. Leia `RULES.md`
4. Não altere a stack
5. Não troque Neon Auth por Auth.js
6. Não aumente o escopo sem autorização
7. Implemente em pequenos passos testáveis
8. Use os imports corretos: `@neondatabase/auth/next/server`
9. Use as variáveis de ambiente corretas: `NEON_AUTH_URL`, `NEON_AUTH_JWKS_URL`, `NEON_AUTH_COOKIE_SECRET`, `NEXT_PUBLIC_NEON_AUTH_URL`
10. Após cada etapa, informe como validar
