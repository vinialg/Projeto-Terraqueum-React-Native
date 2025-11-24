# 📘 **Terraqueum — A Rede Social**

Uma rede social moderna desenvolvida em **React Native + Expo**, com **autenticação**, **upload de imagens/vídeos**, **editor de texto rico**, **feed em tempo real**, **perfil personalizável** e **integração total com Supabase (Auth, Database e Storage)**.

O objetivo do Terraqueum é ser uma base sólida para qualquer projeto de rede social com postagens ou aplicativo colaborativo — com código limpo, componentes reutilizáveis e arquitetura escalável.

---

# 📑 **ÍNDICE**

1. [Introdução](#📘-terraqueum--a-rede-social)
2. [Estrutura Geral](#📁-estrutura-geral-resumo)
3. [1. Pasta `app/` — Telas e Navegação](#️-1-pasta-app--telas-e-navegação)

   * 1.1 `_layout.jsx`
   * 1.2 `index.jsx`
   * 1.3 `bemVindo.jsx`
   * 1.4 `login.jsx`
   * 1.5 `cadastro.jsx`
   * 1.6 `main/home.jsx`
   * 1.7 `main/perfil.jsx`
   * 1.8 `main/editPerfil.jsx`
   * 1.9 `main/novoPost.jsx`
4. [2. Pasta `components/`](#-2-pasta-components--componentes-reutilizáveis)
5. [3. Pasta `services/`](#-3-pasta-services--lógica-de-dados-e-api)
6. [Tabelas do Banco de Dados](#📄-tabelas-em-markdown-para-colocar-no-readme)

   * users
   * posts
7. [Tabelas de Telas, Componentes e Serviços](#📱-tabela-telas-pasta-app)
8. [Dependências](#⚙️-tabela-de-dependências-fonctionais)
9. [Conclusão](#-conclusão)

---

# 📸 Prints

<img width="808" height="1600" alt="image" src="https://github.com/user-attachments/assets/b3e34999-a07d-4d5e-89b0-e8bcaaa68737" />
<img width="766" height="1599" alt="image" src="https://github.com/user-attachments/assets/579e59ea-0b4e-4e64-98c6-f031f58c72b8" />
<img width="805" height="1600" alt="image" src="https://github.com/user-attachments/assets/c4ef9e32-2ac7-400d-a218-a19c0a71f275" />
<img width="874" height="1600" alt="image" src="https://github.com/user-attachments/assets/08b83352-63ca-43d2-9688-3b30081610c7" />

# 📁 **Estrutura Geral (Resumo)**

```
app/
├── _layout.jsx
├── index.jsx
├── bemVindo.jsx
├── login.jsx
├── cadastro.jsx
└── main/
     ├── home.jsx
     ├── perfil.jsx
     ├── editPerfil.jsx
     └── novoPost.jsx

components/
├── AppButton.jsx
├── Avatar.jsx
├── Header.jsx
├── Input.jsx
├── Loading.jsx
├── PostCard.jsx
├── RichTextEditor.jsx
├── TelaBase.jsx
└── VoltarButton.jsx

services/
├── imageService.js
├── postService.js
└── userService.js
```

---

# 🗂️ **1. Pasta `app/` — Telas e Navegação**

Cada tela possui um propósito específico e segue uma arquitetura limpa usando:

* **Expo Router**
* **Context API**
* **Supabase Auth**
* **Hooks personalizados**

---

## 🔧 `_layout.jsx`

Responsável por:

* Inicializar o **AuthProvider**
* Escutar estados de sessão (`supabase.auth.onAuthStateChange`)
* Redirecionar automaticamente:

  * `/home` se autenticado
  * `/bemVindo` se deslogado
* Carregar dados do usuário no contexto

É o **cérebro da navegação e autenticação** do app.

useEffect(() => {
  supabase.auth.onAuthStateChange((_, session) => {
    if (session) {
      setAuth(session.user);
      router.replace('/home');
    } else {
      setAuth(null);
      router.replace('/bemVindo');
    }
  });
}, []);


---

## 🌀 `index.jsx`

Tela exibida durante:

* Carregamento da sessão
* Auto refresh
* Boot inicial

Renderiza apenas `<Loading />`.

<TelaBase bg="white">
  <Loading />
</TelaBase>


---

## 👋 `bemVindo.jsx`

Tela inicial com:

* Texto de boas-vindas
* Botão “Começar” → cadastro
* Botão para login
* Layout leve e responsivo

<AppButton title="Comece Aqui" onPress={() => router.push('cadastro')} />

---

## 🔐 `login.jsx`

Realiza login via:

```js
supabase.auth.signInWithPassword({ email, password })
```

Com validação básica e botão personalizado.

const submeter = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailRef.current,
    password: passwordRef.current,
  });
  if (error) Alert.alert("Erro", error.message);
};


---

## 📝 `cadastro.jsx`

Cria conta via:

```js
supabase.auth.signUp({
  email,
  password,
  options: { data: { name } }
})
```

O nome do usuário é salvo no **Auth Metadata**, depois sincronizado com a tabela `users`.

const submeter = async () => {
  const { error } = await supabase.auth.signUp({
    email: emailRef.current,
    password: passwordRef.current,
    options: { data: { name: nameRef.current } }
  });
  if (error) Alert.alert("Erro", error.message);
};

---

## 🏠 `main/home.jsx`

O feed principal:

* Lista posts
* Carrega dados com `fetchPosts`
* Possui **realtime listener**:

  ```js
  supabase.channel('posts')
  ```
* Mostra `<PostCard />` para cada post
* Botões para criar post e abrir perfil

useEffect(() => {
  fetchPosts().then(res => {
    if (res.success) setPosts(res.data);
  });
}, []);


---

## 👤 `main/perfil.jsx`

Exibe:

* Nome, e-mail, telefone, endereço
* Bio
* Imagem de perfil
* Botão de logout:

```js
supabase.auth.signOut()
```
const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) Alert.alert("Erro ao sair");
};

---

## ✏️ `main/editPerfil.jsx`

Permite editar:

* Nome
* Endereço
* Telefone
* Bio
* Imagem (upload com `imageService.uploadFile()`)

Grava no banco usando:

```js
updateUser(userId, data)
```

Atualiza contexto com:

```js
setUserData()
```

await updateUser(user.id, {
  name,
  phoneNumber,
  address,
  bio,
});

---

## ➕ `main/novoPost.jsx`

Tela de criação de um post com:

* Editor de texto rico
* Upload de imagem ou vídeo
* Envio via:

```js
createOrUpdatePost()
```
const onSubmit = async () => {
  const res = await createOrUpdatePost({
    userId: user.id,
    body: bodyRef.current,
    file,
  });
  if (res.success) router.back();
};

const onSubmit = async () => {
  const res = await createOrUpdatePost({
    userId: user.id,
    body: bodyRef.current,
    file,
  });
  if (res.success) router.back();
};

---

# 🎨 **2. Pasta `components/` — Componentes Reutilizáveis**

Documentação resumida no índice — cada componente é modular, responsivo e reutilizável.

---

## 🔘 **AppButton.jsx**

Botão estilizado com:

* Suporte a *loading*
* Sombra opcional
* Estilo responsivo

<Pressable onPress={onPress} style={styles.button}>
  {loading ? <Loading /> : <Text>{title}</Text>}
</Pressable>

---

## 👤 **Avatar.jsx**

Componente de avatar:

* Usa **expo-image**
* Usa **getUserImageSrc** para validar a imagem
* Aceita tamanho e bordas personalizadas

<Image source={getUserImageSrc(uri)} style={{ width: size, height: size }} />

---

## 🧭 **Header.jsx**

Header padrão:

* Mostra o título da tela
* Botão de voltar opcional
* Usado em várias telas internas

<View>
  {showBackButton && <VoltarButton router={router} />}
  <Text>{title}</Text>
</View>

---

## 🔙 **VoltarButton.jsx**

Implementa navegação de retorno:

```js
router.back();
```

Com ícone estilizado.

---

## 🔤 **Input.jsx**

Campo de texto com:

* Ícone opcional
* Estilo padronizado
* Suporte a *multiline* e `secureTextEntry`

<View style={[styles.container, props.containerStyle && props.containerStyle]}>
      {
        props.icon && props.icon
      }
      <TextInput
        style={{flex: 1}}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
</View>

---

## ⏳ **Loading.jsx**

Wrapper simples para `ActivityIndicator`.

---

## 📰 **PostCard.jsx**

Renderiza um post do feed:

* Cabeçalho com avatar, nome e data (moment)
* Corpo do post renderizado como HTML (`RenderHtml`)
* Suporte a imagem ou vídeo
* Área de ações (like / comment / share)
  
<RenderHtml source={{ html: item.body }} />

---

## ✍️ **RichTextEditor.jsx**

Editor WYSIWYG baseado em:

* **RichEditor**
* **RichToolbar**

Suporta:

* H1 / H4
* Negrito / Itálico
* Listas
* Citações
* Código
* Linha horizontal

**
<RichEditor ref={editorRef} onChange={onChange} />**

---

## 🧱 **TelaBase.jsx**

Wrapper base das telas:

* Gerencia SafeArea com `useSafeAreaInsets`
* Aplica `paddingTop` automático

<View style={{ flex: 1, backgroundColor: bg }}>{children}</View>


---

# 🌐 **3. Pasta `services/` — Lógica de Dados e API**

---

## 🖼️ **imageService.js**

### Funções

#### ✔ **getUserImageSrc(imagePath)**

Retorna:

* `{ uri: imagePath }` se existir
* `defaultUser.png` caso contrário

---

#### ✔ **uploadFile(folderName, fileUri, isImage)**

Processo:

1. Converte o arquivo para base64
2. Decodifica usando `decode`
3. Envia o arquivo para o bucket **uploads/**
4. Retorna uma **URL pública** pronta para uso

---

#### ✔ **getSupabaseFileUrl(filePath)**

Retorna apenas:

* `{ uri: filePath }`
  Porque o arquivo já é servido publicamente pelo Supabase.

export const getUserImageSrc = (uri) =>
  uri ? { uri } : require('../assets/images/defaultUser.png');

export const getSupabaseFileUrl = (path) => ({ uri: path });

---

## 📝 **postService.js**

### ✔ **createOrUpdatePost(post)**

* Se houver arquivo local → faz upload
* Define automaticamente o tipo (imagem/vídeo)
* Cria ou atualiza o post usando `upsert`
* Retorna um objeto padronizado (`success`, `data`, `msg`)

---

### ✔ **fetchPosts(limit)**

Busca posts com:

```sql
user: users(id, name, image)
```

Ordenação:

* `created_at DESC`

Inclui dados do autor para o feed.

export const fetchPosts = async () => {
  return await supabase
    .from("posts")
    .select("*, user: users(id, name, image)")
    .order("created_at", { ascending: false });
};

---

## 👤 **userService.js**

### ✔ **getUserData(userId)**

Busca um único registro na tabela `users` baseado no ID.

---

### ✔ **updateUser(userId, data)**

Atualiza dados do usuário, incluindo:

* nome
* telefone
* endereço
* bio
* imagem

export const getUserData = (id) =>
  supabase.from("users").select().eq("id", id).single();
export const updateUser = (id, data) =>
  supabase.from("users").update(data).eq("id", id);

---

## 🧑‍🚀 **Tabela: `users`**

```markdown
## 🧑‍🚀 Tabela: `users`

| Campo        | Tipo          | Obrigatório | Descrição |
|--------------|---------------|-------------|-----------|
| id           | uuid          | ✔           | Mesma UUID do auth.users |
| name         | text          | ✔           | Nome do usuário |
| image        | text (URL)    | ✖           | URL da foto de perfil |
| phoneNumber  | text          | ✖           | Telefone do usuário |
| address      | text          | ✖           | Endereço do usuário |
| bio          | text          | ✖           | Biografia |
| created_at   | timestamptz   | ✔ (auto)    | Criado em |
| updated_at   | timestamptz   | ✔ (auto)    | Atualizado em |
```

---

## 📝 **Tabela: `posts`**

```markdown
## 📝 Tabela: `posts`

| Campo       | Tipo          | Obrigatório | Descrição |
|-------------|---------------|-------------|-----------|
| id          | bigserial     | ✔           | ID único |
| userId      | uuid          | ✔           | FK → users.id |
| body        | text (HTML)   | ✖           | Conteúdo do post |
| file        | text (URL)    | ✖           | Imagem/vídeo |
| created_at  | timestamptz   | ✔ (auto)    | Criado em |
```

---

# 📱 **Tabela: Telas (pasta `app/`)**

```markdown
| Tela            | Arquivo               | Função |
|-----------------|------------------------|--------|
| Bem-vindo       | bemVindo.jsx           | Tela inicial |
| Login           | login.jsx              | Autenticação |
| Cadastro        | cadastro.jsx           | Criar conta |
| Home / Feed     | main/home.jsx          | Feed + realtime |
| Perfil          | main/perfil.jsx        | Dados do usuário |
| Editar Perfil   | main/editPerfil.jsx    | Atualizar perfil |
| Criar Post      | main/novoPost.jsx      | Editor + upload |
| Layout Geral    | _layout.jsx            | Sessão e rotas |
| Loader Inicial  | index.jsx              | Loading |
```

---

# 🎨 **Tabela: Componentes (pasta `components/`)**

```markdown
| Componente        | Arquivo                | Descrição |
|-------------------|-------------------------|------------|
| AppButton         | AppButton.jsx           | Botão com loading |
| Avatar            | Avatar.jsx              | Foto do usuário |
| Header            | Header.jsx              | Cabeçalho |
| VoltarButton      | VoltarButton.jsx        | Voltar |
| Input             | Input.jsx               | Campo de texto |
| Loading           | Loading.jsx             | Spinner |
| PostCard          | PostCard.jsx            | Card do feed |
| RichTextEditor    | RichTextEditor.jsx      | Editor HTML |
| TelaBase          | TelaBase.jsx            | Estrutura padrão |
```

---

# 🔌 **Tabela: Serviços (pasta `services/`)**

```markdown
| Serviço          | Arquivo            | Descrição |
|------------------|--------------------|-----------|
| imageService     | imageService.js    | Upload + URLs |
| postService      | postService.js     | CRUD posts |
| userService      | userService.js     | CRUD usuário |
```

---

# ⚙️ **Tabela de Dependências Fonctionais**

```markdown
| Biblioteca                   | Uso |
|-----------------------------|-----|
| expo-image                  | Exibir imagens |
| expo-av                     | Exibir vídeos |
| react-native-render-html    | Exibir posts formatados |
| react-native-pell-rich-editor | Editor rico |
| moment                      | Datas |
| supabase-js                 | Auth + DB + Storage |
| expo-router                 | Navegação |
| AsyncStorage                | Sessão persistente |
```

---

# 🎯 **Conclusão**

O **Terraqueum** é um projeto-base sólido para qualquer rede social moderna, oferecendo:

✨ Autenticação completa
✨ Feed com renderização rica
✨ Upload de imagens e vídeos
✨ Editor de texto poderoso
✨ Perfil personalizável
✨ Estrutura modular
✨ Serviços bem definidos
✨ Suporte realtime graças ao Supabase
