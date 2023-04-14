import { getChatStream, sanitizeMessages } from "@src/utils/gpt";
import type { APIRoute } from "astro";

const OPENAI_API_KEY = import.meta.env.PUBLIC_OPENAI_API_KEY;

export const post: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    // get posted mp3 file from form data
    const file = formData.get("file");
    const fileExt = formData.get("fileExt");

    const apiFormData = new FormData();
    apiFormData.append("file", file, `file.${fileExt}`);
    apiFormData.append("model", "whisper-1");

    console.log(apiFormData.get("file"));

    console.log("file", file);
    console.log("fileExt", fileExt);

    // send to transcribe api

    const apiUrl = "https://api.openai.com/v1/audio/transcriptions";

    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: apiFormData,
    });

    const apiData = await apiResponse.json();

    return new Response(JSON.stringify(apiData), {
      headers: {
        "Content-Type": "application/json",
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
