-- create a new table for sessions. should have an id, user_id, created_at

CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  session_id TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);