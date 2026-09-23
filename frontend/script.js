const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyZ5byE0L2YiU_m_GhqofO-xUdoBJFoUZn1UdhlULEaZoNkZl84PFSP-YVqgDEmiTTQ/exec";

const chat = document.getElementById("chat");
const input = document.getElementById("msg");

const sendBtn =
  document.getElementById("send-btn") ||
  document.getElementById("send") ||
  [...document.querySelectorAll("button")].find(
    (button) => button.textContent.trim().toLowerCase() === "send"
  );

function addMessage(text, sender) {
  if (!chat) return;

  const message = document.createElement("div");

  message.className =
    sender === "user" ? "user-message" : "jarvis-message";

  message.textContent = text;

  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

async function askJarvis() {
  if (!input) {
    alert("Message input not found");
    return;
  }

  const message = input.value.trim();

  if (!message) {
    alert("Please enter a message");
    return;
  }

  addMessage(message, "user");

  input.value = "";

  addMessage("J.A.R.V.I.S Thinking...", "jarvis");

  if (sendBtn) {
    sendBtn.disabled = true;
  }

  try {
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
      throw new Error("Invalid backend response");
    }

    const messages = chat.querySelectorAll(".jarvis-message");
    const lastMessage = messages[messages.length - 1];

    if (!data.success) {
      throw new Error(data.error || "Backend error");
    }

    if (lastMessage) {
      lastMessage.textContent = data.reply;
    }
  } catch (error) {
    const messages = chat.querySelectorAll(".jarvis-message");
    const lastMessage = messages[messages.length - 1];

    const errorText = "J.A.R.V.I.S ERROR: " + error.message;

    if (lastMessage) {
      lastMessage.textContent = errorText;
    } else {
      addMessage(errorText, "jarvis");
    }
  } finally {
    if (sendBtn) {
      sendBtn.disabled = false;
    }
  }
}

if (sendBtn) {
  sendBtn.addEventListener("click", askJarvis);
} else {
  console.error("SEND button not found");
}

if (input) {
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      askJarvis();
    }
  });
    }
