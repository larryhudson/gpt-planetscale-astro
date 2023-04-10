import type { Message, SystemPrompt } from "./db";

export async function getGptMessage({
  systemPrompt,
  messages,
}: {
  systemPrompt: SystemPrompt;
  messages: Message[];
}) {
  console.log({ messages });

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

  const apiKey = import.meta.env.PUBLIC_OPENAI_API_KEY;

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

import { fetchEventSource } from "@fortaine/fetch-event-source";
import type { ChatCompletionOptions } from "openai";
import { getResponseStream } from "./streams";

export function getChatStream(options: any, apiKey: string): ReadableStream {
  const ctrl = new AbortController();

  const { send, stream, close } = getResponseStream();

  fetchEventSource("https://api.openai.com/v1/chat/completions", {
    onmessage: (event) => {
      const { data } = event;
      if (data === "[DONE]") {
        ctrl.abort();
        send("event: done\n\n");

        close();
      }
      const res = JSON.parse(event.data);
      send(`event: delta\ndata: ${JSON.stringify(res?.choices[0]?.delta)}\n\n`);
    },
    // deno-lint-ignore require-await
    onopen: async () => {
      send(`event: open\n\n`);
    },
    onerror: (event) => {
      console.error(event);
      send(`event: error\ndata: ${event}\n\n`);
      ctrl.abort();
    },
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    signal: ctrl.signal,
    body: JSON.stringify({
      ...options,
      model: "gpt-3.5-turbo",
      stream: true,
    }),
  });
  return stream;
}

export function sanitizeMessages(
  messages: ChatCompletionOptions["messages"],
  historyLength = 8,
  maxMessageLength = 1000
): ChatCompletionOptions["messages"] {
  return messages.slice(-historyLength).map(({ content, role }) => {
    if (role !== "assistant" && role !== "user") {
      return { role: "", content: "" };
    }
    content = content.slice(0, maxMessageLength);
    return { content, role };
  });
}
