// gerador.js · gera o texto SVG a partir da AST (Fase 2)
//
//   Recebe:  a AST do programa
//   Devolve: uma string com o SVG completo, começando em <svg ...> e terminando em </svg>
//
// O gerador é recursivo, como o paraMermaid da aula de AST: gerarElemento()
// monta o texto de um nó e, se for grupo, chama ela mesma para cada filho.
// Cada nível de grupo ganha 2 espaços a mais de recuo, para o SVG ficar legível.

// Tabela de cores: nome na linguagem → nome de cor do SVG.
// Cor #RRGGBB não passa por aqui, vai direto para o SVG.
const CORES = {
    preto: "black",
    branco: "white",
    vermelho: "red",
    verde: "green",
    azul: "blue",
    amarelo: "yellow",
    laranja: "orange",
    roxo: "purple",
    cinza: "gray",
    rosa: "pink",
};

export function gerarSVG(ast) {
    const l = ast.tela.largura;
    const a = ast.tela.altura;
    let texto = '<svg xmlns="http://www.w3.org/2000/svg" width="' + l + '" height="' + a +
        '" viewBox="0 0 ' + l + " " + a + '">\n';
    for (const no of ast.elementos) {
        texto += gerarElemento(no, "  ");
    }
    texto += "</svg>\n";
    return texto;
}

// Devolve o texto SVG de um elemento (forma ou grupo), já com o recuo.
function gerarElemento(no, recuo) {
    if (no.tipo === "reta") {
        return recuo + '<line x1="' + no.x1 + '" y1="' + no.y1 + '" x2="' + no.x2 + '" y2="' + no.y2 + '"' +
            estiloSVG(no.estilo) + "/>\n";
    }
    if (no.tipo === "circulo") {
        return recuo + '<circle cx="' + no.cx + '" cy="' + no.cy + '" r="' + no.raio + '"' +
            estiloSVG(no.estilo) + "/>\n";
    }
    if (no.tipo === "retangulo") {
        return recuo + '<rect x="' + no.x + '" y="' + no.y + '" width="' + no.largura + '" height="' + no.altura + '"' +
            estiloSVG(no.estilo) + "/>\n";
    }

    // grupo: <g> com os filhos dentro
    let texto = recuo + "<g" + transformSVG(no.modificadores) + ">\n";
    for (const filho of no.elementos) {
        texto += gerarElemento(filho, recuo + "  ");
    }
    texto += recuo + "</g>\n";
    return texto;
}

// Sempre escreve os três atributos. O que não foi escrito no programa usa
// o padrão: sem preenchimento, traço preto e espessura 1.
function estiloSVG(estilo) {
    let fill = "none";
    let stroke = "black";
    let largura = 1;
    if (estilo.fundo !== undefined) {
        fill = corSVG(estilo.fundo);
    }
    if (estilo.borda !== undefined) {
        stroke = corSVG(estilo.borda);
    }
    if (estilo.espessura !== undefined) {
        largura = estilo.espessura;
    }
    return ' fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + largura + '"';
}

function corSVG(cor) {
    if (cor.startsWith("#")) {
        return cor;
    }
    return CORES[cor];
}

// Junta os modificadores no transform, na ordem em que foram escritos.
// Grupo sem modificadores fica só <g>, sem o atributo transform.
function transformSVG(modificadores) {
    if (modificadores.length === 0) {
        return "";
    }
    const partes = [];
    for (const m of modificadores) {
        if (m.tipo === "girar") {
            partes.push("rotate(" + m.angulo + ")");
        } else {
            partes.push("translate(" + m.dx + " " + m.dy + ")");
        }
    }
    return ' transform="' + partes.join(" ") + '"';
}
