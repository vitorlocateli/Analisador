# Rabisco — Fase 1 (léxico, sintático e AST)

Linguagem de comandos para descrever desenhos. Esta fase produz a AST; o SVG fica para a Fase 2.

**Testar online:** https://vitorlocateli.github.io/rabisco/

## Integrantes

| Nome completo | RA |
|---|---|
| Vitor Utimura Locateli | 23024638 |
| Lara Marina de Oliveira | 23024708 |

## Especificação

A especificação da linguagem (tokens, gramática, AST e decisões de projeto) está em
[`Especificacao_Rabisco.pdf`](Especificacao_Rabisco.pdf) (também em `.docx`).

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | página de teste: caixa de texto, botão, tokens, erros e AST |
| `main.js` | liga a página aos analisadores e mostra o resultado |
| `tokens.js` | lista de tokens (expressões regulares) |
| `lexer.js` | analisador léxico |
| `parser.js` | analisador sintático descendente recursivo, gera a AST |
| `casos.js` | os 8 casos de teste com o resultado esperado (usado pela página e pelo `testes.mjs`) |
| `casos-de-teste.md` | os mesmos casos, legíveis, com a saída esperada completa |
| `testes.mjs` | confere os casos automaticamente: `node testes.mjs` |

## Como rodar

Os navegadores não carregam módulos (`type="module"`) abrindo o arquivo com duplo clique. Use um servidor local:

- **VS Code:** extensão Live Server → botão direito no `index.html` → *Open with Live Server*.
- **Terminal:** na pasta do projeto, `python -m http.server 8000` e abra `http://localhost:8000`.

## Exemplo

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

## Como testar

1. Abra a página com um servidor local (veja acima).
2. Escolha um caso no menu **Carregar caso de teste…** ou escreva um programa na caixa de texto.
3. Clique em **Analisar** (ou Ctrl + Enter).
4. Programa certo: aparecem os tokens e a AST (em JSON ou em árvore).
   Programa com erro: aparecem os tokens e a mensagem de erro léxico ou sintático, com a linha.

Para conferir os 8 casos de uma vez pelo terminal: `node testes.mjs`.
