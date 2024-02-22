-- DB & tables
CREATE DATABASE task_manager IF NOT EXISTS;

CREATE TABLE tasklists (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL CHECK (position >= 0),
    tasks UUID[] DEFAULT '{}',
    n INTEGER DEFAULT 3 CHECK (n >= 0)
) IF NOT EXISTS;

CREATE TABLE tasks (
    id UUID PRIMARY KEY,
    text VARCHAR(200) NOT NULL,
    position INTEGER NOT NULL CHECK (position >= 0),
    tasklist_id UUID REFERENCES tasklists
) IF NOT EXISTS;

--User (actions: SELECT, INSERT, UPDATE, DELETE)
CREATE ROLE tm_admin LOGIN ENCRYPTED PASSWORD 'admin';
GRANT SELECT, INSERT, UPDATE, DELETE ON tasklists, tasks TO tm_admin;