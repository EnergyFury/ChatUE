/* ==========================================================
   CONFIGURAÇÃO — único ficheiro que precisas de editar
   ========================================================== */
const CONFIG = {
  // URL da API do teu colega (vazio = modo demonstração)
  apiUrl: "",                      // ex.: "https://api.exemplo.pt/chat"

  // Logos — cada local pode ter a sua imagem
  logos: {
    topbar:    "assets/logo.png",  // barra superior (fica a branco por CSS)
    hero:      "assets/icon-logo.png",  // ao lado do título
    watermark: "assets/icon-logo.png"   // marca de água no fundo do chat
  },

  // Ativa o botão "+" para enviar imagens
  enableUpload: false,

  // Línguas disponíveis (flag: chave em FLAGS, definido em app.js)
  defaultLang: "pt",
  languages: [
    { code: "pt", label: "Português", flag: "pt", htmlLang: "pt-PT" },
    { code: "en", label: "English",   flag: "gb", htmlLang: "en" }
    // Para adicionar outra língua: acrescenta aqui e em "texts" abaixo
  ],

  // Textos por língua
  texts: {
    pt: {
      pageTitle: "Assistente Virtual · Universidade de Évora",
      changeLang: "Alterar língua",
      heroTitle: "Assistente Virtual da\nUniversidade de Évora",
      cardHead: "Pergunte ao assistente",
      helloTitle: "Como posso ajudar?",
      helloText: "Pergunte sobre mudanças de curso, creditações, secretaria e mais.",
      placeholder: "Escreva a sua dúvida…",
      messageLabel: "Mensagem",
      sendLabel: "Enviar",
      attachLabel: "Anexar imagem",
      imagePrefix: "Imagem: ",
      remove: "Remover",
      note: "Respostas geradas por IA, podem conter erros.",
      footerRights: "© 2026 <strong>Universidade de Évora</strong>",
      footerSupport: "Para Apoio ou questões académicas: <strong>Balcão de atendimento online</strong>",
      footerTech: "Para Dúvidas ou questões técnicas: <strong>apoio@si.uevora.pt</strong>",
      demo: "Modo demonstração: liga a API em js/config.js para receberes respostas reais.",
      error: "Não foi possível obter resposta. Tenta novamente daqui a pouco."
    },
    en: {
      pageTitle: "Virtual Assistant · University of Évora",
      changeLang: "Change language",
      heroTitle: "Virtual Assistant of the\nUniversity of Évora",
      cardHead: "Ask the assistant",
      helloTitle: "How can I help?",
      helloText: "Ask about course changes, credit recognition, the registrar's office and more.",
      placeholder: "Write your question…",
      messageLabel: "Message",
      sendLabel: "Send",
      attachLabel: "Attach image",
      imagePrefix: "Image: ",
      remove: "Remove",
      note: "AI-generated answers may contain errors.",
      footerRights: "© 2026 <strong>University of Évora</strong>",
      footerSupport: "For support or academic questions: <strong>Online service desk</strong>",
      footerTech: "For queries or technical issues: <strong>apoio@si.uevora.pt</strong>",
      demo: "Demo mode: connect the API in js/config.js to get real answers.",
      error: "Could not get a response. Please try again in a moment."
    }
  }
};