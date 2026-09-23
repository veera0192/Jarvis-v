const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyZ5byE0L2YiU_m_GhqofO-xUdoBJFoUZn1UdhlULEaZoNkZl84PFSP-YVqgDEmiTTQ/exec";

// HTML Elements
const chat = document.getElementById("chat");
const input = document.getElementById("msg");
const micBtn = document.getElementById("mic-btn");

// Add message to chat
function addMessage(text, sender) {
  if (!chat) return;

  const message = document.createElement("div");

  message.className =
    sender === "user" ? "user-message" : "jarvis-message";

  message.textContent = text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

// Call JARVIS Backend
async function callJarvis(message) {
  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      message: message
    })
  });

  const responseText = await response.text();

  let data;

  try {
    data = JSON.parse(responseText);
  } catch (error) {
    throw new Error("Backend returned an invalid response.");
  }

  if (!data.success) {
    throw new Error(data.error || "Backend error.");
  }

  return data.reply;
}

// Ask JARVIS
async function askJarvis() {
  if (!input) return;

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  input.value = "";

  addMessage("J.A.R.V.I.S: Thinking...", "jarvis");

  try {
    const reply = await callJarvis(message);

    const messages = chat.querySelectorAll(".jarvis-message");
    const lastMessage = messages[messages.length - 1];

    if (lastMessage) {
      lastMessage.textContent = reply;
    }

  } catch (error) {
    const messages = chat.querySelectorAll(".jarvis-message");
    const lastMessage = messages[messages.length - 1];

    const errorMessage =
      "J.A.R.V.I.S ERROR: " + error.message;

    if (lastMessage) {
      lastMessage.textContent = errorMessage;
    } else {
      addMessage(errorMessage, "jarvis");
    }

    console.error("JARVIS Error:", error);
  }
}

// Enter key support
if (input) {
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      askJarvis();
    }
  });
}

// Voice input
if (micBtn && "webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();

  recognition.lang = "te-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  micBtn.addEventListener("click", function () {
    recognition.start();
  });

  recognition.onresult = function (event) {
    const voiceText = event.results[0][0].transcript;

    if (input) {
      input.value = voiceText;
      askJarvis();
    }
  };

  recognition.onerror = function () {
    addMessage("Voice input failed. Please try again.", "jarvis");
  };
}
