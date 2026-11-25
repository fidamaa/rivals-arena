# Integração Bellator (Unity) ↔ Rivals Arena (site)

O site já está pronto: a página `jogar.html` abre o Bellator do itch.io, manda para o jogo
quem está logado e recebe o resultado de cada partida (ondas e pontos), que vai para o
ranking. **Só falta o jogo mandar o resultado.** Isso leva uns 15 minutos:

## 1. Copiar os arquivos para o projeto Unity

Copie a pasta `Assets` daqui para dentro do projeto Unity (mesclando com a pasta `Assets` de lá):

```
Assets/Plugins/WebGL/RivalsArena.jslib              ← ponte com o navegador
Assets/Scripts/RivalsArena/RivalsArena.cs           ← funções para usar no jogo
Assets/Scripts/RivalsArena/RivalsArenaConexao.cs    ← componente da primeira cena
```

## 2. Colocar o componente na primeira cena

Na **primeira cena** que abre (ex.: o menu), crie um GameObject vazio chamado `RivalsArena`
e adicione o componente **RivalsArenaConexao**. Ele continua vivo nas outras cenas.

## 3. Enviar o resultado quando a partida acabar

No script que sabe quando a partida terminou (ex.: o gerenciador de ondas, na hora da
derrota ou da vitória), adicione **uma linha**:

```csharp
// Modo Sobrevivência (5 ondas):
RivalsArena.EnviarResultado(RivalsArena.ModoSobrevivencia, ondasCompletas, pontos, venceu, nomeDoGuerreiro, (int)tempoDeJogo);

// Modo Ondas infinitas:
RivalsArena.EnviarResultado(RivalsArena.ModoInfinito, ondasCompletas, pontos, false, nomeDoGuerreiro, (int)tempoDeJogo);
```

- `pontos`: se o jogo não tiver pontuação, mande `0` — o site calcula 100 pontos por onda.
- `nomeDoGuerreiro`: `"Secutor"`, `"Retiarius"`, `"Sagittarius"` ou `"Dimachaerus"` (ou `""`).

## 4. (Opcional) Usar o nome do jogador do site dentro do jogo

```csharp
if (RivalsArenaConexao.Dados != null)
{
    textoNome.text = RivalsArenaConexao.Dados.usuario;      // ex.: "Cadu"
    string guerreiro = RivalsArenaConexao.Dados.guerreiro;  // guerreiro escolhido na partida do site
}
```

Se o jogo for aberto direto no itch.io (fora do site), `Dados` fica `null` e nada muda.

**Dica:** o jogo tem uma tela própria de login ("Perfis locais neste dispositivo" /
"Jogar como convidado"). Quando `RivalsArenaConexao.Dados` não for `null`, o jogador já está
logado no site: vocês podem pular essa tela e entrar direto com `Dados.usuario`, sem precisar
de um segundo cadastro dentro do jogo.

## 5. Gerar a build e publicar

1. `File > Build Settings > WebGL > Build` (como vocês já fazem).
2. Envie a build nova no itch.io, como sempre.
3. **Importante:** o itch.io pode mudar o número do jogo a cada envio. Abra a página do
   jogo no itch.io, clique em **Embed** e copie o endereço `https://itch.io/embed-upload/NÚMERO`.
   Troque no arquivo `jogar.html` do site, no atributo `data-endereco-do-jogo`.
   (O endereço direto `html-classic.itch.zone/...` **não** funciona fora do itch.io: o itch
   bloqueia e mostra a tela "You should be using itch.io". Use sempre o `embed-upload`.)

## Como saber se funcionou

Abra `jogar.html`, clique em **Jogar agora** e olhe embaixo do jogo:

- **"Integração com o site: conectado ✓"** → tudo certo, os resultados vão para o ranking.
- **"O jogo está rodando, mas esta versão ainda não envia resultados"** → a build publicada
  ainda não tem estes arquivos (ou o endereço em `jogar.html` está desatualizado).

Para testar o site sem o jogo, use **"Para desenvolvedores: testar a integração"** na
própria página `jogar.html`.

## Como funciona por dentro (para a banca)

O jogo roda dentro do embed oficial do itch.io, que fica dentro de um `<iframe>` no site:

```
jogar.html (site)  >  iframe itch.io/embed-upload  >  iframe do jogo (html-classic.itch.zone)
```

Por isso o jogo manda mensagens para `window.top` (a página do site), e o site responde para o
frame do jogo. Os dois conversam com `window.postMessage`, que é a forma segura do navegador de
páginas de endereços diferentes trocarem mensagens:

| Quem manda | Mensagem | Quando |
|---|---|---|
| Jogo → Site | `{ origem: 'bellator', tipo: 'pronto' }` | o jogo abriu |
| Site → Jogo | `{ origem: 'rivals-arena', tipo: 'jogador', usuario, guerreiro, partidaId }` | logo depois do "pronto" |
| Jogo → Site | `{ origem: 'bellator', tipo: 'resultado', modo, ondas, pontos, venceu, guerreiro, duracaoSegundos }` | fim da partida |

O site só aceita mensagens vindas do endereço do jogo (`html-classic.itch.zone`), então
outra página não consegue mandar resultados falsos por esse caminho. (Como o site ainda não
tem servidor, os dados ficam no navegador; com um back-end, o ideal é validar o resultado no
servidor também.)

**Testado:** com a build atual publicada no itch.io, rodando dentro do `jogar.html`, o código
deste kit conectou nos dois sentidos (o jogo recebeu o usuário do site e o resultado enviado
pelo jogo entrou no ranking).
