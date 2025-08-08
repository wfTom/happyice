### 1. Entidades

Entidades são objetos com uma identidade distinta que persiste ao longo do tempo e em diferentes representações. Elas são mutáveis e representam os conceitos centrais do negócio.

#### 1.1. `User` (Usuário)

Representa um usuário da aplicação.

-   **Propriedades:**
    -   `id: string` (Somente leitura): Identificador único do usuário.
    -   `email: Email`: O endereço de e-mail do usuário, encapsulado como um objeto de valor `Email`.
    -   `password: Password`: A senha criptografada do usuário, encapsulada como um objeto de valor `Password`.
    -   `createdAt: Date` (Somente leitura): Carimbo de data/hora de quando a conta do usuário foi criada.

#### 1.2. `Recipe` (Receita)

Representa uma receita criada por um usuário.

-   **Propriedades:**
    -   `id: string` (Somente leitura): Identificador único da receita.
    -   `userId: string` (Somente leitura): O ID do usuário que criou a receita.
    -   `name: string`: O nome da receita.
    -   `description: string`: Uma descrição detalhada da receita.
    -   `steps: string[]`: Uma lista ordenada de passos para preparar a receita.
    -   `ingredients: RecipeIngredient[]`: Uma lista de objetos `RecipeIngredient` detalhando os ingredientes e suas quantidades.
    -   `createdAt: Date` (Somente leitura): Carimbo de data/hora de quando a receita foi criada.

#### 1.3. `Ingredient` (Ingrediente)

Representa um ingrediente genérico que pode ser usado em receitas.

-   **Propriedades:**
    -   `id: string` (Somente leitura): Identificador único do ingrediente.
    -   `name: string`: O nome do ingrediente (ex: "Tomate", "Açúcar").

#### 1.4. `RecipeIngredient` (Ingrediente da Receita)

Representa um ingrediente específico usado dentro de uma receita, incluindo sua quantidade e unidade. Esta é uma entidade de junção que liga `Recipe` e `Ingredient`.

-   **Propriedades:**
    -   `recipeId: string` (Somente leitura): O ID da receita à qual este ingrediente pertence.
    -   `ingredientId: string` (Somente leitura): O ID do próprio ingrediente.
    -   `quantity: string`: A quantidade do ingrediente (ex: "2", "1/2").
    -   `unit: string`: A unidade de medida para a quantidade (ex: "xícaras", "gramas", "unidades").
    -   `displayOrder: number`: Um número inteiro indicando a ordem em que o ingrediente deve ser exibido na receita.

#### 1.5. `Favorite` (Favorito)

Representa uma receita favorita de um usuário. Esta entidade captura a relação entre um usuário e uma receita que ele marcou como favorita.

-   **Propriedades:**
    -   `userId: string` (Somente leitura): O ID do usuário que favoritou a receita.
    -   `recipeId: string` (Somente leitura): O ID da receita que foi favoritada.
    -   `createdAt: Date` (Somente leitura): Carimbo de data/hora de quando a receita foi favoritada.

### 2. Objetos de Valor

Objetos de valor são objetos imutáveis que representam aspectos descritivos do domínio. Eles são caracterizados por seus atributos, e não por uma identidade distinta.

#### 2.1. `Email`

Representa o endereço de e-mail de um usuário, garantindo sua validade.

-   **Propriedades:**
    -   `value: string` (Somente leitura): A string do e-mail.
-   **Comportamento:**
    -   `create(email: string): Email`: Método estático de fábrica que valida o formato do e-mail e retorna uma instância de `Email`. Lança um erro se o e-mail for inválido.
    -   A igualdade é baseada na propriedade `value`.

#### 2.2. `Password` (Senha)

Representa a senha de um usuário, lidando com a criptografia (hashing) e comparação.

-   **Propriedades:**
    -   `value: string` (Somente leitura): A string da senha criptografada.
-   **Comportamento:**
    -   `create(password: string, isHashed: boolean): Password`: Método estático de fábrica. Se `isHashed` for falso, ele criptografa a senha fornecida antes de criar a instância.
    -   `compare(password: string): Promise<boolean>`: Compara uma senha de texto simples fornecida com a senha criptografada armazenada.

