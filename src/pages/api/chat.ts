import { getChatStream, sanitizeMessages } from "@src/utils/gpt";
import type { APIRoute } from "astro";

const OPENAI_API_KEY = import.meta.env.PUBLIC_OPENAI_API_KEY;

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // This only trims the size of the messages, to avoid abuse of the API.
    // You should do any extra validation yourself.
    const messages = sanitizeMessages(data?.messages ?? []);
    const stream = getChatStream({ messages }, OPENAI_API_KEY);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(e.message, {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
};
