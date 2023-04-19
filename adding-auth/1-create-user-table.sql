-- create users table with id (primary key, autoincrement), username (needs to be unique), email address (needs to be unique), password hash, created_at
-- and updated_at columns. include approved_at column. default value for approved_at should be null
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME DEFAULT NULL
);
