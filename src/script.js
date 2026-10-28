const nomeProjeto = "Guia de Segurança Digital";
const notaMaxima = 10;
// Calcula o total das pontuações:
function calcularTotal(pontuacoes) {
    let total = 0;

    for (const pontuacao of pontuacoes) {
        total += pontuacao;
    }
    
    return total;
}

// Calcula a média:
function calcularMedia(total, quantidade) {
    return total / quantidade;
}

// Conta as práticas que chegaram ao nível seguro:
function contarPraticasSeguras(pontuacoes) {
    let quantidadeSeguras = 0;

    for (const pontuacao of pontuacoes) {
        if (pontuacao >= 7 && pontuacao <= 10) {
            quantidadeSeguras++;
        }
    }

    return quantidadeSeguras;
}

// Classifica o resultado:
function classificarResultado(media) {
    if (media >= 7) {
        return "Proteção forte";
    } else if (media >= 4) {
        return "Proteção intermediária";
    } else {
        return "Proteção básica";
    }
}

// Pega os valores digitados pelo usuário:
function obterPontuacoes() {
    const ids = [
        "input-contas",
        "input-navegacao",
        "input-dispositivos",
        "input-mensagens",
        "input-backup",
        "input-privacidade"
    ];

    // Verifica se algum campo está vazio
    for (const id of ids) {
        const campo = document.getElementById(id);

        if (campo.value.trim() === "") {
            alert("Preencha todas as pontuações antes de continuar.");
            campo.focus();
            return null;
        }
    }

    // Converte os valores para números
    const pontuacoes = ids.map(id =>
        Number(document.getElementById(id).value)
    );

    return pontuacoes;
}

// Realiza toda a avaliação:
function realizarAvaliacao() {

    const pontuacoes = obterPontuacoes();

    if (pontuacoes === null) {
        return;
    }

    for (const pontuacao of pontuacoes) {
        if (
            !Number.isInteger(pontuacao) ||
            pontuacao < 0 ||
            pontuacao > notaMaxima
        ) {
            alert("Digite notas inteiras de 0 a 10.");
            return;
        }
    }

    const total = calcularTotal(pontuacoes);

    const media = calcularMedia(
        total,
        pontuacoes.length
    );

    const praticasSeguras =
        contarPraticasSeguras(pontuacoes);

    const classificacao =
        classificarResultado(media);

    // Mostra no console
    console.log(`Projeto: ${nomeProjeto}`);
    console.log(`Total de pontos: ${total}`);
    console.log(`Média: ${media.toFixed(2)}`);
    console.log(`Práticas em nível seguro: ${praticasSeguras}`);
    console.log(`Classificação: ${classificacao}`);

    // Mostra no HTML
    document.getElementById("total").textContent = total;

    document.getElementById("media").textContent =
        media.toFixed(2);

    document.getElementById("seguros").textContent =
        praticasSeguras;

    document.getElementById("classificacao").textContent =
        classificacao;
}

// Botão para calcular resultados:
document.getElementById("btn-calcular")
    .addEventListener("click", realizarAvaliacao);
