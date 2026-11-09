// semantica.js · verificações semânticas (Fase 2)
//
//   Recebe:  a AST do programa
//   Devolve: um vetor de erros: [ { linha, mensagem }, ... ]
//            (vetor vazio = nenhum erro encontrado)
//
// A gramática aceita o zero, então estes programas passam pelo parser
// mas não fazem sentido como desenho:
//   - tela com largura ou altura zero
//   - círculo com raio zero
//   - retângulo com largura ou altura zero
// Os erros são juntados todos (não para no primeiro).

export function verificar(ast) {
    const erros = [];

    const tela = ast.tela;
    if (tela.largura === 0 || tela.altura === 0) {
        erros.push({ linha: tela.linha, mensagem: "a tela precisa ter largura e altura maiores que zero" });
    }

    verificarElementos(ast.elementos, erros);
    return erros;
}

// Percorre uma lista de elementos. Quando acha um grupo, chama de novo
// para os filhos dele, então funciona em qualquer nível de grupo.
function verificarElementos(elementos, erros) {
    for (const no of elementos) {
        if (no.tipo === "circulo") {
            if (no.raio === 0) {
                erros.push({ linha: no.linha, mensagem: "o círculo precisa ter raio maior que zero" });
            }
        } else if (no.tipo === "retangulo") {
            if (no.largura === 0 || no.altura === 0) {
                erros.push({ linha: no.linha, mensagem: "o retângulo precisa ter largura e altura maiores que zero" });
            }
        } else if (no.tipo === "grupo") {
            verificarElementos(no.elementos, erros);
        }
        // reta não tem verificação: uma reta de tamanho zero não quebra nada
    }
}
