let seenTimestamps = new Set();

function renderEvent(event) {
  const wrapper = document.createElement("div");
  wrapper.className = "event";

  const msg = event.message?.toLowerCase() || "";
  let eventType = "";

  if (msg.includes("pushed")) {
    eventType = "push";
  } else if (msg.includes("pull request")) {
    eventType = "pull_request";
  } else if (msg.includes("merged")) {
    eventType = "merge";
  }

  if (!eventType) return null; // Ignore unknown events

  wrapper.classList.add(eventType);

  // Create icon element
  const icon = document.createElement("img");
  icon.className = "event-icon";
  icon.alt = `${eventType} icon`;
  icon.src = `icons/${eventType}.png`;

  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = "event-message";
  messageDiv.innerHTML = event.message; // ✅ updated to allow <b> tags

  // Append icon and message to wrapper
  wrapper.appendChild(icon);
  wrapper.appendChild(messageDiv);

  return wrapper;
}

function fetchEvents() {
  fetch("https://webhook-repo-kwo9.onrender.com/webhook/events")
    .then(res => res.json())
    .then(data => {
      const log = document.getElementById("log");

      data.forEach(event => {
        if (!event.message || event.message === "null") return;

        const key = event.timestamp + event.message;
        if (seenTimestamps.has(key)) return;

        seenTimestamps.add(key);
        const eventElement = renderEvent(event);
        if (eventElement) log.appendChild(eventElement);
      });
    })
    .catch(err => {
      console.error("Failed to fetch events:", err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchEvents();
  setInterval(fetchEvents, 15000);
});
