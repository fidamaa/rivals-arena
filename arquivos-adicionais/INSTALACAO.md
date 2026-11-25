# Instalação e uso — Rivals Arena

Este guia explica como **acessar, instalar, configurar, executar e usar** o projeto.

- **Site publicado:** https://fidamaa.github.io/rivals-arena/
- **Código-fonte:** https://github.com/fidamaa/rivals-arena
- **Jogo Bellator:** https://dedechi.itch.io/bellator

---

## 1. Requisitos

| Para... | Você precisa de |
|---|---|
| Usar o site | Um navegador atualizado (Chrome, Edge, Firefox ou Safari) no computador ou no celular, com internet |
| Rodar o site no seu computador | Os arquivos do projeto e (opcional) Python 3 **ou** o VS Code com a extensão *Live Server* |
| Criar o banco de dados | MySQL 8.0.16+ (ou MariaDB 10.5+) e, se quiser uma interface visual, o MySQL Workbench |
| Atualizar o site publicado | Git e uma conta no GitHub |
| Mandar resultados do jogo para o site | Unity 6 (projeto do Bellator) |

> O site não precisa de instalação de pacotes, build ou servidor de aplicação: é HTML, CSS e
> JavaScript puros.

---

## 2. Acessar online (sem instalar nada)

1. Abra **https://fidamaa.github.io/rivals-arena/**
2. Clique em **Entrar** → **Entrar com conta de demonstração** para usar a conta "Cadu", que já é
   capitão de um time e organizador de torneios. Ou crie uma conta nova em **Criar conta**.

---

## 3. Rodar no seu computador

### 3.1 Baixar o projeto

Com Git:
```bash
git clone https://github.com/fidamaa/rivals-arena.git
```
Ou, no GitHub, clique em **Code → Download ZIP** e descompacte.

### 3.2 Abrir

**Opção A — mais simples:** dê dois cliques no arquivo `index.html`. O site abre no navegador.

**Opção B — com servidor local (recomendado):** dentro da pasta do projeto, rode:
```bash
python -m http.server 8000
```
e acesse **http://localhost:8000**. (No VS Code, também dá para clicar com o botão direito
no `index.html` → *Open with Live Server*.)

> A internet continua necessária para as fontes (Google Fonts) e para o jogo, que vem do itch.io.

---

## 4. Banco de dados (MySQL)

> **Importante:** nesta versão, o site guarda os dados no **navegador** de cada pessoa
> (`localStorage`). O banco MySQL abaixo é a **modelagem relacional** desses mesmos dados,
> pronta para a versão com servidor (back-end). Cada tabela corresponde a uma lista do objeto
> `banco` em `js/banco.js`. Veja a pasta [`documentacao/`](../documentacao/).

### 4.1 Instalar o MySQL

1. Baixe o **MySQL Installer** em https://dev.mysql.com/downloads/installer/
2. Instale o **MySQL Server 8** e o **MySQL Workbench** e defina a senha do usuário `root`.

### 4.2 Criar o banco e inserir os dados

Os scripts estão em `arquivos-adicionais/sql/` e devem ser executados **nesta ordem**:

| Ordem | Arquivo | O que faz |
|---|---|---|
| 1º | `01_criacao_banco.sql` | Cria o banco `rivals_arena`, as 14 tabelas, índices e 3 visões de ranking |
| 2º | `02_insercao_dados.sql` | Insere os dados de exemplo (16 jogadores, 6 equipes, 6 torneios, 30 inscrições, 20 partidas...) |
| 3º | `03_consultas_exemplo.sql` | (opcional) 10 consultas prontas: rankings, chaveamento, campeões... |

**Pelo terminal:**
```bash
mysql -u root -p < arquivos-adicionais/sql/01_criacao_banco.sql
```
```bash
mysql -u root -p < arquivos-adicionais/sql/02_insercao_dados.sql
```
```bash
mysql -u root -p < arquivos-adicionais/sql/03_consultas_exemplo.sql
```

**Pelo MySQL Workbench:** *File → Open SQL Script*, abra o `01_criacao_banco.sql`, clique no
raio ⚡ (*Execute*). Depois faça o mesmo com o `02` e o `03`.

**Conferência:** no fim do script 02 aparece uma tabela com a quantidade de linhas:
jogador 16, equipe 6, torneio 6, inscricao 30, partida 20, resultado_jogo 8, noticia 6.

> Atenção: o script 01 começa com `DROP DATABASE IF EXISTS rivals_arena`. Rodar de novo
> **apaga e recria** o banco.

---

## 5. Configurações

