import { authMe, authPost } from "./cadastro/auth-api.js";

let usuarioLogado = null;
try {
    const sessao = await authMe();
    usuarioLogado = sessao.authenticated ? sessao.user : null;
} catch (error) {
    console.error("Falha ao consultar autenticação:", error);
}

const logoutButton = document.getElementById("logout-btn") || document.getElementById("logout-button");
logoutButton?.addEventListener("click", async () => {
    try {
        const result = await authPost("logout");
        if (result.ok) window.location.href = "../pages/login.html";
    } catch (error) {
        console.error("Falha ao sair:", error);
    }
});

// Definir as disciplinas
const disciplinas = [

    //Banco
    {
        titulo: "Banco de dados 1",
        descricao: "Aprenda a utilizar um banco de dados, com todas as suas funções e lógicas!",
        link: "../Pagina_disciplina/Banco_modulo1/banco1.html",
        brand: "database",
        icons: ["fa-solid fa-database"],
        dificuldade: "Fácil",
        categoria: "back-end",
        area: "banco-de-dados",
        duracao: "45min"
    },
    {
        titulo: "Banco de dados 2",
        descricao: "Voce aprendera",
        link: "../Pagina_disciplina/Banco_modulo2/banco2.html",
        brand: "database",
        icons: ["fa-solid fa-database"],
        dificuldade: "Médio",
        categoria: "back-end",
        area: "banco-de-dados",
        duracao: "45min"
    },
    {
        titulo: "Banco de dados 3",
        descricao: "Aprenda a utilizar um banco de dados, com todas as suas funções e lógicas!",
        link: "../Pagina_disciplina/Banco_modulo3/banco3.html",
        brand: "database",
        icons: ["fa-solid fa-database"],
        dificuldade: "Dificil",
        categoria: "back-end",
        area: "banco-de-dados",
        duracao: "1h"
    },

    // Computacao
    {
        titulo: "Curso de Illustrator",
        descricao: "Aprenda a utilizar o Illustrator de uma forma incrível!",
        link: "../Pagina_disciplina/illustrator/illustrator.html",
        brand: "illustrator",
        icons: ["fa-solid fa-pen-nib"],
        dificuldade: "Médio",
        categoria: "front-end",
        area: "design-grafico",
        duracao: "2h"
    },
    {
        titulo: "Curso de Photoshop",
        descricao: "Aqui aprendera a usar o Photoshop",
        link: "../Pagina_disciplina/photoshop/photoshop.html",
        brand: "photoshop",
        icons: ["fa-solid fa-image"],
        dificuldade: "Difícil",
        categoria: "front-end",
        area: "design-grafico",
        duracao: "5h"
    },

    // JAVA
    {
        titulo: "Lógica de programação - JAVA",
        descricao: "O começo da jornada JAVA!!",
        link: "../Pagina_disciplina/Java_modulo1/java1.html",
        brand: "java",
        icons: ["fa-solid fa-mug-hot"],
        dificuldade: "Fácil",
        categoria: "back-end",
        area: "java",
        duracao: "1h"
    },
    {
        titulo: "Tipos de dados - JAVA",
        descricao: "...",
        link: "../Pagina_disciplina/java_modulo2/java2.html",
        brand: "java",
        icons: ["fa-solid fa-mug-hot"],
        dificuldade: "Fácil",
        categoria: "back-end",
        area: "java",
        duracao: "2h"
    },
    {
        titulo: "Comparação de dados - JAVA",
        descricao: "...",
        link: "../Pagina_disciplina/java_modulo3/java3.html",
        brand: "java",
        icons: ["fa-solid fa-mug-hot"],
        dificuldade: "Fácil",
        categoria: "back-end",
        area: "java",
        duracao: "2h"
    },
    {
        titulo: "IF ELSE - JAVA",
        descricao: "Aprenda a operacao IF ELSE para seus codigos!!",
        link: "../Pagina_disciplina/java_modulo4/java4.html",
        brand: "java",
        icons: ["fa-solid fa-mug-hot"],
        dificuldade: "Médio",
        categoria: "back-end",
        area: "java",
        duracao: "1h"
    },
    {
        titulo: "Teste de mesa - JAVA",
        descricao: "Aprenda a realizar o teste de mesa em seu codigo!!",
        link: "../Pagina_disciplina/java_modulo6/java6.html",
        brand: "java",
        icons: ["fa-solid fa-mug-hot"],
        dificuldade: "Médio",
        categoria: "back-end",
        area: "java",
        duracao: "1h"
    },
    {
        titulo: "Vetores - JAVA",
        descricao: "Aprenda a utilizar vetores",
        link: "../Pagina_disciplina/java_modulo7/java7.html",
        brand: "java",
        icons: ["fa-solid fa-mug-hot"],
        dificuldade: "Díficil",
        categoria: "back-end",
        area: "java",
        duracao: "1h"
    },
    {
        titulo: "JOptionpane - JAVA",
        descricao: "JOptionPane é o primeiro contato com códigos front-end, onde podemos utilizar modelos pré-prontos de caixas de diálogo para deixar o código mais interativo.",
        link: "../Pagina_disciplina/java_modulo8/java8.html",
        brand: "java",
        icons: ["fa-solid fa-mug-hot"],
        dificuldade: "Díficil",
        categoria: "back-end",
        area: "java",
        duracao: "2h"
    },

    /*HTML e CSS*/

    {
        titulo: "Curso de HTML e CSS",
        descricao: "Aprenda a base para qualquer site!",
        link: "../Pagina_disciplina/htmlecss/htmlecss.html",
        brand: "html-css",
        icons: ["fa-brands fa-html5", "fa-brands fa-css3-alt"],
        dificuldade: "Médio",
        categoria: "front-end",
        area: "programacao-web",
        duracao: "3h"
    },
    
];

