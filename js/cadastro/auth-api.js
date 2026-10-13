const endpoint = new URL("../../php/api/auth.php", import.meta.url);

export function redirectToVerificationPending(email) {
  try {
    sessionStorage.setItem("vcensinos-pending-verification-email", email.trim());
  } catch {
    // Continua para a tela de espera mesmo se o armazenamento da sessão estiver bloqueado.
  }
  window.location.assign(new URL("../../pages/aguardando-verificacao.html", import.meta.url));
}

export async function authPost(action, data = {}) {
  const csrfResponse = await fetch(`${endpoint.href}?action=csrf`, { credentials: "same-origin", cache: "no-store" });
  const csrf = await csrfResponse.json();
  if (!csrfResponse.ok || !csrf.csrfToken) throw new Error("Não foi possível iniciar uma sessão segura.");

  const actionEndpoint = new URL(endpoint);
  actionEndpoint.searchParams.set("action", action);
  const response = await fetch(actionEndpoint, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf.csrfToken },
    body: JSON.stringify({ ...data, action }),
  });
  const result = await response.json().catch(() => ({ ok: false, message: "Resposta inválida do servidor." }));
  return { ...result, status: response.status };
}

export async function authMe() {
  const response = await fetch(`${endpoint.href}?action=me`, { credentials: "same-origin", cache: "no-store" });
  if (!response.ok) throw new Error("Não foi possível consultar a sessão.");
  return response.json();
}
