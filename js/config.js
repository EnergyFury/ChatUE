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

  // Autenticação — URLs do backend (vazio = modo demonstração, contas guardadas só neste browser)
  // loginUrl:    POST { username, password }                  -> { token, user: { name, username, email, avatar } }
  // registerUrl: POST { name, username, email, password }     -> { token, user: { ... } }
  // Em caso de erro, responder com status != 2xx e { error: "mensagem" }
  auth: {
    loginUrl: "",
    registerUrl: "",
    govUrl: "",          // redirecionamento Autenticação.gov / Chave Móvel Digital
    googleUrl: "",       // redirecionamento "Autenticar com Google"
    forgotUrl: "",       // página "Esqueceu a palavra-passe?"
    minPassword: 6
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
      pageTitle: "ChatUE · Universidade de Évora",
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
      error: "Não foi possível obter resposta. Tenta novamente daqui a pouco.",

      /* Autenticação */
      loginPageTitle: "Autenticação · SIIUE",
      loginHeroTitle: "Sistema de Informação Integrado da\nUniversidade de Évora",
      authTitle: "Autenticação",
      registerTitle: "Registo",
      usernamePh: "Nome de utilizador",
      passwordPh: "Palavra-passe",
      namePh: "Nome completo",
      emailPh: "E-mail",
      confirmPh: "Confirmar palavra-passe",
      loginBtn: "Autenticar",
      registerBtn: "Registar",
      forgot: "Esqueceu a palavra-passe?",
      registerLink: "Registe-se!",
      backToLogin: "Já tem conta? Autenticar",
      govText: "Autenticação com Chave Móvel Digital",
      or: "ou",
      googleBtn: "Autenticar com Google",
      wait: "A aguardar…",
      errEmpty: "Preencha todos os campos.",
      errInvalid: "Nome de utilizador ou palavra-passe incorretos.",
      errExists: "Esse nome de utilizador já existe.",
      errEmail: "Indique um e-mail válido.",
      errShort: "A palavra-passe deve ter pelo menos {n} caracteres.",
      errMatch: "As palavras-passe não coincidem.",
      errServer: "Não foi possível contactar o servidor. Tenta novamente.",
      errUnavailable: "Este método ainda não está disponível.",
      registered: "Conta criada com sucesso.",
      userMenuLabel: "Conta do utilizador",
      logout: "Terminar sessão",
      switchAccount: "Registar / iniciar sessão com outra conta"
    },
    en: {
      pageTitle: "ChatUE · University of Évora",
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
      error: "Could not get a response. Please try again in a moment.",

      /* Authentication */
      loginPageTitle: "Sign in · SIIUE",
      loginHeroTitle: "Integrated Information System of the\nUniversity of Évora",
      authTitle: "Sign in",
      registerTitle: "Register",
      usernamePh: "Username",
      passwordPh: "Password",
      namePh: "Full name",
      emailPh: "E-mail",
      confirmPh: "Confirm password",
      loginBtn: "Sign in",
      registerBtn: "Register",
      forgot: "Forgot your password?",
      registerLink: "Register!",
      backToLogin: "Already have an account? Sign in",
      govText: "Sign in with Chave Móvel Digital",
      or: "or",
      googleBtn: "Sign in with Google",
      wait: "Please wait…",
      errEmpty: "Fill in all fields.",
      errInvalid: "Wrong username or password.",
      errExists: "That username already exists.",
      errEmail: "Enter a valid e-mail.",
      errShort: "The password must have at least {n} characters.",
      errMatch: "The passwords do not match.",
      errServer: "Could not reach the server. Please try again.",
      errUnavailable: "This method is not available yet.",
      registered: "Account created successfully.",
      userMenuLabel: "User account",
      logout: "Sign out",
      switchAccount: "Register / sign in with another account"
    }
  }
};