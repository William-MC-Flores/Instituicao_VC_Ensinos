import { authPost } from "./auth-api.js";

const button = document.getElementById("confirm-email-button");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

button?.addEventListener("click", async () => {
  button.disabled = true;
  errorMessage.textContent = "";
  successMessage.textContent = "";
  try {
    const result = await authPost("verify_email", {
      token: new URLSearchParams(window.location.search).get("token") || "",
    });
    if (!result.ok) {
      errorMessage.textContent = result.message || "Não foi possível confirmar o e-mail.";
      button.hidden = true;
      return;
    }
    successMessage.textContent = result.message;
    button.hidden = true;
    window.history.replaceState({}, document.title, window.location.pathname);
  } catch (error) {
    errorMessage.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    button.disabled = false;
  }
});
