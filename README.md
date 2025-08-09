<h1 align="center">
    HappyIce
</h1>

<p align="center">
   <a href="https://www.linkedin.com/in/wellington-barros-593ba0137/">
      <img alt="Wellington Barros" src="https://img.shields.io/badge/-Wellington%20Barros-8257E5?style=flat&logo=Linkedin&logoColor=white" />
   </a>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/wfTom/happyice?color=774DD6">
</p>

# HappyIce: Seu Gerenciador de Receitas Favoritas

Bem-vindo ao HappyIce, uma aplicação completa para gerenciar suas receitas favoritas, descobrir novas criações e organizar seus ingredientes. Este projeto é construído com uma arquitetura robusta e moderna, utilizando as melhores práticas de desenvolvimento.

## 🚀 Visão Geral da Aplicação

HappyIce é uma plataforma que permite aos usuários:

- Registrar e fazer login de forma segura.
- Criar, visualizar, atualizar e excluir suas próprias receitas.
- Buscar receitas por nome ou por ingredientes.
- Marcar receitas como favoritas e gerenciar sua lista de favoritos.

## 🏗️ Arquitetura

A aplicação segue uma arquitetura de microsserviços (ou, mais precisamente, uma arquitetura em camadas bem definida para um monólito), dividida em três componentes principais:

1.  **Backend (API):** Responsável pela lógica de negócios, persistência de dados e exposição dos endpoints da API.
2.  **Frontend (Web):** A interface do usuário que consome a API do backend para exibir e interagir com os dados.
3.  **Banco de Dados:** Armazena todos os dados da aplicação.

A comunicação entre o frontend e o backend é feita via requisições HTTP. Todos os componentes são conteinerizados usando Docker para facilitar o desenvolvimento e a implantação.

## 💻 Stack Tecnológica

A stack tecnológica foi escolhida para garantir performance, escalabilidade e uma ótima experiência de desenvolvimento:

- **Backend:**
  - **Node.js:** Ambiente de execução JavaScript assíncrono e eficiente.
  - **Express.js:** Framework web minimalista e flexível para Node.js, usado para construir a API RESTful.
  - **TypeScript:** Superset do JavaScript que adiciona tipagem estática, melhorando a manutenibilidade e a detecção de erros.
  - **Jest:** Framework de testes para JavaScript e TypeScript.
  - **Axios:** Cliente HTTP para fazer requisições.
- **Frontend:**
  - **React:** Biblioteca JavaScript para construção de interfaces de usuário interativas.
  - **Vite:** Ferramenta de build rápida para projetos frontend.
  - **TypeScript:** Para tipagem estática no frontend.
  - **React Router DOM:** Para gerenciamento de rotas na aplicação SPA (Single Page Application).
  - **Axios:** Cliente HTTP para fazer requisições à API.
- **Banco de Dados:**
  - **PostgreSQL:** Sistema de gerenciamento de banco de dados relacional robusto e de código aberto.
- **Conteinerização:**
  - **Docker & Docker Compose:** Para empacotar, distribuir e executar a aplicação em ambientes isolados.

## 📊 Estrutura do Banco de Dados

O banco de dados PostgreSQL é composto pelas seguintes tabelas:

### `users` (Usuários)

Armazena informações dos usuários da aplicação.

- `id` (UUID, PK, DEFAULT gen_random_uuid()): Identificador único do usuário.
- `email` (VARCHAR(255), UNIQUE, NOT NULL): Endereço de e-mail do usuário (único).
- `password` (VARCHAR(255), NOT NULL): Senha criptografada do usuário.
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP): Data e hora de criação do registro.

### `recipes` (Receitas)

Armazena os detalhes das receitas criadas pelos usuários.

