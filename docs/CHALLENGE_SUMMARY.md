# Postech - Fase 4 - Tech Challenge Summary

## 📌 Visão Geral

**Objetivo:** Desenvolver uma interface gráfica mobile robusta, intuitiva e eficiente para uma aplicação de blogging dinâmico utilizando **React Native**.
**Contexto:** A aplicação deve consumir um back-end já existente (Node.js) e atender a docentes e estudantes.

## 🎯 Objetivos Principais

1.  **Mobile First:** Interface acessível e fácil de usar.
2.  **Integração:** Consumir endpoints REST existentes (Posts, Alunos, Professores).
3.  **Funcionalidades:** CRUD de posts, gestão de usuários (alunos/professores) e autenticação.

## 📋 Requisitos Funcionais

### 1. Página Principal (Lista de Posts)

- Listagem de todos os posts disponíveis.
- Card do post: Título, Autor, Breve descrição.
- Funcionalidade de **Busca** (filtro por palavras-chave).

### 2. Página de Leitura de Post

- Exibição completa do conteúdo do post selecionado.
- (Opcional) Seção de comentários.

### 3. Gestão de Postagens (Professores)

- **Criação:** Formulário com Título, Conteúdo e Autor.
- **Edição:** Carregar dados atuais e permitir salvamento.
- **Admin:** Listagem de todos os posts com opções de editar/excluir.

### 4. Gestão de Professores

- **Criação:** Cadastro de novos professores.
- **Edição:** Atualização de dados de professores existentes.
- **Listagem:** Tabela/Lista paginada com botões de editar e excluir.

### 5. Gestão de Estudantes

- Réplica das funcionalidades de gestão de professores (Criação, Edição, Listagem/Exclusão).

### 6. Autenticação e Autorização

- **Login:** Implementar login para professores.
- **Proteção de Rotas:** Apenas usuários autenticados acessam páginas de criação/edição/admin.
- **Controle de Acesso:**
  - **Professores:** Podem criar/modificar posts.
  - **Alunos:** Podem apenas visualizar posts.

## 🛠 Requisitos Técnicos

- **Framework:** React Native (Hooks e Componentes Funcionais).
- **Estilização:** Livre (conforme definido pelo grupo).
- **Integração:** Consumo de API REST (GET, POST, PUT, DELETE).
- **Gerenciamento de Estado:** Context API ou Redux (Opcional, mas recomendado).

## 📦 Entregáveis

1.  **Código-Fonte:** Repositório GitHub.
2.  **Vídeo Demo:** Máximo 15 minutos, demonstrando funcionamento e detalhes técnicos.
3.  **Documentação:** Arquivo (README ou PDF) descrevendo:
    - Arquitetura do sistema.
    - Guia de uso.
    - Relato de experiências e desafios.
