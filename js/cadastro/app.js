import { authPost, redirectToVerificationPending } from "./auth-api.js";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");
const resendButton = document.getElementById("resend-verification");

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
  resendButton.hidden = true;

  try {
    const result = await authPost("login", {
      email: emailInput.value.trim(),
      password: document.getElementById("password").value,
    });
    if (!result.ok) {
      showError(result.message || "Não foi possível entrar.");
      resendButton.hidden = result.code !== "email_not_verified";
      return;
    }
    showSuccess(`Login realizado. Bem-vindo, ${result.user?.name || "usuário"}!`);
    window.setTimeout(() => { window.location.href = new URL("../../index.php", import.meta.url).href; }, 500);
  } catch (error) {
    console.error("Falha no login:", error);
    showError("Não foi possível conectar ao servidor. Tente novamente.");
  }
});

resendButton?.addEventListener("click", async () => {
  resendButton.disabled = true;
  showError("");
  try {
    const result = await authPost("resend_verification", { email: emailInput.value.trim() });
    if (result.ok) {
      redirectToVerificationPending(emailInput.value);
      return;
    }
    else showError(result.message || "Não foi possível reenviar o link.");
  } catch (error) {
    showError("Não foi possível conectar ao servidor. Tente novamente.");
  } finally {
    resendButton.disabled = false;
  }
});
