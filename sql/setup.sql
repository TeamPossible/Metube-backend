-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users, profiles CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 () UNIQUE,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    user_id uuid NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users (id),
    username TEXT NOT NULL UNIQUE,
    dob TEXT,
    avatar TEXT,
    bio TEXT
);
