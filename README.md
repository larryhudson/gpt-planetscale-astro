## To do list

Add an autocomplete for the text area. This should send a request to the GPT API, based on the text already written in the text area, and the previous conversation history. The autocomplete should only be triggered when the user clicks the 'autocomplete' button, because the GPT API is not free.

Seamless conversation mode - as soon as you hit 'stop recording', it transcribes the audio and creates a new message, and gets a new GPT message. It reads the GPT message aloud, and as soon as it finishes playing, the recorder starts recording again. So you have a loop of talking back and forth.

### Bookmarks

Being able to save a bookmark, which can then branch off into a new conversation. Sometimes there will be interesting ideas in a conversation that you want to create a new conversation from.

To do list:

- create a new table for bookmarks. it should have a message id, a label, and a conversation id.
