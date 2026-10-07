const nomeProjeto = "Guia de Segurança Digital";
const notaMaxima = 10;
const avaliacaoAtiva = true;


// Calcula o total das pontuações
function calcularTotal(pontuacoes) {
    let total = 0;

    for (const pontuacao of pontuacoes) {
        total += pontuacao;
    }

    return total;
}


// Calcula a média
function calcularMedia(total, quantidade) {
    return total / quantidade;
}


// Conta as práticas que chegaram ao nível seguro
function contarPraticasSeguras(pontuacoes) {
    let quantidadeSeguras = 0;

    for (const pontuacao of pontuacoes) {
        if (pontuacao >= 7 && pontuacao <= 10) {
            quantidadeSeguras++;
        }
    }

    return quantidadeSeguras;
}


// Classifica o resultado
function classificarResultado(media) {

    if (media >= 8) {
        return "Proteção forte";

    } else if (media >= 5) {
        return "Proteção intermediária";

    } else {
        return "Proteção básica";
    }
}


// Pega os valores digitados pelo usuário
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


// Realiza toda a avaliação
function realizarAvaliacao() {

    const pontuacoes = obterPontuacoes();

    // Verifica se todas as notas estão entre 0 e 10
    for (const pontuacao of pontuacoes) {

        if (pontuacao < 0 || pontuacao > notaMaxima || Number.isNaN(pontuacao)) {

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


    // Mostra os resultados no Console
    console.log(`Projeto: ${nomeProjeto}`);
    console.log(`Total de pontos: ${total}`);
    console.log(`Média: ${media.toFixed(2)}`);
    console.log(`Práticas em nível seguro: ${praticasSeguras}`);
    console.log(`Classificação: ${classificacao}`);


    // Mostra os resultados no HTML
    document.getElementById("total").textContent = total;

    document.getElementById("media").textContent =
        media.toFixed(2);

    document.getElementById("seguras").textContent =
        praticasSeguras;

    document.getElementById("classificacao").textContent =
        classificacao;
}


// Botão para calcular
document.getElementById("btn-calcular")
    .addEventListener("click", realizarAvaliacao);

document.getElementById("btn-calcular").addEventListener("click", function () {

    const notas = [
        Number(document.getElementById("input-contas").value),
        Number(document.getElementById("input-navegacao").value),
        Number(document.getElementById("input-dispositivos").value),
        Number(document.getElementById("input-mensagens").value),
        Number(document.getElementById("input-backup").value),
        Number(document.getElementById("input-privacidade").value)
    ];

    const total = notas.reduce((soma, nota) => soma + nota, 0);

    const media = total / notas.length;

    const seguros = notas.filter(nota => nota >= 7).length;

    let classificacao;

    if (media >= 7) {
        classificacao = "Proteção forte";
    } else if (media >= 4) {
        classificacao = "Proteção intermediária";
    } else {
        classificacao = "Proteção básica";
    }

    document.getElementById("total").textContent = total;
    document.getElementById("media").textContent = media.toFixed(1);
    document.getElementById("seguros").textContent = seguros;
    document.getElementById("classificacao").textContent = classificacao;
});

