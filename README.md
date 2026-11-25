# Guia de Segurança Digital

Projeto Final da disciplina (Encontro 23): evolução do projeto do Encontro 15, com migração de JavaScript para **TypeScript** e uma nova funcionalidade interativa, o **checklist de práticas de segurança**.

A página ensina boas práticas de segurança digital e permite que a pessoa marque as práticas que já adota. A cada marcação, o total de pontos, a média, a quantidade de práticas em nível seguro e a classificação de proteção são recalculados na hora, sem recarregar a página.

## Autores

- Jucelyno Marlon Batista da Silva
- Samyr Fernandes Silva

Repositório: <https://github.com/mjucelyno-ju/Guia-de-Seguranca-Digital>

Site: https://mjucelyno-ju.github.io/Guia-de-Seguranca-Digital/

## Tema e público

Guia educativo sobre segurança digital para quem está começando: proteção de contas, navegação segura, proteção dos dispositivos, cuidado com mensagens, backup e privacidade.

**Aviso:** o conteúdo tem fins educacionais. O teste **não pede nem guarda senhas ou dados pessoais**; as respostas não são salvas nem enviadas a lugar nenhum.

## O que foi preservado do Encontro 15

- Tema, propósito e textos autorais.
- Seis práticas, cada uma com pontuação de 0 a 10.
- Total, média, contagem de práticas em nível seguro e classificação.
- HTML semântico e navegação interna (Boas Práticas, Teste de Segurança, Dicas e Contatos).
- Identidade visual com Tailwind CSS, comportamento responsivo e foco visível.

## O que mudou neste projeto

1. `script.js` foi substituído por `script.ts`, com tipagem estrita (`strict: true`).
2. Os dados passaram a ser um **array de objetos tipados**, em vez de números soltos.
3. Nova funcionalidade (Ideia 19): **checklist interativo**. Cada resposta altera a pontuação, mostra uma orientação relacionada e atualiza os indicadores.
4. Estados da interface (inicial, sucesso, erro e vazio) com mensagens acessíveis.

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 semântico | Estrutura da página |
| Tailwind CSS 4 (`@tailwindcss/cli`) | Estilo, responsividade e foco visível |
| TypeScript 5 | Lógica da aplicação, compilada para JavaScript |
| Docker e Docker Compose | Ambiente de execução (Node 22 + nginx) |
| GitHub Actions e GitHub Pages | Build e publicação automáticos |

## Como executar

### Com Docker (recomendado)

Requisitos: Docker e Docker Compose.

```bash
docker compose up --build
```

Depois, abra <http://localhost:8080>.

O compose sobe dois serviços:

- `tailwind`: roda `npm run dev`, que mantém o compilador do TypeScript (`tsc --watch`) e o do Tailwind (`--watch`) ligados. Os arquivos gerados (`src/script.js` e `src/output.css`) são gravados na pasta `src` do seu computador.
- `web`: nginx servindo a pasta `src` na porta 8080.

Para parar: `Ctrl + C`, e depois `docker compose down`.

### Sem Docker

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Em outro terminal, sirva a pasta `src` com qualquer servidor estático, por exemplo:

```bash
python -m http.server 8080 --directory src
```

E abra <http://localhost:8080>.

### Scripts disponíveis

| Comando | O que faz |
|---|---|
| `npm run dev` | Compila TypeScript e Tailwind em modo observação |
| `npm run check` | Verifica os tipos com `tsc --noEmit`, sem gerar arquivos |
| `npm run build` | Roda a verificação, compila o TypeScript e gera o CSS minificado |

## Estrutura do projeto

```text
Guia-de-Seguranca-Digital/
├── .github/workflows/static.yml   # build e publicação no GitHub Pages
├── src/
│   ├── imagens/                   # imagens da página
│   ├── index.html                 # página (HTML semântico)
│   ├── input.css                  # entrada do Tailwind
│   ├── output.css                 # CSS gerado
│   ├── script.ts                  # código-fonte TypeScript
│   └── script.js                  # JavaScript gerado pelo compilador
├── Dockerfile
├── compose.yaml
├── package.json
├── tsconfig.json
└── README.md
```

O `src/script.js` é gerado pelo compilador e está no `.gitignore`. O HTML carrega somente esse arquivo compilado, nunca o `.ts`.

## Modelagem dos dados

```ts
type NivelProtecao = "forte" | "intermediaria" | "basica";
type EstadoTela = "inicial" | "sucesso" | "erro" | "vazio";

interface PraticaSeguranca {
    readonly id: string;
    titulo: string;
    pontos: number;
    atendida: boolean;
    orientacao: string;
    observacao?: string;
}
```

