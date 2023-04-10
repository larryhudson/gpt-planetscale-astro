import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

export async function getAudioFromText(text: string) {
  console.log("getting audio for text");
  console.log(text);

  const AZURE_API_KEY = import.meta.env.PUBLIC_AZURE_API_KEY;
  const AZURE_REGION = import.meta.env.PUBLIC_AZURE_REGION;

  // initialise microsoft cognitive speech sdk
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    AZURE_API_KEY,
    AZURE_REGION
  );
  speechConfig.speechSynthesisVoiceName = "en-AU-WilliamNeural";

  // create the synthesizer with the speech config
  const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);

  // return a promise with the audio data
  return new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        resolve(result.audioData);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
