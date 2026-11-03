/* ==========================================================
   AUTH — página de autenticação e registo (login.html)
   Depende de: config.js, api.js, common.js
   ========================================================== */

const a = {
  head:      document.getElementById("authHead"),
  loginForm: document.getElementById("loginForm"),
  regForm:   document.getElementById("registerForm"),
  loginErr:  document.getElementById("loginError"),
  regErr:    document.getElementById("registerError"),
  sideErr:   document.getElementById("sideError"),
  loginBtn:  document.getElementById("loginBtn"),
  regBtn:    document.getElementById("registerBtn")
};

let mode = "login";     // "login" | "register"

/* ---------- Vistas ---------- */
function showMode(next) {
  mode = next;
  const isLogin = next === "login";
  a.loginForm.hidden = !isLogin;
  a.regForm.hidden = isLogin;
  a.head.dataset.i18n = isLogin ? "authTitle" : "registerTitle";
  a.head.textContent = t(a.head.dataset.i18n);
  [a.loginErr, a.regErr, a.sideErr].forEach(p => { p.hidden = true; });
  (isLogin ? document.getElementById("loginUser") : document.getElementById("regName")).focus();
}

/* Chamada por common.js quando a língua muda */
function onLanguageChange() {
  a.head.textContent = t(a.head.dataset.i18n || "authTitle");
}

function showError(p, message) {
  p.textContent = message;
  p.hidden = false;
}

function messageFor(error) {
  if (error.detail) return error.detail;
  const key = "err" + (error.code || "Server");
  return t(key) || t("errServer");
}

function setBusy(btn, busy, labelKey) {
  btn.disabled = busy;
  btn.textContent = busy ? t("wait") : t(labelKey);
}

function finish(session) {
  setSession(session);
  location.replace("index.html");
}

/* ---------- Login ---------- */
a.loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  a.loginErr.hidden = true;

  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value;
  if (!username || !password) return showError(a.loginErr, t("errEmpty"));

  setBusy(a.loginBtn, true, "loginBtn");
  try {
    finish(await authRequest("login", { username, password }));
  } catch (error) {
    showError(a.loginErr, messageFor(error));
    setBusy(a.loginBtn, false, "loginBtn");
  }
});

/* ---------- Registo ---------- */
a.regForm.addEventListener("submit", async event => {
  event.preventDefault();
  a.regErr.hidden = true;

  const name = document.getElementById("regName").value.trim();
  const username = document.getElementById("regUser").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPass").value;
  const confirm = document.getElementById("regPass2").value;
  const min = CONFIG.auth.minPassword;

  if (!name || !username || !email || !password || !confirm) return showError(a.regErr, t("errEmpty"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError(a.regErr, t("errEmail"));
  if (password.length < min) return showError(a.regErr, t("errShort").replace("{n}", min));
  if (password !== confirm) return showError(a.regErr, t("errMatch"));

  setBusy(a.regBtn, true, "registerBtn");
  try {
    finish(await authRequest("register", { name, username, email, password }));
  } catch (error) {
    showError(a.regErr, messageFor(error));
    setBusy(a.regBtn, false, "registerBtn");
  }
});

/* ---------- Outros botões ---------- */
document.getElementById("toRegister").addEventListener("click", () => showMode("register"));
document.getElementById("toLogin").addEventListener("click", () => showMode("login"));

function externalLogin(url) {
  if (url) location.href = url;
  else showError(a.sideErr, t("errUnavailable"));
}
document.getElementById("govBtn").addEventListener("click", () => externalLogin(CONFIG.auth.govUrl));
document.getElementById("googleBtn").addEventListener("click", () => externalLogin(CONFIG.auth.googleUrl));
document.getElementById("forgotBtn").addEventListener("click", () => externalLogin(CONFIG.auth.forgotUrl));

/* ---------- Arranque ---------- */
initCommon();
showMode(location.hash === "#register" ? "register" : "login");
