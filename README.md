# FIAP PosTech - Blog Educacional Mobile

App mobile React Native (Expo) para a plataforma de blogging educacional da FIAP, com backend Node.js/Express/MongoDB.

## Requisitos

- Node.js 20+
- Docker e Docker Compose
- Expo CLI (`npx expo`)
- Emulador Android/iOS ou dispositivo físico com Expo Go

## Setup Rápido

### 1. Backend + MongoDB (Docker)

```bash
cd backend
docker compose up -d
```

O backend estará disponível em `http://localhost:3000` e o MongoDB em `localhost:27017`.

Para verificar:
```bash
curl http://localhost:3000/health
```

### 2. App Mobile (Expo)

```bash
# Na raiz do projeto
npm install
npx expo start
```

Escaneie o QR code com o Expo Go ou pressione `a` para abrir no emulador Android.

## Postman Collection

Importe o arquivo `FIAP_TechChallenge.postman_collection.json` no Postman para testar todos os endpoints da API.

**Como usar:**
1. `Import` → selecionar o arquivo na raiz do projeto
2. Fazer login (Professor ou Aluno) — o token JWT é **salvo automaticamente** na variável `{{token}}`
3. Todas as demais requisições já usam `Bearer {{token}}` no header

Inclui payloads prontos para: Auth · Posts (6 exemplos) · Professores · Alunos · Busca · Paginação.

## Credenciais de Teste

| Usuário | E-mail | Senha | Role |
|---------|--------|-------|------|
| Professor FIAP | professor@fiap.com.br | fiap2024 | professor |
| Aluno FIAP | aluno@fiap.com.br | fiap2024 | student |

Os usuários seed são criados automaticamente ao iniciar o backend.

## Arquitetura

```
fiap-mobile/
├── app/                    # Telas (Expo Router - file-based routing)
│   ├── (auth)/             # Telas de autenticação (login)
│   ├── (tabs)/             # Tabs principais
│   │   ├── index.tsx       # Home — Feed de posts (público)
│   │   ├── meus-posts.tsx  # Meus Posts — edição dos próprios posts (aluno)
│   │   └── admin/          # Painel admin — CRUD posts/professores/alunos (professor)
│   └── posts/              # Stack de posts (detalhe)
├── backend/                # API Node.js/Express (standalone)
│   ├── src/
│   │   ├── controllers/    # Controllers (post, user, auth)
│   │   ├── models/         # Mongoose models (Post, User)
│   │   ├── routes/         # Rotas Express
│   │   ├── services/       # Camada de serviço
│   │   ├── middleware/     # Auth, validação, error handler
│   │   └── config/         # Database, environment, seed
│   ├── Dockerfile
│   └── package.json
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes base (Button, Loading, ConfirmDialog, etc)
│   ├── post-card.tsx       # Card de post
│   ├── search-bar.tsx      # Barra de busca com debounce
│   └── pagination.tsx      # Controles de paginação
├── services/               # Serviços de API (auth, posts, professors, students, storage)
├── store/                  # Redux Toolkit (authSlice)
├── types/                  # Tipos TypeScript (auth, post, user)
├── constants/              # Constantes (API URL, tema)
└── docker-compose.yml      # Docker Compose (backend + MongoDB)
```

## Funcionalidades por Perfil

### Público (sem login)
- Listagem paginada de posts
- Busca de posts por palavras-chave
- Leitura completa de posts

### Aluno (student)
- Tudo do público
- Aba **Meus Posts**: visualizar, editar e excluir os próprios posts

### Professor
- Tudo do público
- Aba **Admin** com três seções:
  - **Posts** — CRUD completo de todos os posts
  - **Professores** — CRUD completo de professores
  - **Alunos** — CRUD completo de alunos

## Endpoints da API

### Auth
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | /api/auth/login | Não | Login (retorna JWT) |
| POST | /api/auth/register | Não | Registro |

### Posts
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/posts?page=&limit= | Não | Lista paginada |
| GET | /api/posts/search?q= | Não | Busca por keyword |
| GET | /api/posts/:id | Não | Detalhe do post |
| POST | /api/posts | Sim (professor) | Criar post |
| PUT | /api/posts/:id | Sim (professor) | Editar post |
| DELETE | /api/posts/:id | Sim (professor) | Excluir post (soft delete) |

### Professores
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/professors?page=&limit=&search= | Sim | Lista paginada |
| GET | /api/professors/:id | Sim | Detalhe |
| POST | /api/professors | Sim (professor) | Criar |
| PUT | /api/professors/:id | Sim (professor) | Editar |
| DELETE | /api/professors/:id | Sim (professor) | Excluir |

### Alunos
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | /api/students?page=&limit=&search= | Sim | Lista paginada |
| GET | /api/students/:id | Sim | Detalhe |
| POST | /api/students | Sim (professor) | Criar |
| PUT | /api/students/:id | Sim (professor) | Editar |
| DELETE | /api/students/:id | Sim (professor) | Excluir |

## Tecnologias

### Mobile
- React Native + Expo SDK 54
- Expo Router (file-based routing)
- TypeScript
- Redux Toolkit (gerenciamento de estado de autenticação)
- expo-secure-store / localStorage (armazenamento seguro do JWT — cross-platform)

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (autenticação)
- express-validator (validação)
- bcryptjs (hash de senhas)

### Infraestrutura
- Docker + Docker Compose
- MongoDB 7

## Decisões Técnicas

| Decisão | Justificativa |
|---------|--------------|
| Redux Toolkit | Gerenciamento centralizado de auth com persistência cross-platform |
| Apenas 2 roles | `professor` e `student` — papel `admin` removido para simplificar o controle de acesso |
| Storage wrapper | `expo-secure-store` em nativo, `localStorage` na web — mesmo código para ambas as plataformas |
| Admin por modal | Edição/criação via bottom-sheet modal ao invés de páginas separadas — menos navegação |
| Aluno edita seus posts | Comparação `user.name === post.author` — sem campo `authorId` no modelo atual |
| User model único | Professores e alunos compartilham o mesmo schema, filtrados por `role` |
| Posts como Stack fora de tabs | Telas de detalhe empilham sobre a tab atual |
