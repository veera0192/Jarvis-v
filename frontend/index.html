const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyb1aj0HrHbitbPMRwn1Agn22vayQ_hp7lc_6zln-bGy-qhIZGWM3LcFhhsldniaet5vA/exec";

const input = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const chat = document.getElementById("chat");

function addMessage(sender, text) {
  const box = document.createElement("div");
  box.className = "message";

  const title = document.createElement("strong");
  title.textContent = sender + ": ";

  const content = document.createElement("span");
  content.textContent = text;

  box.appendChild(title);
  box.appendChild(content);
  chat.appendChild(box);

  chat.scrollTop = chat.scrollHeight;
}

async function askJarvis(message) {
  const response = await fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      message: message
    })
  });

  if (!response.ok) {
    throw new Error("Backend error: " + response.status);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  return result.reply || "No response received.";
}

async function sendMessage() {
  const message = input.value.trim();

  if (!message) return;

  addMessage("YOU", message);
  input.value = "";
  sendBtn.disabled = true;

  addMessage("J.A.R.V.I.S", "Thinking...");

  try {
    const reply = await askJarvis(message);

    chat.lastElementChild.remove();
    addMessage("J.A.R.V.I.S", reply);

  } catch (error) {
    chat.lastElementChild.remove();
    addMessage(
      "J.A.R.V.I.S",
      "Connection error: " + error.message
    );
  }

  sendBtn.disabled = false;
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});