const cardContainer = document.querySelector(".cards");
const filtroCategorias = document.querySelector(".filtro_categorias");
const filtroDisciplinas = document.querySelector(".filtro_disciplinas");
const filtroToggle = document.querySelector(".catalog-filter-toggle");
const filtroGroups = document.querySelector("#catalog-filters");
const pesquisarInput = document.querySelector("#pesquisarInput");
const disciplinaStatus = document.querySelector("#catalog-discipline-status");
let categoriaSelecionada = "todas";
let areaSelecionada = "todas";
let termoBusca = "";
const nomesDisciplinas = new Map([
    ["banco-de-dados", "Banco de Dados"],
    ["java", "Java"],
    ["programacao-web", "Programação Web"],
    ["design-grafico", "Design Gráfico"],
]);
const iconesDisciplinas = new Map([
    ["todas", "fa-solid fa-book-open"],
    ["banco-de-dados", "fa-solid fa-database"],
    ["java", "fa-solid fa-mug-hot"],
    ["programacao-web", "fa-solid fa-laptop-code"],
    ["design-grafico", "fa-solid fa-pen-nib"],
]);
const escaparHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}[character]));

const carregarDisciplinas = async () => {
    try {
        const endpoint = new URL("../php/api/catalog.php", import.meta.url);
        const response = await fetch(endpoint, { credentials: "same-origin", cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result?.ok || !Array.isArray(result.data?.subjectAreas)) {
            throw new Error(result?.message || "Resposta inválida ao consultar disciplinas.");
        }
        result.data.subjectAreas.forEach((area) => nomesDisciplinas.set(area.slug, area.name));
        if (filtroDisciplinas) {
            filtroDisciplinas.replaceChildren();
            const areas = [{ slug: "todas", name: "Todas" }, ...result.data.subjectAreas];
            areas.forEach((area, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.dataset.area = area.slug;
                button.setAttribute("aria-pressed", String(index === 0));
                const icon = document.createElement("i");
                icon.className = iconesDisciplinas.get(area.slug) || "fa-solid fa-book-open";
                icon.setAttribute("aria-hidden", "true");
                button.append(icon, document.createTextNode(area.name));
                filtroDisciplinas.append(button);
            });
        }
    } catch (error) {
        console.error("Falha ao carregar disciplinas do catálogo:", error);
        if (disciplinaStatus) {
            disciplinaStatus.textContent = "Não foi possível atualizar a lista de disciplinas. Exibindo as opções padrão.";
        }
    }
};

await carregarDisciplinas();

filtroToggle?.addEventListener("click", () => {
    const expanded = filtroToggle.getAttribute("aria-expanded") === "true";
    filtroToggle.setAttribute("aria-expanded", String(!expanded));
    filtroGroups.hidden = expanded;
    filtroToggle.querySelector("[data-filter-toggle-label]").textContent = expanded
        ? "Mostrar filtros"
        : "Ocultar filtros";
    filtroToggle.setAttribute("aria-label", expanded ? "Mostrar filtros do catálogo" : "Ocultar filtros do catálogo");
});

const embaralharDisciplinas = (disciplinas) => {
    for (let i = disciplinas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [disciplinas[i], disciplinas[j]] = [disciplinas[j], disciplinas[i]]; // Troca de elementos
    }
    return disciplinas;
};

const verDisciplinas = (disciplinas) => {
    if (!cardContainer) return;
    cardContainer.innerHTML = "";

    if (disciplinas.length === 0) {
        cardContainer.innerHTML = `
        <div class="naoEncontrado">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <p>Nenhuma disciplina encontrada.</p>
        </div>
        `;
        return;
    }

    disciplinas.forEach(e => {
        cardContainer.innerHTML += `
        <div class="card" data-id="${e.titulo}" data-course-brand="${e.brand}">
            <div class="container_card">
                <div class="foto_card course-icons" aria-hidden="true">
                    ${e.icons.map(icon => `<i class="${icon} course-icon"></i>`).join("")}
                </div>
                <div class="duracao_card">
                    <i class="fa-regular fa-clock" aria-hidden="true"></i>
                    <h2>${e.duracao}</h2>
                </div>
                <div class="escrita_card">
                    <h1>${e.titulo}</h1>
                </div>
                <div class="item_dificuldade">
                    <div class="dificuldade_card">
                        <i class="fa-solid fa-chart-simple" aria-hidden="true"></i>
                        <h2>${e.dificuldade}</h2>
                    </div>
                    <div class="dificuldade_card">
                        <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
                        <h2>${escaparHtml(nomesDisciplinas.get(e.area) || "Outras disciplinas")}</h2>
                    </div>
                </div>
            </div>
            <div class="descricao">
                <div class="foto_card course-icons" aria-hidden="true">
                    ${e.icons.map(icon => `<i class="${icon} course-icon"></i>`).join("")}
                </div>
                <h2>${e.titulo}</h2>
                <p>${e.descricao}</p>
                <div class="links-hover">
                    <a href="#" class="btn-ver-mais" data-curso="${e.titulo}">Veja mais</a>
                </div>
            </div>
        </div>
        `;
    });

    const verMaisBtns = document.querySelectorAll(".btn-ver-mais");

    verMaisBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            if (usuarioLogado) {
                const cursoId = e.target.getAttribute("data-curso");
                console.log(`Acessando o curso de ${cursoId}`);

                const curso = disciplinas.find(d => d.titulo === cursoId);
                if (curso) {
                    window.location.href = curso.link;
                }
            } else {
                window.location.href = "../pages/login.html";
            }
        });
    });
};

