// TODO: Separar o que da por funções e deixar o código mais organizado
const productsCardTemplate = document.querySelector("[data-products-template]");
const productsCardContainer = document.querySelector("[data-products-cards-container]");
const searchInput = document.querySelector("[data-search]");

let products = [];

// LEMBRETE: Este fetch é quem lê o arquivos json e cria os cards, atualmente está responvel por
// criar os modal também. Não sei se isso é o mais certo a se fazer, talvez separar depois.
fetch("/produtos.json")
    .then(res => res.json())
    .then(data => {
        // TODO: Esse data.sort está organizando todos os cards em ordem alfabética a partir do nome
        // Seria legal ele funcionar só na primeira parte, e quando você pesquisa algo eu deveria desabilitar isso.
        data.sort((a, b) => a.nome.localeCompare(b.nome));
        products = data.map(product => {
            console.log("Produto encontrado: " + product.nome)

            // Cards
            const card = productsCardTemplate.content.cloneNode(true).children[0]
            const name = card.querySelector("[data-name]")
            const desc = card.querySelector("[data-desc]")
            const img = card.querySelector("[data-img]")
            const btn = card.querySelector("[data-btn-ver-mais]");

            name.textContent = product.nome
            desc.textContent = product.desc
            img.setAttribute("src", product.img)
            btn.setAttribute("data-unique-name", product.nome);

            // Modal
            btn.addEventListener("click", () => {
                // Obtenha o nome do produto associado ao botão clicado
                const modalNameId = btn.getAttribute("data-unique-name");
                console.log("Nome do Produto no Modal:", modalNameId);

                // Crie um id dinâmico para o modal usando o nome do produto
                const modalId = `exampleModal-${modalNameId}`;
        
                // Verifique se o modal já foi criado, se não, crie e adicione ao DOM
                let modalElement = document.getElementById(modalId);
                if (!modalElement) {
                    modalElement = document.createElement('div');
                    modalElement.id = modalId;
                    modalElement.classList.add('modal', 'fade');

                    // Aqui é colocado a ordem na qual os Guias de Ativação devem aparecer
                    // LEMBRETE: TODOS os produtos devem estar cadastrados aqui.
                    const orderOfFields = ["gl200", "gl300", "gl320mg", "gl500", "gv55", "gv65", "gv300", "gv300n", "gv300can", "gv350mg", "gv355 ceu"];

                    //FIXME: Ao clicar para abrir outro guia ele não fecha o atual
                    const gaModalButton = orderOfFields.map(gaKey => {
                        const gaBtnSrc = product.gaModal[gaKey];
                        return gaBtnSrc ? `
                            <div class="d-inline-block">
                                <button class="btn btn-qblue mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${gaKey}" aria-expanded="false" aria-controls="collapse${gaKey}">
                                    ${gaKey.toLocaleUpperCase()}
                                </button>
                            </div>` : '';
                    }).join('');

                    const gaModalContentImg = orderOfFields.map(gaKey => {
                        const gaImgSrc = product.gaModal[gaKey];
                        return gaImgSrc ? `

                            <div class="collapse" id="collapse${gaKey}">
                                <img class="img-fluid w-60" src="${gaImgSrc}" alt="${gaKey.toLocaleUpperCase()}">
                            </div>` : '';
                    }).join('');

                    // TODO: Retirar o botão Guia de Ativação, trocar por apenas um título
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
                                        <button class="btn btn-qblue mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGuias" aria-expanded="false" aria-controls="collapseGuias">
                                            Guias de Ativação
                                        </button>
                                    </div>
                                    <div class="collapse" id="collapseGuias">
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

                // btn.removeEventListener('click', () => {});

                // Abra o modal correspondente ao produto
                const modal = new bootstrap.Modal(modalElement);
                console.log(modal)
                modal.show();

                // Adiciona um event listener para remover o modal do DOM após ser fechado
                modalElement.addEventListener('hidden.bs.modal', () => {
                    document.body.removeChild(modalElement);
                });
        
                // Adicionar ouvinte de evento ao modalElement para liberar recursos
                modalElement.addEventListener('hidden.bs.modal', () => modal.dispose());
            });
    
            productsCardContainer.append(card)

            // Aqui eu retorno um objeto para ser usado na busca. 
            return {name: product.nome, alias: product.apelido, element: card}
        });
    });


// Essa parte esconde o card caso o input do usuário seja diferente do NOME ou APELIDO no arquivo JSON
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    let matchedProduct = false;

    products.forEach(product => {
        console.log(value)
        const hasWord = value.split(' ').every(word => product.name.toLowerCase().includes(word)) || value.split('.').every(word => product.alias.toLowerCase().includes(word))
        product.element.classList.toggle("hide", !hasWord)

        if (hasWord) {
            matchedProduct = true;
        }
    })
    let errorWarning = document.getElementById("errorWarning");
    errorWarning.classList.toggle('hide', matchedProduct);
})

