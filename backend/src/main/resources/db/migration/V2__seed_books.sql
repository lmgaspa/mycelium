-- V2__seed_books.sql
-- Seed inicial de livros do catálogo (Renata Poeta)

INSERT INTO books (id, author, category, description, image_url, price, stock, title, author_id)
VALUES
    (
        'nacasa',
        'Renata Poeta',
        'Literatura infanto-juvenil.',
        'Poesia para gente minúscula',
        'https://www.renatapoeta.com.br/images/nacasa.webp',
        20.00,
        90,
        'Na casa das rimas',
        2
    ),
    (
        'poesia',
        'Renata Poeta',
        'Literatura infanto-juvenil.',
        'Poesia para gente minúscula',
        'https://www.renatapoeta.com.br/images/poesia.webp',
        20.00,
        90,
        'Poesia para gente minúscula',
        2
    ),
    (
        'antologia',
        'Renata Poeta',
        'Literatura infanto-juvenil.',
        'Antologia Via Vale dos Poetas.',
        'https://www.renatapoeta.com.br/images/viavale.webp',
        90.00,
        0,
        'Antologia Via Vale dos Poetas',
        2
    ),
    (
        'gatomasia',
        'Renata Poeta',
        'Literatura infanto-juvenil.',
        'Gatomasia! Que história é essa de Gatomasia?',
        'https://www.renatapoeta.com.br/images/gatomasia.webp',
        30.00,
        90,
        'Gatomasia',
        2
    ),
    (
        'poemar',
        'Renata Poeta',
        'Literatura infanto-juvenil.',
        'Para crianças que moram longe do mar',
        'https://www.renatapoeta.com.br/images/poemar.webp',
        40.00,
        90,
        'Poemar',
        2
    )
    ON CONFLICT (id) DO UPDATE
                            SET
                                author      = EXCLUDED.author,
                            category    = EXCLUDED.category,
                            description = EXCLUDED.description,
                            image_url   = EXCLUDED.image_url,
                            price       = EXCLUDED.price,
                            stock       = EXCLUDED.stock,
                            title       = EXCLUDED.title,
                            author_id   = EXCLUDED.author_id;

-- Vincula todos esses livros ao autor de pagamento (payment_author_registry.id = 2)
INSERT INTO payment_book_authors (book_id, author_id)
SELECT b.id, 2
FROM books b
WHERE b.id IN ('nacasa','poesia','antologia','gatomasia','poemar')
ON CONFLICT (book_id) DO UPDATE
SET author_id = EXCLUDED.author_id;
