/* ==========================================================
   APP — lógica da interface
   ========================================================== */

/* ---------- Elementos ---------- */
const el = {
  chat:       document.getElementById("chat"),
  messages:   document.getElementById("messages"),
  input:      document.getElementById("input"),
  send:       document.getElementById("send"),
  attach:     document.getElementById("attach"),
  file:       document.getElementById("file"),
  chip:       document.getElementById("chip"),
  chipName:   document.getElementById("chipName"),
  chipRemove: document.getElementById("chipRemove"),
  lang:       document.getElementById("lang"),
  langBtn:    document.getElementById("langBtn"),
  langFlag:   document.getElementById("langFlag"),
  langTip:    document.getElementById("langTip"),
  langMenu:   document.getElementById("langMenu")
};

/* ---------- Bandeiras (SVG inline, sem ficheiros extra) ---------- */
const FLAGS = {
  pt: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#d00"/><rect width="12" height="20" fill="#060"/><circle cx="12" cy="10" r="3.6" fill="#ff0"/><circle cx="12" cy="10" r="2" fill="#fff" stroke="#d00" stroke-width=".8"/></svg>',
  gb: '<svg viewBox="0 0 60 30" preserveAspectRatio="none"><rect width="60" height="30" fill="#012169"/><path d="M0 0L60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0L60 30M60 0L0 30" stroke="#c8102e" stroke-width="2"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#c8102e" stroke-width="6"/></svg>'
};

const history = [];
let isBusy = false;
let pendingImage = null;
let lang = loadLang();

function loadLang() {
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  return CONFIG.texts[saved] ? saved : CONFIG.defaultLang;
}

function t(key) {
  return CONFIG.texts[lang][key];
}

function applyLanguage() {
  const info = CONFIG.languages.find(l => l.code === lang);
  document.documentElement.lang = info.htmlLang;
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(n => { n.innerHTML = t(n.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(n => { n.placeholder = t(n.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria]").forEach(n => { n.setAttribute("aria-label", t(n.dataset.i18nAria)); });

  // Botão da língua
  el.langFlag.innerHTML = FLAGS[info.flag];
  el.langTip.textContent = t("changeLang");
  el.langBtn.setAttribute("aria-label", t("changeLang"));

  // Menu com as outras línguas
  el.langMenu.innerHTML = "";
  CONFIG.languages.filter(l => l.code !== lang).forEach(l => {
    const li = document.createElement("li");
    li.setAttribute("role", "none");
    li.innerHTML = '<button class="lang-item" type="button" role="menuitem"><span class="lang-flag">' + FLAGS[l.flag] + '</span><span></span></button>';
    const btn = li.firstChild;
    btn.lastChild.textContent = l.label;
    btn.addEventListener("click", () => setLanguage(l.code));
    el.langMenu.appendChild(li);
  });

  if (pendingImage) setImage(pendingImage);   // atualiza o texto da imagem anexada
}

function setLanguage(code) {
  lang = code;
  try { localStorage.setItem("lang", code); } catch (e) {}
  applyLanguage();
  closeLangMenu();
  el.input.focus();
}

function openLangMenu() {
  el.langMenu.hidden = false;
  el.langBtn.setAttribute("aria-expanded", "true");
}

function closeLangMenu() {
  el.langMenu.hidden = true;
  el.langBtn.setAttribute("aria-expanded", "false");
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

el.langBtn.addEventListener("click", () => { el.langMenu.hidden ? openLangMenu() : closeLangMenu(); });
document.addEventListener("click", event => { if (!el.lang.contains(event.target)) closeLangMenu(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !el.langMenu.hidden) { closeLangMenu(); el.langBtn.focus(); }
});

/* ---------- Arranque ---------- */
document.querySelectorAll("[data-logo]").forEach(img => { img.src = CONFIG.logos[img.dataset.logo]; });
el.attach.hidden = !CONFIG.enableUpload;
applyLanguage();
el.input.focus();