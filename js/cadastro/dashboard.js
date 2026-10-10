import { authMe, authPost } from "./auth-api.js";

const cadastroButton = document.getElementById("cadastre-se");
const painelButton = document.getElementById("painelButton");
const logoutButton = document.getElementById("logout-button");
const pageUrl = (page) => new URL(`../../pages/${page}`, import.meta.url).href;

for (const button of [cadastroButton, painelButton, logoutButton]) {
  if (button) button.style.display = "none";
}

try {
  const session = await authMe();
  if (session.authenticated) {
    if (painelButton) painelButton.style.display = "inline-block";
    if (logoutButton) logoutButton.style.display = "inline-block";
  } else if (cadastroButton) cadastroButton.style.display = "inline-block";
} catch (error) {
  console.error("Falha ao consultar sessão:", error);
  if (cadastroButton) cadastroButton.style.display = "inline-block";
}

painelButton?.addEventListener("click", () => { window.location.href = pageUrl("painel.php"); });
cadastroButton?.addEventListener("click", () => { window.location.href = pageUrl("register.html"); });
logoutButton?.addEventListener("click", async () => {
  try {
    const result = await authPost("logout");
    if (result.ok) window.location.href = pageUrl("login.html");
  } catch (error) {
    console.error("Falha ao sair:", error);
  }
});