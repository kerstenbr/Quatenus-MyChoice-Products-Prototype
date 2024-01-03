const produtosCardTemplate = document.querySelector("[data-produtos-template]");
const produtosCardContainer = document.querySelector("[data-produtos-cards-container]");
const searchInput = document.querySelector("[data-search]");

let produtos = [];

// Essa parte esconde o card caso o input do usuário seja diferente do NOME ou APELIDO no arquivo JASON
// Acho que da pra melhorar muito isso, atualmente não da para digitar fleet jornada por exemplo, tem
// que escrever fleet full jornada certinho. Por isso o elastic serach é 1000x melhor nesse quesito.
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    produtos.forEach(produto => {
        const isVisible = produto.nome.toLowerCase().includes(value) || produto.apelido.toLowerCase().includes(value)
        produto.element.classList.toggle("hide", !isVisible)
        
    })
})

// Essa parte é responsavel por ler o arquivo json
fetch("/produtos.json")
    .then(res => res.json())
    .then(data => {
        // Aqui estou passando pelo arquivo json e no final retorno um map de objetos dele (usado para a pesquisa)
        produtos = data.map(produto => {
            // console.log(produto)
            const card = produtosCardTemplate.content.cloneNode(true).children[0]
            const header = card.querySelector("[data-header]")
            const body = card.querySelector("[data-body]")
            const pag = card.querySelector("[data-pag]")
            
            pag.setAttribute("href", produto.pag)
            header.textContent = produto.nome
            body.textContent = produto.alias

            produtosCardContainer.append(card)

            // Aqui eu retorno um objeto para ser usado na busca.
            return {nome: produto.nome, apelido: produto.alias, element: card}
        });
    });
