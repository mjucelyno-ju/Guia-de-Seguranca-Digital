
const nomeProjeto: string = "Guia de Segurança Digital";
const notaMaxima: number = 10;
 
// Busca um elemento pelo id e garante que ele existe (evita "null" no resto do código):
function obterElemento<T extends HTMLElement>(id: string): T {
    const elemento = document.getElementById(id) as T | null;
 
    if (elemento === null) {
        throw new Error(`Elemento com id "${id}" não encontrado no HTML.`);
    }
 
    return elemento;
}
 
// Calcula o total das pontuações:
function calcularTotal(pontuacoes: number[]): number {
    let total = 0;
 
    for (const pontuacao of pontuacoes) {
        total += pontuacao;
    }
 
    return total;
}
 
// Calcula a média:
function calcularMedia(total: number, quantidade: number): number {
    return total / quantidade;
}
 
// Conta as práticas que chegaram ao nível seguro:
function contarPraticasSeguras(pontuacoes: number[]): number {
    let quantidadeSeguras = 0;
 
    for (const pontuacao of pontuacoes) {
        if (pontuacao >= 7 && pontuacao <= 10) {
            quantidadeSeguras++;
        }
    }
 
    return quantidadeSeguras;
}
 
// Classifica o resultado:
function classificarResultado(media: number): string {
    if (media >= 7) {
        return "Proteção forte";
    } else if (media >= 4) {
        return "Proteção intermediária";
    } else {
        return "Proteção básica";
    }
}
 
// Pega os valores digitados pelo usuário:
function obterPontuacoes(): number[] | null {
    const ids: string[] = [
        "input-contas",
        "input-navegacao",
        "input-dispositivos",
        "input-mensagens",
        "input-backup",
        "input-privacidade"
    ];
 
    // Verifica se algum campo está vazio
    for (const id of ids) {
        const campo = obterElemento<HTMLInputElement>(id);
 
        if (campo.value.trim() === "") {
            alert("Preencha todas as pontuações antes de continuar.");
            campo.focus();
            return null;
        }
    }
 
    // Converte os valores para números
    const pontuacoes: number[] = ids.map(id =>
        Number(obterElemento<HTMLInputElement>(id).value)
    );
 
    return pontuacoes;
}
 
// Realiza toda a avaliação:
function realizarAvaliacao(): void {
 
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
 
    // Mostra no HTML (textContent só aceita string)
    obterElemento<HTMLElement>("total").textContent = String(total);
 
    obterElemento<HTMLElement>("media").textContent =
        media.toFixed(2);
 
    obterElemento<HTMLElement>("seguros").textContent =
        String(praticasSeguras);
 
    obterElemento<HTMLElement>("classificacao").textContent =
        classificacao;
}
 
// Botão para calcular resultados:
obterElemento<HTMLButtonElement>("btn-calcular")
    .addEventListener("click", realizarAvaliacao);
 