const produtosCardTemplate = document.querySelector("[data-produtos-template]");
const produtosCardContainer = document.querySelector("[data-produtos-cards-container]");
const searchInput = document.querySelector("[data-search]");

let produtos = [];

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    produtos.forEach(produto => {
        const isVisible = produto.nome.toLowerCase().includes(value) || produto.apelido.toLowerCase().includes(value)
        produto.element.classList.toggle("hide", !isVisible)
    })
})

fetch("/produtos.json")
    .then(res => res.json())
    .then(data => {
        produtos = data.map(produto => {
            console.log(produto)
            const card = produtosCardTemplate.content.cloneNode(true).children[0]
            const header = card.querySelector("[data-header]")
            const body = card.querySelector("[data-body]")
            const pag = card.querySelector("[data-pag]")
            
            pag.setAttribute("href", produto.pag)
            header.textContent = produto.nome
            body.textContent = produto.alias

            produtosCardContainer.append(card)

            return {nome: produto.nome, apelido: produto.alias, element: card}
        });
    });