- `id` (UUID, PK, DEFAULT gen_random_uuid()): Identificador único da receita.
- `user_id` (UUID, NOT NULL, FK para `users.id`): ID do usuário que criou a receita.
- `name` (VARCHAR(255), NOT NULL): Nome da receita.
- `description` (TEXT): Descrição detalhada da receita.
- `steps` (TEXT[]): Array de strings com os passos de preparo.
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP): Data e hora de criação do registro.

### `ingredients` (Ingredientes)

Armazena uma lista de ingredientes genéricos.

- `id` (UUID, PK, DEFAULT gen_random_uuid()): Identificador único do ingrediente.
- `name` (VARCHAR(255), UNIQUE, NOT NULL): Nome do ingrediente (único).

### `recipe_ingredients` (Ingredientes da Receita)

Tabela de junção para relacionar receitas com seus ingredientes, incluindo detalhes específicos.

- `recipe_id` (UUID, PK, FK para `recipes.id`): ID da receita.
- `ingredient_id` (UUID, PK, FK para `ingredients.id`): ID do ingrediente.
- `quantity` (VARCHAR(100)): Quantidade do ingrediente (ex: "2", "1/2 xícara").
- `unit` (VARCHAR(100)): Unidade de medida (ex: "gramas", "ml", "unidades").
- `display_order` (INTEGER, NOT NULL): Ordem de exibição do ingrediente na receita.

### `favorites` (Favoritos)

Registra as receitas que um usuário marcou como favoritas.

- `user_id` (UUID, PK, FK para `users.id`): ID do usuário que favoritou.
- `recipe_id` (UUID, PK, FK para `recipes.id`): ID da receita favoritada.
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP): Data e hora em que a receita foi favoritada.

## 🌐 Endpoints da API (Backend)

A API é acessível através do serviço `backend` na porta `3000` (mapeada para `3000` no host). O prefixo base para todas as rotas é `/api`.

### Usuários (`/api/users`)

- **`POST /api/users/register`**
  - **Descrição:** Registra um novo usuário.
  - **Corpo da Requisição:** `{ email: string, password: string }`
  - **Respostas:** `201 Created`, `400 Bad Request`
- **`POST /api/users/login`**
  - **Descrição:** Autentica um usuário e retorna um token JWT e os dados do usuário.
  - **Corpo da Requisição:** `{ email: string, password: string }`
  - **Respostas:** `200 OK` (com `{ token: string, user: { id: string, email: string } }`), `400 Bad Request`

### Receitas (`/api/recipes`)

- **`GET /api/recipes`**
  - **Descrição:** Lista todas as receitas. **Acessível sem autenticação.**
  - **Respostas:** `200 OK` (com `Recipe[]`), `500 Internal Server Error`
- **`GET /api/recipes/{id}`**
  - **Descrição:** Obtém os detalhes de uma receita específica por ID. **Acessível sem autenticação.**
  - **Parâmetros de Rota:** `id` (string, UUID da receita)
  - **Respostas:** `200 OK` (com `Recipe`), `404 Not Found`, `500 Internal Server Error`
- **`POST /api/recipes`**
  - **Descrição:** Cria uma nova receita. **Requer autenticação.**
  - **Corpo da Requisição:** `{ name: string, description: string, steps: string[], ingredients: RecipeIngredient[] }`
  - **Respostas:** `201 Created`, `400 Bad Request`, `401 Unauthorized`
- **`PUT /api/recipes/{id}`**
  - **Descrição:** Atualiza uma receita existente por ID. **Requer autenticação.**
  - **Parâmetros de Rota:** `id` (string, UUID da receita)
  - **Corpo da Requisição:** `{ name: string, description: string, steps: string[], ingredients: RecipeIngredient[] }`
  - **Respostas:** `200 OK`, `400 Bad Request`, `401 Unauthorized`
- **`DELETE /api/recipes/{id}`**
  - **Descrição:** Exclui uma receita por ID. **Requer autenticação.**
  - **Parâmetros de Rota:** `id` (string, UUID da receita)
  - **Respostas:** `200 OK`, `400 Bad Request`, `401 Unauthorized`
