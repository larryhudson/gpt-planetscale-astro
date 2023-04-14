import { fetchEventSource } from "@fortaine/fetch-event-source";

const form = document.querySelector("#new-message-form");
if (!form) throw new Error("No form found");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const action = formData.get("action");
  const content = formData.get("content");
  const type = formData.get("type");
  console.log({ type });
  const chatApiUrl = `/api/chat`;

  const previousMessageDataElement = document.querySelector(
    "#previous-messages-data"
  );
  const previousMessagesData = JSON.parse(
    previousMessageDataElement.dataset.messages
  );

  const messagesToSend = [
    ...previousMessagesData,
    {
      role: type,
      content,
    },
  ];

  const currentChatElement = document.querySelector("#current-chat-content");

  let abortController = new AbortController();

  // save user's message to the database

  const newUserMessageFormData = new FormData();
  newUserMessageFormData.append("type", "user");
  newUserMessageFormData.append("content", content);

  await fetch(window.location.href, {
    method: "POST",
    body: newUserMessageFormData,
  });

  //   add user's message to the messages list
  const newMessageElement = document.createElement("section");
  newMessageElement.innerHTML = `<strong>user</strong>: ${content}`;
  const messagesElement = document.querySelector("#messages");
  messagesElement.appendChild(newMessageElement);

  fetchEventSource(chatApiUrl, {
    method: "POST",
    body: JSON.stringify({
      messages: messagesToSend,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    signal: abortController.signal,
    onclose: () => {
      console.log("should be setting it to idle");
    },
    onmessage: (event) => {
      switch (event.event) {
        case "delta": {
          // This is a new word or chunk from the AI
          const message = JSON.parse(event.data);
          console.log({ message });
          if (message?.role === "assistant") {
            currentChatElement.textContent = "";
            return;
          }
          if (message.content) {
            const existingChat = currentChatElement?.textContent;
            currentChatElement.textContent = existingChat + message.content;
          }
          break;
        }
        case "open": {
          // The stream has opened and we should recieve
          // a delta event soon. This is normally almost instant.
          currentChatElement.textContent = "...";
          break;
        }
        case "done": {
          // When it's done, we add the message to the history
          // and reset the current chat
          console.log("should be setting it to done");
          // save message to the database
          const newGptMessageFormData = new FormData();

          newGptMessageFormData.append("type", "assistant");
          newGptMessageFormData.append(
            "content",
            currentChatElement.textContent
          );

          fetch(window.location.href, {
            method: "POST",
            body: newGptMessageFormData,
          }).then(() => {
            // move message to the messages list
            const newMessageElement = document.createElement("section");
            newMessageElement.innerHTML = `<strong>assistant</strong>: ${currentChatElement.textContent}`;
            speakContent(currentChatElement.textContent);
            messagesElement.appendChild(newMessageElement);
            currentChatElement.textContent = "";
          });
        }
        default:
          break;
      }
    },
  });
});
