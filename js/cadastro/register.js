import { authPost } from "./auth-api.js";

const registerForm = document.getElementById("register-form");
const errorMessage = document.getElementById("error-message");
const successMessage = document.getElementById("success-message");

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorMessage.textContent = "";
  successMessage.textContent = "";
  const submitButton = registerForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;

  try {
    const result = await authPost("register", {
      name: document.getElementById("nome").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    });
    if (result.ok) successMessage.textContent = result.message;
    else errorMessage.textContent = result.message || "Confira os dados e tente novamente.";
  } catch (error) {
    console.error("Falha no cadastro:", error);
    errorMessage.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  } finally {
    submitButton.disabled = false;
  }
});