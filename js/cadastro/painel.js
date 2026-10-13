import { authPost } from "./auth-api.js";
import { workspaceGet, workspaceNotificationsGet, workspacePost, workspaceUpload } from "./workspace-api.js";

const workspace = document.getElementById("profile-workspace");
const message = document.getElementById("workspace-message");
const logoutButton = document.getElementById("logout-button");
const notificationToggle = workspace.querySelector("[data-notifications-toggle]");
const notificationList = workspace.querySelector("[data-notification-list]");
const notificationCount = workspace.querySelector("[data-notification-count]");
const notificationsReadButton = workspace.querySelector("[data-notifications-read]");
const roleNames = { student: "Aluno", collaborator: "Colaborador / professor", admin: "Administrador" };
const planNames = { free: "Free", standard: "Standard", pro: "Pro" };

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

const setMessage = (text, isError = false) => {
  message.textContent = text;
  message.classList.toggle("is-error", isError);
  message.classList.toggle("is-success", !isError && text !== "");
};

const fillSelect = (select, items, getValue, getLabel, placeholder) => {
  select.replaceChildren();
  const firstOption = document.createElement("option");
  firstOption.value = "";
  firstOption.textContent = placeholder;
  select.append(firstOption);
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = getValue(item);
    option.textContent = getLabel(item);
    select.append(option);
  });
};

const emptyState = (text) => `<p class="workspace-empty">${escapeHtml(text)}</p>`;

const renderNotifications = (notifications) => {
  const unreadCount = notifications.filter((notification) => !notification.read_at).length;
  notificationCount.textContent = unreadCount > 99 ? "99+" : String(unreadCount);
  notificationCount.hidden = unreadCount === 0;
  notificationsReadButton.hidden = unreadCount === 0;
  notificationList.innerHTML = notifications.length
    ? notifications.map((notification) => {
      const date = new Date(`${String(notification.created_at).replace(" ", "T")}Z`);
      const dateLabel = Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short", timeStyle: "short",
      }).format(date);
      const safeTarget = notification.target_url === "painel.php" ? "painel.php" : "";
      const content = `<span class="notification-item__type">${escapeHtml({
        submission_pending: "Revisão de conteúdo",
        submission_reviewed: "Resultado da revisão",
        new_student: "Nova inscrição",
      }[notification.type] || "Atualização")}</span>
        <strong>${escapeHtml(notification.title)}</strong><span>${escapeHtml(notification.message)}</span>
        <time>${escapeHtml(dateLabel)}</time>`;
      return safeTarget
        ? `<a class="notification-item${notification.read_at ? "" : " is-unread"}" href="${safeTarget}">${content}</a>`
        : `<article class="notification-item${notification.read_at ? "" : " is-unread"}">${content}</article>`;
    }).join("")
    : emptyState("Você ainda não tem notificações.");
};

const loadNotifications = async () => {
  try {
    renderNotifications(await workspaceNotificationsGet());
  } catch (error) {
    console.warn("Falha ao atualizar notificações:", error.message);
  }
};

const renderProfile = (user) => {
  const form = workspace.querySelector("[data-profile-form]");
  const advanced = form.querySelector("[data-profile-advanced]");
  const canCustomize = user.role !== "student" || ["standard", "pro"].includes(user.plan);
  workspace.querySelector("#user-name").textContent = user.name || "";
  form.elements.namedItem("name").value = user.name || "";
  ["bio", "pronouns", "website_url", "instagram_url", "linkedin_url", "profile_visibility"].forEach((field) => {
    form.elements.namedItem(field).value = user[field] || (field === "profile_visibility" ? "private" : "");
  });
  advanced.disabled = !canCustomize;
  form.querySelector("[data-profile-access-note]").textContent = canCustomize
    ? user.role === "student"
      ? `Recursos liberados no plano ${planNames[user.plan] || user.plan}.`
      : "A equipe tem acesso à personalização avançada."
    : "Biografia, capa, links, pronomes e visibilidade avançada estarão disponíveis nos planos Standard e Pro.";

  const avatar = workspace.querySelector("[data-profile-avatar]");
  const avatarPlaceholder = workspace.querySelector("[data-avatar-placeholder]");
  const avatarRemove = form.querySelector("[data-avatar-remove]");
  if (user.avatar_path) {
    avatar.src = `perfil-imagem.php?id=${Number(user.id)}&tipo=avatar`;
    avatar.hidden = false;
    avatarPlaceholder.hidden = true;
    avatarRemove.hidden = false;
  } else {
    avatar.removeAttribute("src");
    avatar.hidden = true;
    avatarPlaceholder.hidden = false;
    avatarRemove.hidden = true;
  }
  const coverRemove = form.querySelector("[data-cover-remove]");
  coverRemove.hidden = !user.cover_path || !canCustomize;
  workspace.querySelector("[data-profile-preview]").href = `perfil.php?id=${Number(user.id)}`;
};

