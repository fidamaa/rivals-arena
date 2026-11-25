# Instalação e uso

## 1. O que é preciso

Para usar o site basta um navegador atualizado (Chrome, Edge, Firefox ou Safari), no computador
ou no celular, com internet.

Para as outras partes do projeto:

- rodar o site no computador: os arquivos do projeto e, se quiser, o Python 3 ou o VS Code com a
  extensão Live Server
- criar o banco de dados: MySQL 8 (pode usar o MySQL Workbench)
- atualizar o site publicado: Git e uma conta no GitHub
- ligar o jogo ao site: Unity, com o projeto do Bellator

O site é feito só com HTML, CSS e JavaScript, então não precisa instalar bibliotecas nem compilar.

## 2. Acessando pela internet

O site está publicado em https://fidamaa.github.io/rivals-arena/

Na tela de login dá para criar uma conta nova ou clicar em "Entrar com conta de demonstração".
A conta de demonstração é a do jogador Cadu, que já é capitão de um time e organizador de
torneios, então serve para testar tudo.

## 3. Rodando no computador

Baixe o projeto pelo GitHub (botão Code > Download ZIP) ou com o Git:

```bash
git clone https://github.com/fidamaa/rivals-arena.git
```

Depois é só abrir o arquivo `index.html` no navegador.

Também dá para rodar com um servidor local. Dentro da pasta do projeto:

```bash
python -m http.server 8000
```

E acessar http://localhost:8000 no navegador. No VS Code, outra opção é clicar com o botão direito
no `index.html` e escolher "Open with Live Server".

A internet continua sendo necessária, porque a fonte do site e o jogo vêm de fora (Google Fonts e
itch.io).

## 4. Banco de dados

Nesta versão o site guarda os dados no navegador (localStorage). O banco MySQL tem a mesma
estrutura e fica pronto para quando o projeto tiver um servidor. Cada tabela do banco corresponde
a uma lista dentro do arquivo `js/banco.js`.

Para criar o banco:

1. Instale o MySQL Server 8 e o MySQL Workbench (https://dev.mysql.com/downloads/installer/).
2. Rode os scripts da pasta `arquivos-adicionais/sql`, nesta ordem:
   - `01_criacao_banco.sql`: cria o banco `rivals_arena`, as tabelas e as views
   - `02_insercao_dados.sql`: insere os dados de exemplo
   - `03_consultas_exemplo.sql`: algumas consultas para testar (opcional)

Pelo Workbench: File > Open SQL Script, abrir o arquivo e clicar no raio para executar.

Pelo terminal:

```bash
mysql -u root -p < arquivos-adicionais/sql/01_criacao_banco.sql
```

```bash
mysql -u root -p < arquivos-adicionais/sql/02_insercao_dados.sql
```

No final do script 02 aparece a quantidade de registros de cada tabela, por exemplo 16 jogadores,
6 equipes, 6 torneios e 20 partidas.

Atenção: o script 01 apaga o banco `rivals_arena` antes de criar de novo, então rodar ele outra vez
perde os dados.

## 5. Configurações

Algumas coisas que podem ser alteradas:

- Endereço do jogo: no arquivo `jogar.html`, atributo `data-endereco-do-jogo`. Quando for publicada
  uma versão nova do jogo no itch.io, o endereço pode mudar. Para pegar o novo, abra a página do jogo
  no itch.io, clique em Embed e copie o link `https://itch.io/embed-upload/...`.
- Dados de exemplo: arquivo `js/dados.js`.
- Para recriar os dados de exemplo em todos os navegadores, mude o número da versão na constante
  `CHAVE_BANCO`, em `js/banco.js` (por exemplo, de v4 para v5).
- Pontos do ranking e limite de membros por time: constantes no começo de `js/banco.js`.
- Cores: no começo do arquivo `css/style.css`.
- Imagens: pasta `img`. Para trocar uma imagem, basta substituir o arquivo mantendo o mesmo nome.

Para o jogo mandar os resultados para o site, é preciso adicionar alguns arquivos no projeto Unity.
O passo a passo está em `integracao-unity/LEIA-ME.md`.

## 6. Publicando alterações

O site está no GitHub Pages. Depois de alterar algum arquivo:

```bash
git add -A
```

```bash
git commit -m "descrição da alteração"
```

```bash
git push
```

Em um ou dois minutos a versão nova aparece no site.

## 7. Como usar

### Conta

Para criar a conta, clique em Entrar e depois em Criar conta. É preciso informar um nome de
usuário, um e-mail e uma senha com pelo menos 6 caracteres. Os dados do perfil e a senha podem ser
alterados em Configurações, no menu que abre ao clicar no seu avatar.

### Torneios

Na página Torneios, clique em "Criar torneio" e preencha nome, tamanho dos times (1v1, 2v2 ou 3v3),
modo de jogo, formato, vagas, data e premiação.

Para participar, abra o torneio e clique em "Inscrever-se". Em torneios de times, quem inscreve é o
capitão, e o time precisa ter jogadores suficientes.

Quando as inscrições estiverem completas, o organizador clica em "Iniciar torneio", e o chaveamento
é montado sozinho. Para testar, o botão "Preencher vagas com exemplos" completa as vagas com
jogadores de exemplo.

### Partidas

As partidas aparecem no chaveamento do torneio e na página Partidas. Ao abrir uma partida, quem vai
jogar escolhe o guerreiro, pode conversar pelo chat e abrir o Bellator. Depois do jogo, o
organizador ou um dos jogadores envia o placar. O vencedor passa para a próxima fase e o ranking é
atualizado: 25 pontos por vitória, menos 15 por derrota e 100 para o campeão.

### Times

Na página Times, clique em "Criar time". Quem cria vira o capitão e pode adicionar jogadores pelo
nome de usuário, remover membros e editar o time. Outros jogadores podem entrar pelo botão "Entrar
no time". Cada time pode ter até 6 membros.

### Jogar

No menu, clique em Jogar e depois em "Jogar agora". O jogo abre dentro do site. No celular ele abre
em tela cheia, e o melhor é deixar o aparelho deitado. Quando o jogo estiver com a integração, os
resultados vão para o Ranking (aba Bellator) e para o perfil do jogador.

### Outras páginas

- Ranking: jogadores, times e Bellator, com busca e filtro por guerreiro
- Meu painel: próximas partidas, torneios e notificações
- Novidades: notícias do site e do jogo
- Suporte (no rodapé): perguntas frequentes e formulário de contato
- Configurações: tem o botão "Restaurar dados de exemplo", que volta o site ao estado inicial

## 8. Problemas comuns

- **Os torneios que eu criei não aparecem em outro computador.** Os dados ficam salvos no navegador,
  então cada navegador tem os seus.
- **O jogo mostra a mensagem "You should be using itch.io".** O endereço do jogo em `jogar.html`
  precisa ser o link `itch.io/embed-upload/...`.
- **Aparece "esta versão ainda não envia resultados".** A versão publicada do jogo ainda não tem os
  arquivos da pasta `integracao-unity`.
- **O site continua com a aparência antiga depois de uma atualização.** Recarregue a página com
  Ctrl + F5.
- **Dá erro ao rodar o SQL.** Confira se o MySQL é a versão 8 e se o script 01 foi executado antes
  do 02.
