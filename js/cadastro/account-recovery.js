import { authPost } from "./auth-api.js";

const form = document.getElementById("forgot-password-form") || document.getElementById("reset-password-form");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");
const submitButton = form?.querySelector('button[type="submit"]');

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  successMessage.textContent = "";
  submitButton.disabled = true;

  try {
    let result;
    if (form.id === "forgot-password-form") {
      result = await authPost("request_password_reset", {
        email: form.elements.namedItem("email").value.trim(),
      });
    } else {
      const password = document.getElementById("password").value;
      if (password !== document.getElementById("password-confirm").value) {
        throw new Error("As senhas não coincidem.");
      }
      result = await authPost("reset_password", {
        token: new URLSearchParams(window.location.search).get("token") || "",
        password,
      });
    }

    if (!result.ok) {
      errorMessage.textContent = result.message || "Não foi possível concluir a solicitação.";
      return;
    }
    successMessage.textContent = result.message;
    if (form.id === "reset-password-form") {
      form.hidden = true;
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (error) {
    errorMessage.textContent = error.message || "Não foi possível conectar ao servidor. Tente novamente.";
  } finally {
    submitButton.disabled = false;
  }
});
