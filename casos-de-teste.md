# Casos de teste — linguagem 

5 programas válidos, 3 inválidos (léxico e sintático) e 2 com erro semântico (Fase 2), com o resultado esperado de cada um. Os mesmos casos estão em `casos.js`, e `node testes.mjs` confere todos automaticamente.

Na Fase 2, os programas válidos também viraram SVG: o `.svg` e a imagem de cada um estão na pasta [`testes/`](testes/).

| Caso | Tipo | Resultado esperado |
|---|---|---|
| V1 | válido | Válido. AST com 3 elemento(s) no nível do programa. SVG em `testes/`. |
| V2 | válido | Válido. AST com 4 elemento(s) no nível do programa. SVG em `testes/`. |
| V3 | válido | Válido. AST com 0 elemento(s) no nível do programa. SVG em `testes/`. |
| V4 | válido | Válido. AST com 1 elemento(s) no nível do programa. SVG em `testes/`. |
| V5 | válido | Válido. AST com 12 elemento(s) no nível do programa. SVG em `testes/`. |
| I1 | inválido | 4 erros léxicos: linha 2 `05`, linha 2 `azulado`, linha 3 `retangulos`, linha 3 `#12G45F`. O sintático não roda. |
| I2 | inválido | Erro sintático na linha 5: esperado RETA, CIRCULO, RETANGULO ou GRUPO, encontrado FECHA (`"}"`) |
| I3 | inválido | Erro sintático na linha 2: esperado RETA, CIRCULO, RETANGULO, GRUPO ou o fim do programa, encontrado GIRAR (`"girar"`) |
| S1 | erro semântico | linha 6: o círculo precisa ter raio maior que zero. O gerador não roda. |
| S2 | erro semântico | linha 1: a tela precisa ter largura e altura maiores que zero; linha 2: o retângulo precisa ter largura e altura maiores que zero. O gerador não roda. |

### Cobertura dos elementos da linguagem

| Elemento | Onde aparece |
|---|---|
| `tela` | todos |
| `reta`, `circulo`, `retangulo` | V1, V2, V4, V5 |
| `borda=`, `fundo=`, `espessura=` | V1, V2, V4, V5 (os três juntos em V2 e V5) |
| atributo repetido e fora de ordem (vale o último) | V4 (`espessura=2 fundo=rosa fundo=laranja`) |
| forma sem estilo | V4 (`circulo 0 0 5`), V5 (`reta 0 0 0 0`) |
| `grupo` | V1, V2, V4 |
| grupo dentro de grupo | V1 e V2 (2 níveis), V4 (3 níveis) |
| `girar` e `mover` | V1, V2, V4 (V4 repete os dois e mostra a ordem preservada) |
| comentário `%` (linha inteira e fim de linha) | V1, V2, V3, V4 |
| número `0` | V1, V4, V5 |
| cores por nome (as 10) | V5 |
| cores `#RRGGBB` (maiúsculas e minúsculas) | V2, V5 |
| programa sem formas | V3 |
| erro léxico | I1 |
| erro sintático: grupo vazio | I2 |
| erro sintático: modificador fora de grupo | I3 |
| erro semântico: círculo com raio zero (dentro de grupo aninhado) | S1 |
| erro semântico: tela e retângulo com zero | S2 |

## V1 · Carro (grupo dentro de grupo)

```
tela 400 300
% um carro simples
retangulo 50 150 200 60 fundo=azul
grupo mover 70 190 {
    circulo 0 0 25 fundo=preto
    grupo girar 45 {
        reta 0 0 20 0 borda=branco espessura=2
    }
}
grupo mover 200 190 {
    circulo 0 0 25 fundo=preto
}
```

**Resultado esperado:** programa válido. AST:

