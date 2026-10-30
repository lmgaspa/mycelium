-- Preserve existing author relationships while removing the old column name.
ALTER TABLE books RENAME COLUMN author_id TO author_ref_id;
ALTER INDEX idx_books_author_id RENAME TO idx_books_author_ref_id;

ALTER TABLE payment_author_accounts RENAME COLUMN author_id TO registry_id;
ALTER TABLE payment_author_accounts
  RENAME CONSTRAINT payment_author_accounts_author_id_fkey
  TO payment_author_accounts_registry_id_fkey;

ALTER TABLE payment_book_authors RENAME COLUMN author_id TO registry_id;
ALTER TABLE payment_book_authors
  RENAME CONSTRAINT payment_book_authors_author_id_fkey
  TO payment_book_authors_registry_id_fkey;
ALTER INDEX idx_pba_author_id RENAME TO idx_pba_registry_id;
