/* =========================================
   JARVIS AI ASSISTANT
   Google Apps Script Backend
   ========================================= */

const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbzHQiKAndH1TzrsiWfBVPkGYuiT-O7rEsvG9LVg6za7BFqw69Ym0hixlzSEsDcTBzoxRQ/exec";

// HTML Elements
const chat = document.getElementById("chat");
const input = document.getElementById("msg");
const micBtn = document.getElementById("mic-btn");


// =========================================
// CHAT MESSAGE DISPLAY
// =========================================

function addMessage(text, sender) {
  if (!chat) return;

  const message = document.createElement("div");

  message.className =
    sender === "user" ? "user-message" : "jarvis-message";

  message.textContent = text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}


// =========================================
// GEMINI BACKEND CONNECTION
// =========================================

async function callGemini(message) {
  const response = await fetch(BACKEND_URL, {
    method: "POST",

    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },

    body: JSON.stringify({
      message: message
    })
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Backend error");
  }

  return data.reply;
}


// =========================================
// ASK JARVIS
// =========================================

async function askJarvis() {
  if (!input) return;

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  addMessage("J.A.R.V.I.S: Thinking...", "jarvis");

  try {
    const reply = await callGemini(message);

    const messages = chat.querySelectorAll(".jarvis-message");

    const lastMessage = messages[messages.length - 1];

    if (lastMessage) {
      lastMessage.textContent = "J.A.R.V.I.S: " + reply;
    }

    speak(reply);

  } catch (error) {
    console.error("JARVIS ERROR:", error);

    const messages = chat.querySelectorAll(".jarvis-message");

    const lastMessage = messages[messages.length - 1];

    if (lastMessage) {
      lastMessage.textContent =
        "J.A.R.V.I.S ERROR: " + error.message;
    }
  }
}


// =========================================
// SEND BUTTON
// =========================================

const sendBtn =
  document.getElementById("send-btn") ||
  document.getElementById("send");

if (sendBtn) {
  sendBtn.addEventListener("click", askJarvis);
}


// =========================================
// ENTER KEY
// =========================================

if (input) {
  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askJarvis();
    }
  });
}


// =========================================
// TEXT TO SPEECH
// =========================================

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const voice = new SpeechSynthesisUtterance(text);

  voice.lang = "te-IN";
  voice.rate = 0.95;
  voice.pitch = 1;
  voice.volume = 1;

  window.speechSynthesis.speak(voice);
}


// =========================================
// SPEECH RECOGNITION
// =========================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();

  recognition.lang = "te-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = function() {
    if (micBtn) {
      micBtn.textContent = "🎙️ Listening...";
    }
  };

  recognition.onresult = function(event) {
    const text =
      event.results[0][0].transcript;

    if (input) {
      input.value = text;
    }

    askJarvis();
  };

  recognition.onerror = function(event) {
    console.error("Voice error:", event.error);

    if (micBtn) {
      micBtn.textContent = "🎤";
    }
  };

  recognition.onend = function() {
    if (micBtn) {
      micBtn.textContent = "🎤";
    }
  };
}


// =========================================
// MICROPHONE BUTTON
// =========================================

if (micBtn) {
  micBtn.addEventListener("click", function() {
    if (!recognition) {
      alert("మీ బ్రౌజర్‌లో Voice Recognition అందుబాటులో లేదు.");
      return;
    }

    recognition.start();
  });
}


// =========================================
// WELCOME MESSAGE
// =========================================

window.addEventListener("load", function() {
  addMessage(
    "నమస్కారం! నేను JARVIS. మీకు ఎలా సహాయం చేయగలను?",
    "jarvis"
  );
});
