import type { APIRoute } from "astro";
import * as db from "@src/utils/db";
import { getAudioFromText } from "@src/utils/tts";

// post text to be converted to speech
export const post: APIRoute = async ({ request }) => {
  // get the input stream from the request
  const { text } = await request.json();

  // return a stream of the audio
  const audioResponse = await getAudioFromText(text);

  return audioResponse;
};
