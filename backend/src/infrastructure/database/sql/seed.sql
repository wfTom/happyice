-- Usuários de Exemplo
INSERT INTO users (id, email, password, created_at) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'user1@example.com', 'hashed_password_1', CURRENT_TIMESTAMP),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'user2@example.com', 'hashed_password_2', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Ingredientes de Exemplo
INSERT INTO ingredients (id, name) VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Tomate'),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Cebola'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Alho'),
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Macarrão'),
    ('11eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Carne Moída'),
    ('22eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Manjericão')
ON CONFLICT (id) DO NOTHING;

-- Receitas de Exemplo
INSERT INTO recipes (id, user_id, name, description, steps, created_at) VALUES
    ('33eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Molho de Tomate Simples', 'Um molho de tomate clássico e fácil.', ARRAY['Refogue alho e cebola.', 'Adicione tomates e cozinhe.', 'Tempere a gosto.'], CURRENT_TIMESTAMP),
    ('44eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Espaguete à Bolonhesa', 'Um prato italiano clássico com carne moída.', ARRAY['Cozinhe o macarrão.', 'Prepare o molho bolonhesa.', 'Sirva com queijo.'], CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Ingredientes para Receitas de Exemplo
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, display_order) VALUES
    ('33eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '500', 'gramas', 0),
    ('33eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '1', 'unidade', 1),
    ('33eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2', 'dentes', 2),
    ('44eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '200', 'gramas', 0),
    ('44eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '11eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '300', 'gramas', 1),
    ('44eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '400', 'gramas', 2)
ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;

-- Favoritos de Exemplo
INSERT INTO favorites (user_id, recipe_id, created_at) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '33eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', CURRENT_TIMESTAMP)
ON CONFLICT (user_id, recipe_id) DO NOTHING;
