import { ChatOpenAI } from "langchain/chat_models/openai";
import weaviate from "weaviate-ts-client";
import { WeaviateStore } from "langchain/vectorstores/weaviate";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { getMessagesForConversation } from "./db";
import { AIChatMessage, HumanChatMessage } from "langchain/schema";

export async function getGptResponseForConversation(
  conversationId: number,
  userId: number,
  userMessage: string
) {
  /* Initialize the LLM to use to answer the question */
  // should use chat API instead
  const model = new ChatOpenAI({
    openAIApiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
  });

  const weaviateClient = (weaviate as any).client({
    scheme: import.meta.env.WEAVIATE_SCHEME || "https",
    host: import.meta.env.WEAVIATE_HOST || "weaviate.larryhudson.io",
  });

  // Create a store for an existing index
  const vectorStore = await WeaviateStore.fromExistingIndex(
    new OpenAIEmbeddings({
      openAIApiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
    }),
    {
      client: weaviateClient,
      indexName: "WebpageChunk",
      textKey: "content",
    }
  );

  /* Create the chain */
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(undefined, {
      where: {
        operator: "Equal",
        path: ["userId"],
        valueInt: userId,
      },
    })
  );

  // fetch the chat history from the database
  const previousMessages = await getMessagesForConversation(conversationId);

  const messages = previousMessages.map((message) => {
    const messageType =
      message.type === "user" ? HumanChatMessage : AIChatMessage;
    return new messageType(message.content);
  });

  /* Ask it a question */
  const res = await chain.call({
    question: userMessage,
    chat_history: messages,
  });
  return res.text;
}
