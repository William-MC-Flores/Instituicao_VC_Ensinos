import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { auth } from "./firebase.js";

// Função de cadastro
const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const nome = document.getElementById("nome").value; // Capturar o nome
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Cadastro bem-sucedido
      const user = userCredential.user;

      // Atualizar o perfil do usuário com o nome
      updateProfile(user, {
        displayName: nome
      }).then(() => {
        console.log("Nome de usuário atualizado:", nome);
        // Redirecionar para a página de login
        window.location.href = "../pages/login.html";
      }).catch((error) => {
        console.error("Erro ao atualizar o nome de usuário:", error.message);
      });
    })
    .catch((error) => {
      console.error("Erro ao cadastrar:", error.message);
    });
});
