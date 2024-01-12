const produtosCardTemplate = document.querySelector("[data-produtos-template]");
const produtosCardContainer = document.querySelector("[data-produtos-cards-container]");
const searchInput = document.querySelector("[data-search]");

let produtos = [];

// Essa parte esconde o card caso o input do usuário seja diferente do NOME ou APELIDO no arquivo JSON
searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    produtos.forEach(produto => {
        console.log(value)
        const isVisible = value.split(' ').every(word => produto.nome.toLowerCase().includes(word)) || value.split('.').every(word => produto.apelido.toLowerCase().includes(word))
        produto.element.classList.toggle("hide", !isVisible)
    })
    // FIXME: Por algum motivo que eu não entendi até agora, se tu digitar um produto que não tenha 2 respostas, exemplo: ft.basic ou ft.guincho, a mensagem de erro também aparece...
    // if (!isVisible){
    //     let avisoErro = document.getElementById("avisoDeErro")
    //     avisoErro.classList.remove('d-none')
    // } else {
    //     let avisoErro = document.getElementById("avisoDeErro")
    //     avisoErro.classList.add('d-none');
    // }
})

// Parte responsável por ler o Json e retornar as informações para a pesquisa e também para o card
fetch("/produtos.json")
    .then(res => res.json())
    .then(data => {
        produtos = data.map(produto => {
            // console.log(produto)
            const card = produtosCardTemplate.content.cloneNode(true).children[0]
            const nome = card.querySelector("[data-nome]")
            const desc = card.querySelector("[data-desc]")
            const img = card.querySelector("[data-img]")
            const imgLink = card.querySelector("[data-img-link]")
            const link = card.querySelector("[data-link]")
            
            nome.textContent = produto.nome
            desc.textContent = produto.desc
            img.setAttribute("src", produto.img)
            imgLink.setAttribute("href", produto.link) // Tive que fazer dessa forma pro link funcionar, vai saber.
            link.setAttribute("href", produto.link)
            // desc.textContent = produto.apelido

            produtosCardContainer.append(card)

            // Aqui eu retorno um objeto para ser usado na busca.
            return {nome: produto.nome, apelido: produto.apelido, element: card}
        });
    });