```json
{
  "tipo": "programa",
  "tela": {
    "tipo": "tela",
    "linha": 1,
    "largura": 400,
    "altura": 300
  },
  "elementos": [
    {
      "tipo": "retangulo",
      "linha": 3,
      "x": 50,
      "y": 150,
      "largura": 200,
      "altura": 60,
      "estilo": {
        "fundo": "azul"
      }
    },
    {
      "tipo": "grupo",
      "linha": 4,
      "modificadores": [
        {
          "tipo": "mover",
          "dx": 70,
          "dy": 190
        }
      ],
      "elementos": [
        {
          "tipo": "circulo",
          "linha": 5,
          "cx": 0,
          "cy": 0,
          "raio": 25,
          "estilo": {
            "fundo": "preto"
          }
        },
        {
          "tipo": "grupo",
          "linha": 6,
          "modificadores": [
            {
              "tipo": "girar",
              "angulo": 45
            }
          ],
          "elementos": [
            {
              "tipo": "reta",
              "linha": 7,
              "x1": 0,
              "y1": 0,
              "x2": 20,
              "y2": 0,
              "estilo": {
                "borda": "branco",
                "espessura": 2
              }
            }
          ]
        }
      ]
    },
    {
      "tipo": "grupo",
      "linha": 10,
      "modificadores": [
        {
          "tipo": "mover",
          "dx": 200,
          "dy": 190
        }
      ],
      "elementos": [
        {
          "tipo": "circulo",
          "linha": 11,
          "cx": 0,
          "cy": 0,
          "raio": 25,
          "estilo": {
            "fundo": "preto"
          }
        }
      ]
    }
  ]
}
```

## V2 · Casa com sol (hexadecimal, vários modificadores)

```
tela 300 300
% casa com sol
retangulo 0 0 300 300 fundo=#87CEEB        % céu
retangulo 0 220 300 80 fundo=verde         % grama
grupo mover 80 120 {
    retangulo 0 40 120 100 borda=preto fundo=amarelo espessura=2
    reta 0 40 60 0 borda=vermelho espessura=3
    reta 60 0 120 40 borda=vermelho espessura=3
    retangulo 45 90 30 50 fundo=#8B4513
}
grupo mover 240 60 girar 15 {
    circulo 0 0 30 fundo=laranja
    grupo girar 45 {
        reta 0 0 50 0 borda=amarelo
    }
}
```

**Resultado esperado:** programa válido. AST:

