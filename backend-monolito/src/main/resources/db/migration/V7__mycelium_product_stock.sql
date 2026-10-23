CREATE TABLE IF NOT EXISTS mycelium_product_stock (
    slug VARCHAR(120) PRIMARY KEY,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

INSERT INTO mycelium_product_stock (slug, stock) VALUES
    ('raiz', 0),
    ('crescimento-parte-a', 0),
    ('crescimento-parte-b', 0),
    ('floracao-parte-a', 0),
    ('floracao-parte-b', 0),
    ('flores-magicas', 0),
    ('finalizador', 0),
    ('ph-down', 0),
    ('ph-up', 0)
ON CONFLICT (slug) DO NOTHING;
