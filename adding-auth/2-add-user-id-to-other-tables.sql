-- alter conversations table to add user_id column and make it a foreign key. default value should be 1
-- alter messages table to add user_id column and make it a foreign key. default value should be 1
-- alter bookmarks table to add user_id column and make it a foreign key. default value should be 1
-- alter system_prompts table to add _user_id column and make it a foreign key. default value should be 1
-- add key to match this: KEY conversation_id_idx (conversation_id),
--

ALTER TABLE conversations ADD COLUMN user_id INT DEFAULT 1;
ALTER TABLE conversations ADD KEY user_id_idx (user_id);

ALTER TABLE messages ADD COLUMN user_id INT DEFAULT 1;
ALTER TABLE messages ADD KEY user_id_idx (user_id);

ALTER TABLE bookmarks ADD COLUMN user_id INT DEFAULT 1;
ALTER TABLE bookmarks ADD KEY user_id_idx (user_id);

ALTER TABLE system_prompts ADD COLUMN user_id INT DEFAULT 1;
ALTER TABLE system_prompts ADD KEY user_id_idx (user_id);
