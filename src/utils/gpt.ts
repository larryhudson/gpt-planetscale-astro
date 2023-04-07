import type { Message, SystemPrompt } from "./db";

export async function getGptMessage({
  systemPrompt,
  messages,
}: {
  systemPrompt: SystemPrompt;
  messages: Message[];
}) {
  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt.content },
      ...messages.map((message) => ({
        role: message.type,
        content: message.content,
      })),
    ],
    temperature: 0.5,
  };

  const requestUrl = `https://api.openai.com/v1/chat/completions`;

  const apiKey = import.meta.env["OPENAI_API_KEY"];

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  return data.choices[0].message.content;
}