const profileForm = workspace.querySelector("[data-profile-form]");
profileForm.elements.namedItem("profile_avatar").addEventListener("change", () => {
  profileForm.elements.namedItem("remove_avatar").checked = false;
});
profileForm.elements.namedItem("profile_cover").addEventListener("change", () => {
  profileForm.elements.namedItem("remove_cover").checked = false;
});

const renderClassesForStudent = (classes, plan) => {
  const container = workspace.querySelector("[data-open-classes]");
  if (classes.length === 0) {
    container.innerHTML = emptyState("Ainda não há turmas abertas. Volte em breve para conferir novas oportunidades.");
    return;
  }
  const canJoinClasses = ["standard", "pro"].includes(plan);
  container.innerHTML = classes.map((courseClass) => `
    <article class="workspace-item">
      <div><span class="workspace-item__eyebrow">${escapeHtml(courseClass.discipline_name)}</span>
        <h3>${escapeHtml(courseClass.name)}</h3>
        <p>${escapeHtml(courseClass.description || "Turma da comunidade VC Ensinos.")}</p>
        <span class="workspace-item__meta">${Number(courseClass.student_count)} participantes</span></div>
      ${Boolean(Number(courseClass.enrolled))
        ? '<span class="state-chip state-chip--success"><i class="fa-solid fa-check" aria-hidden="true"></i>Inscrito</span>'
        : canJoinClasses
          ? `<button type="button" class="workspace-action" data-action="join-class" data-class-id="${Number(courseClass.id)}">Participar</button>`
          : '<span class="state-chip">Inscrição requer Standard ou Pro</span>'}
    </article>
  `).join("");
};

const renderMaterials = (submissions, target) => {
  target.innerHTML = submissions.length === 0
    ? emptyState("Os materiais extras aprovados pela equipe aparecerão aqui.")
    : submissions.map((submission) => `
      <article class="workspace-item">
        <div><span class="workspace-item__eyebrow">${escapeHtml(submission.area_name)} · ${escapeHtml(submission.discipline_name)} · ${escapeHtml(submission.content_type)}</span>
          <h3>${escapeHtml(submission.title)}</h3>
          <p>${escapeHtml(submission.description)}</p></div>
        ${submission.resource_url
          ? `<a class="workspace-action workspace-action--link" href="${escapeHtml(submission.resource_url)}" target="_blank" rel="noopener noreferrer">Abrir material</a>`
          : ""}
      </article>
    `).join("");
};

