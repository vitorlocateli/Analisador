import { regras } from "./tokens.js";

// Analisador léxico: percorre o texto com um ponteiro (pos) e, em cada
// posição, tenta as regras de tokens.js na ordem. Devolve a lista de tokens
// ({ tipo, lexema, linha }) e a lista de erros léxicos ({ linha, lexema }).
export function analisarLexico(texto) {
    const tokens = [];   // tokens encontrados
    const erros = [];    // erros léxicos encontrados
    let pos = 0;         // ponteiro: posição atual no texto
    let linha = 1;       // linha atual (começa em 1)

    while (pos < texto.length) {
        let achou = false;

        for (const regra of regras) {
            regra.padrao.lastIndex = pos;          // posiciona o ponteiro da regex
            const m = regra.padrao.exec(texto);    // tenta casar exatamente ali
            if (m) {
                if (!regra.ignorar) {              // espaço e comentário não são guardados
                    tokens.push({ tipo: regra.tipo, lexema: m[0], linha: linha });
                }
                for (const caractere of m[0]) {    // conta as quebras de linha do trecho
                    if (caractere === "\n") {
                        linha = linha + 1;
                    }
                }
                pos = regra.padrao.lastIndex;      // avança o ponteiro
                achou = true;
                break;
            }
        }

        if (!achou) {
            // nenhuma regra casou: erro léxico. O trecho informado é a palavra
            // inteira, até o próximo espaço (ou o fim do texto).
            let fim = pos;
            while (fim < texto.length && !/\s/.test(texto[fim])) {
                fim = fim + 1;
            }
            erros.push({ linha: linha, lexema: texto.slice(pos, fim) });
            pos = fim;                              // pula o trecho inválido e continua
        }
    }

    return { tokens, erros };
}
