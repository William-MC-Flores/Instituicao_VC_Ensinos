const caixas = [
    {
        nome: "Introdução",
        subitens: [
            {
                nome: "O que vamos aprender?",
                titulo: "Introdução ao Módulo 1",
                conteudo: "O módulo 1 fala sobre o banco de dados, é uma coleção estruturada de dados, organizada para armazenamento e recuperação eficiente.Ele utiliza modelos como orelacional, que organiza informações em tabelas, e o não relacional, que armazena dados em formatos como documentos e grafos.O gerenciamento desses dados é feito por um Sistema de Gerenciamento de Banco de Dados(SGBD), como MySQL, PostgreSQL e MongoDB, que oferece funcionalidades para acessar, modificar, e proteger os dados.Os bancos de dados possuem três níveis de abstração: físico, que trata do armazenamento dos dados no hardware; conceitual, que define a estrutura lógica como tabelas e relações; e de visão, que apresenta os dados acessíveis aos usuários. Um SGBD desempenha funções essenciais, como gerenciamento de dados, controle de acesso, realização de backups e manutenção da integridade. Entre os SGBDs, destacam-se o MySQL, conhecido por sua simplicidade e alto desempenho; o PostgreSQL, robusto e avançado, com suporte a transações complexas; e o MongoDB, que é não relacional, ideal para aplicações escaláveis e flexíveis. A administração de bancos de dados é responsabilidade do Administrador de Banco de Dados (DBA), que garante a segurança, desempenho e consistência do sistema. A arquitetura dos SGBDs é dividida em três camadas: física, que lida com o armazenamento; lógica, que organiza os dados; e visão, que oferece acesso aos usuários. Seus principais componentes incluem o gerenciamento de armazenamento, consultas, transações e logs, essenciais para manter o sistema eficiente e confiável."
            },
        ]
    },
    {
        nome: "Video",
        subitens: [
            {
                nome: "Aula 1",
                titulo: "Introdução ao Banco de Dados - Vitoria Gabriela",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/2R_hM6vULk0?si=oZNbIqtO0QAzTNEQ"
            },
            {
                nome: "Aula 2",
                titulo: "Yndaia Centeno - Vídeo Aula 2: SGBD's",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/xjg2J8mzkzU?si=tbQlWGui4eSRvM2m"
            },
            {
                nome: "Aula 3",
                titulo: "Yndaia Centeno - Vídeo Aula 3",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/Fdcda3KMvZA?si=XdtLI9OO10XCvrmE"
            },

        ]
    },
    {
        nome: "Apostila",
        subitens: [
            {
                nome: "Apostila 1",
                titulo: "Primeira apostila",
                conteudo: "Feita por Rafaela Cardoso",
                dowload: "../../apostilas/banco/banco1/apostila1.pdf"
            },
            {
                nome: "Apostila 2",
                titulo: "Segunda apostila",
                conteudo: "Feita por Gabrielly Mello",
                dowload: "../../apostilas/banco/banco1/apostila2.pdf"
            },
            {
                nome: "Apostila 3",
                titulo: "Terceira apostila",
                conteudo: "Feita por Gabrielly Mello",
                dowload: "../../apostilas/banco/banco1/apostila3.pdf"
            },
        ]
    },
    {
        nome: "Desafio",
        subitens: [
            {
                nome: "Desafio Final",
                titulo: "Resolva o Desafio",
                conteudo: "Complete o formulário abaixo para finalizar o desafio:",
                iframe: "https://docs.google.com/forms/d/1ZLkdOp8bFCfh9q_9MQ1xUIq379XbwrR4c0KJUiYlsw8/viewform?pli=1&pli=1&edit_requested=true"
            }
        ]
    },
];

const cursoNome = [
    { nome_curso: "Banco de Dados 1" }
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
