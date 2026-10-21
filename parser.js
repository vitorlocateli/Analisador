// Analisador sintático descendente recursivo da linguagem Rabisco.
//
// Gramática (símbolo inicial: programa)
//
//   programa      → TELA NUM NUM elementos
//   elementos     → elemento elementos | ε
//   elemento      → forma | grupo
//   forma         → RETA NUM NUM NUM NUM estilo
//                 | CIRCULO NUM NUM NUM estilo
//                 | RETANGULO NUM NUM NUM NUM estilo
//   estilo        → borda fundo espessura
//   borda         → BORDA IGUAL cor | ε
//   fundo         → FUNDO IGUAL cor | ε
//   espessura     → ESPESSURA IGUAL NUM | ε
//   cor           → COR | HEX
//   grupo         → GRUPO modificadores ABRE elemento elementos FECHA
//   modificadores → modificador modificadores | ε
//   modificador   → GIRAR NUM | MOVER NUM NUM
//
// Cada variável vira uma função; cada token vira um esperar(); cada "|"
// vira um if que olha SÓ o próximo token. As listas (elementos e
// modificadores) são feitas com while, que reconhece a mesma linguagem
// da recursão à direita da gramática.

const INICIO_ELEMENTO = ["RETA", "CIRCULO", "RETANGULO", "GRUPO"];

// Erro sintático com os três dados pedidos: linha, esperado e encontrado.
export class ErroSintatico extends Error {
    constructor(linha, esperado, encontrado, dica) {
        let mensagem = "Erro sintático na linha " + linha +
            ": esperado " + esperado + ", encontrado " + encontrado;
        if (dica) {
            mensagem = mensagem + "\n  Dica: " + dica;
        }
        super(mensagem);
        this.linha = linha;
        this.esperado = esperado;
        this.encontrado = encontrado;
        this.dica = dica;
    }
}

