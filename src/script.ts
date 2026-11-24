const nomeProjeto: string = "Guia de Segurança Digital";

type NivelProtecao = "forte" | "intermediaria" | "basica";

type EstadoTela = "inicial" | "sucesso" | "erro" | "vazio";

const PONTOS_MIN = 0;
const PONTOS_MAX = 10;
const LIMITE_SEGURO = 7;

const rotulosNivel: Record<NivelProtecao, string> = {
    forte: "Proteção forte",
    intermediaria: "Proteção intermediária",
    basica: "Proteção básica",
};

interface PraticaSeguranca {
    readonly id: string;
    titulo: string;
    pontos: number;
    atendida: boolean;
    orientacao: string;
    observacao?: string;
}

const praticas: PraticaSeguranca[] = [
    { id: "contas", titulo: "Proteção de contas", pontos: 10, atendida: false, orientacao: "Use uma senha diferente para cada conta e ative a verificação em duas etapas." },
    { id: "navegacao", titulo: "Navegação segura", pontos: 10, atendida: false, orientacao: "Evite clicar em links suspeitos e sempre verifique o endereço da página antes de inserir informações sensíveis." },
    { id: "dispositivos", titulo: "Proteção dos dispositivos", pontos: 10, atendida: false, orientacao: "Mantenha seu sistema operacional e softwares atualizados com as últimas correções de segurança." },
    { id: "mensagens", titulo: "Cuidados com mensagens", pontos: 10, atendida: false, orientacao: "Não abra anexos ou cliquem em links de remetentes desconhecidos." },
    { id: "backup", titulo: "Backup", pontos: 10, atendida: false, orientacao: "Realize backups regulares dos seus dados importantes para evitar perdas em caso de incidente." },
    { id: "privacidade", titulo: "Privacidade", pontos: 10, atendida: false, orientacao: "Revise as configurações de privacidade das suas contas online e restrinja o acesso a informações sensíveis." }
];

const respondidas = new Set<string>();
let estadoAtual: EstadoTela = "inicial";

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
        if (pontuacao >= LIMITE_SEGURO && pontuacao <= PONTOS_MAX) {
            quantidadeSeguras++;
        }
    }

    return quantidadeSeguras;
}

// Classifica o resultado:
function classificarResultado(media: number): NivelProtecao {
    if (media >= LIMITE_SEGURO) return "forte";
    if (media >= 4) return "intermediaria";
    return "basica";
}

function validarPraticas(lista: PraticaSeguranca[]): string[] {
    const erros: string[] = [];
    const ids = new Set<string>();
    for (const p of lista) {
        if (p.titulo.trim() === "") erros.push(`A prática "${p.id}" está sem título.`);
        if (!Number.isInteger(p.pontos) || p.pontos < PONTOS_MIN || p.pontos > PONTOS_MAX)
            erros.push(`Pontos inválidos em "${p.id}": use inteiros de ${PONTOS_MIN} a ${PONTOS_MAX}.`);
        if (ids.has(p.id)) erros.push(`Id repetido: "${p.id}".`);
        ids.add(p.id);
    }
    return erros;
}

function alternarPratica(id: string, atendida: boolean): PraticaSeguranca | null {
    const pratica = praticas.find(p => p.id === id);
    if (pratica === undefined) return null;
    pratica.atendida = atendida;
    return pratica;
}

function obterPontuacoes(): number[] {
    return praticas.map(p => (p.atendida ? p.pontos : 0));
}

function criarItem(p: PraticaSeguranca): HTMLLIElement {
    const item = document.createElement("li");
    const rotulo = document.createElement("label");
    rotulo.className = "flex items-center gap-3 font-semibold p-3 border border-slate-300 rounded-lg cursor-pointer focus-within:ring";
    const caixa = document.createElement("input");
    caixa.type = "checkbox";
    caixa.id = `pratica-${p.id}`;
    caixa.className = "size-5";
    caixa.dataset.id = p.id;
    caixa.checked = p.atendida;
    caixa.setAttribute("aria-describedby", `orientacao-${p.id}`);
    const titulo = document.createElement("span");
    titulo.textContent = p.titulo;
    rotulo.append(caixa, titulo);

    const orientacao = document.createElement("p");
    orientacao.id = `orientacao-${p.id}`;
    orientacao.className = "mt-2 text-sm text-slate-700";
    orientacao.textContent = p.orientacao;
    orientacao.hidden = !respondidas.has(p.id);
    item.append(rotulo, orientacao);

    if (p.observacao !== undefined) {
        const observacao = document.createElement("p");
        observacao.className = "mt-1 text-sm text-slate-600";
        observacao.textContent = p.observacao;
        item.append(observacao);
    }
    return item;
}

