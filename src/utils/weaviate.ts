import { extract } from "@extractus/article-extractor";
import { convert as convertHtmlToText } from "html-to-text";
import pMap from "p-map";
import { getArticleFromUrl } from "./extract-article.js";

// Should be able to give this a URL, and it will go and fetch the content of the webpage
// Then it will convert that content into text
// Then it will break up that text into chunks
// Then it will create a webpage object, and a bunch of webpage chunk objects
// Then it will link the webpage object to the webpage chunk objects

export async function fetchFromWeaviate({
  url,
  data,
  method,
}: {
  url: string;
  data?: any;
  method?: string;
}) {
  const baseUrl = `https://weaviate.larryhudson.io/v1/`;
  const fullUrl = baseUrl + url;

  const response = await fetch(fullUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  //   if the response is json, parse it
  if (
    response.headers.get("content-type")?.indexOf("application/json") !== -1
  ) {
    const json = await response.json();

    console.log(json);
    return json;
  } else {
    const text = await response.text();
    console.log(text);
    return text;
  }
}

async function breakTextIntoChunks(text, chunkSize) {
  // break text into chunks of maximum size chunkSize
  // break text on lines

  const lines = text.split("\n");
  const chunks = [];
  let currentChunk = "";
  for (const line of lines) {
    if (currentChunk.length + line.length > chunkSize) {
      chunks.push(currentChunk);
      currentChunk = "";
    }
    currentChunk += line;
  }
  chunks.push(currentChunk);
  return chunks;
}

async function createWebpageObject({ title, url, userId }) {
  const webpageObject = {
    class: "Webpage",
    properties: {
      url,
      title,
      userId,
    },
  };

  const response = await fetchFromWeaviate({
    url: "objects",
    data: webpageObject,
    method: "POST",
  });
  return response.id;
}

async function createWebpageChunk(webpageId, chunk, userId) {
  const webpageChunkObject = {
    class: "WebpageChunk",
    properties: {
      content: chunk,
      userId,
      webpage: [
        {
          beacon: `weaviate://localhost/${webpageId}`,
        },
      ],
    },
  };

  const response = await fetchFromWeaviate({
    url: "objects",
    data: webpageChunkObject,
    method: "POST",
  });
  return response.id;
}

async function createWebpageChunkObjects(webpageId, chunks, userId) {
  // TODO: do this in a batch request instead of one at a time
  return pMap(chunks, (chunk) => createWebpageChunk(webpageId, chunk, userId), {
    concurrency: 2,
  });
}

export async function addWebpageToWeaviate({ url, title, content, userId }) {
  const text = await convertHtmlToText(content);
  const chunks = await breakTextIntoChunks(text, 1000);
  const webpageId = await createWebpageObject({ title, url, userId });
  const webpageChunkIds = await createWebpageChunkObjects(
    webpageId,
    chunks,
    userId
  );

  return webpageId;
}
