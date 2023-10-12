-- users table --

CREATE TABLE IF NOT EXISTS users (
    id uuid primary key DEFAULT uuid_generate_v4(),
    name text NULL,
    password text NULL,
    email text NULL
);

-- carts table --

CREATE TABLE IF NOT EXISTS carts (
    id uuid primary key DEFAULT uuid_generate_v4(),
    user_id uuid NULL,
    is_submitted BOOLEAN DEFAULT false,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES users ("id")
);

-- cart_items table --

CREATE TABLE IF NOT EXISTS cart_items (
    id uuid primary key DEFAULT uuid_generate_v4(),
    cart_id uuid NULL,
    product_id uuid NULL,
    count integer NULL,
    FOREIGN KEY ("cart_id") REFERENCES carts ("id")
);

-- orders table --

CREATE TABLE IF NOT EXISTS orders (
    id uuid primary key DEFAULT uuid_generate_v4(),
    user_id uuid NULL,
    cart_id uuid NULL,
    payment json NULL,
    delivery json NULL,
    comments text NULL,
    status text NULL DEFAULT 'OPEN',
    total integer NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE orders ADD CONSTRAINT orders_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES "carts" (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES "users" (id) ON DELETE CASCADE ON UPDATE CASCADE;

-- seed tables --

INSERT INTO users (id, name, password, email) VALUES
    ('f7ac8b3b-3cee-421c-bfd1-6afa28f50414','akuchynski','TEST_PASSWORD','user@gmail.com');

INSERT INTO carts (id, user_id, is_submitted, created_at, updated_at) VALUES
    ('e35aa9ee-8b9d-4cfb-8427-d83f90a4d84d','f7ac8b3b-3cee-421c-bfd1-6afa28f50414', false, '2022-11-11','2022-11-11');

INSERT INTO cart_items (id, cart_id, product_id, count) VALUES
    ('180fc8ca-eebb-4256-8225-b01e2211af56','e35aa9ee-8b9d-4cfb-8427-d83f90a4d84d','6a9ba6f9-d0f5-4196-967d-11d25fcc22fb',1),
    ('eec74c13-be66-490b-9c8d-855977906673','e35aa9ee-8b9d-4cfb-8427-d83f90a4d84d','81a729ef-3aa5-4950-9b4c-834871ea634b',2),
    ('4f6510c1-128f-4c10-a36e-75813ed20d13','e35aa9ee-8b9d-4cfb-8427-d83f90a4d84d','92cf48b2-d504-424a-91e6-139024459afb',3);

INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total, created_at, updated_at) VALUES
    ('5eea949b-f64f-40fb-8a59-00381b0f21d7','f7ac8b3b-3cee-421c-bfd1-6afa28f50414','e35aa9ee-8b9d-4cfb-8427-d83f90a4d84d','{"type":"ONLINE","creditCard":"test"}','{"firstName":"Andrei","lastName":"Kuchynski","address":"test address"}','test comment','COMPLETED',231,'2022-12-01','2022-12-01');

-- extensions --

--create extension if not exists "uuid-ossp";

-- drop tables --

-- ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_cart_id_fk;
-- ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fk;
-- ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_cart_id_fkey;
-- ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
--
-- DROP TABLE IF EXISTS orders;
-- DROP TABLE IF EXISTS carts;
-- DROP TABLE IF EXISTS cart_items;
-- DROP TABLE IF EXISTS users;