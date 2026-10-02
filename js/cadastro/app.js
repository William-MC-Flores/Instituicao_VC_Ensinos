import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { auth } from "./firebase.js";

// Obter os elementos do formulário de login e mensagens
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message"); // Para mensagens de erro
const successMessage = document.getElementById("success-message"); // Para mensagens de sucesso

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Limpa mensagens anteriores
  errorMessage.textContent = "";
  successMessage.textContent = "";

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Recupera o nome do usuário (displayName)
      const userName = user.displayName || "Usuário"; // Caso não tenha um displayName configurado
      
      console.log("Usuário logado:", userName);

      // Exibe mensagem de sucesso com o nome do usuário
      successMessage.textContent = `Bem-vindo, ${userName}! Redirecionando...`;
      successMessage.style.color = "green"; // Mensagem de sucesso em verde

      // Salva o nome do usuário no localStorage (opcional)
      localStorage.setItem("loggedInUserName", userName);

      // Redireciona para a página principal após 2 segundos
      setTimeout(() => {
        window.location.href = new URL("../../index.php", import.meta.url).href;
      }, 2000);
    })
    .catch((error) => {
      console.error("Erro ao fazer login:", error.message);

      // Exibe mensagem de erro
      if (error.code === "auth/user-not-found") {
        errorMessage.textContent = "E-mail não encontrado.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage.textContent = "Senha incorreta.";
      } else {
        errorMessage.textContent = "Erro ao tentar fazer login. Tente novamente.";
      }
      errorMessage.style.color = "#be0909"; 
    });
});
