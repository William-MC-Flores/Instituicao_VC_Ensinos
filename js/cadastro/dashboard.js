import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { auth } from "./firebase.js";

// Selecionar os elementos do DOM
const cadastroButton = document.getElementById("cadastre-se");
const painelButton = document.getElementById("painelButton");
const logoutButton = document.getElementById("logout-button");
const pageUrl = (page) => new URL(`../../pages/${page}`, import.meta.url).href;

// Inicializar os botões com estado padrão (não visíveis)
if (cadastroButton) cadastroButton.style.display = "none";
if (painelButton) painelButton.style.display = "none";
if (logoutButton) logoutButton.style.display = "none";

// Verificar se o usuário está autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuário está logado
    if (painelButton) painelButton.style.display = "inline-block";
    if (logoutButton) logoutButton.style.display = "inline-block";
    if (cadastroButton) cadastroButton.style.display = "none";
  } else {
    // Usuário não está logado
    if (painelButton) painelButton.style.display = "none";
    if (logoutButton) logoutButton.style.display = "none";
    if (cadastroButton) cadastroButton.style.display = "inline-block";
  }
});

// Evento de clique no botão "Painel" (quando o usuário está logado)
painelButton?.addEventListener("click", () => {
  window.location.href = pageUrl("painel.html");
});

// Evento de clique no botão "Logout"
logoutButton?.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Usuário deslogado.");
      window.location.href = pageUrl("login.html");
    })
    .catch((error) => {
      console.error("Erro ao fazer logout:", error.message);
    });
});

// Evento de clique no botão "Cadastre-se"
cadastroButton?.addEventListener("click", () => {
  window.location.href = pageUrl("register.html");
});
