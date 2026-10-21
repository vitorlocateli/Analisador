import { analisarLexico } from "./lexer.js";
import { analisarSintatico } from "./parser.js";
import { casos } from "./casos.js";

const entrada = document.getElementById("entrada");
const areaTokens = document.getElementById("tokens");
const areaStatus = document.getElementById("status");
const areaSaida = document.getElementById("saida");
const abas = document.getElementById("abas");
const seletor = document.getElementById("casos");

let astAtual = null;     // última AST gerada (para trocar de aba sem reanalisar)
let abaAtual = "json";

// ---------- exemplo inicial e menu de casos de teste ----------

entrada.value = casos[0].codigo;

casos.forEach(function (caso, indice) {
    const opcao = document.createElement("option");
    opcao.value = String(indice);
    opcao.textContent = caso.nome;
    seletor.appendChild(opcao);
});

seletor.addEventListener("change", function () {
    if (seletor.value === "") return;
    entrada.value = casos[Number(seletor.value)].codigo;
    seletor.value = "";
    analisar();
});

// ---------- análise ----------

function analisar() {
    const texto = entrada.value;
    const { tokens, erros } = analisarLexico(texto);

    mostrarTokens(tokens);
    astAtual = null;
    abas.hidden = true;
    areaSaida.textContent = "";

    if (erros.length > 0) {
        // houve erro léxico: a análise sintática NÃO roda
        const linhas = erros.map(function (erro) {
            return "Erro léxico na linha " + erro.linha + ': "' + erro.lexema + '" não forma nenhum token';
        });
        mostrarStatus("erro", linhas.join("\n") + "\n\nA análise sintática não foi executada.");
        return;
    }

    try {
        astAtual = analisarSintatico(tokens);
        mostrarStatus("ok", "Programa válido: " + tokens.length + " tokens, AST gerada.");
        abas.hidden = false;
        mostrarAst();
    } catch (falha) {
        mostrarStatus("erro", falha.message);
    }
}

function mostrarStatus(tipo, texto) {
    areaStatus.className = "status " + tipo;
    areaStatus.textContent = texto;
}

function mostrarTokens(tokens) {
    if (tokens.length === 0) {
        areaTokens.innerHTML = '<p class="vazio">Nenhum token.</p>';
        return;
    }
    const tabela = document.createElement("table");
    tabela.innerHTML = "<thead><tr><th>Linha</th><th>Tipo</th><th>Lexema</th></tr></thead>";
    const corpo = document.createElement("tbody");
    for (const token of tokens) {
        const tr = document.createElement("tr");
        const celulas = [
            [String(token.linha), "num"],
            [token.tipo, "mono"],
            [token.lexema, "mono"],
        ];
        for (const [texto, classe] of celulas) {
            const td = document.createElement("td");
            td.className = classe;
            td.textContent = texto;      // textContent: nunca interpreta o lexema como HTML
            tr.appendChild(td);
        }
        corpo.appendChild(tr);
    }
    tabela.appendChild(corpo);
    areaTokens.replaceChildren(tabela);
}

function mostrarAst() {
    if (astAtual === null) return;
    if (abaAtual === "json") {
        areaSaida.textContent = JSON.stringify(astAtual, null, 2);
    } else {
        areaSaida.textContent = desenharArvore(astAtual);
    }
}

// ---------- visão em árvore (só para conferir o aninhamento) ----------

function rotulo(no) {
    if (no.tipo === "programa") return "programa";
    if (no.tipo === "tela") return "tela " + no.largura + " x " + no.altura;
    if (no.tipo === "reta") return "reta (" + no.x1 + ", " + no.y1 + ") → (" + no.x2 + ", " + no.y2 + ")" + textoEstilo(no.estilo);
    if (no.tipo === "circulo") return "circulo centro (" + no.cx + ", " + no.cy + ") raio " + no.raio + textoEstilo(no.estilo);
    if (no.tipo === "retangulo") return "retangulo (" + no.x + ", " + no.y + ") " + no.largura + " x " + no.altura + textoEstilo(no.estilo);
    if (no.tipo === "grupo") {
        const mods = no.modificadores.map(function (m) {
            return m.tipo === "girar" ? "girar " + m.angulo : "mover " + m.dx + " " + m.dy;
        });
        return "grupo" + (mods.length > 0 ? "  [" + mods.join(" → ") + "]" : "");
    }
    return no.tipo;
}

function textoEstilo(estilo) {
    const partes = Object.keys(estilo).map(function (chave) {
        return chave + "=" + estilo[chave];
    });
    return partes.length > 0 ? "  {" + partes.join(", ") + "}" : "";
}

function filhos(no) {
    if (no.tipo === "programa") return [no.tela].concat(no.elementos);
    if (no.tipo === "grupo") return no.elementos;
    return [];
}

function desenharArvore(no, prefixo = "", ultimo = true, raiz = true) {
    let texto = raiz ? rotulo(no) + "\n" : prefixo + (ultimo ? "└─ " : "├─ ") + rotulo(no) + "\n";
    const proximoPrefixo = raiz ? "" : prefixo + (ultimo ? "   " : "│  ");
    const lista = filhos(no);
    lista.forEach(function (filho, indice) {
        texto += desenharArvore(filho, proximoPrefixo, indice === lista.length - 1, false);
    });
    return texto;
}

// ---------- eventos ----------

for (const botaoAba of abas.querySelectorAll(".aba")) {
    botaoAba.addEventListener("click", function () {
        abaAtual = botaoAba.dataset.aba;
        for (const outro of abas.querySelectorAll(".aba")) {
            outro.classList.toggle("ativa", outro === botaoAba);
        }
        mostrarAst();
    });
}

document.getElementById("botao").addEventListener("click", analisar);

entrada.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" && (evento.ctrlKey || evento.metaKey)) {
        evento.preventDefault();
        analisar();
    }
});
