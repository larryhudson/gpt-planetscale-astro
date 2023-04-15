import {
  Message,
  createMessage,
  getGptMessageForConversation,
} from "@src/utils/db";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const { conversationId, content, type } = Object.fromEntries(
    formData.entries()
  );

  const newMessageData = {
    content,
    conversation_id: conversationId,
    type,
  };

  const newMessageId = await createMessage(newMessageData);

  return new Response(JSON.stringify({ newMessageId }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