```json
{
  "tipo": "programa",
  "tela": {
    "tipo": "tela",
    "linha": 1,
    "largura": 300,
    "altura": 300
  },
  "elementos": [
    {
      "tipo": "retangulo",
      "linha": 3,
      "x": 0,
      "y": 0,
      "largura": 300,
      "altura": 300,
      "estilo": {
        "fundo": "#87CEEB"
      }
    },
    {
      "tipo": "retangulo",
      "linha": 4,
      "x": 0,
      "y": 220,
      "largura": 300,
      "altura": 80,
      "estilo": {
        "fundo": "verde"
      }
    },
    {
      "tipo": "grupo",
      "linha": 5,
      "modificadores": [
        {
          "tipo": "mover",
          "dx": 80,
          "dy": 120
        }
      ],
      "elementos": [
        {
          "tipo": "retangulo",
          "linha": 6,
          "x": 0,
          "y": 40,
          "largura": 120,
          "altura": 100,
          "estilo": {
            "borda": "preto",
            "fundo": "amarelo",
            "espessura": 2
          }
        },
        {
          "tipo": "reta",
          "linha": 7,
          "x1": 0,
          "y1": 40,
          "x2": 60,
          "y2": 0,
          "estilo": {
            "borda": "vermelho",
            "espessura": 3
          }
        },
        {
          "tipo": "reta",
          "linha": 8,
          "x1": 60,
          "y1": 0,
          "x2": 120,
          "y2": 40,
          "estilo": {
            "borda": "vermelho",
            "espessura": 3
          }
        },
        {
          "tipo": "retangulo",
          "linha": 9,
          "x": 45,
          "y": 90,
          "largura": 30,
          "altura": 50,
          "estilo": {
            "fundo": "#8B4513"
          }
        }
      ]
    },
    {
      "tipo": "grupo",
      "linha": 11,
      "modificadores": [
        {
          "tipo": "mover",
          "dx": 240,
          "dy": 60
        },
        {
          "tipo": "girar",
          "angulo": 15
        }
      ],
      "elementos": [
        {
          "tipo": "circulo",
          "linha": 12,
          "cx": 0,
          "cy": 0,
          "raio": 30,
          "estilo": {
            "fundo": "laranja"
          }
        },
        {
          "tipo": "grupo",
          "linha": 13,
          "modificadores": [
            {
              "tipo": "girar",
              "angulo": 45
            }
          ],
          "elementos": [
            {
              "tipo": "reta",
              "linha": 14,
              "x1": 0,
              "y1": 0,
              "x2": 50,
              "y2": 0,
              "estilo": {
                "borda": "amarelo"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## V3 · Tela em branco (só tela e comentários)

```
% programa mínimo: só a declaração da tela
% um #FF0000 dentro de comentário é ignorado
tela 640 480   % largura 640, altura 480
```

**Resultado esperado:** programa válido. AST:

```json
{
  "tipo": "programa",
  "tela": {
    "tipo": "tela",
    "linha": 3,
    "largura": 640,
    "altura": 480
  },
  "elementos": []
}
```

## V4 · Três níveis de grupo, modificadores e atributos repetidos

```
tela 200 200
grupo mover 100 100 girar 30 mover 0 0 girar 0 {
    grupo girar 90 {
        grupo mover 10 10 {
            reta 0 0 50 0 borda=roxo
            reta 0 0 0 50 borda=cinza espessura=4
        }
        circulo 0 0 5
    }
    retangulo 0 0 10 10 espessura=2 fundo=rosa fundo=laranja   % vale o último: laranja
}
```

**Resultado esperado:** programa válido. AST:

```json
{
  "tipo": "programa",
  "tela": {
    "tipo": "tela",
    "linha": 1,
    "largura": 200,
    "altura": 200
  },
  "elementos": [
    {
      "tipo": "grupo",
      "linha": 2,
      "modificadores": [
        {
          "tipo": "mover",
          "dx": 100,
          "dy": 100
        },
        {
          "tipo": "girar",
          "angulo": 30
        },
        {
          "tipo": "mover",
          "dx": 0,
          "dy": 0
        },
        {
          "tipo": "girar",
          "angulo": 0
        }
      ],
      "elementos": [
        {
          "tipo": "grupo",
          "linha": 3,
          "modificadores": [
            {
              "tipo": "girar",
              "angulo": 90
            }
          ],
          "elementos": [
            {
              "tipo": "grupo",
              "linha": 4,
              "modificadores": [
                {
                  "tipo": "mover",
                  "dx": 10,
                  "dy": 10
                }
              ],
              "elementos": [
                {
                  "tipo": "reta",
                  "linha": 5,
                  "x1": 0,
                  "y1": 0,
                  "x2": 50,
                  "y2": 0,
                  "estilo": {
                    "borda": "roxo"
                  }
                },
                {
                  "tipo": "reta",
                  "linha": 6,
                  "x1": 0,
                  "y1": 0,
                  "x2": 0,
                  "y2": 50,
                  "estilo": {
                    "borda": "cinza",
                    "espessura": 4
                  }
                }
              ]
            },
            {
              "tipo": "circulo",
              "linha": 8,
              "cx": 0,
              "cy": 0,
              "raio": 5,
              "estilo": {}
            }
          ]
        },
        {
          "tipo": "retangulo",
          "linha": 10,
          "x": 0,
          "y": 0,
          "largura": 10,
          "altura": 10,
          "estilo": {
            "espessura": 2,
            "fundo": "laranja"
          }
        }
      ]
    }
  ]
}
```

## V5 · Paleta completa, zeros e formas sem estilo

```
tela 500 100
retangulo 0 0 500 100 borda=#1A2B3C fundo=#ffcc00 espessura=0
circulo 25 50 20 fundo=preto
circulo 75 50 20 borda=preto fundo=branco
circulo 125 50 20 fundo=vermelho
circulo 175 50 20 fundo=verde
circulo 225 50 20 fundo=azul
circulo 275 50 20 fundo=amarelo
circulo 325 50 20 fundo=laranja
circulo 375 50 20 fundo=roxo
circulo 425 50 20 fundo=cinza
circulo 475 50 20 fundo=rosa
reta 0 0 0 0
```

**Resultado esperado:** programa válido. AST:

```json
{
  "tipo": "programa",
  "tela": {
    "tipo": "tela",
    "linha": 1,
    "largura": 500,
    "altura": 100
  },
  "elementos": [
    {
      "tipo": "retangulo",
      "linha": 2,
      "x": 0,
      "y": 0,
      "largura": 500,
      "altura": 100,
      "estilo": {
        "borda": "#1A2B3C",
        "fundo": "#ffcc00",
        "espessura": 0
      }
    },
    {
      "tipo": "circulo",
      "linha": 3,
      "cx": 25,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "preto"
      }
    },
    {
      "tipo": "circulo",
      "linha": 4,
      "cx": 75,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "borda": "preto",
        "fundo": "branco"
      }
    },
    {
      "tipo": "circulo",
      "linha": 5,
      "cx": 125,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "vermelho"
      }
    },
    {
      "tipo": "circulo",
      "linha": 6,
      "cx": 175,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "verde"
      }
    },
    {
      "tipo": "circulo",
      "linha": 7,
      "cx": 225,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "azul"
      }
    },
    {
      "tipo": "circulo",
      "linha": 8,
      "cx": 275,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "amarelo"
      }
    },
    {
      "tipo": "circulo",
      "linha": 9,
      "cx": 325,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "laranja"
      }
    },
    {
      "tipo": "circulo",
      "linha": 10,
      "cx": 375,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "roxo"
      }
    },
    {
      "tipo": "circulo",
      "linha": 11,
      "cx": 425,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "cinza"
      }
    },
    {
      "tipo": "circulo",
      "linha": 12,
      "cx": 475,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "rosa"
      }
    },
    {
      "tipo": "reta",
      "linha": 13,
      "x1": 0,
      "y1": 0,
      "x2": 0,
      "y2": 0,
      "estilo": {}
    }
  ]
}
```

## I1 · Erros léxicos (zero à esquerda, cor inexistente, palavra-chave colada, hex inválido)

```
tela 300 200
circulo 50 50 05 fundo=azulado
retangulos 0 0 10 10 borda=#12G45F
```

**Resultado esperado:** erros léxicos (a análise sintática não roda):

- Erro léxico na linha 2: `05` não forma nenhum token
- Erro léxico na linha 2: `azulado` não forma nenhum token
- Erro léxico na linha 3: `retangulos` não forma nenhum token
- Erro léxico na linha 3: `#12G45F` não forma nenhum token

