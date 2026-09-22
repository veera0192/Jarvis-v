const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyb1aj0HrHbitbPMRwn1Agn22vayQ_hp7lc_6zln-bGy-qhIZGWM3LcFhhsldniaet5vA/exec";

async function askJarvis(message) {
  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message
      })
    });

    const result = await response.json();

    return result.reply || result.error;

  } catch (error) {
    return "Backend connection failed.";
  }
}
