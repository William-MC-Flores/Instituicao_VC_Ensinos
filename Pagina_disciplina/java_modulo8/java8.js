const caixas = [
    {
        nome: "Introdução",
        subitens: [
            {
                nome: "O que é JOptionPane?",
                titulo: "O que é JOptionPane?",
                conteudo: "Olá, caro aluno! Você já deve ter se deparado com aqueles famosos pop-ups de erro no seu computador, ou até mesmo com aqueles que pedem permissão para acessar algum conteúdo. Para te ajudar a recordar, lembra do Windows XP? Quando o sistema travava e surgiam inúmeros pop-ups de erro até o computador parar completamente? Pois é, são esses mesmos pop-ups que estamos falando! Eles são chamados de JOptionPane e são amplamente utilizados em Java para interagir com o usuário através de caixas de diálogo.",
                img: "../../img/popp.jpeg"
            },
        ]
    },
    {
        nome: "Video",
        subitens: [
            {
                nome: "Aula 1",
                titulo: "Aprenda a usar caixas de mensagem!! - JOptionPane - Parte 1",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/aXMSmjzV-e0?si=ZndOa5b7wdGtWH9P"
            },
            {
                nome: "Aula 2",
                titulo: "Aprenda a usar modelos padrões de alternativas!! - JOptionpane - Parte 2",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/7lEG-e1j4nU?si=vZwfaZmoPfpVyU2b"
            },
            {
                nome: "Aula 3",
                titulo: "Aprenda a usar caixas de dialogo para cadastro!! - JOptionpane - Parte 3",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/9t1hhV8GBdw?si=0KJ2qxK8R_JrQQRv"
            },
            {
                nome: "Aula 4",
                titulo: "Aprenda a fazer um jogo com alternativas personalizadas!! - JOptionPane - Parte 4",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/p3RCVHHqEvE?si=xNc5kVXpaE5E_Kkv"
            },
            {
                nome: "Aula 5",
                titulo: "Aprenda a criar um loja usando combo box!! - JOptionPane - Parte final",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/KjudlBKdpsg?si=DGEvT8gyxLlvOLGq"
            },
        ]
    },
    {
        nome: "Apostila",
        subitens: [
            {
                nome: "Apostila Completa",
                titulo: "Apostila para Download",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/java_/java8/apostila8.pdf"
            }
        ]
    },
    {
        nome: "Desafio",
        subitens: [
            {
                nome: "Prova de conhecimentos gerais JOptionPane.",
                titulo: "Prova de conhecimentos gerais JOptionPane.",
                conteudo: "Complete o formulário abaixo para finalizar o desafio:",
                iframe: "https://docs.google.com/forms/d/e/1FAIpQLSefS6p5qtH9GcuoCvHaHOxU09yEa4z7dRkrk3SES_RLNdkvcA/viewform"
            },
            {
                nome: "Desafios práticos JOptionPane",
                titulo: "Desafios práticos JOptionPane",
                conteudo: "Complete o formulário abaixo para finalizar o desafio:",
                iframe: "https://docs.google.com/forms/d/e/1FAIpQLSftmt1Znq7X5aVrkD9GYXoSOZDok1L2sG_kTXWSZpCtFToVYA/viewform"
            },
        ]
    },
];

const cursoNome = [
    { nome_curso: "JOptionPane - JAVA" }
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
                ${item.img ? `<img src="${item.img}" alt="">` : ""}

                ${item.iframe ? `
                    <div class="conteudo_video">
                        <iframe src="${item.iframe}"></iframe>
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
