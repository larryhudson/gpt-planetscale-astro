import { c as createAstro, a as createComponent, r as renderTemplate, b as addAttribute, d as renderHead, m as maybeRenderHead, e as renderSlot, f as renderComponent } from '../astro.bed4ddd7.mjs';
import 'html-escaper';
/* empty css                           *//* empty css                           *//* empty css                          */import { connect } from '@planetscale/database';
/* empty css                          */
const $$Astro$5 = createAstro();
const $$Index$2 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Index$2;
  return renderTemplate`<html lang="en">
	<head>
		<meta charset="utf-8">
		<link rel="icon" type="image/svg+xml" href="/favicon.svg">
		<meta name="viewport" content="width=device-width">
		<meta name="generator"${addAttribute(Astro2.generator, "content")}>
		<title>Astro</title>
	${renderHead($$result)}</head>
	<body>
		<h1>Astro</h1>
	</body></html>`;
}, "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/index.astro");

const $$file$4 = "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/index.astro";
const $$url$4 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$2,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$4 = createAstro();
const $$Layout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`${maybeRenderHead($$result)}<div class="container astro-DMQSI53G">
  <header class="astro-DMQSI53G">
    <nav class="astro-DMQSI53G">
      <ul class="astro-DMQSI53G">
        <li class="astro-DMQSI53G"><a href="/system-prompts/" class="astro-DMQSI53G">System prompts</a></li>
        <li class="astro-DMQSI53G"><a href="/conversations/" class="astro-DMQSI53G">Conversations</a></li>
      </ul>
    </nav>
  </header>
  <main class="astro-DMQSI53G">
    ${renderSlot($$result, $$slots["default"])}
  </main>
</div>`;
}, "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/components/Layout.astro");

async function getGptMessage({
  systemPrompt,
  messages
}) {
  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemPrompt.content },
      ...messages.map((message) => ({
        role: message.type,
        content: message.content
      }))
    ],
    temperature: 0.5
  };
  const requestUrl = `https://api.openai.com/v1/chat/completions`;
  const apiKey = Object.assign({"BASE_URL":"\"/\"","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":undefined,"ASSETS_PREFIX":undefined}, { OPENAI_API_KEY: "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", _: ({})._ })["OPENAI_API_KEY"];
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestData)
  });
  const data = await response.json();
  return data.choices[0].message.content;
}

