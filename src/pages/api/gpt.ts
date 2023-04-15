import {
  getGptMessageForConversation,
  getGptCompletionForConversation,
} from "@src/utils/db";
import type { APIRoute } from "astro";

export const post: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get("action");

  const conversationId = formData.get("conversationId");

  let dataToReturn;

  if (action === "getGptMessageForConversation") {
    const newMessageData = await getGptMessageForConversation(conversationId);
    dataToReturn = newMessageData;
  } else if (action === "getGptCompletion") {
    const text = formData.get("text");
    const completion = await getGptCompletionForConversation(
      conversationId,
      text
    );
    dataToReturn = completion;
  }

  return new Response(JSON.stringify(dataToReturn), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