### 3. Repositórios

As interfaces de repositório definem os contratos para persistência e recuperação de dados para cada raiz de agregado ou entidade. Elas abstraem os detalhes do banco de dados subjacente.

#### 3.1. `IUserRepository` (Repositório de Usuário)

Interface para gerenciar entidades `User`.

-   **Métodos:**
    -   `findById(id: string): Promise<User | null>`: Recupera um usuário pelo seu ID.
    -   `findByEmail(email: Email): Promise<User | null>`: Recupera um usuário pelo seu endereço de e-mail.
    -   `save(user: User): Promise<void>`: Persiste um novo usuário ou atualiza um existente.
    -   `delete(email: Email): Promise<void>`: Exclui um usuário pelo seu endereço de e-mail.

#### 3.2. `IRecipeRepository` (Repositório de Receita)

Interface para gerenciar entidades `Recipe`.

-   **Métodos:**
    -   `findById(id: string): Promise<Recipe | null>`: Recupera uma receita pelo seu ID.
    -   `findAll(): Promise<Recipe[]>`: Recupera todas as receitas.
    -   `save(recipe: Recipe): Promise<void>`: Persiste uma nova receita ou atualiza uma existente.
    -   `delete(id: string): Promise<void>`: Exclui uma receita pelo seu ID.
    -   `searchByName(name: string): Promise<Recipe[]>`: Busca receitas por nome.
    -   `searchByIngredient(ingredientName: string): Promise<Recipe[]>`: Busca receitas por nome de ingrediente.

#### 3.3. `IIngredientRepository` (Repositório de Ingrediente)

Interface para gerenciar entidades `Ingredient`.

-   **Métodos:**
    -   `findById(id: string): Promise<Ingredient | null>`: Recupera um ingrediente pelo seu ID.
    -   `findByName(name: string): Promise<Ingredient | null>`: Recupera um ingrediente pelo seu nome.
    -   `findSimilarByName(searchTerm: string): Promise<Ingredient[]>`: Busca ingredientes com nomes semelhantes ao termo de busca.
    -   `save(ingredient: Ingredient): Promise<void>`: Persiste um novo ingrediente ou atualiza um existente.
    -   `update(ingredient: Ingredient): Promise<void>`: Atualiza um ingrediente existente.
    -   `delete(id: string): Promise<void>`: Exclui um ingrediente pelo seu ID.

#### 3.4. `IFavoriteRepository` (Repositório de Favorito)

Interface para gerenciar entidades `Favorite`.

-   **Métodos:**
    -   `findByUserId(userId: string): Promise<Recipe[]>`: Recupera todas as receitas favoritas para um determinado ID de usuário.
    -   `save(favorite: Favorite): Promise<void>`: Marca uma receita como favorita para um usuário.
    -   `delete(userId: string, recipeId: string): Promise<void>`: Desfavorita uma receita para um usuário.

### 4. Relacionamentos

-   **Usuário para Receita (Um-para-Muitos):** Um `User` pode criar várias `Recipe`s. Cada `Recipe` está associada a um `User`.
-   **Receita para Ingrediente (Muitos-para-Muitos através de `RecipeIngredient`):** Uma `Recipe` pode ter muitos `Ingredient`s, e um `Ingredient` pode fazer parte de várias `Recipe`s. A entidade `RecipeIngredient` modela essa relação, incluindo detalhes específicos como quantidade e unidade.
-   **Usuário para Favorito (Um-para-Muitos):** Um `User` pode ter muitos `Favorite`s. Cada `Favorite` está associado a um `User`.
-   **Receita para Favorito (Um-para-Muitos):** Uma `Recipe` pode ser favoritada por vários `User`s. Cada `Favorite` está associado a uma `Recipe`.
-   **Usuário para Email/Senha (Composição):** Entidades `User` compõem objetos de valor `Email` e `Password`, o que significa que o ciclo de vida dos objetos de valor está ligado ao usuário.

Este modelo de domínio oferece uma base clara e robusta para a lógica de negócios da aplicação, garantindo a integridade dos dados e a separação de responsabilidades.