function getDbConnection() {
  const config = {
    host: Object.assign({"BASE_URL":"\"/\"","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":undefined,"ASSETS_PREFIX":undefined}, { DATABASE_HOST: "aws.connect.psdb.cloud", DATABASE_USERNAME: "ma307o9p5zwhj6x66gv6", DATABASE_PASSWORD: "pscale_pw_xztKjnFSyS44UDEJLP5JOnA2c45n2VoyNVyzB4fFWuj", USER: ({}).USER, _: ({})._ })["DATABASE_HOST"],
    username: Object.assign({"BASE_URL":"\"/\"","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":undefined,"ASSETS_PREFIX":undefined}, { DATABASE_HOST: "aws.connect.psdb.cloud", DATABASE_USERNAME: "ma307o9p5zwhj6x66gv6", DATABASE_PASSWORD: "pscale_pw_xztKjnFSyS44UDEJLP5JOnA2c45n2VoyNVyzB4fFWuj", USER: ({}).USER, _: ({})._ })["DATABASE_USERNAME"],
    password: Object.assign({"BASE_URL":"\"/\"","MODE":"production","DEV":false,"PROD":true,"SSR":true,"SITE":undefined,"ASSETS_PREFIX":undefined}, { DATABASE_HOST: "aws.connect.psdb.cloud", DATABASE_USERNAME: "ma307o9p5zwhj6x66gv6", DATABASE_PASSWORD: "pscale_pw_xztKjnFSyS44UDEJLP5JOnA2c45n2VoyNVyzB4fFWuj", USER: ({}).USER, _: ({})._ })["DATABASE_PASSWORD"]
  };
  return connect(config);
}
async function getAllSystemPrompts() {
  const db = getDbConnection();
  const query = "SELECT * FROM system_prompts";
  const rows = await db.execute(query).then((result) => result.rows);
  return rows;
}
async function getSystemPromptById(id) {
  const db = getDbConnection();
  const query = "SELECT * FROM system_prompts WHERE id = ?";
  const rows = await db.execute(query, [id]).then((result) => result.rows);
  return rows[0];
}
async function createSystemPrompt({ name, content }) {
  const db = getDbConnection();
  const query = "INSERT INTO system_prompts (name, content) VALUES (?, ?)";
  const result = await db.execute(query, [name, content]);
  return result.insertId;
}
async function getAllConversations() {
  const db = getDbConnection();
  const query = "SELECT * FROM conversations";
  const rows = await db.execute(query).then((result) => result.rows);
  return rows;
}
async function getConversationById(id) {
  const db = getDbConnection();
  const query = "SELECT * FROM conversations WHERE id = ?";
  const rows = await db.execute(query, [id]).then((result) => result.rows);
  return rows[0];
}
async function createConversation(conversation) {
  const db = getDbConnection();
  const query = "INSERT INTO conversations (name, system_prompt_id) VALUES (?, ?)";
  const result = await db.execute(query, [
    conversation.name,
    conversation.system_prompt_id
  ]);
  return result.insertId;
}
async function getMessagesForConversation(conversationId) {
  const db = getDbConnection();
  const query = "SELECT * FROM messages WHERE conversation_id = ?";
  const rows = await db.execute(query, [conversationId]).then((result) => result.rows);
  return rows;
}
async function createMessage(message) {
  const db = getDbConnection();
  const query = "INSERT INTO messages (content, conversation_id, type) VALUES (?, ?, ?)";
  const result = await db.execute(query, [
    message.content,
    message.conversation_id,
    message.type
  ]);
  return result.insertId;
}
async function getGptMessageForConversation(conversationId) {
  const db = getDbConnection();
  const conversationQuery = "SELECT * FROM conversations WHERE id = ?";
  const conversation = await db.execute(conversationQuery, [conversationId]).then((result) => result.rows[0]);
  const messagesQuery = "SELECT * FROM messages WHERE conversation_id = ?";
  const messages = await db.execute(messagesQuery, [conversationId]).then((result) => result.rows);
  const systemPromptQuery = "SELECT * FROM system_prompts WHERE id = ?";
  const systemPrompt = await db.execute(systemPromptQuery, [conversation.system_prompt_id]).then((result) => result.rows[0]);
  const gptResponse = await getGptMessage({
    systemPrompt,
    messages
  });
  const newMessage = {
    type: "assistant",
    content: gptResponse,
    conversation_id: conversationId
  };
  const newMessageId = await createMessage(newMessage);
  return newMessageId;
}

const $$Astro$3 = createAstro();
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Index$1;
  const systemPrompts = await getAllSystemPrompts();
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const promptData = {
      name: formData.get("name") || "Unnamed",
      content: formData.get("content") || ""
    };
    const newPromptId = await createSystemPrompt(promptData);
    return Astro2.redirect(`/system-prompts/${newPromptId}/`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "class": "astro-JLDVBG2A" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<h1 class="astro-JLDVBG2A">System prompts</h1>

  <ul class="astro-JLDVBG2A">
    ${systemPrompts.map((prompt) => renderTemplate`<li class="astro-JLDVBG2A">
          <a${addAttribute(`/system-prompts/${prompt.id}/`, "href")} class="astro-JLDVBG2A">${prompt.content}</a>
        </li>`)}
  </ul>

  <h2 class="astro-JLDVBG2A">Create new</h2>
  <form method="POST" class="astro-JLDVBG2A">
    <label for="name" class="astro-JLDVBG2A">Name</label>
    <input id="name" name="name" class="astro-JLDVBG2A">
    <label for="content" class="astro-JLDVBG2A">Prompt</label>
    <textarea id="content" name="content" class="astro-JLDVBG2A"></textarea>
    <button type="submit" class="astro-JLDVBG2A">Create</button>
  </form>
` })}`;
}, "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/system-prompts/index.astro");

