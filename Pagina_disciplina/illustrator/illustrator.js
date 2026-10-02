const caixas = [
    {
        nome: "Introdução",
        subitens: [
            {
                nome: "O que é Illustrator?",
                titulo: "O que é Illustrator?",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/zkdfeKNunHE?si=fpASYug_IYxM3zSP"
            },
        ]
    },
    {
        nome: "Video",
        subitens: [
            {
                nome: "Aula 1",
                titulo: "Conceitos básicos do Adobe Illustrator.",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/1KhdqWgNVV4?si=32K4zN872d7t9WS4"
            },
            {
                nome: "Aula 2",
                titulo: "Mostrando Todas As Ferramentas Do Adobe Illustrator",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/6KD9TFHOauU?si=PTEWti17dM5JSdHl"
            },
            {
                nome: "Aula 3",
                titulo: "Ensinando camadas no Adobe Illustrator.",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/JqvXEgOcaR0?si=HR8N4gu1Xc6pxThz"
            },
            {
                nome: "Aula 4",
                titulo: "Como mesclar formas no Adobe Illustrator.",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/oI_T8Z8-7Ds?si=rbe_NENMBRIzYHUY"
            },
        ]
    },
    {
        nome: "Apostila",
        subitens: [
            {
                nome: "Apostila 1",
                titulo: "Apostila para Download",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/illustrator/apostilas/illustrator1.pdf"
            },
            {
                nome: "Apostila 2",
                titulo: "Apostila para Download",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/illustrator/apostilas/illustrator2.pdf"
            },
            {
                nome: "Apostila 3",
                titulo: "Apostila para Download",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/illustrator/apostilas/illustrator3.pdf"
            },
        ]
    },
    {
        nome: "Desafio",
        subitens: [
            {
                nome: "Desafio Fácil",
                titulo: "Desafio fácil",
                conteudo: "Baixe desafio",
                dowload: "../../apostilas/illustrator/desafios/facil.pdf"
            },
            {
                nome: "Desafio Médio",
                titulo: "Desafio médio",
                conteudo: "Baixe desafio",
                dowload: "../../apostilas/illustrator/desafios/medio.pdf"
            },
            {
                nome: "Desafio Díficil",
                titulo: "Desafio díficil",
                conteudo: "Baixe desafio",
                dowload: "../../apostilas/illustrator/desafios/dificil.pdf"
            },
        ]
    },
];

const cursoNome = [
    { nome_curso: "Illustrator" }
];

const elementos = document.querySelector(".elementos");
const container = document.querySelector(".conteudo");
const headerNome = document.querySelector(".links_header_curso");

const verCaixas = () => {
    elementos.innerHTML = caixas.map((e, index) => `
        <div class="caixa_elemento">
            <div class="caixa_cor"></div>
            <button class="caixa_elemento" data-index="${index}">
                ${e.nome}
                <img src="../../img/maisIcon.png" alt="">
            </button>
        </div>
        <div class="subitems" id="subitems-${index}">
            ${e.subitens.map((sub, subIndex) => `
                <div class="caixa_elemento_sub">
                    <img src="../../img/seta.png" alt="">
                    <button class="caixa_elemento" data-index="${index}" data-subindex="${subIndex}">
                        ${sub.nome}
                    </button>
                </div>
            `).join('')}
        </div>
    `).join('');

    document.querySelectorAll(".caixa_elemento").forEach(button => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            const subIndex = this.getAttribute("data-subindex");

            if (subIndex !== null) {
                mostrarConteudo(index, subIndex);
            } else {
                const subitems = document.getElementById(`subitems-${index}`);
                subitems.classList.toggle("active");
            }
        });
    });
};

const verNome = () => {
    headerNome.innerHTML = cursoNome.map(curso => `<h2>${curso.nome_curso}</h2>`).join('');
};

const mostrarConteudo = (index, subIndex) => {
    const item = caixas[index].subitens[subIndex];

    container.innerHTML = `
        <div class="conteudo">
            <div class="container_conteudo">
                <h1>${item.titulo}</h1>
                <p>${item.conteudo}</p>
                ${item.iframe ? `
                    <div class="conteudo_video">
                        <iframe src="${item.iframe}" frameborder="0" width="100%" height="600px" allowfullscreen></iframe>
                    </div>
                ` : ''}
                ${item.dowload ? `
                    <a href="${item.dowload}" download class="botao_download">Baixar Apostila</a>
                ` : ''}
            </div>
        </div>
    `;
};


// Inicializa a interface
window.addEventListener("load", () => {
    verCaixas();
    verNome();
});

// Overlay Compartilhamento
const overlay = document.getElementById("caixa_branca");
const shareButton = document.querySelector(".header_compartilhe");
const linkInput = document.getElementById("linkInput");
const closeButton = document.getElementById("closeButton");

shareButton.addEventListener("click", () => {
    linkInput.value = window.location.href;
    overlay.style.display = "flex";
});

closeButton.addEventListener("click", () => {
    overlay.style.display = "none";
});

// Alternar tópicos laterais
const toggleButton = document.getElementById("toggleTopicos");
const topicosDiv = document.querySelector(".topicos");
const toggleIcon = document.getElementById("toggleIcon");

toggleButton.addEventListener("click", () => {
    topicosDiv.classList.toggle("minimized");
    toggleIcon.src = topicosDiv.classList.contains("minimized") ? "../../img/maisIcon.png" : "../../img/menosIcon.png";
});
