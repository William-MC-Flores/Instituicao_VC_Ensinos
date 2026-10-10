import { authPost } from "./auth-api.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

const showError = (message) => {
  errorMessage.textContent = message;
  successMessage.textContent = "";
};
const showSuccess = (message) => {
  successMessage.textContent = message;
  errorMessage.textContent = "";
};
loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showError("");
  showSuccess("");

  try {
    const result = await authPost("login", {
      email: emailInput.value.trim(),
      password: document.getElementById("password").value,
    });
    if (!result.ok) {
      showError(result.message || "Não foi possível entrar.");
      return;
    }
    showSuccess(`Login realizado. Bem-vindo, ${result.user?.name || "usuário"}!`);
    window.setTimeout(() => { window.location.href = new URL("../../index.php", import.meta.url).href; }, 500);
  } catch (error) {
    console.error("Falha no login:", error);
    showError("Não foi possível conectar ao servidor. Tente novamente.");
  }
});