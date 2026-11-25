# Rivals Arena

Plataforma de competições do jogo **Bellator** (TCC). Crie e participe de torneios, monte
times, acompanhe o chaveamento e as partidas, suba no ranking e jogue o Bellator direto no
navegador.

## Como abrir

- **Online:** pelo endereço do GitHub Pages deste repositório.
- **No computador:** abra o `index.html` no navegador.

Para apresentar, use o botão **"Entrar com conta de demonstração"** na tela de login.

## Como o projeto está organizado

```
index.html, torneios.html, ...   uma página HTML para cada tela
css/style.css                    cores, botões, cabeçalho, rodapé e página inicial
css/paginas.css                  estilos das páginas internas
js/dados.js                      dados de exemplo (jogadores, times, torneios...)
js/banco.js                      "banco de dados" (localStorage) e regras do site
js/comum.js                      funções usadas em todas as páginas
js/paginas/*.js                  um script para cada página
img/                             imagens (vindas do Figma do projeto)
integracao-unity/                arquivos para colar no projeto Unity do Bellator
```

Ainda não existe servidor: os dados ficam salvos no navegador de cada pessoa (localStorage).

## Jogo

O Bellator (Unity WebGL) fica hospedado no itch.io: https://dedechi.itch.io/bellator
e é aberto dentro da página `jogar.html`. Veja `integracao-unity/LEIA-ME.md` para enviar os
resultados do jogo ao ranking do site.
