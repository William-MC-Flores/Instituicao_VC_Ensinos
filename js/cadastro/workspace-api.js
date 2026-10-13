const endpoint = new URL("../../php/api/workspace.php", import.meta.url);
const authEndpoint = new URL("../../php/api/auth.php", import.meta.url);

export async function workspaceGet() {
  const response = await fetch(`${endpoint.href}?action=data`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    throw new Error(result?.message || "Não foi possível carregar seu espaço.");
  }
  return result.data;
}

export async function workspaceNotificationsGet() {
  const response = await fetch(`${endpoint.href}?action=notifications`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    throw new Error(result?.message || "Não foi possível carregar as notificações.");
  }
  return result.notifications || [];
}

export async function workspacePost(action, data = {}) {
  const csrfResponse = await fetch(`${authEndpoint.href}?action=csrf`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  const csrf = await csrfResponse.json().catch(() => null);
  if (!csrfResponse.ok || !csrf?.csrfToken) {
    throw new Error("Não foi possível iniciar uma sessão segura.");
  }

  const requestUrl = new URL(endpoint);
  requestUrl.searchParams.set("action", action);
  const response = await fetch(requestUrl, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrf.csrfToken,
    },
    body: JSON.stringify({ ...data, action }),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    throw new Error(result?.message || "Não foi possível concluir a solicitação.");
  }
  return result;
}

export async function workspaceUpload(action, formData) {
  const csrfResponse = await fetch(`${authEndpoint.href}?action=csrf`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  const csrf = await csrfResponse.json().catch(() => null);
  if (!csrfResponse.ok || !csrf?.csrfToken) {
    throw new Error("Não foi possível iniciar uma sessão segura.");
  }

  const requestUrl = new URL(endpoint);
  requestUrl.searchParams.set("action", action);
  formData.set("action", action);
  const response = await fetch(requestUrl, {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "X-CSRF-Token": csrf.csrfToken },
    body: formData,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) {
    throw new Error(result?.message || "Não foi possível concluir a solicitação.");
  }
  return result;
}
