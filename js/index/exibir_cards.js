
const cards_exibir = [
    {
        titulo: "Curso grátis de Banco de Dados",
        descricao: "Aprenda a utilizar um banco de dados, com todas as suas funções e lógicas!",
        brand: "database",
        icons: ["fa-solid fa-database"],
        dificuldade: "Fácil",
        categoria: "back-end",
        duracao: "1:35h",
        ir: "pages/disciplinas.php"
    },
    {
        titulo: "Curso grátis de JAVA",
        descricao: "Aprenda a programar em Java!",
        brand: "java",
        icons: ["fa-solid fa-mug-hot"],
        dificuldade: "Fácil",
        categoria: "back-end",
        duracao: "1h",
        ir: "pages/disciplinas.php"
    },
    {
        titulo: "Ilustrator",
        descricao: "Faça seus supers desenhos!!",
        brand: "illustrator",
        icons: ["fa-solid fa-pen-nib"],
        dificuldade: "Fácil",
        categoria: "front-end",
        duracao: "3h",
        ir: "pages/disciplinas.php"
    }
]

const container_cards_exibir = document.querySelector("#cards_exibir");
const catalogUrl = container_cards_exibir?.dataset.catalogUrl;

const verCards = (ver) => {
    container_cards_exibir.innerHTML = "";

    ver.forEach(a => {
        container_cards_exibir.innerHTML += `
                <div class="card" data-id="${a.titulo}" data-course-brand="${a.brand}">
            <div class="container_card">
                <div class="foto_card course-icons" aria-hidden="true">
                    ${a.icons.map(icon => `<i class="${icon} course-icon"></i>`).join("")}
                </div>
                <div class="duracao_card">
                    <i class="fa-regular fa-clock" aria-hidden="true"></i>
                    <h2>${a.duracao}</h2>
                </div>
                <div class="escrita_card">
                    <h1>${a.titulo}</h1>
                </div>
                <div class="item_dificuldade">
                    <div class="dificuldade_card">
                        <i class="fa-solid fa-chart-simple" aria-hidden="true"></i>
                        <h2>${a.dificuldade}</h2>
                    </div>
                    <div class="dificuldade_card">
                        <i class="fa-solid fa-layer-group" aria-hidden="true"></i>
                        <h2>${a.categoria}</h2>
                    </div>
                </div>

            </div>
            <div class="descricao">
                <div class="foto_card course-icons" aria-hidden="true">
                    ${a.icons.map(icon => `<i class="${icon} course-icon"></i>`).join("")}
                </div>
                <h2>${a.titulo}</h2>
                <p>${a.descricao}</p>
                <div class="links-hover">
                    <a href="${catalogUrl || a.ir}" class="btn-ver-mais" data-curso="${a.ir}">Veja mais</a>
                </div>
            </div>
        </div>
        `
    });
}

verCards(cards_exibir);