## I2 · Erro sintático: grupo vazio

```
tela 300 200
grupo mover 10 10 {
    circulo 5 5 5
    grupo girar 45 {
    }
}
```

**Resultado esperado:**

```
Erro sintático na linha 5: esperado RETA, CIRCULO, RETANGULO ou GRUPO, encontrado FECHA ("}")
```

## I3 · Erro sintático: modificador fora de grupo

```
tela 300 200
circulo 50 50 20 fundo=azul girar 45
```

**Resultado esperado:**

```
Erro sintático na linha 2: esperado RETA, CIRCULO, RETANGULO, GRUPO ou o fim do programa, encontrado GIRAR ("girar")
```

## S1 · Erro semântico: círculo de raio zero dentro de grupo aninhado

```
tela 300 200
% roda com raio zero, dentro de dois grupos
grupo mover 100 100 {
    retangulo 0 0 80 40 fundo=azul
    grupo girar 30 {
        circulo 0 0 0 fundo=preto
    }
}
```

**Resultado esperado:** erro semântico (o SVG não é gerado). A página mostra:

```
Erro semântico: linha 6: o círculo precisa ter raio maior que zero
```

Print da página: [`testes/S1-pagina.png`](testes/S1-pagina.png)

## S2 · Erro semântico: tela e retângulo com tamanho zero

```
tela 400 0
retangulo 10 10 0 50 fundo=verde
circulo 50 50 10
```

**Resultado esperado:** erro semântico (o SVG não é gerado). A página mostra:

```
Erro semântico: linha 1: a tela precisa ter largura e altura maiores que zero
Erro semântico: linha 2: o retângulo precisa ter largura e altura maiores que zero
```

Print da página: [`testes/S2-pagina.png`](testes/S2-pagina.png)
