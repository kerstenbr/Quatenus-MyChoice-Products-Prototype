const productsCardTemplate = document.querySelector("[data-products-template]");
const productsCardContainer = document.querySelector("[data-products-cards-container]");
const searchInput = document.querySelector("[data-search]");

let products = [];

// ------ Todos os rastreadores devem ser cadastrados aqui na ordem de visualização deles dentro do modal! ------
const orderOfFields = ["gl200", "gl300", "gl320mg", "gl500", "gv55", "gv65", "gv300", "gv300n", "gv300can", "gv350mg", "gv355 ceu"];
// ------ Todos os rastreadores devem ser cadastrados aqui na ordem de visualização deles dentro do modal! ------

// Função para carregar os produtos a partir do arquivo json
function loadProductsFromJson() {
    fetch("/produtos.json")
        .then(res => res.json())
        .then(data => {
            data.sort((a, b) => a.nome.localeCompare(b.nome));
            products = data.map(product => {
                console.log("Produto encontrado: " + product.nome);
                return createProductCard(product);
            });
        });
}

loadProductsFromJson();

// Event listener para o que o usuário está pesquisando
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    filterProducts(value);
});

// Função que esconde os produtos que não batem com a pesquisa do usuário
function filterProducts(value) {
    let matchedProduct = false;

    products.forEach(product => {
        const hasWord = value.split(' ').every(word => product.name.toLowerCase().includes(word)) ||
                        value.split('.').every(word => product.alias.toLowerCase().includes(word));

        product.element.classList.toggle("hide", !hasWord);

        if (hasWord) {
            matchedProduct = true;
        }
    });

    let errorWarning = document.getElementById("errorWarning");
    errorWarning.classList.toggle('hide', matchedProduct);
}

// Função para criar os cards dos produtos
function createProductCard(product) {
    const card = productsCardTemplate.content.cloneNode(true).children[0];
    const name = card.querySelector("[data-name]");
    const desc = card.querySelector("[data-desc]");
    const img = card.querySelector("[data-img]");
    const btn = card.querySelector("[data-btn-ver-mais]");

    name.textContent = product.nome;
    desc.textContent = product.desc;
    img.setAttribute("src", product.img);
    btn.setAttribute("data-unique-name", product.nome);

    btn.addEventListener("click", () => {
        const modalNameId = btn.getAttribute("data-unique-name");
        console.log("Modal Aberto: ", modalNameId);
        createProductModal(product);
    });

    productsCardContainer.append(card);

    return { name: product.nome, alias: product.apelido, element: card };
}

// Função para criar o modal do produto específico clicado
function createProductModal(product) {
    const modalId = `exampleModal-${product.nome}`;

    let modalElement = document.getElementById(modalId);
    if (!modalElement) {
        modalElement = document.createElement('div');
        modalElement.id = modalId;
        modalElement.classList.add('modal', 'fade');

        const gaModalButton = orderOfFields.map(gaKey => {
            const gaBtnSrc = product.gaModal[gaKey];
            return gaBtnSrc ? `
                <div class="d-inline-block">
                    <button class="btn btn-qblue mb-3" id="btn${gaKey}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${gaKey}" aria-expanded="false" aria-controls="collapse${gaKey}">
                        ${gaKey.toLocaleUpperCase()}
                    </button>
                </div>` : '';
        }).join('');

        const gaModalContentImg = orderOfFields.map(gaKey => {
            const gaImgSrc = product.gaModal[gaKey];
            return gaImgSrc ? `
                <div class="collapse card shadow-sm mb-2" id="collapse${gaKey}">
                    <h6 class="mt-1 ms-2">${gaKey.toLocaleUpperCase()}</h6>
                    <img class="img-fluid" src="${gaImgSrc}" alt="${gaKey.toLocaleUpperCase()}">
                </div>` : '';
        }).join('');
        
        modalElement.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${modalId}">${product.nome} - ${product.apelido}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>${product.descModal}</p>
                        <div>
                            <h5>Guias de Ativação</h5>
                        </div>
                        <div>
                            <div>${gaModalButton}</div>
                            <div>${gaModalContentImg}</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-qblue" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalElement);
    }

    const modal = new bootstrap.Modal(modalElement);
    modal.show();

    const closeHandler = () => {
        document.body.removeEventListener('click', buttonClickHandler);
        document.removeEventListener('hidden.bs.modal', closeHandler);
    };

    // FIXME: Se a clicar muito rápido a cor do botão não muda
    const buttonClickHandler = (event) => {
        const targetId = event.target.id;
        if (targetId && targetId.startsWith('btn')) {
            //const gaKey = targetId.substring(3);
            const btnElement = document.getElementById(targetId);

            if (btnElement.classList.contains("btn-qblue")) {
                // console.log("Botão clicado pela primeira vez");
                btnElement.classList.remove("btn-qblue");
                btnElement.classList.add("btn-qorange");
            } else if (btnElement.classList.contains("btn-qorange")) {
                // console.log("Botão clicado pela segunda vez");
                btnElement.classList.remove("btn-qorange");
                btnElement.classList.add("btn-qblue");
            }
        }
    };

    document.body.addEventListener('click', buttonClickHandler);
    document.addEventListener('hidden.bs.modal', closeHandler);

    modalElement.addEventListener('hidden.bs.modal', () => {
        closeHandler();
        document.body.removeChild(modalElement);
        modal.dispose();
    });
}