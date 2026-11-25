# Rivals Arena

> **Onde a rivalidade começa.** Plataforma de competições do jogo **Bellator**.

**Site publicado:** https://fidamaa.github.io/rivals-arena/
**Jogo Bellator (itch.io):** https://dedechi.itch.io/bellator

Para testar sem criar conta, clique em **Entrar → Entrar com conta de demonstração**.

---

## Descrição

A **Rivals Arena** é uma plataforma web de competições no estilo dos hubs de e-sports: jogadores
criam e disputam **torneios** do jogo **Bellator**, montam **times**, acompanham o **chaveamento**
e as **partidas**, sobem no **ranking** e jogam o Bellator **direto no navegador**, no computador
ou no celular.

O **Bellator** (do latim, "aquele que guerreia") é o jogo de combate em terceira pessoa,
ambientado no Coliseu da Roma Antiga, desenvolvido em **Unity 6** pela equipe como parte do
Projeto Integrador e publicado no itch.io.

## Objetivo do sistema

Oferecer à comunidade do Bellator um lugar único para **organizar e disputar competições**, sem
planilhas nem grupos de mensagens:

- **Organizadores** criam torneios e acompanham tudo em um painel.
- **Jogadores** se inscrevem sozinhos ou em equipe.
- O **chaveamento** é gerado automaticamente.
- Os **resultados** atualizam o ranking na hora.
- O **jogo** fica integrado ao site, para que as partidas jogadas também entrem no ranking.

## Funcionalidades

**Contas e perfis**
- Cadastro, login e conta de demonstração.
- Perfil público com estatísticas (pontos, posição, vitórias, derrotas, % de vitórias, títulos), times, histórico de partidas e recordes no jogo.
- Configurações: editar perfil, cor do avatar, trocar senha e sair.
- Notificações (sino no cabeçalho) e **Meu painel** com o resumo do jogador.

**Torneios**
- Criação com prévia ao vivo do cartão: 1v1, 2v2 ou 3v3; modos Mata-Mata, Estandarte do Império e Fuga do Coliseu; formato eliminação simples ou pontos corridos; vagas, data, premiação, região, regras e banner.
- Lista com busca, filtros (status, tamanho, modo) e ordenação.
- Inscrição de jogador (1v1) ou de time pelo capitão (2v2/3v3), com validações: vagas, tamanho do time e inscrição repetida.
- Área do organizador: iniciar torneio, preencher vagas com exemplos, remover inscritos e excluir torneio.
- **Chaveamento automático**: mata-mata com "passou direto" (BYE) quando faltam adversários, ou tabela de classificação em pontos corridos.

**Partidas**
- Listas Ao vivo, Próximas, Resultados e Minhas partidas.
- Página da partida: placar, escalações, **escolha do guerreiro** por jogador, **chat** e envio do resultado.
- O vencedor avança no chaveamento e o campeão é definido automaticamente.

**Times**
- Criar time (nome, TAG, cor), entrar, sair, adicionar e remover membros, editar e excluir. Máximo de 6 membros.

**Ranking**
- Jogadores (com pódio, busca e filtro por guerreiro).
- Equipes.
- Bellator: melhor resultado de cada jogador nos modos do jogo.

**Jogo Bellator integrado**
- Página **Jogar** com o jogo (Unity WebGL do itch.io) rodando dentro do site, com tela cheia no celular.
- Integração site ↔ jogo via `postMessage`: o site envia o jogador logado e o guerreiro escolhido; o jogo devolve ondas e pontos, que vão para o ranking.
- Kit pronto para o projeto Unity em [`integracao-unity/`](integracao-unity/).

**Conteúdo e institucional**
- Novidades (notícias com categorias).
- Página do Bellator (guerreiros, modos e roadmap).
- Suporte com perguntas frequentes e formulário que gera um protocolo.
- Termos, privacidade, segurança, jurídico, acessibilidade e kit de imprensa.
- Página 404.

**Responsivo:** todas as telas funcionam no computador e no celular (menu "hambúrguer", tela cheia
do jogo, botões do tamanho do dedo).

## Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Front-end | **HTML5**, **CSS3** (variáveis, Grid, Flexbox, container queries) e **JavaScript** puro (ES6), sem frameworks |
| Armazenamento (versão atual) | **localStorage** do navegador |
| Banco de dados (modelagem) | **MySQL 8**: 14 tabelas, chaves estrangeiras, `CHECK`, índices e *views* com funções de janela |
| Jogo | **Unity 6** (WebGL), publicado no **itch.io** e embutido pelo embed oficial |
| Integração jogo ↔ site | `window.postMessage` + plugin `.jslib` e scripts **C#** para o Unity |
| Design | **Figma** (protótipo e imagens), fonte **Blinker** (Google Fonts) |
| Hospedagem | **GitHub Pages** |
| Versionamento | **Git** e **GitHub** |

## Modelagem do banco de dados

Toda a modelagem está na pasta [`documentacao/`](documentacao/):

| Documento | Conteúdo |
|---|---|
| [Modelagem conceitual](documentacao/01-modelagem-conceitual.md) | Entidades, relacionamentos, cardinalidades e regras de negócio |
| [Modelagem lógica](documentacao/02-modelagem-logica.md) | Esquema relacional, dicionário de dados, decisões e normalização (3FN) |
| [DER](documentacao/03-DER.md) | Diagrama Entidade-Relacionamento: versão simplificada (tabelas principais) e versão completa |

**Tabelas (14):** `guerreiro`, `jogador`, `equipe`, `equipe_membro`, `torneio`, `inscricao`,
`partida`, `partida_guerreiro`, `mensagem_partida`, `resultado_jogo`, `notificacao`, `noticia`,
`chamado_suporte`, `interessado`. **Visões:** `vw_ranking_jogadores`, `vw_ranking_equipes`,
`vw_ranking_jogo`.

![DER simplificado](documentacao/DER-simplificado.png)

*Versão simplificada. O DER completo, com todas as 14 tabelas, está em [`documentacao/03-DER.md`](documentacao/03-DER.md).*

> **Observação:** nesta versão, sem servidor, o site salva os dados no navegador (`localStorage`),
> com a mesma estrutura do modelo: cada tabela corresponde a uma lista do objeto `banco` em
> `js/banco.js`. Os scripts SQL criam esse mesmo banco no MySQL, pronto para a versão com back-end.

## Arquivos adicionais

Pasta [`arquivos-adicionais/`](arquivos-adicionais/):

| Arquivo | Descrição |
|---|---|
| [`sql/01_criacao_banco.sql`](arquivos-adicionais/sql/01_criacao_banco.sql) | Criação do banco, das tabelas, dos índices e das visões |
| [`sql/02_insercao_dados.sql`](arquivos-adicionais/sql/02_insercao_dados.sql) | Inserção dos dados de exemplo (os mesmos do site) |
| [`sql/03_consultas_exemplo.sql`](arquivos-adicionais/sql/03_consultas_exemplo.sql) | Consultas prontas (rankings, chaveamento, campeões...) |
| [`INSTALACAO.md`](arquivos-adicionais/INSTALACAO.md) | **Instalação, configuração, execução e uso do sistema** |

## Como executar

- **Online:** https://fidamaa.github.io/rivals-arena/
- **No computador:** baixe o projeto e abra o `index.html`, ou rode `python -m http.server 8000`
  na pasta e acesse http://localhost:8000.
- **Banco de dados:** execute os scripts `01` e `02` da pasta `arquivos-adicionais/sql/` no MySQL.

O passo a passo completo está em [`arquivos-adicionais/INSTALACAO.md`](arquivos-adicionais/INSTALACAO.md).

## Estrutura do projeto

```
index.html, torneios.html, ...   uma página HTML para cada tela (19 páginas)
css/style.css                    cores, botões, cabeçalho, rodapé e página inicial
css/paginas.css                  estilos das páginas internas e ajustes para celular
js/dados.js                      dados de exemplo (jogadores, times, torneios, notícias...)
js/banco.js                      "banco de dados" (localStorage) e todas as regras do sistema
js/comum.js                      funções usadas em todas as páginas
js/paginas/*.js                  um script para cada página
img/                             imagens (vindas do Figma do projeto)
integracao-unity/                arquivos para colar no projeto Unity do Bellator
documentacao/                    modelagem conceitual, lógica e DER
arquivos-adicionais/             scripts SQL e instruções de instalação e uso
```

## Equipe

<!-- Preencha com os nomes dos integrantes e do(a) orientador(a) -->
- Integrante 1
- Integrante 2
- Orientador(a):

---

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC).
