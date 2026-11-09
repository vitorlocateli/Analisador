// Confere todos os casos de casos.js. Rode na pasta do projeto com:
//   node testes.mjs
import { analisarLexico } from "./lexer.js";
import { analisarSintatico } from "./parser.js";
import { verificar } from "./semantica.js";
import { casos } from "./casos.js";

function analisar(codigo) {
    const { tokens, erros } = analisarLexico(codigo);
    if (erros.length > 0) {
        return { fase: "lexica", erros: erros };            // sintático não roda
    }
    let ast;
    try {
        ast = analisarSintatico(tokens);
    } catch (e) {
        return { fase: "sintatica", linha: e.linha, esperado: e.esperado, encontrado: e.encontrado };
    }
    const errosSemanticos = verificar(ast);
    if (errosSemanticos.length > 0) {
        return { fase: "semantica", erros: errosSemanticos };    // o gerador não roda
    }
    return { fase: "ok", ast: ast };
}

let falhas = 0;
for (const caso of casos) {
    const obtido = analisar(caso.codigo);
    const ok = JSON.stringify(obtido) === JSON.stringify(caso.esperado);
    console.log((ok ? "PASSOU " : "FALHOU ") + caso.nome);
    if (!ok) {
        falhas = falhas + 1;
        console.log("  esperado: " + JSON.stringify(caso.esperado));
        console.log("  obtido:   " + JSON.stringify(obtido));
    }
}
console.log("\n" + (casos.length - falhas) + " de " + casos.length + " casos passaram");
process.exit(falhas > 0 ? 1 : 0);
