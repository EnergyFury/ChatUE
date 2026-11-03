/* ==========================================================
   APP — lógica do chat (index.html)
   Depende de: config.js, api.js, common.js
   ========================================================== */

/* Sem sessão → volta ao login */
if (!getSession()) location.replace("login.html");

const el = {
  chat:       document.getElementById("chat"),
  messages:   document.getElementById("messages"),
  input:      document.getElementById("input"),
  send:       document.getElementById("send"),
  attach:     document.getElementById("attach"),
  file:       document.getElementById("file"),
  chip:       document.getElementById("chip"),
  chipName:   document.getElementById("chipName"),
  chipRemove: document.getElementById("chipRemove")
};

const history = [];
let isBusy = false;
let pendingImage = null;

/* Chamada por common.js sempre que a língua muda */
function onLanguageChange() {
  if (pendingImage) setImage(pendingImage);   // atualiza o texto da imagem anexada
}

/* ---------- Mensagens ---------- */
function addMessage(text, who) {
  document.body.classList.add("chat-started");

  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;           // textContent evita injeção de HTML

  el.messages.appendChild(div);
  scrollToBottom();
  return div;
}

function showTyping(div) {
  div.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
}

function scrollToBottom() {
  el.chat.scrollTop = el.chat.scrollHeight;
}

/* ---------- Caixa de texto ---------- */
function autoResize() {
  el.input.style.height = "auto";
  el.input.style.height = el.input.scrollHeight + "px";
}

function updateSendButton() {
  el.send.disabled = isBusy || !el.input.value.trim();
}

/* ---------- Imagem anexada ---------- */
function setImage(file) {
  pendingImage = file;
  el.chipName.textContent = t("imagePrefix") + file.name;
  el.chip.classList.add("on");
}

function clearImage() {
  pendingImage = null;
  el.file.value = "";
  el.chip.classList.remove("on");
}

/* ---------- Enviar pergunta ---------- */
async function submit() {
  const text = el.input.value.trim();
  if (!text || isBusy) return;

  isBusy = true;
  addMessage(text, "user");
  el.input.value = "";
  autoResize();
  updateSendButton();

  const botMessage = addMessage("", "bot");
  showTyping(botMessage);

  try {
    const reply = await sendToApi(text, history, pendingImage, lang);
    botMessage.textContent = reply;
    history.push(
      { role: "user", content: text },
      { role: "assistant", content: reply }
    );
  } catch (error) {
    console.error(error);
    botMessage.textContent = t("error");
    botMessage.classList.add("error");
  }

  clearImage();
  isBusy = false;
  updateSendButton();
  el.input.focus();
  scrollToBottom();
}

/* ---------- Eventos ---------- */
el.input.addEventListener("input", () => { autoResize(); updateSendButton(); });

el.input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submit();
  }
});

el.send.addEventListener("click", submit);
el.attach.addEventListener("click", () => el.file.click());
el.file.addEventListener("change", () => { if (el.file.files[0]) setImage(el.file.files[0]); });
el.chipRemove.addEventListener("click", clearImage);

/* ---------- Arranque ---------- */
el.attach.hidden = !CONFIG.enableUpload;
initCommon();
el.input.focus();
