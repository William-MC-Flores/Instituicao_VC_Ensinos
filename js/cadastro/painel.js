import { authPost } from "./auth-api.js";

const logoutButton = document.getElementById("logout-button");
logoutButton?.addEventListener("click", async () => {
  try {
    const result = await authPost("logout");
    if (result.ok) window.location.href = "login.html";
  } catch (error) {
    console.error("Falha ao encerrar sessão:", error);
  }
});