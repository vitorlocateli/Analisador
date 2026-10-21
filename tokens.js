// Lista de tokens da linguagem Rabisco.
// Cada regra tem um tipo e uma expressão regular com a flag "y" (sticky):
// ela só casa exatamente na posição apontada por lastIndex.
//
// A ORDEM IMPORTA: o léxico tenta as regras de cima para baixo e fica com
// a primeira que casar. Por isso:
//   - espaços e comentários vêm primeiro (são ignorados);
//   - as palavras-chave terminam com FIM (fim de palavra), para que "reta"
//     não case com o começo de "retangulo" e "azul" não case com "azulado";
//   - NUM também termina com FIM, para que "05" e "12abc" virem erro léxico
//     inteiro em vez de serem quebrados em pedaços.

// FIM faz o papel do \b: depois do token não pode vir letra, dígito nem _.
// Não usamos o \b direto porque, no JavaScript, ele não entende letra com
// acento: "retaé" virava RETA + erro "é". Com FIM, "retaé" é um erro só.
// (\p{L} = qualquer letra, com ou sem acento; precisa da flag "u")
const FIM = "(?![\\p{L}\\d_])";

function regra(tipo, texto) {
    return { tipo: tipo, padrao: new RegExp(texto + FIM, "yu") };
}

export const regras = [
    // ---- ignorados ----
    { tipo: "ESPACO", padrao: /\s+/y, ignorar: true },
    { tipo: "COMENTARIO", padrao: /%[^\n]*/y, ignorar: true },

    // ---- declaração da tela ----
    regra("TELA", "tela"),

    // ---- formas ----
    regra("RETA", "reta"),
    regra("CIRCULO", "circulo"),
    regra("RETANGULO", "retangulo"),

    // ---- grupo e modificadores de grupo ----
    regra("GRUPO", "grupo"),
    regra("GIRAR", "girar"),
    regra("MOVER", "mover"),

    // ---- atributos de estilo ----
    regra("BORDA", "borda"),
    regra("FUNDO", "fundo"),
    regra("ESPESSURA", "espessura"),

    // ---- valores ----
    regra("COR", "(preto|branco|vermelho|verde|azul|amarelo|laranja|roxo|cinza|rosa)"),
    regra("HEX", "#[0-9A-Fa-f]{6}"),
    regra("NUM", "(0|[1-9][0-9]*)"),

    // ---- pontuação ----
    { tipo: "IGUAL", padrao: /=/y },
    { tipo: "ABRE", padrao: /\{/y },
    { tipo: "FECHA", padrao: /\}/y },
];
