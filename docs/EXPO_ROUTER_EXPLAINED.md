# Entendendo o Expo Router

O Expo Router funciona com base nos **arquivos** que você cria. A estrutura de pastas define a navegação do app.

## 1. Regra de Ouro: Arquivo = Rota

Se você criar um arquivo, ele vira uma tela automaticamente.

- `app/index.tsx` ➡️ Tela Inicial `/`
- `app/login.tsx` ➡️ Rota `/login`
- `app/perfil.tsx` ➡️ Rota `/perfil`

## 2. Grupos `(nome)`

Pastas com parênteses **não aparecem na URL**. Elas servem apenas para agrupar arquivos que compartilham o mesmo **Layout** (como uma barra de navegação).

No seu projeto:

```
app/
  ├── (tabs)/          <-- Grupo "Tabs"
  │     ├── _layout.tsx  <-- Layout que desenha o Menu Inferior
  │     ├── index.tsx    <-- Aba Home (Rota "/")
  │     └── explore.tsx  <-- Aba Explore (Rota "/explore")
  ├── professores/
  │     └── index.tsx    <-- Rota "/professores" (Fora das abas!)
```

## 3. O Problema Atual

Você tentou adicionar "Professores" dentro do `_layout.tsx` da pasta `(tabs)`.

```tsx
// app/(tabs)/_layout.tsx
<Tabs.Screen name="professores" ... />
```

**Por que não funciona?**
O `<Tabs>` procura um arquivo chamado `professores` **DENTRO** da pasta `(tabs)`.
Como a sua pasta `professores` está **FORA** (na raiz `app/`), o layout de abas não consegue encontrá-la para colocar no menu.

## 4. A Solução

Para que "Professores" apareça no menu inferior, você deve mover a pasta (ou arquivo) para dentro de `(tabs)`.

**Estrutura Correta:**

```
app/
  ├── (tabs)/
  │     ├── _layout.tsx
  │     ├── index.tsx
  │     ├── explore.tsx
  │     └── professores/   <-- MOVA PARA CÁ
  │           └── index.tsx
```

Dessa forma, o `Tabs.Screen name="professores"` vai encontrar o caminho `app/(tabs)/professores` e funcionará perfeitamente.
