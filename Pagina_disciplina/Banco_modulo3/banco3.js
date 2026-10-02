const caixas = [
    {
        nome: "Introdução",
        subitens: [
            {
                nome: "O que vamos aprender?",
                titulo: "INTRODUÇÃO AO MÓDULO 3",
                conteudo:"As apostilas 7, 8 e 9 apresentam conceitos fundamentais sobre bancos de dados. A apostila 7 aborda o mapeamento do Modelo Entidade-Relacionamento (ER) para o modelo relacional, explicando como transformar relações: na relação 1:1, utilizam-se duas tabelas, onde a chave primária de uma é chave estrangeira na outra; na relação 1:N, a chave primária da entidade do lado “1” é adicionada como chave estrangeira na tabela do lado “N”; já a relação N:N requer uma tabela associativa com as chaves primárias das duas entidades formando uma chave composta. A apostila 8 trata da normalização, um processo que organiza os dados para evitar redundâncias e inconsistências. A Primeira Forma Normal elimina valores multivalorados, deixando apenas valores atômicos. A Segunda Forma Normal remove dependências parciais, garantindo que os atributos dependem totalmente da chave primária. Por fim, a Terceira Forma Normal elimina dependências transitivas, assegurando que atributos não-chave dependem somente da chave primária. Já a apostila 9 introduz o SQL, linguagem usada para gerenciar bancos de dados relacionais. São apresentados tipos de dados (como inteiros e textos), restrições (como PRIMARY KEY e FOREIGN KEY) e comandos. A DDL (CREATE, ALTER, DROP) define a estrutura do banco, enquanto a DML (INSERT, UPDATE, DELETE, SELECT) manipula os dados. A criação de um banco envolve comandos como CREATE DATABASE e CREATE TABLE, possibilitando estruturar e gerenciar os dados com eficiência."
            },
        ]
    },
    {
        nome: "Video",
        subitens: [
            {
                nome: "Aula 1",
                titulo: "Mapeamento do modelo conceitual para o Lógico",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/AsiWq6N2sKQ?si=cVN_H6zz7XaXS2jc"
            },
            {
                nome: "Aula 2",
                titulo: "Gabriel Sandes e Vitor Rosa - Vídeo Aula 7: Normalização de Dados",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/4IZg2gqRahg?si=hsDT9cAQN_g38b7p"
            },
            {
                nome: "Aula 3",
                titulo: "Gabriel Sandes - Vídeo Aula 8: Introdução ao SQL",
                conteudo: " ",
                iframe: "https://www.youtube.com/embed/fzSuz-uQMLg?si=zCgORrFMyBNi5y7f"
            },
        ]
    },
    {
        nome: "Apostila",
        subitens: [
            {
                nome: "Apostila 6",
                titulo: "Apostila 6",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/banco/banco3/apostila6.pdf"
            },
            {
                nome: "Apostila 7",
                titulo: "Apostila 7",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/banco/banco3/apostila7.pdf"
            },
            {
                nome: "Apostila 8",
                titulo: "Apostila 8",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/banco/banco3/apostila8.pdf"
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
                iframe: "https://docs.google.com/forms/d/1xgmJySUhtuxAkCFsxE1vUxQ-lOy6LGqBsOUCBkRX7Yo/viewform?edit_requested=true"
            }
        ]
    },
];

const cursoNome = [
    { nome_curso: "Banco de Dados 3" }
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
                        <iframe src="${item.iframe}" frameborder="0" height="600px" allowfullscreen></iframe>
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
