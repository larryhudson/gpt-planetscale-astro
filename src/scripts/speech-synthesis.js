// read out the currently selected text, using the SpeechSynthesis web API
// to make into a bookmarklet, copy and paste this into https://make-bookmarklets.com/
// MDN docs: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
async function speakContent(speakButton) {
  try {
    // add a buttons container to the page
    var buttonsContainer = document.createElement("div");
    buttonsContainer.style.position = "fixed";
    buttonsContainer.style.top = "0";
    buttonsContainer.style.left = "0";
    buttonsContainer.style.zIndex = "99999";
    buttonsContainer.style.padding = "1rem";
    buttonsContainer.style.backgroundColor = "white";
    buttonsContainer.style.border = "1px solid black";

    buttonsContainer.id = "buttonsContainer";

    // add a stop button to the page
    var stopButton = document.createElement("button");
    stopButton.innerHTML = "Stop";

    // when the button is clicked, cancel the speech synthesis
    stopButton.addEventListener("click", function () {
      speechSynthesis.cancel();
      removeButtons();
    });

    // add a button to make the utterance faster
    var fasterButton = document.createElement("button");
    fasterButton.innerHTML = "Faster";

    // when the faster button is clicked, increase the rate of the utterance
    fasterButton.addEventListener("click", function () {
      speechSynthesis.cancel();
      window.utteranceRate += 0.1;
      window.utterance.rate = window.utteranceRate;
      speechSynthesis.speak(window.utterance);
    });

    // if the speech rate is not set, set it to 1
    // setting global variable so that it stays after the speech synthesis ends
    if (!window.utteranceRate) {
      window.utteranceRate = 1;
    }

    // add a button to make the utterance slower
    var slowerButton = document.createElement("button");
    slowerButton.innerHTML = "Slower";

    // when the slower button is clicked, decrease the rate of the utterance
    slowerButton.addEventListener("click", function () {
      speechSynthesis.cancel();
      window.utteranceRate -= 0.1;
      window.utterance.rate = window.utteranceRate;
      speechSynthesis.speak(window.utterance);
    });

    // add a button to pause
    var pauseButton = document.createElement("button");
    pauseButton.innerHTML = "Pause";

    // when the pause button is clicked, pause the speech synthesis
    pauseButton.addEventListener("click", function () {
      // if the speech synthesis is paused, resume it
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        pauseButton.innerHTML = "Pause";
      } else {
        speechSynthesis.pause();
        pauseButton.innerHTML = "Play";
      }
    });

    // add buttons to the page
    buttonsContainer.appendChild(slowerButton);
    buttonsContainer.appendChild(pauseButton);
    buttonsContainer.appendChild(stopButton);
    buttonsContainer.appendChild(fasterButton);
    document.body.appendChild(buttonsContainer);

    const textToRead = speakButton
      .closest("[data-message-container]")
      .querySelector("[data-content]").textContent;

    // check if speech synthesis voices are available
    if (!speechSynthesis.getVoices().length) {
      await new Promise(
        (resolve) => (speechSynthesis.onvoiceschanged = resolve)
      );
    }

    const voices = speechSynthesis.getVoices();

    // if window.chosenVoiceURI is not set, set it
    // setting global variable so that it stays after the speech synthesis ends
    if (!window.chosenVoiceURI) {
      // check if initialVoiceURI is in localStorage
      const initialVoiceURI = localStorage.getItem("initialVoiceURI");
      // if it is, check if it is a valid voice
      const matchingVoice =
        initialVoiceURI && voices.find((v) => v.voiceURI === initialVoiceURI);
      if (matchingVoice) {
        window.chosenVoiceURI = initialVoiceURI;
      } else {
        window.chosenVoiceURI = voices[0].voiceURI;
      }
    }

    // add a label for the select dropdown
    const label = document.createElement("label");
    label.innerHTML = "Voice";
    label.htmlFor = "voiceSelect";
    buttonsContainer.appendChild(label);

    // add a select dropdown to the page with the voices as options
    const select = document.createElement("select");
    select.id = "voiceSelect";

    voices.forEach((voice) => {
      const option = document.createElement("option");
      option.value = voice.voiceURI;
      option.text = voice.name;
      if (voice.voiceURI === window.chosenVoiceURI) {
        option.selected = true;
      }
      select.appendChild(option);
    });
    buttonsContainer.appendChild(select);

    // when the select dropdown is changed, change the voice of the utterance
    select.addEventListener("change", function () {
      speechSynthesis.cancel();
      const voice = voices.find((v) => v.voiceURI === select.value);
      window.chosenVoiceURI = select.value;
      window.utterance.voice = voice;
      // save in localstorage
      localStorage.setItem("initialVoiceURI", window.chosenVoiceURI);
      speechSynthesis.speak(window.utterance);
    });

    const voice = voices.find((v) => v.voiceURI === chosenVoiceURI);
    window.utterance = new SpeechSynthesisUtterance(textToRead);
    window.utterance.voice = voice;
    window.utterance.rate = window.utteranceRate;
    speechSynthesis.speak(window.utterance);

    function removeButtons() {
      buttonsContainer.parentNode.removeChild(buttonsContainer);
    }

    function removeButtonsAfterTwoSeconds() {
      // wait one second, because the synthesis might have been cancelled in order to change the voice, or the rate
      setTimeout(function () {
        // if the speech synthesis is still speaking, don't remove the buttons
        if (speechSynthesis.speaking) {
          return;
        }

        // remove the buttons from the page
        removeButtons();
      }, 1000);
    }

    // when the speech synthesis ends, remove buttons
    window.utterance.addEventListener("end", removeButtonsAfterTwoSeconds);
  } catch (error) {
    console.log("Text to speech bookmarklet did not work: ", error);
  }
}

const speakButtons = document.querySelectorAll("[data-action='speak']");
speakButtons.forEach((speakButton) => {
  speakButton.addEventListener("click", (event) => {
    speakContent(speakButton);
  });
});