- **`GET /api/recipes/search/name?name={query}`**
  - **Descrição:** Busca receitas por nome. **Acessível sem autenticação.**
  - **Parâmetros de Query:** `name` (string, termo de busca)
  - **Respostas:** `200 OK` (com `Recipe[]`), `400 Bad Request` (se `name` estiver ausente), `500 Internal Server Error`
- **`GET /api/recipes/search/ingredient?ingredient={query}`**
  - **Descrição:** Busca receitas por ingrediente. **Acessível sem autenticação.**
  - **Parâmetros de Query:** `ingredient` (string, termo de busca)
  - **Respostas:** `200 OK` (com `Recipe[]`), `400 Bad Request` (se `ingredient` estiver ausente), `500 Internal Server Error`

### Favoritos (`/api/favorites`)

- **`GET /api/favorites`**
  - **Descrição:** Lista as receitas favoritas do usuário autenticado. **Requer autenticação.**
  - **Respostas:** `200 OK` (com `Recipe[]`), `401 Unauthorized`, `500 Internal Server Error`
- **`POST /api/favorites`**
  - **Descrição:** Adiciona uma receita aos favoritos do usuário autenticado. **Requer autenticação.**
  - **Corpo da Requisição:** `{ recipeId: string }`
  - **Respostas:** `201 Created`, `400 Bad Request`, `401 Unauthorized`
- **`DELETE /api/favorites/{recipeId}`**
  - **Descrição:** Remove uma receita dos favoritos do usuário autenticado. **Requer autenticação.**
  - **Parâmetros de Rota:** `recipeId` (string, UUID da receita)
  - **Respostas:** `200 OK`, `400 Bad Request`, `401 Unauthorized`

## 🖥️ Frontend

O frontend é uma Single Page Application (SPA) construída com React e TypeScript. Ele oferece uma interface intuitiva para interagir com a API do backend.

### Rotas Principais do Frontend:

- **`/` (Home):** Exibe a lista de todas as receitas, com opções de busca por nome ou ingrediente. **Acessível sem autenticação.**
- **`/recipes`:** Também exibe a lista de todas as receitas. **Acessível sem autenticação.**
- **`/recipes/new`:** Formulário para criar uma nova receita. Requer autenticação.
- **`/recipes/edit/:id`:** Formulário para editar uma receita existente. Requer autenticação.
- **`/recipes/:id`:** Detalhes de uma receita específica.
- **`/favorites`:** Lista as receitas favoritas do usuário. Requer autenticação.
- **`/login`:** Página de login.
- **`/register`:** Página de registro de usuário.

## 🐳 Como Rodar a Aplicação com Docker Compose

Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.

1.  **Clone o Repositório:**

    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd happyice
    ```

2.  **Configurar Variáveis de Ambiente (Backend):**
    Crie um arquivo `.env` dentro da pasta `backend/` com as seguintes variáveis:

    ```
    DB_USER=user
    DB_PASSWORD=password
    DB_NAME=happyice
    DB_HOST=db
    DB_PORT=5432
    # Você pode adicionar outras variáveis de ambiente aqui, como JWT_SECRET
    ```

3.  **Configurar Variáveis de Ambiente (Frontend):**
    Crie um arquivo `.env` dentro da pasta `frontend/` com a seguinte variável:

    ```
    VITE_API_URL=http://localhost:3000/api
    ```

    _Nota: Se você estiver rodando em um ambiente diferente de `localhost`, ajuste `http://localhost:3000/api` para a URL da sua API._

4.  **Construir e Iniciar os Serviços:**
    No diretório raiz do projeto (`happyice/`), execute:

    ```bash
    docker-compose up --build
    ```

    - `--build`: Garante que as imagens Docker sejam construídas a partir dos Dockerfiles. Remova-o em execuções futuras se não houver mudanças nos Dockerfiles ou dependências.
    - Este comando irá:
      - Criar a rede `happyice-net`.
      - Iniciar o serviço `db` (PostgreSQL).
      - Aguardar o banco de dados estar saudável.
      - Iniciar o serviço `backend` (API Node.js).
      - Iniciar o serviço `frontend` (Aplicação React).

