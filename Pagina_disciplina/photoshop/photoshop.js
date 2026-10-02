const caixas = [
    {
        nome: "Introdução",
        subitens: [
            {
                nome: "O que é PHOTOSHOP?",
                titulo: "O que é PHOTOSHOP?",
                conteudo: "Neste curso de Photoshop, você aprenderá o básico para a edição de imagens. Exploraremos ferramentas essenciais, como recortes, ajustes de cores, retoques e criação de composições criativas. Além disso, abordaremos como otimizar imagens para web e impressão, garantindo resultados profissionais. Com exercícios práticos, você ganhará confiança e domínio no uso do software. Também são fornecida apostilas e vídeos aulas para você poder aprender com confiança.",
                img: "../../img/popp.jpeg"
            },
        ]
    },
    {
        nome: "Video",
        subitens: [
            {
                nome: "Aula 1",
                titulo: "introdução do adobe Photoshop",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/NDXyDc1gtdI?si=1QqGZQ1AJysOi2mm" 
            },
            {
                nome: "Aula 2",
                titulo: "Ensinando introdução do adobe Photoshop",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/G6YtkSQVafY?si=zkuEEZa4jujHeB9e" 
            },
            {
                nome: "Aula 3",
                titulo: "Ensinamentos sobre Recortes no Photoshop",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/a2pDo6HDZcA?si=FZJIOVHt1c8GIOPf" 
            },
            {
                nome: "Aula 4",
                titulo: "Ensinamentos sobre Máscara no Photoshop",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/30JqngtEDZc?si=etz6M-_wXAWTzHWs" 
            },
            {
                nome: "Aula 5",
                titulo: "Ensinamentos Publicidade Photoshop",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/K_NorZK_N84?si=uO46XF_t3CZH6sil" 
            },
        ]
    },
    {
        nome: "Apostila",
        subitens: [
            {
                nome: "Apostila Fácil",
                titulo: "Primeira apostila",
                conteudo: " ",
                dowload: "../../apostilas/photoshop/apostilas/apostilaFacil.pdf"
            },
            {
                nome: "Apostila Média",
                titulo: "Segunda apostila",
                conteudo: " ",
                dowload: "../../apostilas/photoshop/apostilas/apostilaMedio.pdf"
            },
            {
                nome: "Apostila Difícil",
                titulo: "Terceira apostila",
                conteudo: " ",
                dowload: "../../apostilas/photoshop/apostilas/apostilaDificil.pdf"
            },
        ]
    },
    {
        nome: "Desafio",
        subitens: [
            {
                nome: "Fácil",
                titulo: "Desafio fácil",
                conteudo: "Complete os desafios sugeridos",
                dowload: "../../apostilas/photoshop/desafios/photoFacil.pdf"
            },
            {
                nome: "Médio",
                titulo: "Desafio médio",
                conteudo: "Complete os desafios sugeridos",
                dowload: "../../apostilas/photoshop/desafios/photoMedio.pdf"
            },
            {
                nome: "Difícil",
                titulo: "Desafio difícil",
                conteudo: "Complete os desafios sugeridos",
                dowload: "../../apostilas/photoshop/desafios/photoDificil.pdf"
            },
        ]
    },
];

const cursoNome = [
    { nome_curso: "Photoshop" }
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