const renderCollaborator = (data) => {
  const disciplineSelect = workspace.querySelector("[data-collaborator-disciplines]");
  const classSelect = workspace.querySelector("[data-collaborator-classes]");
  fillSelect(disciplineSelect, data.disciplines, (item) => item.slug, (item) => item.name, "Selecione uma disciplina");
  fillSelect(classSelect, [], (item) => item.id, (item) => item.name, "Todas as turmas da disciplina");
  disciplineSelect.onchange = () => {
    const classes = data.classes.filter((courseClass) => courseClass.discipline_slug === disciplineSelect.value);
    fillSelect(classSelect, classes, (item) => item.id, (item) => item.name, "Todas as turmas da disciplina");
  };
  workspace.querySelector("[data-collaborator-assignments]").innerHTML = data.disciplines.length
    ? data.disciplines.map((discipline) => `
      <article class="workspace-item"><div><span class="workspace-item__eyebrow">${escapeHtml(discipline.area_name)} · MÓDULO</span><h3>${escapeHtml(discipline.name)}</h3>
      <p>${data.classes.filter((courseClass) => courseClass.discipline_slug === discipline.slug).length} turma(s) atribuída(s)</p></div></article>
    `).join("")
    : emptyState("Seu acesso às disciplinas ainda precisa ser configurado por um administrador.");
  workspace.querySelector("[data-collaborator-submissions]").innerHTML = data.submissions.length
    ? data.submissions.map((submission) => `
      <article class="workspace-item"><div><span class="workspace-item__eyebrow">${escapeHtml(submission.area_name)} · ${escapeHtml(submission.discipline_name)} · ${escapeHtml(submission.content_type)}</span>
      <h3>${escapeHtml(submission.title)}</h3><p>${escapeHtml(submission.description)}</p></div>
      <span class="state-chip state-chip--${escapeHtml(submission.status)}">${escapeHtml({ pending: "Em análise", approved: "Aprovado", rejected: "Recusado" }[submission.status] || submission.status)}</span></article>
    `).join("")
    : emptyState("Seus envios e o andamento da revisão aparecerão aqui.");
};

const renderUsers = (users) => {
  const container = workspace.querySelector("[data-user-management]");
  container.innerHTML = users.length ? users.map((account) => `
    <form class="admin-user-row" data-user-form data-user-id="${Number(account.id)}">
      <div class="admin-user-row__identity"><strong>${escapeHtml(account.name)}</strong><span>${escapeHtml(account.email)}</span></div>
      <label>Perfil<select name="role">
        <option value="student"${account.role === "student" ? " selected" : ""}>Aluno</option>
        <option value="collaborator"${account.role === "collaborator" ? " selected" : ""}>Colaborador / professor</option>
        <option value="admin"${account.role === "admin" ? " selected" : ""}>Administrador</option>
      </select></label>
      <label>Plano<select name="plan"${account.role !== "student" ? " disabled" : ""}>
        <option value="free"${account.plan === "free" ? " selected" : ""}>Free</option>
        <option value="standard" disabled>Standard · indisponível</option>
        <option value="pro" disabled>Pro · indisponível</option>
      </select></label>
      <button class="workspace-action" type="submit">Salvar</button>
    </form>
  `).join("") : emptyState("Nenhuma conta encontrada.");
  container.querySelectorAll('[data-user-form] [name="role"]').forEach((select) => {
    select.addEventListener("change", () => {
      const plan = select.form.elements.namedItem("plan");
      plan.disabled = select.value !== "student";
      if (plan.disabled) plan.value = "free";
    });
  });
};