- `readonly id`: o identificador não pode ser alterado depois de criado.
- `observacao?`: propriedade opcional, exibida somente quando existe.
- `NivelProtecao` e `EstadoTela`: unions literais, então o compilador recusa qualquer valor fora da lista.
- `rotulosNivel: Record<NivelProtecao, string>`: obriga a existir um rótulo para cada nível. Se um nível for criado e esquecido, o código não compila.

## Regras de pontuação

Cada uma das seis práticas vale 10 pontos (máximo de 60). Só as práticas marcadas somam pontos.

- **Total:** soma dos pontos das práticas marcadas.
- **Média:** total dividido pela quantidade de práticas (6).
- **Práticas em nível seguro:** quantas pontuações são maiores ou iguais a 7.
- **Classificação**, pela média:

| Média | Classificação |
|---|---|
| 7 ou mais | Proteção forte |
| de 4 até menos de 7 | Proteção intermediária |
| menos de 4 | Proteção básica |

Na prática, com todas as práticas valendo 10: 0 a 2 marcadas é básica, 3 ou 4 é intermediária e 5 ou 6 é forte. Enquanto nada foi marcado, a classificação aparece como "Aguardando avaliação".

## Funções principais (`script.ts`)

| Função | Responsabilidade |
|---|---|
| `obterElemento<T>` | Busca um elemento pelo id e lança erro claro se ele não existir, evitando `null` no resto do código |
| `calcularTotal`, `calcularMedia`, `contarPraticasSeguras`, `classificarResultado` | Cálculos puros, sem acesso ao DOM |
| `validarPraticas` | Valida título, pontos (inteiros de 0 a 10) e ids repetidos |
| `alternarPratica` | Atualiza o estado de uma prática; devolve `null` se o id não existir |
| `obterPontuacoes` | Converte as práticas em pontuações (0 para as não marcadas) |
| `criarItem`, `renderizarChecklist` | Criam e renderizam a lista no DOM |
| `definirEstado` | Atualiza o estado atual e a mensagem de status |
| `atualizarIndicadores` | Atualiza total, média, contagem e classificação na tela |
| `aoAlterarPratica` | Trata o evento de marcar ou desmarcar uma prática |
| `reiniciar` | Volta ao estado inicial e devolve o foco ao primeiro item |
| `iniciar` | Valida os dados, renderiza a página e registra os eventos |

## Decisões de projeto

- **Sem `any`.** Onde o tipo vem do DOM, o código usa verificação em tempo de execução (`instanceof HTMLInputElement`) em vez de conversão forçada.
- **Elementos potencialmente nulos.** `obterElemento` centraliza a verificação; `find` e `dataset.id` são tratados como possivelmente `undefined`.
- **Cálculos separados da interface.** As funções `calcular*` e `classificarResultado` não tocam no DOM, o que facilita testar e entender cada regra.
- **DOM seguro.** A interface é montada com `createElement` e `textContent`, sem `innerHTML`.
- **Um único ouvinte de evento.** O evento `change` é registrado na lista (delegação de eventos) e funciona para todas as práticas, inclusive as criadas dinamicamente.
- **Orientações sob demanda.** A orientação de cada prática só aparece depois que a pessoa responde àquela prática (controle por um `Set` de práticas respondidas).
- **Nada é salvo.** Não há `localStorage`, cookies nem envio de dados, para manter o compromisso de privacidade da página.
- **Script comum, não módulo.** O código não usa `import` nem `export`, então o compilador gera um script clássico, carregado com `defer`. Se um dia o projeto passar a usar módulos, a tag deve mudar para `type="module"`.
- **Saída do compilador em `src`.** O `outDir` do TypeScript é `src`, assim o nginx e o GitHub Pages servem o JavaScript gerado ao lado do HTML.

## Acessibilidade

