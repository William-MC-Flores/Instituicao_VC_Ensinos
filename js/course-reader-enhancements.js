(() => {
  const setupTreeNavigation = () => {
    const sidebar = document.querySelector(".topicos");
    const elements = sidebar?.querySelector(".elementos");
    if (!sidebar || !elements || elements.dataset.treeReady === "true") return;

    const getGroups = () => Array.from(elements.children)
      .filter((child) => child.classList.contains("caixa_elemento"))
      .map((category) => {
        const subitems = category.nextElementSibling;
        if (!subitems?.classList.contains("subitems")) return null;
        return { category, subitems };
      })
      .filter(Boolean);

    const updateCategoryState = (group) => {
      const button = group.category.querySelector("button[data-index]");
      const icon = button?.querySelector("i");
      const expanded = group.subitems.classList.contains("active");
      button?.setAttribute("aria-expanded", String(expanded));
      group.subitems.setAttribute("aria-hidden", String(!expanded));
      if (icon) {
        icon.classList.remove("fa-plus", "fa-minus", "fa-chevron-down", "fa-chevron-right");
        icon.classList.add(expanded ? "fa-chevron-down" : "fa-chevron-right");
      }
      group.subitems.style.maxHeight = expanded
        ? `${group.subitems.scrollHeight}px`
        : "0px";
    };

    const syncGroups = () => getGroups().forEach((group) => updateCategoryState(group));

    elements.dataset.treeReady = "true";
    elements.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-index]");
      if (!button) return;

      requestAnimationFrame(() => {
        const category = button.closest(".elementos > .caixa_elemento");
        const subitems = category?.nextElementSibling;
        if (subitems?.classList.contains("subitems")) {
          updateCategoryState({ category, subitems });
        }

        if (button.hasAttribute("data-subindex")) {
          elements.querySelectorAll(".caixa_elemento_sub button[aria-current='true']")
            .forEach((selected) => selected.removeAttribute("aria-current"));
          button.setAttribute("aria-current", "true");
        }
      });
    });

    new MutationObserver(syncGroups).observe(elements, { childList: true });
    syncGroups();
  };

  const setupPdfPreviews = () => {
    const content = document.querySelector(".conteudos");
    if (!content) return;

    const enhanceDownloads = () => {
      content.querySelectorAll(".botao_download[href]").forEach((downloadLink) => {
        let pdfUrl;
        try {
          pdfUrl = new URL(downloadLink.href, window.location.href);
        } catch {
          return;
        }
        if (!pdfUrl.pathname.toLowerCase().endsWith(".pdf")) return;

        downloadLink.setAttribute("aria-label", "Baixar arquivo PDF");
        if (!downloadLink.querySelector(".fa-solid")) {
          const icon = document.createElement("i");
          icon.className = "fa-solid fa-download";
          icon.setAttribute("aria-hidden", "true");
          downloadLink.prepend(icon);
        }
        downloadLink.lastChild.textContent = "Baixar PDF";

        const parent = downloadLink.closest(".container_conteudo");
        if (!parent || parent.querySelector(".course-pdf-preview")) return;

        const preview = document.createElement("section");
        preview.className = "course-pdf-preview";

        const title = document.createElement("h2");
        title.textContent = "Visualização da apostila";

        const frame = document.createElement("iframe");
        frame.src = `${pdfUrl.href}#toolbar=1&navpanes=0&view=FitH`;
        frame.title = "Visualização do arquivo PDF";
        frame.loading = "lazy";

        const fallback = document.createElement("p");
        fallback.className = "course-pdf-fallback";
        fallback.append("Caso a visualização não abra, ");

        const openLink = document.createElement("a");
        openLink.href = pdfUrl.href;
        openLink.target = "_blank";
        openLink.rel = "noopener";
        openLink.textContent = "abra o PDF em uma nova aba";
        fallback.append(openLink, ".");

        preview.append(title, frame, fallback);
        downloadLink.before(preview);
      });
    };

    enhanceDownloads();
    new MutationObserver(enhanceDownloads).observe(content, {
      childList: true,
      subtree: true
    });
  };

  const setupSharing = () => {
    const overlay = document.getElementById("caixa_branca");
    const popup = overlay?.querySelector(".popup");
    const shareButton = document.querySelector(".header_compartilhe");
    const linkInput = document.getElementById("linkInput");
    const closeButton = document.getElementById("closeButton");
    if (!overlay || !popup || !shareButton || !linkInput || !closeButton) return;
    if (overlay.dataset.sharingReady === "true") return;

    overlay.dataset.sharingReady = "true";
    overlay.setAttribute("aria-hidden", "true");
    popup.setAttribute("role", "dialog");
    popup.setAttribute("aria-modal", "true");
    popup.setAttribute("aria-labelledby", "shareDialogTitle");
    popup.setAttribute("tabindex", "-1");

    const label = popup.querySelector("label");
    if (label) {
      label.id = "shareDialogTitle";
      label.textContent = "Compartilhe este curso";
    }

    linkInput.setAttribute("aria-label", "Link do curso");
    linkInput.readOnly = true;

    const actions = document.createElement("div");
    actions.className = "share-actions";
    const copyButton = document.createElement("button");
    copyButton.className = "share-copy-button";
    copyButton.type = "button";
    copyButton.innerHTML = '<i class="fa-solid fa-link" aria-hidden="true"></i>Copiar link';

    const nativeButton = document.createElement("button");
    nativeButton.className = "share-native-button";
    nativeButton.type = "button";
    nativeButton.innerHTML = '<i class="fa-solid fa-arrow-up-from-bracket" aria-hidden="true"></i>Mais opções';
    nativeButton.hidden = typeof navigator.share !== "function";

    const services = [
      ["whatsapp", "WhatsApp", "fa-brands fa-whatsapp"],
      ["facebook", "Facebook", "fa-brands fa-facebook"],
      ["telegram", "Telegram", "fa-brands fa-telegram"],
      ["x", "X", "fa-brands fa-x-twitter"],
      ["email", "E-mail", "fa-solid fa-envelope"]
    ];

    const links = services.map(([service, name, iconClass]) => {
      const link = document.createElement("a");
      link.className = "share-social-link";
      link.dataset.shareService = service;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `Compartilhar no ${name}`);
      link.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i><span>${name}</span>`;
      actions.append(link);
      return link;
    });

    const status = document.createElement("p");
    status.className = "share-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    actions.prepend(copyButton, nativeButton);
    const existingMessage = popup.querySelector("p");
    existingMessage?.replaceWith(status);
    linkInput.after(actions);
    if (!existingMessage) popup.append(status);

    const getTitle = () => document.querySelector(".links_header_curso h2")?.textContent.trim()
      || document.title;

    const updateShareLinks = () => {
      const url = window.location.href;
      const title = getTitle();
      const encodedUrl = encodeURIComponent(url);
      const encodedTitle = encodeURIComponent(title);
      const hrefs = {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        x: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`${title}\n${url}`)}`
      };
      linkInput.value = url;
      links.forEach((link) => {
        link.href = hrefs[link.dataset.shareService];
      });
    };

    const openDialog = () => {
      updateShareLinks();
      overlay.style.display = "flex";
      overlay.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => copyButton.focus());
    };

    const closeDialog = () => {
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden", "true");
      status.textContent = "";
      shareButton.focus();
    };

    shareButton.addEventListener("click", openDialog);
    closeButton.addEventListener("click", closeDialog);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) closeDialog();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.getAttribute("aria-hidden") === "false") {
        closeDialog();
      }
    });

    copyButton.addEventListener("click", async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(linkInput.value);
        } else {
          linkInput.focus();
          linkInput.select();
          if (!document.execCommand("copy")) throw new Error("A cópia foi recusada pelo navegador.");
        }
        status.textContent = "Link copiado para a área de transferência.";
      } catch (error) {
        status.textContent = "Não foi possível copiar automaticamente. Selecione e copie o link acima.";
        linkInput.focus();
        linkInput.select();
        console.error("Falha ao copiar o link de compartilhamento:", error);
      }
    });

    nativeButton.addEventListener("click", async () => {
      try {
        await navigator.share({ title: getTitle(), text: "Confira este curso da VC Ensinos:", url: linkInput.value });
        status.textContent = "Curso compartilhado.";
      } catch (error) {
        if (error.name !== "AbortError") {
          status.textContent = "Não foi possível abrir as opções de compartilhamento.";
          console.error("Falha ao compartilhar o curso:", error);
        }
      }
    });
  };

  setupTreeNavigation();
  setupPdfPreviews();
  setupSharing();
})();
