// TODO: Da pra colocar o search input e o fetch dentro de funções e carregar eles no onload do body
// Util pra depois quando eu for fazer os sensores, posso criar uma função que só pega os parametros
const produtosCardTemplate = document.querySelector("[data-produtos-template]");
const produtosCardContainer = document.querySelector("[data-produtos-cards-container]");
const searchInput = document.querySelector("[data-search]");

let produtos = [];

// Essa parte esconde o card caso o input do usuário seja diferente do NOME ou APELIDO no arquivo JSON
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    let algumProdutoCorresponde = false;

    produtos.forEach(produto => {
        console.log(value)
        const hasWord = value.split(' ').every(word => produto.nome.toLowerCase().includes(word)) || value.split('.').every(word => produto.apelido.toLowerCase().includes(word))
        produto.element.classList.toggle("hide", !hasWord)

        if (hasWord) {
            algumProdutoCorresponde = true;
        }
    })
    let avisoErro = document.getElementById("avisoDeErro");
    avisoErro.classList.toggle('hide', algumProdutoCorresponde);
})

// Parte responsável por ler o Json e retornar as informações para a pesquisa e também para o card
fetch("/produtos.json")
    .then(res => res.json())
    .then(data => {
        // Organiza de forma alfabética pelo nome o json
        data.sort((a, b) => a.nome.localeCompare(b.nome));
        produtos = data.map(produto => {
            console.log("Produto encontrado: " + produto.nome)

            // Cards
            const card = produtosCardTemplate.content.cloneNode(true).children[0]
            const nome = card.querySelector("[data-nome]")
            const desc = card.querySelector("[data-desc]")
            const img = card.querySelector("[data-img]")
            const btnVerMais = card.querySelector("[data-btn-ver-mais]");
            // const link = card.querySelector("[data-link]")

            nome.textContent = produto.nome
            desc.textContent = produto.desc
            img.setAttribute("src", produto.img)

            btnVerMais.setAttribute("data-unico-nome", produto.nome);

            // FIXME: Os modals que são aberto não são excluidos depois, preciso arrumar isso.
            // Essa parte é necessária para que o botão Ver Mais crie um modal para o produto!
            btnVerMais.addEventListener("click", () => {
                // Obtenha o nome do produto associado ao botão clicado
                const nomeUnicoProduto = btnVerMais.getAttribute("data-unico-nome");
        
                // Crie um id dinâmico para o modal usando o nome do produto
                const modalId = `exampleModal-${nomeUnicoProduto}`;
        
                // Verifique se o modal já foi criado, se não, crie e adicione ao DOM
                let modalElement = document.getElementById(modalId);
                if (!modalElement) {
                    modalElement = document.createElement('div');
                    modalElement.id = modalId;
                    modalElement.classList.add('modal', 'fade');

                    // Aqui é colocado a ordem na qual os Guias de Ativação devem aparecer!
                    // LEMBRETE: TODOS os produtos devem estar cadastrados aqui.
                    const orderOfFields = ["gl200", "gl300", "gl320mg", "gl500", "gv55", "gv65", "gv300", "gv300n", "gv300can", "gv350mg", "gv355 ceu"];

                    //FIXME: Ao clicar para abrir outro guia ele não fecha o outro
                    const gaModalButton = orderOfFields.map(gaKey => {
                        const gaBtnSrc = produto.gaModal[gaKey];
                        return gaBtnSrc ? `
                            <div>
                                <button class="btn btn-qblue mb-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${gaKey}" aria-expanded="false" aria-controls="collapse${gaKey}">
                                    ${gaKey.toLocaleUpperCase()}
                                </button>
                            </div>` : '';
                    }).join('');

                    const gaModalContentImg = orderOfFields.map(gaKey => {
                        const gaImgSrc = produto.gaModal[gaKey];
                        return gaImgSrc ? `

                            <div class="collapse" id="collapse${gaKey}">
                                <img class="img-fluid w-60" src="${gaImgSrc}" alt="${gaKey.toLocaleUpperCase()}">
                            </div>` : '';
                    }).join('');

                    modalElement.innerHTML = `
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="${modalId}">${produto.nome} - ${produto.apelido}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <p>${produto.descModal}</p>
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
        
                // Remover event listeners antigos antes de adicionar um novo
                btnVerMais.removeEventListener('click', () => {});

                // Adicionar ouvinte de evento para remover o modal do DOM após ser fechado
                modalElement.addEventListener('hidden.bs.modal', () => {
                    // Remover o elemento do DOM
                    document.body.removeChild(modalElement);
                });

                // Abra o modal correspondente ao produto
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
        
                 // Adicionar ouvinte de evento ao modalElement para liberar recursos
                modalElement.addEventListener('hidden.bs.modal', () => modal.dispose());

                console.log("Nome do Produto no Modal:", nomeUnicoProduto);
            });
    
            produtosCardContainer.append(card)

            // Aqui eu retorno um objeto para ser usado na busca.
            return {nome: produto.nome, apelido: produto.apelido, element: card}
        });
    });