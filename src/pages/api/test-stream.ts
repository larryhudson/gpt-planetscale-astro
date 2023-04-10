import type { APIRoute } from "astro";

// post text to be converted to speech
export const post: APIRoute = async ({ request }) => {
  // get the input stream from the request
  const reader = request.body.getReader();

  // read the stream into a string
  let text = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const decodedValue = new TextDecoder("utf-8").decode(value);
    console.log(decodedValue);
    text += decodedValue;
  }

  return new Response(text, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
