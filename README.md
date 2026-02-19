# FIAP PosTech - Blog Educacional Mobile

App mobile React Native (Expo) para a plataforma de blogging educacional da FIAP, com backend Node.js/Express/MongoDB.

## Requisitos

- Node.js 20+
- Docker e Docker Compose
- Expo CLI (`npx expo`)
- Emulador Android/iOS ou dispositivo fisico com Expo Go

## Setup Rapido

### 1. Backend + MongoDB (Docker)

```bash
docker compose up -d
```

O backend estara disponivel em `http://localhost:3000` e o MongoDB em `localhost:27017`.

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

## Credenciais de Teste

| Usuario | E-mail | Senha | Role |
|---------|--------|-------|------|
| Professor FIAP | professor@fiap.com.br | fiap2024 | professor |
| Admin FIAP | admin@fiap.com.br | fiap2024 | admin |
| Aluno FIAP | aluno@fiap.com.br | fiap2024 | student |

Os usuarios seed sao criados automaticamente ao iniciar o backend.

## Arquitetura

```
fiap-mobile/
├── app/                    # Telas (Expo Router - file-based routing)
│   ├── (auth)/             # Telas de autenticacao (login)
│   ├── (tabs)/             # Tabs principais
│   │   ├── index.tsx       # Home - Lista de posts
│   │   ├── professores/    # CRUD professores
│   │   ├── alunos/         # CRUD alunos
│   │   └── admin/          # Painel administrativo
│   └── posts/              # Stack de posts (detalhe, criar, editar)
├── backend/                # API Node.js/Express (standalone)
│   ├── src/
│   │   ├── controllers/    # Controllers (post, user, auth)
│   │   ├── models/         # Mongoose models (Post, User)
│   │   ├── routes/         # Rotas Express
│   │   ├── services/       # Camada de servico
│   │   ├── middleware/      # Auth, validacao, error handler
│   │   └── config/         # Database, environment, seed
│   ├── Dockerfile
│   └── package.json
├── components/             # Componentes reutilizaveis
│   ├── ui/                 # Componentes base (Button, Input, Loading, etc)
│   ├── post-card.tsx       # Card de post
│   ├── post-form.tsx       # Formulario de post
│   ├── user-form.tsx       # Formulario de usuario
│   ├── search-bar.tsx      # Barra de busca com debounce
│   └── pagination.tsx      # Controles de paginacao
├── contexts/               # Context API (AuthContext)
├── services/               # Servicos de API (auth, posts, professors, students)
├── types/                  # Tipos TypeScript
├── constants/              # Constantes (API URL, tema)
└── docker-compose.yml      # Docker Compose (backend + MongoDB)
```

## Funcionalidades

### Publico (sem login)
- Listagem de posts com paginacao
- Busca de posts por palavras-chave
- Leitura completa de posts

### Autenticado (student)
- Tudo do publico
- Visualizacao de professores e alunos

### Professor / Admin
- Tudo do autenticado
- Criar, editar e excluir posts
- CRUD completo de professores
- CRUD completo de alunos
- Painel administrativo (gerenciar todos os posts)

## Endpoints da API

### Auth
| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| POST | /api/auth/login | Nao | Login (retorna JWT) |
| POST | /api/auth/register | Nao | Registro |

### Posts
| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| GET | /api/posts?page=&limit= | Nao | Lista paginada |
| GET | /api/posts/search?q= | Nao | Busca por keyword |
| GET | /api/posts/:id | Nao | Detalhe do post |
| POST | /api/posts | Sim | Criar post |
| PUT | /api/posts/:id | Sim | Editar post |
| DELETE | /api/posts/:id | Sim | Excluir post (soft delete) |

### Professores
| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| GET | /api/professors?page=&limit=&search= | Sim | Lista paginada |
| GET | /api/professors/:id | Sim | Detalhe |
| POST | /api/professors | Sim (prof/admin) | Criar |
| PUT | /api/professors/:id | Sim (prof/admin) | Editar |
| DELETE | /api/professors/:id | Sim (prof/admin) | Excluir |

### Alunos
| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| GET | /api/students?page=&limit=&search= | Sim | Lista paginada |
| GET | /api/students/:id | Sim | Detalhe |
| POST | /api/students | Sim (prof/admin) | Criar |
| PUT | /api/students/:id | Sim (prof/admin) | Editar |
| DELETE | /api/students/:id | Sim (prof/admin) | Excluir |

## Tecnologias

### Mobile
- React Native + Expo SDK 54
- Expo Router (file-based routing)
- TypeScript
- Context API (gerenciamento de estado)
- expo-secure-store (armazenamento seguro do JWT)

### Backend
- Node.js + Express 5
- MongoDB + Mongoose
- JWT (autenticacao)
- express-validator (validacao)
- bcryptjs (hash de senhas)

### Infraestrutura
- Docker + Docker Compose
- MongoDB 7

## Decisoes Tecnicas

| Decisao | Justificativa |
|---------|--------------|
| Context API | Estado global simples (auth), listas sao estado local |
| fetch nativo | Incluso no RN, ApiClient encapsula headers/token/errors |
| expo-secure-store | JWT com criptografia nativa (Keychain/EncryptedSharedPreferences) |
| User model unico | Professores e alunos compartilham o mesmo schema, filtrados por role |
| Posts como Stack fora de tabs | Telas de detalhe empilham sobre a tab atual |
| Backend standalone | Removido do monorepo original para independencia |
