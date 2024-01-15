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
    avisoErro.classList.toggle('d-none', algumProdutoCorresponde);
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
                    // id="${modalId} //${produto.nome} //${produto.desc}
                    modalElement.innerHTML = `
                        <div class="modal-dialog modal-xl">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="${modalId}">${produto.nome}</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <p>${produto.descModal}</p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-qblue" data-bs-dismiss="modal">Fechar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(modalElement);
                }
        
                // Abra o modal correspondente ao produto
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
        
                console.log("Nome do Produto no Modal:", nomeUnicoProduto);
            });
    
            produtosCardContainer.append(card)

            // Aqui eu retorno um objeto para ser usado na busca.
            return {nome: produto.nome, apelido: produto.apelido, element: card}
        });
    });