# Guia de Abordagem para Iniciantes em React Native (Com Expo Router)

Este é um roteiro sugerido para iniciar e completar o Tech Challenge da Fase 4, utilizando a abordagem moderna com **Expo Router**, que é o padrão atual (file-based routing), similar ao Next.js na web.

## 1. Configuração do Projeto

Você já está no caminho certo! O seu projeto já utiliza a estrutura do Expo Router.

**Estrutura Típica (que você já deve ter):**

```
/
├── app/               # Rotas e Layouts (File-based routing)
│   ├── (tabs)/        # Telas com menu inferior
│   ├── _layout.tsx    # Configuração global (Stack, Providers)
│   ├── index.tsx      # Tela inicial
│   └── ...            # Outras rotas
├── src/               # Código lógico (Components, Services, etc)
│   ├── components/    # Botões, Cards, Inputs reutilizáveis
│   ├── services/      # Configuração da API (api.ts)
│   ├── hooks/         # Hooks customizados
│   └── ...
```

## 2. Bibliotecas Essenciais

Além do que já vem no _template_ do Expo Router:

- **Navegação:** `expo-router` (Já instalado).
  - Usa a estrutura de pastas e arquivos para criar rotas automaticamente.
  - Ex: Criar o arquivo `app/perfil.tsx` cria automaticamente a rota `/perfil`.
- **Requisições HTTP:** `axios`.
  - Mais simples para configurar a `baseURL` da API.
- **Armazenamento Local:** `expo-secure-store`.
  - Essencial para salvar o token de autenticação (JWT) de forma segura.

## 3. Passo a Passo de Desenvolvimento

### Fase 1: Entendendo as Rotas (File-based Routing)

1.  **Tabs:** Explore a pasta `app/(tabs)`. Cada arquivo ali vira uma aba no menu inferior.
2.  **Stacks:** Para telas que "empilham" (como Detalhes de um Post), você pode apenas criar o arquivo (ex: `app/post/[id].tsx` para rotas dinâmicas).
3.  **Layouts:** O `_layout.tsx` define como as telas se comportam (se tem cabeçalho, se é modal, etc).

### Fase 2: Integração com API (Axios)

Crie um arquivo `src/services/api.ts` para centralizar as chamadas:

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "http://SEU_IP_PC:3000", // Android Emulator: 10.0.2.2
});

export default api;
```

_Dica:_ Se usar celular físico via Expo Go, use o IP da sua rede local (ex: `192.168.0.15`).

### Fase 3: Autenticação com Expo Router

Use **Context API** porem tome cuidado com a proteção de rotas.

- No `app/_layout.tsx` ou em um componente Provider, verifique se o usuário está logado.
- Se NÃO estiver logado, redirecione para a tela de login (use `router.replace('/login')`).
- O uso de `Segments` e `useRootNavigationState` do Expo Router ajuda a controlar esses fluxos para evitar redirecionamentos infinitos.

### Fase 4: Listagens e Detalhes

- Use `FlatList` nas telas dentro de `app/`.
- Para navegar enviando dados:
  ```typescript
  import { router } from "expo-router";
  // ...
  router.push(`/post/${id}`); // Navega para app/post/[id].tsx
  ```
  E na tela de destino (`app/post/[id].tsx`):
  ```typescript
  import { useLocalSearchParams } from "expo-router";
  // ...
  const { id } = useLocalSearchParams();
  ```

## 4. Dicas para Iniciantes no Expo Router

- **Link Component:** Use `<Link href="/caminho">Ir para...</Link>` para navegação simples declarativa.
- **Reload:** O "Fast Refresh" do Expo é ótimo. Se algo travar, apenas aperte `r` no terminal.
- **Reset de Cache:** Se criar um arquivo e ele não aparecer como rota, pare o servidor e rode `npx expo start -c` (clear cache).
