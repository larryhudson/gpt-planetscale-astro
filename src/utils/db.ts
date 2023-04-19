import { connect } from "@planetscale/database";
import { getGptMessage, getGptCompletion } from "./gpt";

export function getDbConnection() {
  const config = {
    host: import.meta.env.PUBLIC_DATABASE_HOST,
    username: import.meta.env.PUBLIC_DATABASE_USERNAME,
    password: import.meta.env.PUBLIC_DATABASE_PASSWORD,
  };

  return connect(config);
}

export type SystemPrompt = {
  id: number;
  name: string;
  content: string;
};

export async function getSystemPromptsForUser(userId) {
  const db = getDbConnection();
  const query = "SELECT * FROM system_prompts where user_id = ?";
  const rows = await db.execute(query, [userId]).then((result) => result.rows);
  return rows as SystemPrompt[];
}

export async function getSystemPromptById(id: number) {
  const db = getDbConnection();
  const query = "SELECT * FROM system_prompts WHERE id = ?";
  const rows = await db.execute(query, [id]).then((result) => result.rows);
  return rows[0] as SystemPrompt;
}

// create type for system prompt input
export type SystemPromptInput = {
  name: string;
  content: string;
};

export async function createSystemPrompt({ name, content }: SystemPromptInput) {
  const db = getDbConnection();
  const query = "INSERT INTO system_prompts (name, content) VALUES (?, ?)";
  const result = await db.execute(query, [name, content]);
  return result.insertId;
}

export function deleteSystemPrompt(id: number) {
  const db = getDbConnection();
  const query = "DELETE FROM system_prompts WHERE id = ?";
  return db.execute(query, [id]);
}

export async function getConversationsForUser(userId) {
  const db = getDbConnection();
  const getConversationsSql = "SELECT * FROM conversations where user_id = ?";
  const rows = await db
    .execute(getConversationsSql, [userId])
    .then((result) => result.rows);
  return rows as Conversation[];
}

export async function getConversationById(id: number) {
  const db = getDbConnection();
  const query = "SELECT * FROM conversations WHERE id = ?";
  const rows = await db.execute(query, [id]).then((result) => result.rows);
  return rows[0] as Conversation;
}

// define type for Conversation
export type Conversation = {
  id: number;
  name: string;
  system_prompt_id: number;
  user_id: number;
};

export async function createConversation(conversation: Conversation) {
  const db = getDbConnection();
  const query =
    "INSERT INTO conversations (name, system_prompt_id) VALUES (?, ?)";
  const result = await db.execute(query, [
    conversation.name,
    conversation.system_prompt_id,
  ]);
  return result.insertId;
}

export async function getMessagesForConversation(conversationId: number) {
  const db = getDbConnection();
  const query = "SELECT * FROM messages WHERE conversation_id = ?";
  const rows = await db
    .execute(query, [conversationId])
    .then((result) => result.rows);
  return rows as Message[];
}

// define type for Message
export type Message = {
  type: string;
  content: string;
  conversation_id: number;
};

export async function createMessage(message: Message) {
  console.log("creating message");
  console.log(message);

  const db = getDbConnection();
  const query =
    "INSERT INTO messages (content, conversation_id, type) VALUES (?, ?, ?)";
  const result = await db.execute(query, [
    message.content,
    message.conversation_id,
    message.type,
  ]);
  return result.insertId;
}

export async function getGptMessageForConversation(conversationId: number) {
  const db = getDbConnection();

  const conversationQuery = "SELECT * FROM conversations WHERE id = ?";
  const conversation = await db
    .execute(conversationQuery, [conversationId])
    .then((result) => result.rows[0] as Conversation);

  const messagesQuery = "SELECT * FROM messages WHERE conversation_id = ?";
  const messages = await db
    .execute(messagesQuery, [conversationId])
    .then((result) => result.rows as Message[]);

  const systemPromptQuery = "SELECT * FROM system_prompts WHERE id = ?";
  const systemPrompt = await db
    .execute(systemPromptQuery, [conversation.system_prompt_id])
    .then((result) => result.rows[0] as SystemPrompt);

  const gptResponse = await getGptMessage({
    systemPrompt,
    messages,
  });

  // create new message from gpt response with type="assistant"
  const newMessage: Message = {
    type: "assistant",
    content: gptResponse,
    conversation_id: conversationId,
  };

  // insert new message into database
  const newMessageId = await createMessage(newMessage);

  return newMessage;
}

export async function getGptCompletionForConversation(
  conversationId: number,
  text: string
) {
  const db = getDbConnection();

  const messagesQuery = "SELECT * FROM messages WHERE conversation_id = ?";
  const messages = await db
    .execute(messagesQuery, [conversationId])
    .then((result) => result.rows as Message[]);

  const gptResponse = await getGptCompletion({
    messages,
    text,
  });

  return { text: gptResponse };
}