export function analisarSintatico(tokens) {
    let i = 0; // ponteiro: posição do token atual

    // ---------- funções auxiliares ----------

    function atual() {
        return tokens[i];
    }

    function verifica(tipo) {
        const token = tokens[i];
        return token !== undefined && token.tipo === tipo;
    }

    function linhaDoErro() {
        if (tokens[i] !== undefined) return tokens[i].linha;
        if (tokens.length > 0) return tokens[tokens.length - 1].linha; // fim: última linha com token
        return 1;
    }

    function descrever(token) {
        if (token === undefined) return "o fim do programa";
        return token.tipo + ' ("' + token.lexema + '")';
    }

    // Dica extra para os erros mais comuns (não muda o que é aceito).
    function dicaPara(token) {
        if (token === undefined) return undefined;
        if (token.tipo === "BORDA" || token.tipo === "FUNDO" || token.tipo === "ESPESSURA") {
            return "cada atributo de estilo aparece no máximo uma vez, logo após os números da forma, " +
                "na ordem borda, fundo, espessura";
        }
        if (token.tipo === "GIRAR" || token.tipo === "MOVER") {
            return "modificadores só existem em grupos, entre a palavra grupo e o {";
        }
        if (token.tipo === "TELA") {
            return "a tela é declarada uma única vez, no início do programa";
        }
        return undefined;
    }

    function erro(esperado) {
        throw new ErroSintatico(linhaDoErro(), esperado, descrever(atual()), dicaPara(atual()));
    }

    // Confere se o token atual é do tipo pedido; se for, consome e avança.
    function esperar(tipo) {
        if (!verifica(tipo)) {
            erro(tipo);
        }
        const token = tokens[i];
        i = i + 1;
        return token;
    }

    // NUM vira número de verdade na AST (e não texto).
    function numero() {
        return Number(esperar("NUM").lexema);
    }

    function comecaElemento() {
        const token = atual();
        return token !== undefined && INICIO_ELEMENTO.includes(token.tipo);
    }

    // ---------- uma função por variável da gramática ----------

    // programa → TELA NUM NUM elementos
    function programa() {
        esperar("TELA");
        const largura = numero();
        const altura = numero();
        const lista = elementos();
        if (i < tokens.length) {
            // sobrou token que não começa elemento
            erro("RETA, CIRCULO, RETANGULO, GRUPO ou o fim do programa");
        }
        return {
            tipo: "programa",
            tela: { tipo: "tela", largura: largura, altura: altura },
            elementos: lista,
        };
    }

    // elementos → elemento elementos | ε
    // (escolhe a 1ª alternativa se o próximo token começa um elemento)
    function elementos() {
        const lista = [];
        while (comecaElemento()) {
            lista.push(elemento());
        }
        return lista;
    }

    // elemento → forma | grupo
    function elemento() {
        if (verifica("RETA") || verifica("CIRCULO") || verifica("RETANGULO")) {
            return forma();
        } else if (verifica("GRUPO")) {
            return grupo();
        } else {
            erro("RETA, CIRCULO, RETANGULO ou GRUPO");
        }
    }

    // forma → RETA NUM NUM NUM NUM estilo
    //       | CIRCULO NUM NUM NUM estilo
    //       | RETANGULO NUM NUM NUM NUM estilo
    function forma() {
        if (verifica("RETA")) {
            esperar("RETA");
            const x1 = numero();
            const y1 = numero();
            const x2 = numero();
            const y2 = numero();
            return { tipo: "reta", x1: x1, y1: y1, x2: x2, y2: y2, estilo: estilo() };
        } else if (verifica("CIRCULO")) {
            esperar("CIRCULO");
            const cx = numero();
            const cy = numero();
            const raio = numero();
            return { tipo: "circulo", cx: cx, cy: cy, raio: raio, estilo: estilo() };
        } else {
            esperar("RETANGULO");
            const x = numero();
            const y = numero();
            const largura = numero();
            const altura = numero();
            return { tipo: "retangulo", x: x, y: y, largura: largura, altura: altura, estilo: estilo() };
        }
    }

    // estilo    → borda fundo espessura
    // borda     → BORDA IGUAL cor | ε
    // fundo     → FUNDO IGUAL cor | ε
    // espessura → ESPESSURA IGUAL NUM | ε
    // Só entram na AST os atributos que foram escritos.
    function estilo() {
        const resultado = {};
        if (verifica("BORDA")) {
            esperar("BORDA");
            esperar("IGUAL");
            resultado.borda = cor();
        }
        if (verifica("FUNDO")) {
            esperar("FUNDO");
            esperar("IGUAL");
            resultado.fundo = cor();
        }
        if (verifica("ESPESSURA")) {
            esperar("ESPESSURA");
            esperar("IGUAL");
            resultado.espessura = numero();
        }
        return resultado;
    }

    // cor → COR | HEX
    function cor() {
        if (verifica("COR") || verifica("HEX")) {
            const token = atual();
            i = i + 1;
            return token.lexema;
        }
        erro("COR ou HEX");
    }

    // grupo → GRUPO modificadores ABRE elemento elementos FECHA
    // ("elemento elementos" garante pelo menos um elemento: grupo vazio é erro)
    function grupo() {
        esperar("GRUPO");
        const mods = modificadores();
        if (!verifica("ABRE")) {
            erro("GIRAR, MOVER ou ABRE");
        }
        esperar("ABRE");
        const lista = [elemento()];
        const resto = elementos();
        for (const e of resto) {
            lista.push(e);
        }
        if (!verifica("FECHA")) {
            erro("RETA, CIRCULO, RETANGULO, GRUPO ou FECHA");
        }
        esperar("FECHA");
        return { tipo: "grupo", modificadores: mods, elementos: lista };
    }

    // modificadores → modificador modificadores | ε
    // (a lista guarda os modificadores na ordem em que foram escritos)
    function modificadores() {
        const lista = [];
        while (verifica("GIRAR") || verifica("MOVER")) {
            lista.push(modificador());
        }
        return lista;
    }

    // modificador → GIRAR NUM | MOVER NUM NUM
    function modificador() {
        if (verifica("GIRAR")) {
            esperar("GIRAR");
            return { tipo: "girar", angulo: numero() };
        } else {
            esperar("MOVER");
            const dx = numero();
            const dy = numero();
            return { tipo: "mover", dx: dx, dy: dy };
        }
    }

    return programa();
}