const aplicarFiltros = () => {
    const filtradas = disciplinas.filter((disciplina) => {
        const correspondeCategoria = categoriaSelecionada === "todas"
            || disciplina.categoria.toLowerCase() === categoriaSelecionada;
        const correspondeDisciplina = areaSelecionada === "todas" || disciplina.area === areaSelecionada;
        const correspondeBusca = disciplina.titulo.toLowerCase().includes(termoBusca);
        return correspondeCategoria && correspondeDisciplina && correspondeBusca;
    });

    verDisciplinas(embaralharDisciplinas(filtradas));
};

aplicarFiltros();

filtroCategorias?.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-categoria]");
    if (button) {
        categoriaSelecionada = button.dataset.categoria.toLowerCase();
        filtroCategorias.querySelectorAll("button").forEach((button) => {
            button.setAttribute("aria-pressed", String(button === e.target.closest("button")));
        });
        aplicarFiltros();
    }
});

filtroDisciplinas?.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-area]");
    if (!button) return;
    areaSelecionada = button.dataset.area;
    if (areaSelecionada === "todas") {
        categoriaSelecionada = "todas";
        filtroCategorias?.querySelectorAll("button").forEach((filterButton) => {
            filterButton.setAttribute("aria-pressed", "false");
        });
    }
    filtroDisciplinas.querySelectorAll("button").forEach((filterButton) => {
        filterButton.setAttribute("aria-pressed", String(filterButton === button));
    });
    aplicarFiltros();
});

pesquisarInput?.addEventListener("input", () => {
    termoBusca = pesquisarInput.value.trim().toLowerCase();
    aplicarFiltros();
});
