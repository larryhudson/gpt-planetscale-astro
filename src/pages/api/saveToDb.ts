import type { APIRoute } from "astro";
import * as db from "@src/utils/db";

export const post: APIRoute = async ({ request }) => {
  const { conversation_id, content, type } = await request.json();
  const message = await db.createMessage({
    conversation_id,
    content,
    type,
  });
  return {
    status: 200,
    body: message,
  };
};
