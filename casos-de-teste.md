# Casos de teste — linguagem Rabisco

5 programas válidos e 3 inválidos, com o resultado esperado de cada um. Os mesmos casos estão em `casos.js`: a página de teste os carrega pelo menu **Carregar caso**, e `node testes.mjs` confere todos automaticamente.

| Caso | Tipo | Resultado esperado |
|---|---|---|
| V1 | válido | Válido. AST com 3 elemento(s) no nível do programa. |
| V2 | válido | Válido. AST com 4 elemento(s) no nível do programa. |
| V3 | válido | Válido. AST com 0 elemento(s) no nível do programa. |
| V4 | válido | Válido. AST com 1 elemento(s) no nível do programa. |
| V5 | válido | Válido. AST com 12 elemento(s) no nível do programa. |
| I1 | inválido | 4 erros léxicos: linha 2 `05`, linha 2 `azulado`, linha 3 `retangulos`, linha 3 `#12G45F`. O sintático não roda. |
| I2 | inválido | Erro sintático na linha 5: esperado RETA, CIRCULO, RETANGULO ou GRUPO, encontrado FECHA (`"}"`) |
| I3 | inválido | Erro sintático na linha 2: esperado RETA, CIRCULO, RETANGULO, GRUPO ou o fim do programa, encontrado BORDA (`"borda"`) |

### Cobertura dos elementos da linguagem

| Elemento | Onde aparece |
|---|---|
| `tela` | todos |
| `reta`, `circulo`, `retangulo` | V1, V2, V4, V5 |
| `borda=`, `fundo=`, `espessura=` | V1, V2, V4, V5 (os três juntos em V2 e V5) |
| forma sem estilo | V4 (`circulo 0 0 5`), V5 (`reta 0 0 0 0`) |
| `grupo` | V1, V2, V4 |
| grupo dentro de grupo | V1 e V2 (2 níveis), V4 (3 níveis) |
| `girar` e `mover` | V1, V2, V4 (V4 repete os dois e mostra a ordem preservada) |
| comentário `%` (linha inteira e fim de linha) | V1, V2, V3 |
| número `0` | V1, V4, V5 |
| cores por nome (as 10) | V5 |
| cores `#RRGGBB` (maiúsculas e minúsculas) | V2, V5 |
| programa sem formas | V3 |
| erro léxico | I1 |
| erro sintático: grupo vazio | I2 |
| erro sintático: atributo fora de ordem / repetido | I3 |

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
    "largura": 400,
    "altura": 300
  },
  "elementos": [
    {
      "tipo": "retangulo",
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
          "cx": 0,
          "cy": 0,
          "raio": 25,
          "estilo": {
            "fundo": "preto"
          }
        },
        {
          "tipo": "grupo",
          "modificadores": [
            {
              "tipo": "girar",
              "angulo": 45
            }
          ],
          "elementos": [
            {
              "tipo": "reta",
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
    "largura": 300,
    "altura": 300
  },
  "elementos": [
    {
      "tipo": "retangulo",
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
          "cx": 0,
          "cy": 0,
          "raio": 30,
          "estilo": {
            "fundo": "laranja"
          }
        },
        {
          "tipo": "grupo",
          "modificadores": [
            {
              "tipo": "girar",
              "angulo": 45
            }
          ],
          "elementos": [
            {
              "tipo": "reta",
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
    "largura": 640,
    "altura": 480
  },
  "elementos": []
}
```

## V4 · Três níveis de grupo e modificadores repetidos

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
    retangulo 0 0 10 10 fundo=rosa
}
```

**Resultado esperado:** programa válido. AST:

```json
{
  "tipo": "programa",
  "tela": {
    "tipo": "tela",
    "largura": 200,
    "altura": 200
  },
  "elementos": [
    {
      "tipo": "grupo",
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
          "modificadores": [
            {
              "tipo": "girar",
              "angulo": 90
            }
          ],
          "elementos": [
            {
              "tipo": "grupo",
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
              "cx": 0,
              "cy": 0,
              "raio": 5,
              "estilo": {}
            }
          ]
        },
        {
          "tipo": "retangulo",
          "x": 0,
          "y": 0,
          "largura": 10,
          "altura": 10,
          "estilo": {
            "fundo": "rosa"
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
retangulo 0 0 500 100 borda=#1A2B3C fundo=#ffcc00 espessura=0
reta 0 0 0 0
```

**Resultado esperado:** programa válido. AST:

```json
{
  "tipo": "programa",
  "tela": {
    "tipo": "tela",
    "largura": 500,
    "altura": 100
  },
  "elementos": [
    {
      "tipo": "circulo",
      "cx": 25,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "preto"
      }
    },
    {
      "tipo": "circulo",
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
      "cx": 125,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "vermelho"
      }
    },
    {
      "tipo": "circulo",
      "cx": 175,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "verde"
      }
    },
    {
      "tipo": "circulo",
      "cx": 225,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "azul"
      }
    },
    {
      "tipo": "circulo",
      "cx": 275,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "amarelo"
      }
    },
    {
      "tipo": "circulo",
      "cx": 325,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "laranja"
      }
    },
    {
      "tipo": "circulo",
      "cx": 375,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "roxo"
      }
    },
    {
      "tipo": "circulo",
      "cx": 425,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "cinza"
      }
    },
    {
      "tipo": "circulo",
      "cx": 475,
      "cy": 50,
      "raio": 20,
      "estilo": {
        "fundo": "rosa"
      }
    },
    {
      "tipo": "retangulo",
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
      "tipo": "reta",
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

## I3 · Erro sintático: atributos de estilo fora de ordem

```
tela 300 200
retangulo 10 10 100 50 fundo=verde borda=preto
```

**Resultado esperado:** 

```
Erro sintático na linha 2: esperado RETA, CIRCULO, RETANGULO, GRUPO ou o fim do programa, encontrado BORDA ("borda")
```
