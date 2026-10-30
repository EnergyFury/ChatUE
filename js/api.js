/* ==========================================================
   API — comunicação com o backend de IA
   ----------------------------------------------------------
   Pedido sem imagem (JSON):
     POST  { message: "texto", history: [{ role, content }], lang: "pt" }
   Pedido com imagem (multipart/form-data):
     campos: message, history (JSON em texto), lang, image
   Resposta esperada:
     { reply: "texto" }
   ========================================================== */

async function sendToApi(message, history, image = null, lang = CONFIG.defaultLang) {
  // Sem API configurada → resposta de demonstração
  if (!CONFIG.apiUrl) {
    await new Promise(resolve => setTimeout(resolve, 900));
    return CONFIG.texts[lang].demo;
  }

  let options;

  if (image) {
    const form = new FormData();
    form.append("message", message);
    form.append("history", JSON.stringify(history));
    form.append("lang", lang);
    form.append("image", image);
    options = { method: "POST", body: form };
  } else {
    options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, lang })
    };
  }

  const response = await fetch(CONFIG.apiUrl, options);
  if (!response.ok) throw new Error("HTTP " + response.status);

  const data = await response.json();
  return data.reply;
}