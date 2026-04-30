# INITIAL.md — THRVCLUB

## 1. Contexto

O THRVCLUB é uma área de membros pessoal para centralizar cursos, vídeos e conteúdos de aprendizado vindos de plataformas externas como YouTube e VK Video.

O produto tem dois perfis de acesso:
- **Admin**: cria e gerencia cursos, módulos e aulas
- **Membro**: assiste aulas, acompanha progresso

---

## 2. Objetivo Principal

Criar um web app na nuvem onde:

**Admin pode:**
- Criar, editar e excluir cursos
- Organizar cursos em módulos
- Criar aulas com link de embed (YouTube ou VK Video)
- Visualizar usuários cadastrados

**Membro autenticado pode:**
- Acessar a biblioteca de cursos disponíveis
- Assistir aulas com player incorporado (YouTube/VK)
- Acompanhar progresso por aula e por curso
- Buscar conteúdo

---

## 3. Nome do Projeto

**THRVCLUB**

---

## 4. Tipo de Produto

Área de membros pessoal com painel administrativo.

Não é marketplace.
Não é rede social.
Não é LMS corporativo.
Não é hospedagem de vídeo.

---

## 5. Stack Obrigatória

- Next.js 14+ com App Router
- TypeScript strict
- Tailwind CSS
- shadcn/ui
- Neon Auth
- Neon PostgreSQL
- Drizzle ORM
- Vercel

---

## 6. Requisitos Funcionais do MVP

### 6.1 Autenticação

O sistema deve permitir:

- Login via Neon Auth
- Logout via Neon Auth
- Persistência de sessão
- Validação de sessão no servidor
- Proteção de rotas privadas
- Redirecionamento de usuário não autenticado para `/login`
- Diferenciação de papel: `admin` vs `member` via campo `role` na tabela de usuários

### 6.2 Área de Membros

Rotas privadas (role: member ou admin):

- `/members` — dashboard com progresso geral e cursos recentes
- `/members/library` — biblioteca de todos os cursos publicados
- `/members/search` — busca de cursos e aulas
- `/members/courses/[courseId]` — detalhes de um curso e lista de módulos/aulas
- `/members/courses/[courseId]/[lessonId]` — player da aula + marcação de concluído

### 6.3 Painel Administrativo

Rotas privadas (role: admin apenas):

- `/admin` — visão geral: total de usuários, cursos, aulas
- `/admin/courses` — lista de todos os cursos com ações
- `/admin/courses/new` — formulário de criação de curso
- `/admin/courses/[courseId]/edit` — formulário de edição de curso
- `/admin/users` — lista de usuários cadastrados

### 6.4 Gestão de Cursos (Admin)

O admin deve poder:

- Criar curso (título, descrição, thumbnail, status)
- Editar curso
- Arquivar curso
- Criar módulos dentro de um curso
- Criar aulas dentro de um módulo
- Adicionar URL de embed por aula (YouTube ou VK Video)
- Definir order/posição de módulos e aulas

### 6.5 Progresso do Membro

- Cada aula pode ser marcada como concluída
- O percentual de progresso do curso é calculado com base nas aulas concluídas
- O dashboard do membro exibe progresso geral e por curso

### 6.6 Player de Vídeo

- O player deve incorporar YouTube e VK Video sem mostrar recomendações, logos ou links externos
- Usar parâmetros específicos de embed para limpar a interface do player
- Overlay CSS com `pointer-events: none` para cobrir logos de plataforma

---

## 7. Modelo de Dados

### courses
```
id, user_id, title, description, thumbnail_url, status, created_at, updated_at
```

### modules
```
id, course_id, title, position, created_at, updated_at
```

### lessons
```
id, module_id, title, description, video_provider, embed_url, duration_sec, position, created_at, updated_at
```

### enrollments
```
id, user_id, course_id, enrolled_at
```

### user_progress
```
id, user_id, lesson_id, completed, completed_at
```

---

## 8. Requisitos Não Funcionais

### 8.1 Segurança

- Todas as queries ocorrem no servidor
- Nenhuma credencial exposta ao client
- Usuário autenticado validado antes de qualquer ação sensível
- Server Actions validam sessão antes de mutar dados
- Inputs validados com Zod
- Nunca confiar em `user_id` enviado pelo client
- Rotas `/admin` protegidas por verificação de role no servidor

### 8.2 Performance

- Server Components por padrão
- Client Components apenas quando houver interatividade real
- Evitar bibliotecas pesadas no frontend
- Evitar chamadas desnecessárias ao banco

### 8.3 Deploy

- Build sem erros na Vercel
- Banco no Neon
- Neon Auth habilitado
- Migrações reproduzíveis
- Variáveis de ambiente configuradas

---

## 9. Componentes Principais

- `CourseCard`
- `LessonCard`
- `ModuleAccordion`
- `VideoEmbed`
- `VideoWrapper` (com overlay)
- `ProgressBar`
- `ProgressBadge`
- `AdminSidebar`
- `MemberHeader`
- `EmptyState`
- `CourseForm`
- `LessonForm`
- `DeleteButton`

---

## 10. Server Actions Esperadas

### actions/courses.ts
- `createCourse`
- `updateCourse`
- `deleteCourse`

### actions/lessons.ts
- `createLesson`
- `updateLesson`
- `deleteLesson`

### actions/progress.ts
- `markLessonComplete`
- `markLessonIncomplete`
- `getCourseProgress`

Todas devem:
- Validar sessão via Neon Auth
- Obter `user_id` da sessão no servidor
- Validar input com Zod
- Retornar erro seguro
- Revalidar rotas afetadas

---

## 11. Critérios de Aceite do MVP

O MVP está finalizado quando:

- [ ] Login com Neon Auth funciona
- [ ] Logout funciona
- [ ] Rotas `/members` protegidas: não autenticado → redireciona para `/login`
- [ ] Rotas `/admin` protegidas: role diferente de admin → redireciona
- [ ] Admin consegue criar curso, módulo e aula com embed de vídeo
- [ ] Membro consegue acessar a biblioteca e assistir aulas
- [ ] Progresso é salvo no banco por aula
- [ ] Dashboard do membro exibe progresso real
- [ ] Player não exibe recomendações ou logos de plataforma
- [ ] Build passa na Vercel
- [ ] Variáveis de ambiente configuradas em produção
- [ ] Nenhum segredo exposto ao client

---

## 12. Fora do Escopo

Não implementar agora:

- Upload de vídeos
- Streaming próprio
- Comentários
- Pagamentos
- Certificados
- Gamificação
- Comunidade
- Importação automática da Udemy/Coursera
- Integrações por API com plataformas externas
