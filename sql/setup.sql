-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users, videos, comments, likes CASCADE;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 () UNIQUE,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    username TEXT NOT NULL UNIQUE,
    dob TEXT,
    avatar TEXT,
    bio TEXT
);

CREATE TABLE videos (
user_id uuid NOT NULL,
title TEXT NOT NULL,
description TEXT,
video_id BIGINT NOT NULL 
);

CREATE TABLE comments (
user_id uuid NOT NULL,
comment TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
video_id BIGINT NOT NULL
);

CREATE TABLE likes (
user_id uuid NOT NULL,
is_liked BOOLEAN NOT NULL,
video_id BIGINT NOT NULL
);

