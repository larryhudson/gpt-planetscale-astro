function addNewMessageToPage(content, role, state) {
  // add the new message to the page
  const messagesElement = document.querySelector("#messages");
  const newMessageElement = document.createElement("section");
  newMessageElement.dataset.messageContainer = "";
  newMessageElement.dataset.speaker = role;
  newMessageElement.innerHTML = `<div data-content>${content}</div>`;
  const newSpeakButton = document.createElement("button");
  newSpeakButton.innerHTML = "Speak";
  newSpeakButton.dataset.action = "speak";
  newMessageElement.appendChild(newSpeakButton);
  newMessageElement.dataset.state = state;
  messagesElement.appendChild(newMessageElement);
  newMessageElement.scrollIntoView();

  return newMessageElement;
}

async function fetchAndHandleErrors(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  return response;
}

async function addNewUserMessage() {
  // save user's message to the database
  const apiUrl = `/api/messages`;

  const formData = new FormData(newMessageForm);
  const content = formData.get("content");

  const newMessageElement = addNewMessageToPage(content, "user", "pending");

  const apiResponse = await fetchAndHandleErrors(apiUrl, {
    method: "POST",
    body: formData,
  });

  // clear the text input
  newMessageForm.querySelector("textarea").value = "";

  newMessageElement.dataset.state = "";
  return newMessageElement;
}

async function getNewAssistantMessage() {
  // send a request to the API to get a new GPT message with the current conversation ID
  const apiUrl = `/api/gpt`;

  const gptMessageElement = addNewMessageToPage("...", "assistant", "pending");
  const conversationId = document.querySelector("#conversation-id").value;

  const formData = new FormData();

  formData.append("conversationId", conversationId);

  const apiResponse = await fetchAndHandleErrors(apiUrl, {
    method: "POST",
    body: formData,
  });

  const { newMessageId, newMessage } = await apiResponse.json();
  const content = newMessage.content;

  gptMessageElement.querySelector("[data-content]").textContent = content;
  gptMessageElement.dataset.state = "";

  return gptMessageElement;
}

const newMessageForm = document.querySelector("#new-message-form");
if (!newMessageForm) throw new Error("No form found");

newMessageForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const newUserMessage = await addNewUserMessage();
  const newAssistantMessage = await getNewAssistantMessage();
  speakContent(newAssistantMessage.querySelector("[data-content]").textContent);
});
