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
    const pontuacoes = [
        Number(document.getElementById("input-contas").value),
        Number(document.getElementById("input-navegacao").value),
        Number(document.getElementById("input-dispositivos").value),
        Number(document.getElementById("input-mensagens").value),
        Number(document.getElementById("input-backup").value),
        Number(document.getElementById("input-privacidade").value)
    ];

    return pontuacoes;
}

// Realiza toda a avaliação:
function realizarAvaliacao() {

    const pontuacoes = obterPontuacoes();

    // Verifica se todas as notas estão entre 0 e 10:
    for (const pontuacao of pontuacoes) {

        if (
            pontuacao < 0 ||
            pontuacao > notaMaxima ||
            Number.isNaN(pontuacao)
        ) {
            alert("Digite todas as pontuações entre 0 e 10.");
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

// Botão para calcular:
document.getElementById("btn-calcular")
    .addEventListener("click", realizarAvaliacao);
