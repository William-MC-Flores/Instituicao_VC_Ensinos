import { authPost, redirectToVerificationPending } from "./auth-api.js";

const registerForm = document.getElementById("register-form");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");
const resendButton = document.getElementById("resend-verification");
const emailInput = document.getElementById("email");

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  successMessage.textContent = "";
  resendButton.hidden = true;
  const submitButton = registerForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const result = await authPost("register", {
      name: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    });
    if (result.ok) {
      redirectToVerificationPending(emailInput.value);
      return;
    }
    else {
      errorMessage.textContent = result.message || "Confira os dados e tente novamente.";
      resendButton.hidden = result.status !== 503;
    }
  } catch (error) {
    console.error("Falha no cadastro:", error);
    errorMessage.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    resendButton.hidden = false;
  } finally {
    submitButton.disabled = false;
  }
});

resendButton?.addEventListener("click", async () => {
  resendButton.disabled = true;
  errorMessage.textContent = "";
  try {
    const result = await authPost("resend_verification", { email: emailInput.value.trim() });
    if (result.ok) {
      redirectToVerificationPending(emailInput.value);
      return;
    }
    else errorMessage.textContent = result.message || "Não foi possível reenviar o link.";
  } catch (error) {
    errorMessage.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  } finally {
    resendButton.disabled = false;
  }
});
