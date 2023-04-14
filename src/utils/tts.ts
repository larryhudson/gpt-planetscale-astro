import { encode } from "html-entities";

export async function getAudioFromText(text: string) {
  console.log("getting audio for text");
  console.log(text);

  const AZURE_API_KEY = import.meta.env.PUBLIC_AZURE_API_KEY;
  const AZURE_REGION = import.meta.env.PUBLIC_AZURE_REGION;

  const voiceName = "en-AU-WilliamNeural";
  const ttsLang = "en-AU";

  const ttsUrl = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;

  return fetch(ttsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-16khz-64kbitrate-mono-mp3",
      "User-Agent": "astro",
      "Ocp-Apim-Subscription-Key": AZURE_API_KEY,
    },
    body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${ttsLang}"><voice name="${voiceName}">${encode(
      text
    )}</voice></speak>`,
  });
}
