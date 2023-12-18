function produto(){
    const ft_full_jor = ["identificação", "condutor", "localização"];

    const atributo1 = document.getElementById("atr1").value;
    
    
    let resposta = ft_full_jor.includes(atributo1);

    if (resposta) {
        console.log("ft_full_jor");
        resposta = "ft_full_jor";
        document.getElementById("resposta").innerHTML = resposta;
    } else {
        console.log("Nenhum produto cadastrado");
        resposta = "Nenhum produto cadastrado";
        document.getElementById("resposta").innerHTML = resposta;
    } 
    
}