- HTML semântico (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`) e `lang="pt-BR"`.
- Checklist dentro de `fieldset` com `legend` visível apenas para leitores de tela (`sr-only`).
- Cada checkbox fica dentro de um `label` e aponta para sua orientação com `aria-describedby`.
- Mensagens de estado em um elemento com `role="status"`, anunciado por leitores de tela sem mover o foco.
- Funciona inteiramente pelo teclado: `Tab` navega, `Espaço` marca a prática e `Enter` aciona "Reiniciar avaliação".
- Foco visível nos links, checkboxes e botão.
- Imagens com texto alternativo.
- Layout responsivo em grade (uma coluna no celular, duas ou três em telas maiores).

## Tabela de testes

Execute cada teste e marque a última coluna.

| # | Cenário | Como executar | Resultado esperado | Passou? |
|---|---|---|---|---|
| 1 | Estado inicial | Abrir a página | Mensagem "Marque as práticas que você já adota."; total 0 / 60; média 0.00; 0 práticas seguras; classificação "Aguardando avaliação"; orientações ocultas | ☐ |
| 2 | Marcar 1 prática | Marcar "Proteção de contas" | Mensagem "Proteção de contas: marcada. Total: 10 pontos."; total 10; média 1.67; 1 prática segura; "Proteção básica"; orientação aparece | ☐ |
| 3 | Limite intermediário | Marcar 3 práticas | Total 30; média 5.00; 3 seguras; "Proteção intermediária" | ☐ |
| 4 | Antes do limite forte | Marcar 4 práticas | Total 40; média 6.67; 4 seguras; continua "Proteção intermediária" | ☐ |
| 5 | Limite forte | Marcar 5 práticas | Total 50; média 8.33; 5 seguras; "Proteção forte" | ☐ |
| 6 | Pontuação máxima | Marcar as 6 práticas | Total 60 / 60; média 10.00; 6 seguras; "Proteção forte" | ☐ |
| 7 | Desmarcar | Com 3 marcadas, desmarcar 1 | Mensagem com "desmarcada" e total 20; média 3.33; "Proteção básica" | ☐ |
| 8 | Reiniciar | Clicar em "Reiniciar avaliação" | Todas desmarcadas; mensagem inicial; total 0; "Aguardando avaliação"; orientações ocultas; foco no primeiro item | ☐ |
| 9 | Uso só com teclado | Usar `Tab`, `Espaço` e `Enter` | Marcar, desmarcar e reiniciar funcionam sem mouse; foco sempre visível | ☐ |
| 10 | Leitor de tela | Marcar uma prática com leitor de tela ligado | A mensagem de status é anunciada | ☐ |
| 11 | Estado vazio | Em `script.ts`, trocar o array `praticas` por `[]` | Mensagem "Nenhuma prática cadastrada."; nenhuma lista renderizada | ☐ |
| 12 | Estado de erro: id repetido | Repetir o `id` de uma prática no array | Mensagem `Id repetido: "contas".` (com o id repetido); checklist não é renderizado | ☐ |
| 13 | Estado de erro: pontos inválidos | Trocar `pontos` de uma prática por `11` | Mensagem `Pontos inválidos em "contas": use inteiros de 0 a 10.` | ☐ |
| 14 | Estado de erro: título vazio | Trocar `titulo` de uma prática por `""` | Mensagem `A prática "contas" está sem título.` | ☐ |
| 15 | Responsividade | Reduzir a janela para 360 px de largura | Layout em uma coluna, sem rolagem horizontal | ☐ |
| 16 | Verificação de tipos | `npm run check` | Termina sem erros | ☐ |
| 17 | Build | `npm run build` | Gera `src/script.js` e `src/output.css` minificado | ☐ |
| 18 | Docker | `docker compose up --build` | Página disponível em `http://localhost:8080` | ☐ |

Para repetir os testes 11 a 14, volte o `script.ts` ao estado original depois de cada um (e aguarde o compilador regenerar o `script.js`).

## Requisitos do enunciado

| Requisito | Onde está |
|---|---|
| Entidade principal tipada | `interface PraticaSeguranca` |
| Array de objetos | `const praticas: PraticaSeguranca[]` |
| Union para estado ou classificação | `NivelProtecao` e `EstadoTela` |
| Pelo menos cinco funções tipadas | 15 funções, todas com parâmetros e retorno tipados |
| Função de validação | `validarPraticas` |
| Função que atualiza o estado | `alternarPratica` |
| Função que renderiza a coleção | `renderizarChecklist` e `criarItem` |
| Função que atualiza os indicadores | `atualizarIndicadores` |
| Evento de formulário, botão ou filtro | `change` na lista e `click` em `btn-reiniciar` |
| Estados inicial, sucesso, erro e vazio | `definirEstado` com `EstadoTela` |
| `textContent` ou criação segura de elementos | `createElement` e `textContent` em todo o código |
| Verificação de elementos nulos | `obterElemento`, `find`, `instanceof` e `dataset.id` |
| Aprovado em `npm run check` | Script `check` do `package.json` |
| Tailwind responsivo e acessível | `index.html` e a seção de acessibilidade acima |
| README com execução, decisões e testes | Este arquivo |

## Publicação

O workflow em `.github/workflows/static.yml` instala as dependências, roda `npm run build` e publica a pasta `src` no GitHub Pages a cada push na branch `master` (a publicação precisa estar habilitada nas configurações do repositório).