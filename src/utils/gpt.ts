import type { Message, SystemPrompt } from "./db";

async function sendRequestToGptApi({
  messages,
  systemPrompt,
  temperature,
}: {
  messages: Message[];
  systemPrompt: SystemPrompt;
  temperature: number;
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
    temperature,
  };

  const requestUrl = `https://api.openai.com/v1/chat/completions`;

  const apiKey = import.meta.env.PUBLIC_OPENAI_API_KEY;

  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const data = await response.json();

  return data.choices[0].message.content;
}

export async function getGptMessage({
  systemPrompt,
  messages,
}: {
  systemPrompt: SystemPrompt;
  messages: Message[];
}) {
  const gptResponse = await sendRequestToGptApi({
    systemPrompt,
    messages,
    temperature: 0.5,
  });

  return gptResponse;
}

export async function getGptCompletion({ messages, text }) {
  const completionPropmt = {
    content:
      "You are given a conversation history between a user and an AI assistant. The user is in the middle of typing a message. Finish off the user's message, using context from the conversation history. Add extra details. Include the user's full message without any extra text.",
  } as SystemPrompt;

  console.log(messages);

  const fullMessage =
    `Here is a conversation history between a user and an AI assistant. The user is in the middle of typing a message:` +
    messages
      .map((message) => `${message.type}: ${message.content}`)
      .join("\n") +
    `\nUser's half finished message: ${text}\n\nFinish off the user's message, using context from the conversation history. Add extra details. Include the user's full message without any extra text. Do not include a label for the user's message, and do not wrap the message in quotes`;

  console.log({ fullMessage });

  const gptResponse = await sendRequestToGptApi({
    systemPrompt: completionPropmt,
    messages: [
      {
        type: "user",
        content: fullMessage,
      },
    ],
    temperature: 0.5,
  });

  return gptResponse;
}
