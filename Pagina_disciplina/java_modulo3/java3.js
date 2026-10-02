const caixas = [
    {
        nome: "Introdução",
        subitens: [
            { 
                nome: "O'que é a lógica?",
                titulo: "O'que é a lógica?", 
                conteudo: "lógica de programação, ou so lógica, é o termo designado a compreensão do pensamento de uma máquina, quando você pensa 'vou pegar a caneta dentro da gaveta', você sabe que deve abrir a gaveta primeiro, porém a máquina não, por causa disso que é tão importante que você aprenda a pensar como a máquina ",
            },
            {
                nome: "Pensando como um robô",
                titulo: "Pensando como um robô",
                conteudo: " Agora se questione, quantos passos tem cada ação simples do seu dia a dia? aquelas que você nem percebe? pense no ato de vestir uma roupa, você primeiro se move até o armário e roupeiro, depois pega a roupa desejada, caso esteja vestindo uma roupa deve se despir, porém apenas da parte desejada, e somente após isso pode pôr a roupa desejada, são muitos passos para algo muito simples. Agora imagine outras situações: tomar banho, sair para uma caminhada, etc. "
            }
        ]
    },
    {
        nome: "Video",
        subitens: [
            {
                nome: "Curso de java aula 3: comparação de dados",
                titulo: "Conteúdo em Vídeo",
                conteudo: "Veja o vídeo explicativo:",
                iframe: "https://www.youtube.com/embed/viKFofVyW5E?si=2KUIxFcMaA_P_4rj"
            }
        ]
    },
    {
        nome: "Apostila",
        subitens: [
            {
                nome: "Apostila Completa",
                titulo: "Apostila para Download",
                conteudo: "Clique no botão para baixar a apostila.",
                dowload: "../../apostilas/java_/java3/apostila3.pdf"
            }
        ]
    },
    {
        nome: "Desafio",
        subitens: [
            {
                nome: "Desafio Final de Comparação de Dados",
                titulo: "Resolva o Desafio",
                conteudo: "Complete o formulário abaixo para finalizar o desafio:",
                iframe: "https://docs.google.com/forms/d/e/1FAIpQLSdaUorJKl8ufowCzIkeXQQj04VGruXXLJOVicuvPZe3wik2bg/viewform"
            }
        ]
    },
];

const cursoNome = [
    { nome_curso: "Comparação de dados - JAVA" }
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
