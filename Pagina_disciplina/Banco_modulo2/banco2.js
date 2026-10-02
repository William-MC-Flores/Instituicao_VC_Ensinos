const caixas = [
    {
        nome: "Introdução",
        subitens: [
            {
                nome: "O que vamos aprender?",
                titulo: "INTRODUÇÃO AO MÓDULO 2",
                conteudo: "O módulo 2 mostra que os modelos conceituais de banco de dados são formas de estruturar os dados de maneira a facilitar o armazenamento, o acesso e a manipulação da informação. Existem diferentes modelos que atendem a necessidades específicas: O modelo hierárquico organiza os dados em uma estrutura de árvore, na qual cada nó possui uma relação pai-filho. Essa estrutura é rígida e unidirecional, funcionando bem para consultas que seguem a hierarquia definida, mas apresentando dificuldades em representar relações mais complexas. O modelo em redes utiliza grafos para estabelecer conexões entre entidades, permitindo múltiplos relacionamentos e maior flexibilidade. Esse modelo é indicado para situações onde há necessidade de conexões complexas, mas sua implementação e manutenção podem ser mais complicadas. Já o modelo relacional organiza os dados em tabelas compostas por linhas e colunas, com o uso da linguagem SQL para manipulação. É um modelo simples, amplamente utilizado, escalável e fácil de gerenciar, mas pode não ser tão eficiente para grandes volumes de dados interconectados.O processo de criação de bancos de dados começa com a modelagem, que transforma os requisitos levantados em uma estrutura eficiente. Os conceitos fundamentais incluem as entidades, que representam objetos do mundo real; os relacionamentos, que definem interações entre entidades; e os atributos, que descrevem características das entidades. A notação de Peter Chen é uma forma gráfica de representar os diagramas de entidade-relacionamento, com elementos como retângulos para entidades, losangos para relacionamentos e elipses para atributos. Os tipos de dados também são importantes, pois definem o formato das informações armazenadas, como números, textos e datas. Além disso, a cardinalidade ajuda a especificar quantas instâncias de uma entidade podem se relacionar com outra, como relações um para um, um para muitos ou muitos para muitos. Com base nesses conceitos, o objetivo principal é criar um modelo de dados bem estruturado, que atenda às necessidades do sistema e assegure a integridade e eficiência na manipulação das informações."
            },
        ]
    },
    {
        nome: "Video",
        subitens: [
            {
                nome: "Aula 1",
                titulo: " Mayara Maciel - Modelos Conceituais de Banco de Dados",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/_W4Yn5AIem8?si=5wkA8Gj74Bh8AD4x"
            },
            {
                nome: "Aula 2",
                titulo: "Mayara Maciel - Vídeo Aula 5",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/hysLBrxhnRE?si=zGwa2c6BOo-C77Mc"
            },
        ]
    },
    {
        nome: "Apostila",
        subitens: [
            {
                nome: "Apostila 4",
                titulo: "Apostila para Download",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/banco/banco2/apostila4.pdf"
            },
            {
                nome: "Apostila 5",
                titulo: "Apostila para Download",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/banco/banco2/apostila5.pdf"
            },
        ]
    },
    {
        nome: "Desafio",
        subitens: [
            {
                nome: "Desafio final do Módulo 2",
                titulo: "Resolva o Desafio",
                conteudo: "Complete o formulário abaixo para finalizar o desafio:",
                iframe: "https://docs.google.com/forms/d/11dY1gl28mGBlwDBJ3ztifZ3A364KYMiO-1txc80U63U/viewform?edit_requested=true"
            }
        ]
    },
];

const cursoNome = [
    { nome_curso: "Banco de Dados 2" }
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
