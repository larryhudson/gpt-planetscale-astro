import { getGptMessageForConversation } from "@src/utils/db";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const conversationId = formData.get("conversationId");

  const newMessageData = await getGptMessageForConversation(conversationId);

  return new Response(JSON.stringify(newMessageData), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
