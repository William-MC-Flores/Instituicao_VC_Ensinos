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
        image: "../img/emblemas_cards/banco.png",
        dificuldade: "Fácil",
        categoria: "back-end",
        duracao: "45min"
    },
    {
        titulo: "Banco de dados 2",
        descricao: "Voce aprendera",
        link: "../Pagina_disciplina/Banco_modulo2/banco2.html",
        image: "../img/emblemas_cards/banco.png",
        dificuldade: "Médio",
        categoria: "back-end",
        duracao: "45min"
    },
    {
        titulo: "Banco de dados 3",
        descricao: "Aprenda a utilizar um banco de dados, com todas as suas funções e lógicas!",
        link: "../Pagina_disciplina/Banco_modulo3/banco3.html",
        image: "../img/emblemas_cards/banco.png",
        dificuldade: "Dificil",
        categoria: "back-end",
        duracao: "1h"
    },

    // Computacao
    {
        titulo: "Curso de Illustrator",
        descricao: "Aprenda a utilizar o Illustrator de uma forma incrível!",
        link: "../Pagina_disciplina/illustrator/illustrator.html",
        image: "../img/emblemas_cards/illustrator.png",
        dificuldade: "Médio",
        categoria: "front-end",
        duracao: "2h"
    },
    {
        titulo: "Curso de Photoshop",
        descricao: "Aqui aprendera a usar o Photoshop",
        link: "../Pagina_disciplina/photoshop/photoshop.html",
        image: "../img/emblemas_cards/Photo.png",
        dificuldade: "Difícil",
        categoria: "front-end",
        duracao: "5h"
    },

    // JAVA
    {
        titulo: "Lógica de programação - JAVA",
        descricao: "O começo da jornada JAVA!!",
        link: "../Pagina_disciplina/Java_modulo1/java1.html",
        image: "../img/emblemas_cards/java.png",
        dificuldade: "Fácil",
        categoria: "back-end",
        duracao: "1h"
    },
    {
        titulo: "Tipos de dados - JAVA",
        descricao: "...",
        link: "../Pagina_disciplina/java_modulo2/java2.html",
        image: "../img/emblemas_cards/java.png",
        dificuldade: "Fácil",
        categoria: "back-end",
        duracao: "2h"
    },
    {
        titulo: "Comparação de dados - JAVA",
        descricao: "...",
        link: "../Pagina_disciplina/java_modulo3/java3.html",
        image: "../img/emblemas_cards/java.png",
        dificuldade: "Fácil",
        categoria: "back-end",
        duracao: "2h"
    },
    {
        titulo: "IF ELSE - JAVA",
        descricao: "Aprenda a operacao IF ELSE para seus codigos!!",
        link: "../Pagina_disciplina/java_modulo4/java4.html",
        image: "../img/emblemas_cards/java.png",
        dificuldade: "Médio",
        categoria: "back-end",
        duracao: "1h"
    },
    {
        titulo: "Teste de mesa - JAVA",
        descricao: "Aprenda a realizar o teste de mesa em seu codigo!!",
        link: "../Pagina_disciplina/java_modulo6/java6.html",
        image: "../img/emblemas_cards/java.png",
        dificuldade: "Médio",
        categoria: "back-end",
        duracao: "1h"
    },
    {
        titulo: "Vetores - JAVA",
        descricao: "Aprenda a utilizar vetores",
        link: "../Pagina_disciplina/java_modulo7/java7.html",
        image: "../img/emblemas_cards/java.png",
        dificuldade: "Díficil",
        categoria: "back-end",
        duracao: "1h"
    },
    {
        titulo: "JOptionpane - JAVA",
        descricao: "JOptionPane é o primeiro contato com códigos front-end, onde podemos utilizar modelos pré-prontos de caixas de diálogo para deixar o código mais interativo.",
        link: "../Pagina_disciplina/java_modulo8/java8.html",
        image: "../img/emblemas_cards/java.png",
        dificuldade: "Díficil",
        categoria: "back-end",
        duracao: "2h"
    },

    /*HTML e CSS*/

    {
        titulo: "Curso de HTML e CSS",
        descricao: "Aprenda a base para qualquer site!",
        link: "../Pagina_disciplina/htmlecss/htmlecss.html",
        image: "../img/emblemas_cards/htmlecss.png",
        dificuldade: "Médio",
        categoria: "front-end",
        duracao: "3h"
    },
    
];

const cardContainer = document.querySelector(".cards");
const filtroCategorias = document.querySelector(".filtro_categorias");
const pesquisarInput = document.querySelector("#pesquisarInput");
let categoriaSelecionada = "todas";
let termoBusca = "";

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
            <img src="../img/naoEncontrado.png" alt="">
            <p>Nenhuma disciplina encontrada.</p>
        </div>
        `;
        return;
    }

    disciplinas.forEach(e => {
        cardContainer.innerHTML += `
        <div class="card" data-id="${e.titulo}">
            <div class="container_card">
                <div class="foto_card">
                    <img src="${e.image}" alt="">
                </div>
                <div class="duracao_card">
                    <img src="../img/duracao.png" alt="">
                    <h2>${e.duracao}</h2>
                </div>
                <div class="escrita_card">
                    <h1>${e.titulo}</h1>
                </div>
                <div class="item_dificuldade">
                    <div class="dificuldade_card">
                        <img src="../img/difficult.png" alt="">
                        <h2>${e.dificuldade}</h2>
                    </div>
                    <div class="dificuldade_card">
                        <img src="../img/categoria.png" alt="">
                        <h2>${e.categoria}</h2>
                    </div>
                </div>
            </div>
            <div class="descricao">
                <div class="foto_card">
                    <img src="${e.image}" alt="">
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
        const correspondeBusca = disciplina.titulo.toLowerCase().includes(termoBusca);
        return correspondeCategoria && correspondeBusca;
    });

    verDisciplinas(embaralharDisciplinas(filtradas));
};

aplicarFiltros();

filtroCategorias?.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
        categoriaSelecionada = e.target.dataset.categoria.toLowerCase();
        aplicarFiltros();
    }
});

pesquisarInput?.addEventListener("input", () => {
    termoBusca = pesquisarInput.value.trim().toLowerCase();
    aplicarFiltros();
});