const renderAdmin = (data) => {
  const collaborators = data.users.filter((account) => account.role === "collaborator");
  const disciplines = data.disciplines;
  const subjectAreas = data.subjectAreas || [];
  fillSelect(workspace.querySelector("[data-collaborator-users]"), collaborators,
    (item) => item.id, (item) => `${item.name} · ${item.email}`, "Selecione um colaborador");
  fillSelect(workspace.querySelector("[data-all-disciplines]"), subjectAreas,
    (item) => item.slug, (item) => item.name, "Selecione uma disciplina");
  fillSelect(workspace.querySelector("[data-class-disciplines]"), disciplines,
    (item) => item.slug, (item) => `${item.area_name} · ${item.name}`, "Selecione um módulo");

  renderUsers(data.users);
  const subjectAreaContainer = workspace.querySelector("[data-subject-area-management]");
  subjectAreaContainer.innerHTML = subjectAreas.length
    ? subjectAreas.map((area) => `
      <article class="workspace-item workspace-item--stack">
        <form class="subject-area-form" data-subject-area-form data-area-id="${Number(area.id)}">
          <label>Disciplina<input name="name" maxlength="160" required value="${escapeHtml(area.name)}"></label>
          <label>Descrição<textarea name="description" rows="2" maxlength="1000">${escapeHtml(area.description || "")}</textarea></label>
          <div class="workspace-item__row">
            <span class="workspace-item__meta">${Number(area.topic_count)} módulo(s) associado(s)</span>
            <button class="workspace-action" type="submit">Salvar alterações</button>
          </div>
        </form>
      </article>
    `).join("")
    : emptyState("Nenhuma disciplina cadastrada.");

  const assignmentContainer = workspace.querySelector("[data-discipline-assignments]");
  assignmentContainer.innerHTML = data.disciplineAssignments.length
    ? data.disciplineAssignments.map((assignment) => `
      <article class="workspace-item"><div><span class="workspace-item__eyebrow">${escapeHtml(assignment.collaborator_name)}</span>
      <h3>${escapeHtml(assignment.area_name)}</h3><p>${Number(assignment.module_count)} módulo(s) atribuídos</p></div>
      <button type="button" class="workspace-action workspace-action--quiet" data-action="remove-discipline"
        data-user-id="${Number(assignment.collaborator_id)}" data-area-slug="${escapeHtml(assignment.subject_area_slug)}">Remover</button></article>
    `).join("")
    : emptyState("Nenhuma disciplina atribuída à equipe ainda.");

  const classContainer = workspace.querySelector("[data-class-management]");
  classContainer.innerHTML = data.classes.length
    ? data.classes.map((courseClass) => `
      <article class="workspace-item workspace-item--stack">
        <div class="workspace-item__row">
          <div><span class="workspace-item__eyebrow">${escapeHtml(courseClass.area_name)} · ${escapeHtml(courseClass.discipline_name)}</span>
          <h3>${escapeHtml(courseClass.name)}</h3><p>${escapeHtml(courseClass.description || "Sem descrição.")}</p>
          <span class="workspace-item__meta">${Number(courseClass.student_count)} participantes · ${escapeHtml(courseClass.collaborator_names || "Sem colaborador atribuído")}</span></div>
          <button type="button" class="workspace-action workspace-action--quiet" data-action="toggle-class"
            data-class-id="${Number(courseClass.id)}" data-status="${courseClass.status}">${courseClass.status === "open" ? "Fechar inscrições" : "Abrir inscrições"}</button>
        </div>
        <form class="class-assign-form" data-class-assignment-form data-class-id="${Number(courseClass.id)}">
          <label>Colaborador<select name="user_id" required>
            <option value="">Atribuir colaborador autorizado para a disciplina</option>
            ${collaborators.filter((collaborator) => data.disciplineAssignments.some((assignment) =>
              Number(assignment.collaborator_id) === Number(collaborator.id)
              && assignment.subject_area_slug === courseClass.area_slug))
              .map((collaborator) => `<option value="${Number(collaborator.id)}">${escapeHtml(collaborator.name)}</option>`).join("")}
          </select></label><button type="submit">Atribuir à turma</button>
        </form>
      </article>
    `).join("")
    : emptyState("Crie a primeira turma desta disciplina.");

  const reviewContainer = workspace.querySelector("[data-content-review]");
  reviewContainer.innerHTML = data.submissions.length
    ? data.submissions.map((submission) => `
      <article class="workspace-item workspace-item--stack">
        <div><span class="workspace-item__eyebrow">${escapeHtml(submission.area_name)} · ${escapeHtml(submission.discipline_name)} · ${escapeHtml(submission.content_type)} · ${escapeHtml(submission.author_name)}</span>
          <h3>${escapeHtml(submission.title)}</h3><p>${escapeHtml(submission.description)}</p>
          ${submission.resource_url ? `<a href="${escapeHtml(submission.resource_url)}" target="_blank" rel="noopener noreferrer">Conferir material enviado</a>` : ""}</div>
        <div class="workspace-item__actions"><button type="button" class="workspace-action" data-action="review-content" data-id="${Number(submission.id)}" data-status="approved">Aprovar</button>
          <button type="button" class="workspace-action workspace-action--quiet" data-action="review-content" data-id="${Number(submission.id)}" data-status="rejected">Recusar</button></div>
      </article>
    `).join("")
    : emptyState("Não há conteúdos aguardando revisão.");
};