const $$file$3 = "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/system-prompts/index.astro";
const $$url$3 = "/system-prompts";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index$1,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$2 = createAstro();
const $$id$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$id$1;
  const id = parseInt(Astro2.params.id);
  const systemPrompt = await getSystemPromptById(id);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<h1>System prompt</h1>

  <p>${systemPrompt.content}</p>
` })}`;
}, "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/system-prompts/[id].astro");

const $$file$2 = "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/system-prompts/[id].astro";
const $$url$2 = "/system-prompts/[id]";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id$1,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro$1 = createAstro();
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index;
  const conversations = await getAllConversations();
  const systemPrompts = await getAllSystemPrompts();
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const conversationData = {
      name: formData.get("name") || "Unnamed",
      system_prompt_id: Number(formData.get("system_prompt_id")) || ""
    };
    const newConversationId = await createConversation(conversationData);
    return Astro2.redirect(`/conversations/${newConversationId}/`);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "class": "astro-LXY4AY6Q" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<h1 class="astro-LXY4AY6Q">Conversations</h1>

  ${conversations.map((conversation) => renderTemplate`<div class="astro-LXY4AY6Q">
        <a${addAttribute(`/conversations/${conversation.id}/`, "href")} class="astro-LXY4AY6Q">${conversation.name}</a>
      </div>`)}<h2 class="astro-LXY4AY6Q">Create new</h2>
  <form method="POST" class="astro-LXY4AY6Q">
    <label for="name" class="astro-LXY4AY6Q">Name</label>
    <input id="name" name="name" class="astro-LXY4AY6Q">
    <label for="system_prompt_id" class="astro-LXY4AY6Q">Prompt</label>
    <select id="system_prompt_id" name="system_prompt_id" class="astro-LXY4AY6Q">
      ${systemPrompts.map((systemPrompt) => renderTemplate`<option${addAttribute(systemPrompt.id, "value")} class="astro-LXY4AY6Q">${systemPrompt.content}</option>`)}
    </select>
    <button type="submit" class="astro-LXY4AY6Q">Create</button>
  </form>
` })}`;
}, "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/conversations/index.astro");

const $$file$1 = "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/conversations/index.astro";
const $$url$1 = "/conversations";

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro();
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const idParam = Astro2.params.id;
  if (!idParam)
    return Astro2.redirect("/conversations");
  const id = parseInt(idParam);
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const action = formData.get("action") || "addMessage";
    if (action === "getGptMessage") {
      await getGptMessageForConversation(id);
    } else {
      const content = formData.get("content");
      const messageData = {
        type: "user",
        content,
        conversation_id: id
      };
      await createMessage(messageData);
    }
  }
  const conversation = await getConversationById(id);
  const messages = await getMessagesForConversation(id);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "class": "astro-F2BZF3C4" }, { "default": ($$result2) => renderTemplate`
  ${maybeRenderHead($$result2)}<h1 class="astro-F2BZF3C4">Conversation: ${conversation.name}</h1>

  ${messages.map((message) => renderTemplate`<section class="astro-F2BZF3C4">
        <strong class="astro-F2BZF3C4">${message.type}</strong>: ${message.content}
      </section>`)}<form method="POST" class="astro-F2BZF3C4">
    <button type="submit" name="action" value="getGptMessage" class="astro-F2BZF3C4">Get GPT response</button>
  </form>

  <h2 class="astro-F2BZF3C4">Add a message to this conversation</h2>
  <form method="POST" class="astro-F2BZF3C4">
    <label class="astro-F2BZF3C4">
      Content:
      <input type="text" name="content" class="astro-F2BZF3C4">
    </label>
    <button type="submit" class="astro-F2BZF3C4">Add</button>
  </form>
` })}`;
}, "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/conversations/[id].astro");

const $$file = "/Users/larryhudson/github.com/larryhudson/gpt-planetscale-astro/src/pages/conversations/[id].astro";
const $$url = "/conversations/[id]";

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$id,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

export { _page0 as _, _page1 as a, _page2 as b, _page3 as c, _page4 as d };
