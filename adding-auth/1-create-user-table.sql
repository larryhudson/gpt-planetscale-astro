-- create users table with id (primary key, autoincrement), username (needs to be unique), email address (needs to be unique), password hash, created_at
-- and updated_at columns. include approved_at column. default value for approved_at should be null
CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username varchar(255) NOT NULL UNIQUE,
  email varchar(255) NOT NULL UNIQUE,
  password varchar(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  approved_at DATETIME DEFAULT NULL
);