5.  **Acessar a Aplicação:**
    - O frontend estará acessível em `http://localhost:80` (ou apenas `http://localhost` se a porta 80 for a padrão).
    - A API do backend estará acessível em `http://localhost:3000/api`.

## 🧪 Executando Testes

### Testes de Unidade (Backend)

Para executar os testes de unidade do backend:

1.  Certifique-se de que o serviço `backend` esteja rodando (ou construa a imagem se ainda não o fez).
2.  Execute o comando dentro do contêiner do backend:
    ```bash
    docker-compose exec backend npm test
    ```
    Ou, se preferir rodar diretamente na sua máquina (assumindo Node.js e npm instalados e dependências instaladas na pasta `backend`):
    ```bash
    cd backend
    npm install # Se ainda não fez
    npm test
    ```

### Testes de API (com Swagger/OpenAPI)

O arquivo `backend/swagger.yaml` descreve os endpoints da sua API. Para testar a API com base nesta especificação:

1.  **Inicie a aplicação com Docker Compose** (`docker-compose up`).
2.  **Use uma ferramenta como Postman:**
    - Importe o arquivo `backend/swagger.yaml` no Postman.
    - O Postman criará coleções de requisições que você pode usar para testar cada endpoint.
    - Lembre-se de configurar a autenticação (Bearer Token) para os endpoints protegidos.

## 🛑 Parando a Aplicação

Para parar todos os serviços e remover os contêineres:

```bash
docker-compose down
```

Para remover também os volumes (o que apagará os dados do banco de dados):

```bash
docker-compose down -v
```

## 🌱 Inicialização do Banco de Dados e Seeds

O banco de dados é inicializado e populado automaticamente na primeira vez que o serviço do Docker é iniciado. Esse processo é gerenciado pelos scripts SQL localizados em `backend/src/infrastructure/database/sql/`:

- **`10-init.sql`**: Este script é executado primeiro e é responsável por criar toda a estrutura de tabelas, chaves primárias, estrangeiras e outros constraints necessários para a aplicação.
- **`20-seed.sql`**: Após a criação da estrutura, este script é executado para popular o banco de dados com dados iniciais (seeds). Isso inclui, por exemplo, uma lista de ingredientes comuns e algumas receitas de exemplo, permitindo que a aplicação seja utilizada imediatamente após a instalação.

Se você precisar resetar o banco de dados, pode parar os contêineres com `docker-compose down -v` (o `-v` remove os volumes, incluindo os dados do banco) e iniciá-los novamente com `docker-compose up`.

## 🧪 Testes, Cobertura e Monitoramento

### Relatório de Cobertura de Testes

Para gerar um relatório detalhado de cobertura de testes, que mostra quais partes do código foram testadas, execute:

```bash
docker-compose exec backend npm run test:coverage
```

Isso criará uma pasta `coverage/` no diretório `backend/` com um relatório HTML interativo que pode ser aberto no navegador.

## 🔌 Frontend e a Conexão com o Backend

É crucial entender como a variável de ambiente `VITE_API_URL` no arquivo `.env` do frontend funciona:

- **Para acesso via navegador (local):** Use `VITE_API_URL=http://localhost:3000/api`. O seu navegador acessa o `localhost`, e o Docker redireciona a porta `3000` para o contêiner do backend.
- **Para comunicação interna do Docker:** Se um serviço precisasse se comunicar com outro _dentro_ da rede do Docker, ele usaria o nome do serviço (ex: `http://backend:3000/api`). No nosso caso, como a requisição parte do navegador do usuário, usamos sempre `localhost`.
