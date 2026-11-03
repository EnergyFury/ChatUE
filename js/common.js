/* ==========================================================
   COMMON — partilhado por index.html e login.html
   (língua, sessão e menu do utilizador)
   ========================================================== */

const FLAGS = {
  pt: '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#d00"/><rect width="12" height="20" fill="#060"/><circle cx="12" cy="10" r="3.6" fill="#ff0"/><circle cx="12" cy="10" r="2" fill="#fff" stroke="#d00" stroke-width=".8"/></svg>',
  gb: '<svg viewBox="0 0 60 30" preserveAspectRatio="none"><rect width="60" height="30" fill="#012169"/><path d="M0 0L60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0L60 30M60 0L0 30" stroke="#c8102e" stroke-width="2"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#c8102e" stroke-width="6"/></svg>'
};

const AVATAR_DEFAULT = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8.5" r="4" fill="currentColor"/><path d="M4 21c0-4.4 3.6-7.5 8-7.5s8 3.1 8 7.5z" fill="currentColor"/></svg>';

/* ---------- Sessão ---------- */
const SESSION_KEY = "chatue_session";

function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
}
function setSession(session) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch (e) {}
}
function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
}

/* ---------- Língua ---------- */
let lang = loadLang();

function loadLang() {
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  return CONFIG.texts[saved] ? saved : CONFIG.defaultLang;
}

function t(key) {
  return CONFIG.texts[lang][key];
}

const $ = id => document.getElementById(id);
const common = {
  lang: $("lang"), langBtn: $("langBtn"), langFlag: $("langFlag"),
  langTip: $("langTip"), langMenu: $("langMenu"),
  user: $("user"), userBtn: $("userBtn"), userAvatar: $("userAvatar"), userMenu: $("userMenu")
};

function applyLanguage() {
  const info = CONFIG.languages.find(l => l.code === lang);
  document.documentElement.lang = info.htmlLang;
  document.title = t(document.body.dataset.title || "pageTitle");

  document.querySelectorAll("[data-i18n]").forEach(n => { n.textContent = t(n.dataset.i18n); });
  document.querySelectorAll("[data-i18n-html]").forEach(n => { n.innerHTML = t(n.dataset.i18nHtml); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(n => { n.placeholder = t(n.dataset.i18nPlaceholder); });
  document.querySelectorAll("[data-i18n-aria]").forEach(n => { n.setAttribute("aria-label", t(n.dataset.i18nAria)); });

  common.langFlag.innerHTML = FLAGS[info.flag];
  common.langTip.textContent = t("changeLang");
  common.langBtn.setAttribute("aria-label", t("changeLang"));

  common.langMenu.innerHTML = "";
  CONFIG.languages.filter(l => l.code !== lang).forEach(l => {
    const li = document.createElement("li");
    li.setAttribute("role", "none");
    li.innerHTML = '<button class="lang-item" type="button" role="menuitem"><span class="lang-flag">' + FLAGS[l.flag] + '</span><span></span></button>';
    const btn = li.firstChild;
    btn.lastChild.textContent = l.label;
    btn.addEventListener("click", () => setLanguage(l.code));
    common.langMenu.appendChild(li);
  });

  renderUserMenu();
  if (typeof onLanguageChange === "function") onLanguageChange();
}

function setLanguage(code) {
  lang = code;
  try { localStorage.setItem("lang", code); } catch (e) {}
  applyLanguage();
  closeMenus();
}

/* ---------- Menus (língua + utilizador) ---------- */
function menuPairs() {
  return [[common.langBtn, common.langMenu], [common.userBtn, common.userMenu]].filter(p => p[0] && p[1]);
}

function closeMenus() {
  menuPairs().forEach(([btn, menu]) => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); });
}

function toggleMenu(btn, menu) {
  const wasHidden = menu.hidden;
  closeMenus();
  if (wasHidden) { menu.hidden = false; btn.setAttribute("aria-expanded", "true"); }
}

/* ---------- Botão do utilizador ---------- */
function renderUserMenu() {
  if (!common.userBtn) return;
  const session = getSession();
  const user = (session && session.user) || {};

  common.userAvatar.innerHTML = "";
  if (user.avatar) {
    const img = document.createElement("img");
    img.src = user.avatar;
    img.alt = "";
    img.addEventListener("error", () => { common.userAvatar.innerHTML = AVATAR_DEFAULT; });
    common.userAvatar.appendChild(img);
  } else {
    common.userAvatar.innerHTML = AVATAR_DEFAULT;
  }

  common.userMenu.innerHTML = "";

  const head = document.createElement("div");
  head.className = "user-info";
  const name = document.createElement("strong");
  name.textContent = user.name || user.username || "";
  const sub = document.createElement("span");
  sub.textContent = user.username ? "@" + user.username : "";
  head.append(name, sub);
  common.userMenu.appendChild(head);

  const items = [
    { label: t("logout"), to: "login.html" },
    { label: t("switchAccount"), to: "login.html#register" }
  ];
  items.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "user-item";
    btn.type = "button";
    btn.setAttribute("role", "menuitem");
    btn.textContent = item.label;
    btn.addEventListener("click", () => { clearSession(); location.href = item.to; });
    common.userMenu.appendChild(btn);
  });
}

/* ---------- Altura do ecrã compensada pelo zoom ---------- */
function fitHeight() {
  const scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  document.documentElement.style.setProperty("--vh", (window.innerHeight / scale) + "px");
}

/* ---------- Arranque comum ---------- */
function initCommon() {
  fitHeight();
  window.addEventListener("resize", fitHeight);

  document.querySelectorAll("[data-logo]").forEach(img => { img.src = CONFIG.logos[img.dataset.logo]; });

  common.langBtn.addEventListener("click", () => toggleMenu(common.langBtn, common.langMenu));
  if (common.userBtn) common.userBtn.addEventListener("click", () => toggleMenu(common.userBtn, common.userMenu));

  document.addEventListener("click", event => {
    if (!common.lang.contains(event.target) && !(common.user && common.user.contains(event.target))) closeMenus();
  });
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape") return;
    const open = menuPairs().find(([, menu]) => !menu.hidden);
    if (open) { closeMenus(); open[0].focus(); }
  });

  applyLanguage();
}