const render = (data) => {
  const role = data.user.role;
  workspace.dataset.role = role;
  renderProfile(data.user);
  workspace.querySelector("[data-role-label]").textContent = roleNames[role] || "Conta";
  workspace.querySelectorAll("[data-student-panel]").forEach((section) => { section.hidden = role !== "student"; });
  workspace.querySelectorAll("[data-collaborator-panel]").forEach((section) => { section.hidden = role !== "collaborator"; });
  workspace.querySelectorAll("[data-admin-panel]").forEach((section) => { section.hidden = role !== "admin"; });
  if (role === "student") {
    workspace.querySelector("[data-current-plan]").textContent = planNames[data.user.plan] || "Free";
    renderClassesForStudent(data.classes, data.user.plan);
    renderMaterials(data.submissions, workspace.querySelector("[data-student-materials]"));
  } else if (role === "collaborator") {
    renderCollaborator(data);
  } else if (role === "admin") {
    renderAdmin(data);
  }
};

const reload = async (successMessage = "") => {
  try {
    render(await workspaceGet());
    if (successMessage) setMessage(successMessage);
  } catch (error) {
    setMessage(error.message || "Não foi possível carregar o painel.", true);
    throw error;
  }
};

workspace.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action } = button.dataset;
  try {
    let result;
    if (action === "join-class") {
      result = await workspacePost("join_class", { class_id: button.dataset.classId });
    } else if (action === "remove-discipline") {
      result = await workspacePost("admin_assign_discipline", {
        user_id: button.dataset.userId,
        subject_area_slug: button.dataset.areaSlug,
        assigned: false,
      });
    } else if (action === "toggle-class") {
      result = await workspacePost("admin_set_class_status", {
        class_id: button.dataset.classId,
        status: button.dataset.status === "open" ? "closed" : "open",
      });
    } else if (action === "review-content") {
      result = await workspacePost("review_content", {
        submission_id: button.dataset.id,
        status: button.dataset.status,
      });
    }
    if (result) await reload(result.message);
  } catch (error) {
    setMessage(error.message || "Não foi possível concluir a ação.", true);
  }
});

workspace.addEventListener("submit", async (event) => {
  const form = event.target;
  event.preventDefault();
  if (form.matches("[data-profile-form]")) {
    try {
      const result = await workspaceUpload("profile_update", new FormData(form));
      form.reset();
      await reload(result.message);
    } catch (error) {
      setMessage(error.message || "Não foi possível atualizar o perfil.", true);
    }
    return;
  }
  const values = Object.fromEntries(new FormData(form));
  try {
    let result;
    if (form.matches("[data-user-form]")) {
      values.plan = values.plan || "free";
      result = await workspacePost("admin_update_user", { ...values, user_id: form.dataset.userId });
    } else if (form.matches("[data-subject-area-create-form]")) {
      result = await workspacePost("admin_create_subject_area", values);
    } else if (form.matches("[data-subject-area-form]")) {
      result = await workspacePost("admin_update_subject_area", { ...values, area_id: form.dataset.areaId });
    } else if (form.matches("[data-discipline-assignment-form]")) {
      result = await workspacePost("admin_assign_discipline", values);
    } else if (form.matches("[data-class-form]")) {
      result = await workspacePost("admin_create_class", values);
    } else if (form.matches("[data-class-assignment-form]")) {
      result = await workspacePost("admin_assign_class", { ...values, class_id: form.dataset.classId });
    } else if (form.matches("[data-content-form]")) {
      result = await workspacePost("submit_content", values);
    }
    if (result) {
      form.reset();
      await reload(result.message);
    }
  } catch (error) {
    setMessage(error.message || "Não foi possível enviar os dados.", true);
  }
});

logoutButton?.addEventListener("click", async () => {
  try {
    const result = await authPost("logout");
    if (result.ok) window.location.href = "login.html";
    else setMessage(result.message || "Não foi possível sair da conta.", true);
  } catch (error) {
    setMessage(error.message || "Não foi possível sair da conta.", true);
  }
});

reload().catch((error) => console.error("Falha ao carregar o painel:", error));
loadNotifications();
window.setInterval(loadNotifications, 15000);

notificationToggle.addEventListener("click", () => {
  const isExpanded = notificationToggle.getAttribute("aria-expanded") === "true";
  notificationToggle.setAttribute("aria-expanded", String(!isExpanded));
  notificationList.hidden = isExpanded;
});

notificationsReadButton.addEventListener("click", async () => {
  try {
    await workspacePost("notifications_read");
    await loadNotifications();
  } catch (error) {
    setMessage(error.message || "Não foi possível atualizar as notificações.", true);
  }
});