| O que | Onde | Como |
|---|---|---|
| Endereço do jogo | `jogar.html`, atributo `data-endereco-do-jogo` | Quando uma build nova é publicada no itch.io, copie o endereço `https://itch.io/embed-upload/NÚMERO` (página do jogo → **Embed**) |
| Dados de exemplo | `js/dados.js` | Jogadores, times, torneios e notícias iniciais |
| Recriar os dados em todos os navegadores | `js/banco.js`, constante `CHAVE_BANCO` | Mude o número da versão (ex.: `v4` → `v5`) |
| Pontuação do ranking | `js/banco.js`, constantes `PONTOS_VITORIA`, `PONTOS_DERROTA`, `PONTOS_CAMPEAO` | Valores atuais: +25, −15, +100 |
| Máximo de membros por time | `js/banco.js`, constante `MAXIMO_MEMBROS_TIME` | Valor atual: 6 |
| Cores do site | `css/style.css`, bloco `:root` | Variáveis `--red`, `--orange`, `--gold`... |
| Imagens | pasta `img/` | Troque o arquivo mantendo o mesmo nome |

### Integração com o jogo (Unity)

O site já está pronto para receber os resultados do Bellator. Do lado do jogo, basta seguir
[`integracao-unity/LEIA-ME.md`](../integracao-unity/LEIA-ME.md): copiar 3 arquivos para o
projeto Unity, adicionar 1 linha no fim da partida e publicar a build no itch.io.

---

## 6. Publicar / atualizar o site (GitHub Pages)

O site já está publicado. Para enviar alterações:
```bash
git add -A
```
```bash
git commit -m "Descreva a alteração"
```
```bash
git push
```
Em 1 ou 2 minutos o GitHub Pages atualiza **https://fidamaa.github.io/rivals-arena/**.

Para publicar em outra conta: crie um repositório público, envie os arquivos e, em
**Settings → Pages**, escolha a branch `main` e a pasta `/ (root)`.

---

## 7. Como usar o sistema

### Conta
- **Criar conta:** Entrar → Criar conta (usuário, e-mail e senha de pelo menos 6 caracteres).
- **Conta de demonstração:** Entrar → *Entrar com conta de demonstração*.
- **Editar perfil, trocar senha ou sair:** menu do avatar (canto superior direito) → Configurações.

### Torneios
1. **Criar:** Torneios → *+ Criar torneio*. Escolha nome, tamanho (1v1, 2v2 ou 3v3), modo de jogo,
   formato (eliminação simples ou pontos corridos), vagas, data e premiação.
2. **Inscrever-se:** abra o torneio → *Inscrever-se*. Em torneios de equipes, quem inscreve é o
   **capitão**, e o time precisa ter jogadores suficientes.
3. **Iniciar (organizador):** na página do torneio, em *Área do organizador* → *Iniciar torneio*.
   O chaveamento é gerado automaticamente. Para testes e apresentações, *Preencher vagas com
   exemplos* completa as vagas.
4. **Acompanhar:** aba *Chaveamento* (ou *Classificação*, em pontos corridos).

### Partidas
- Abra uma partida pelo chaveamento ou em **Partidas**.
- Quem joga a partida **escolhe o guerreiro**, pode **conversar no chat** e clicar em
  **Abrir o Bellator** para jogar.
- O **organizador** ou um **jogador da partida** envia o **placar**. O vencedor avança no
  chaveamento e o ranking é atualizado (+25 para a vitória, −15 para a derrota, +100 para o campeão).

### Times
- Times → *+ Criar time* (você vira o capitão).
- Na página do time, o capitão **adiciona jogadores** pelo nome de usuário, **remove membros** e
  **edita** o time. Outros jogadores podem clicar em *Entrar no time* (máximo de 6 membros).

### Jogar Bellator
- Menu **Jogar** → *Jogar agora*. O jogo roda dentro do site.
- No **celular**, o jogo abre em tela cheia. Deixe o aparelho deitado.
- Com a integração ativa no jogo, cada partida terminada vai para o **Ranking → aba Bellator**
  e para o seu **perfil**.

### Outras telas
- **Ranking:** jogadores, equipes e Bellator, com busca e filtro por guerreiro.
- **Meu painel:** próximas partidas, torneios em que você está, torneios que você organiza e notificações.
- **Novidades:** notícias com filtro por categoria.
- **Rodapé:** suporte (com formulário e perguntas frequentes), termos, privacidade e kit de imprensa.
- **Restaurar dados de exemplo:** Configurações → *Restaurar dados de exemplo*.

---

## 8. Problemas comuns

| Problema | Solução |
|---|---|
| "Meus torneios sumiram" ou "outra pessoa não vê meu torneio" | Os dados ficam no navegador de cada pessoa. Em outro navegador ou computador, os dados começam do zero (dados de exemplo). |
| O jogo mostra "You should be using itch.io" | O endereço em `jogar.html` precisa ser o `itch.io/embed-upload/...`, não o `html-classic.itch.zone/...`. |
| "Esta versão ainda não envia resultados" | A build publicada do jogo ainda não tem o kit `integracao-unity/`. |
| A página está com o visual antigo depois de uma atualização | Recarregue sem cache: **Ctrl + F5** (no celular, limpe o cache do navegador). |
| Erro ao rodar o script SQL | Confira se o MySQL é 8.0.16 ou mais novo e se rodou o `01` antes do `02`. |