function renderizarChecklist(): void {
    const lista = obterElemento<HTMLUListElement>("lista-praticas");
    lista.replaceChildren();
    for (const p of praticas) { lista.append(criarItem(p)); }
}

function definirEstado(estado: EstadoTela, mensagem: string): void {
    estadoAtual = estado;
    obterElemento<HTMLElement>("mensagem-estado").textContent = mensagem;
};

// Atualiza os indicadores (total, média, contagem e classificação) na tela:
function atualizarIndicadores(): void {
    const pontuacoes = obterPontuacoes();

    const total = calcularTotal(pontuacoes);

    const media = calcularMedia(
        total,
        pontuacoes.length
    );

    const praticasSeguras =
        contarPraticasSeguras(pontuacoes);

    const nivel = classificarResultado(media);

    // Pontuação máxima possível: soma dos pontos de todas as práticas
    const maximo = calcularTotal(praticas.map(p => p.pontos));

    // Mostra no console
    console.log(`Projeto: ${nomeProjeto}`);
    console.log(`Total de pontos: ${total}`);
    console.log(`Média: ${media.toFixed(2)}`);
    console.log(`Práticas em nível seguro: ${praticasSeguras}`);
    console.log(`Classificação: ${rotulosNivel[nivel]}`);

    // Mostra no HTML (textContent só aceita string)
    obterElemento<HTMLElement>("total").textContent = String(total);

    obterElemento<HTMLElement>("total-maximo").textContent = String(maximo);

    obterElemento<HTMLElement>("media").textContent =
        media.toFixed(2);

    obterElemento<HTMLElement>("seguros").textContent =
        String(praticasSeguras);

    obterElemento<HTMLElement>("classificacao").textContent =
        estadoAtual === "inicial" ? "Aguardando avaliação" : rotulosNivel[nivel];
}

function aoAlterarPratica(evento: Event): void {
    const alvo = evento.target;
    if (!(alvo instanceof HTMLInputElement) || alvo.dataset.id === undefined) return;
    const pratica = alternarPratica(alvo.dataset.id, alvo.checked);
    if (pratica === null) {
        definirEstado("erro", "Prática não encontrada.");
        return;
    }
    respondidas.add(pratica.id);
    obterElemento<HTMLElement>(`orientacao-${pratica.id}`).hidden = false;
    const total = calcularTotal(obterPontuacoes());
    definirEstado("sucesso", `${pratica.titulo}: ${alvo.checked ? "marcada" : "desmarcada"}. Total: ${total} pontos.`);
    atualizarIndicadores();
}

function reiniciar(): void {
    for (const p of praticas) { p.atendida = false; }
    respondidas.clear();
    renderizarChecklist();
    definirEstado("inicial", "Marque as práticas que você já adota.");
    atualizarIndicadores();
    document.querySelector<HTMLInputElement>("#lista-praticas input")?.focus();
}

function iniciar(): void {
    if (praticas.length === 0) {
        definirEstado("vazio", "Nenhuma prática cadastrada.");
        return;
    }
    const erros = validarPraticas(praticas);
    if (erros.length > 0) {
        definirEstado("erro", erros.join(" "));
        return;
    }
    renderizarChecklist();
    definirEstado("inicial", "Marque as práticas que você já adota.");
    atualizarIndicadores();
    obterElemento<HTMLUListElement>("lista-praticas").addEventListener("change", aoAlterarPratica);
    obterElemento<HTMLButtonElement>("btn-reiniciar").addEventListener("click", reiniciar);
}

iniciar();
