/* ==========================================================
   API — comunicação com o backend
   ----------------------------------------------------------
   CHAT
   Pedido sem imagem (JSON):
     POST  { message, history: [{ role, content }], lang }
   Pedido com imagem (multipart/form-data):
     campos: message, history (JSON em texto), lang, image
   Cabeçalho (se houver sessão): Authorization: Bearer <token>
   Resposta esperada: { reply: "texto" }

   AUTENTICAÇÃO  (ver CONFIG.auth em config.js)
   Resposta esperada: { token, user: { name, username, email, avatar } }
   Erro: status != 2xx com { error: "mensagem" }
   ========================================================== */

/* ---------- Chat ---------- */
async function sendToApi(message, history, image = null, lang = CONFIG.defaultLang) {
  if (!CONFIG.apiUrl) {
    await new Promise(resolve => setTimeout(resolve, 900));
    return CONFIG.texts[lang].demo;
  }

  const session = getSession();
  const authHeader = session && session.token ? { Authorization: "Bearer " + session.token } : {};
  let options;

  if (image) {
    const form = new FormData();
    form.append("message", message);
    form.append("history", JSON.stringify(history));
    form.append("lang", lang);
    form.append("image", image);
    options = { method: "POST", headers: authHeader, body: form };
  } else {
    options = {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ message, history, lang })
    };
  }

  const response = await fetch(CONFIG.apiUrl, options);
  if (response.status === 401) { clearSession(); location.replace("login.html"); throw new Error("HTTP 401"); }
  if (!response.ok) throw new Error("HTTP " + response.status);

  const data = await response.json();
  return data.reply;
}

/* ---------- Autenticação ---------- */
function authError(code, detail) {
  const e = new Error(code);
  e.code = code;
  e.detail = detail || "";
  return e;
}

/* mode: "login" | "register"; data: campos do formulário */
async function authRequest(mode, data) {
  const url = mode === "login" ? CONFIG.auth.loginUrl : CONFIG.auth.registerUrl;
  return url ? authRemote(url, data) : authDemo(mode, data);
}

async function authRemote(url, data) {
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  } catch (e) {
    throw authError("Server");
  }
  let body = {};
  try { body = await response.json(); } catch (e) {}
  if (!response.ok) throw authError("Server", body.error);
  return { token: body.token || "", user: body.user || { name: data.username, username: data.username } };
}

/* Modo demonstração: contas guardadas no localStorage deste browser.
   NÃO é seguro — serve apenas para testar o fluxo sem backend. */
const USERS_KEY = "chatue_users";

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch (e) { return {}; }
}
function writeUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch (e) {}
}

async function hashPassword(text) {
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    return btoa(unescape(encodeURIComponent(text)));
  }
}

async function authDemo(mode, data) {
  await new Promise(resolve => setTimeout(resolve, 500));
  const users = readUsers();
  const key = data.username.trim().toLowerCase();
  const hash = await hashPassword(data.password);

  if (mode === "register") {
    if (users[key]) throw authError("Exists");
    users[key] = { name: data.name, username: data.username.trim(), email: data.email, hash, avatar: "" };
  } else if (!users[key] || users[key].hash !== hash) {
    throw authError("Invalid");
  }

  writeUsers(users);
  const { name, username, email, avatar } = users[key];
  return { token: "demo-" + key, user: { name, username, email, avatar } };
}
