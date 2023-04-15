CREATE TABLE system_prompts (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255) NOT NULL,
  content varchar(10000) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE conversations (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255) NOT NULL,
  system_prompt_id INT,
  KEY system_prompt_id_idx (system_prompt_id),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  type varchar(255) NOT NULL,
  conversation_id INT,
  KEY conversation_id_idx (conversation_id),
  content varchar(10000) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO system_prompts (name, content)
VALUES ('Brainstorming assistant', 'You are an assistant helping the user brainstorm. You should help the user generate new ideas, and clarify existing ideas in their head. You should help them think strategically.');

INSERT INTO conversations (name, system_prompt_id)
VALUES ('Brainstorm', 1);

INSERT INTO messages (type, conversation_id, content)
VALUES ('user', 1, "I'm thinking about creating an AI assistant to help me brainstorm.");

CREATE TABLE bookmarks (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) NOT NULL,
    message_id int,
    KEY message_id_idx (message_id),
    conversation_id int,
    KEY conversation_id_idx (conversation_id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);