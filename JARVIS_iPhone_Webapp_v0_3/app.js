const $ = (id) => document.getElementById(id);
const messages = $("messages");
let language = localStorage.getItem("jarvis-language") || "nl-NL";
let voiceChoice = localStorage.getItem("jarvis-voice") || "default";
let speechEnabled = localStorage.getItem("jarvis-speech") !== "false";
let recognition = null;
let listening = false;

$("languageSelect").value = language;
$("voiceSelect").value = voiceChoice;
$("speechToggle").checked = speechEnabled;
$("langMetric").textContent = language === "nl-NL" ? "NL / EN" : "EN / NL";

function say(text) {
  if (!speechEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  const voices = window.speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith(language.slice(0,2).toLowerCase()));
  if (voiceChoice === "male") utterance.voice = voices.find(v => /male|man/i.test(v.name)) || voices[0];
  else if (voiceChoice === "female") utterance.voice = voices.find(v => /female|woman|vrouw/i.test(v.name)) || voices[0];
  else utterance.voice = voices[0] || null;
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

function addMessage(text, who="jarvis", speak=true) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${who}`;
  const label = document.createElement("span");
  label.className = "bubble-label";
  label.textContent = who === "jarvis" ? "J.A.R.V.I.S." : "YOU";
  const body = document.createElement("span");
  body.textContent = text;
  bubble.append(label, body);
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  if (who === "jarvis" && speak) say(text);
}

function responseFor(raw) {
  const q = raw.toLowerCase();
  const nl = language === "nl-NL";
  if (/(hoe laat|what time|time is it)/.test(q)) {
    return nl ? `Het is momenteel ${new Intl.DateTimeFormat("nl-NL",{hour:"2-digit",minute:"2-digit"}).format(new Date())}.` : `The current time is ${new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit"}).format(new Date())}.`;
  }
  if (/(welke datum|datum is|what date|today's date|date is it)/.test(q)) {
    return nl ? `Vandaag is het ${new Intl.DateTimeFormat("nl-NL",{dateStyle:"full"}).format(new Date())}.` : `Today is ${new Intl.DateTimeFormat("en-US",{dateStyle:"full"}).format(new Date())}.`;
  }
  if (/(wie ben je|who are you)/.test(q)) {
    return nl ? "Ik ben J.A.R.V.I.S., uw persoonlijke digitale assistent. Beleefd, efficiënt en altijd bereid om mee te denken. Al moet ik erbij vermelden dat mijn huidige kern nog in de prototypefase verkeert." : "I am J.A.R.V.I.S., your personal digital assistant. Courteous, efficient, and always ready to assist. I should mention that my current core is still in prototype mode.";
  }
  if (/(grap|joke)/.test(q)) {
    return nl ? "Waarom nam de computer een jas mee? Omdat hij naar de cloud ging. Ik geef toe: mijn humor is nog in bèta." : "Why did the computer bring a jacket? It was going to the cloud. I admit, my humour is still in beta.";
  }
  if (/(help|hulp|wat kan je|what can you do)/.test(q)) {
    return nl ? "Ik kan in deze gratis basisversie de tijd en datum geven, eenvoudige vragen beantwoorden, grappen vertellen en antwoorden uitspreken. Voor open vragen en echt redeneren moet een AI-backend worden gekoppeld." : "In this free starter version I can tell the time and date, answer a few simple prompts, tell jokes, and speak replies aloud. Open-ended reasoning requires an AI backend.";
  }
  if (/(hey jarvis|hé jarvis|hallo|hello)/.test(q)) {
    return nl ? "Tot uw dienst. Waarmee kan ik u helpen?" : "At your service. How may I help?";
  }
  return nl
    ? "Ik heb uw opdracht ontvangen. Mijn gratis basisversie kan nog niet zelfstandig algemene vragen beantwoorden. Daarvoor is een online AI-dienst met een beveiligde serververbinding nodig. U kunt alvast vragen naar de tijd, datum of mijn mogelijkheden."
    : "Your request has been received. My free starter build cannot yet answer general questions independently. That requires an online AI service through a secure server connection. You can ask me for the time, date, or available capabilities.";
}

function handleCommand(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, "user", false);
  $("coreState").textContent = "ANALYSING";
  $("systemStatus").textContent = "PROCESSING";
  setTimeout(() => {
    addMessage(responseFor(clean), "jarvis");
    $("coreState").textContent = "READY";
    $("systemStatus").textContent = "STANDBY";
  }, 350);
}

$("chatForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("messageInput");
  handleCommand(input.value);
  input.value = "";
});
document.querySelectorAll("[data-command]").forEach(btn => btn.addEventListener("click", () => {
  handleCommand(btn.dataset.command);
  document.querySelector('[data-view="chat"]').click();
}));

document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".tab,.view").forEach(el => el.classList.remove("active"));
  btn.classList.add("active");
  $(btn.dataset.view).classList.add("active");
}));

function setListening(on) {
  listening = on;
  $("micLabel").textContent = on ? "STOP LISTENING" : "TAP TO SPEAK";
  $("voiceMetric").textContent = on ? "LISTENING" : "READY";
  $("coreState").textContent = on ? "LISTENING" : "READY";
  $("systemStatus").textContent = on ? "VOICE ACTIVE" : "STANDBY";
}
function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    $("voiceHint").textContent = "Spraakherkenning wordt niet ondersteund in deze browser. Gebruik de chat of dicteer via het toetsenbord van je iPhone.";
    return;
  }
  if (listening && recognition) { recognition.stop(); return; }
  recognition = new SR();
  recognition.lang = language;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => { setListening(true); $("voiceHint").textContent = "Ik luister. Begin met: Hey JARVIS…"; };
  recognition.onresult = event => {
    let text = event.results[0][0].transcript.trim();
    text = text.replace(/^hey\s+j\.?a\.?r\.?v\.?i\.?s[,. ]*/i, "").replace(/^hé\s+jarvis[,. ]*/i, "");
    handleCommand(text || (language === "nl-NL" ? "Hallo JARVIS" : "Hello JARVIS"));
    document.querySelector('[data-view="chat"]').click();
  };
  recognition.onerror = event => { $("voiceHint").textContent = `Spraakfout: ${event.error}. Je kunt ook typen.`; };
  recognition.onend = () => setListening(false);
  try { recognition.start(); } catch { setListening(false); }
}
$("micButton").addEventListener("click", startVoice);

$("languageSelect").addEventListener("change", e => {
  language = e.target.value; localStorage.setItem("jarvis-language", language);
  $("langMetric").textContent = language === "nl-NL" ? "NL / EN" : "EN / NL";
});
$("voiceSelect").addEventListener("change", e => { voiceChoice=e.target.value; localStorage.setItem("jarvis-voice",voiceChoice); });
$("speechToggle").addEventListener("change", e => { speechEnabled=e.target.checked; localStorage.setItem("jarvis-speech",String(speechEnabled)); });
$("clearChat").addEventListener("click", () => {
  messages.replaceChildren();
  addMessage(language === "nl-NL" ? "Gesprek gewist. Ik sta weer tot uw dienst." : "Conversation cleared. I am at your service.", "jarvis");
});

addMessage("Goedendag. J.A.R.V.I.S. staat tot uw dienst. Tik op de microfoon om te spreken, of open Chat om te typen.", "jarvis", false);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(console.warn));
}
