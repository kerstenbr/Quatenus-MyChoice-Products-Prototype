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
        // TODO:  Caso não encontre nenhum produto, mostre uma mensagem de erro. Lembrar de resetar caso a pessoa procure por um produto!]
        //FIXME: Por algum motivo que eu não entendi até agora, se tu digitar ft.b o erro aparece
        if (isVisible == " "){
            let avisoErro = document.getElementById("avisoDeErro")
            avisoErro.classList.remove('d-none')
        } else {
            let avisoErro = document.getElementById("avisoDeErro")
            avisoErro.classList.add('d-none');
        }
    })
})

// Essa parte é responsavel por ler o arquivo json
fetch("/produtos.json")
    .then(res => res.json())
    .then(data => {
        // Aqui estou passando pelo arquivo json e no final retorno um map de objetos dele (usado para a pesquisa)
        produtos = data.map(produto => {
            // console.log(produto)
            // TODO: Tenho que adicionar TAGS no json e procurar por elas aqui, lembrando que vão ser arrays.....
            const card = produtosCardTemplate.content.cloneNode(true).children[0]
            const img = card.querySelector("[data-img]")
            const nome = card.querySelector("[data-nome]")
            const desc = card.querySelector("[data-desc]")
            const link = card.querySelector("[data-link]")
            
            nome.textContent = produto.nome
            desc.textContent = produto.desc
            img.setAttribute("src", produto.img)
            link.setAttribute("href", produto.link)
            // desc.textContent = produto.apelido

            produtosCardContainer.append(card)

            // Aqui eu retorno um objeto para ser usado na busca.
            // No futuro se eu quiser adicionar tags por exemplo, tenho que adicionar elas aqui também
            return {nome: produto.nome, apelido: produto.apelido, element: card}
        });
    });
