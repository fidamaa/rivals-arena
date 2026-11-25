# Modelagem Lógica

Na modelagem lógica o modelo conceitual foi transformado em tabelas, já pensando no MySQL.
O script que cria essas tabelas está em `arquivos-adicionais/sql/01_criacao_banco.sql`.

## Como o modelo conceitual virou tabelas

O relacionamento N:N entre jogador e equipe virou a tabela `equipe_membro`, que tem como chave o
par (id_equipe, id_jogador).

A inscrição precisava aceitar tanto jogador quanto equipe. Por isso a tabela `inscricao` tem os
dois campos, `id_jogador` e `id_equipe`, e uma regra (CHECK) que obriga a preencher só um deles.
Com isso a tabela `partida` sempre aponta para inscrições, e funciona igual em torneios 1v1 e em
torneios de equipes.

Para o chaveamento, cada partida guarda `id_proxima_partida`, que aponta para a própria tabela, e
`lado_na_proxima` (a ou b), que diz em qual lado o vencedor entra na partida seguinte.

A escolha do guerreiro em cada partida ficou na tabela `partida_guerreiro`, com chave
(id_partida, id_jogador), porque cada jogador escolhe um guerreiro por partida.

O campeão do torneio é guardado em `torneio.id_inscricao_campea`, que fica vazio até o torneio
terminar.

Os campos que só aceitam alguns valores (modo, formato, status) usam o tipo ENUM. A tabela de
times foi chamada de `equipe` porque TIME também é o nome de um tipo de dado no SQL.

## Esquema relacional

PK = chave primária, FK = chave estrangeira.

```
guerreiro (id_guerreiro PK, nome, apelido, descricao, forca, agilidade, resistencia)
jogador (id_jogador PK, usuario, nome, email, senha_hash, bio, cor_avatar, id_ultimo_guerreiro FK,
         pontos, vitorias, derrotas, titulos, criado_em)
equipe (id_equipe PK, nome, tag, id_capitao FK, bio, cor, pontos, vitorias, derrotas, titulos, criado_em)
equipe_membro (id_equipe PK FK, id_jogador PK FK, entrou_em)
torneio (id_torneio PK, nome, modo, modo_de_jogo, formato, vagas, inicio, premio, regiao, descricao,
         regras, arte, status, id_organizador FK, id_inscricao_campea FK, criado_em, finalizado_em)
inscricao (id_inscricao PK, id_torneio FK, id_jogador FK, id_equipe FK, inscrito_em)
partida (id_partida PK, id_torneio FK, rodada, ordem, id_inscricao_a FK, id_inscricao_b FK, placar_a,
         placar_b, id_inscricao_vencedora FK, status, passou_direto, data_hora, id_proxima_partida FK,
         lado_na_proxima, finalizada_em)
partida_guerreiro (id_partida PK FK, id_jogador PK FK, id_guerreiro FK, escolhido_em)
mensagem_partida (id_mensagem PK, id_partida FK, id_jogador FK, texto, enviada_em)
resultado_jogo (id_resultado PK, id_jogador FK, modo, ondas, pontos, venceu, id_guerreiro FK,
                duracao_segundos, id_partida FK, jogado_em)
notificacao (id_notificacao PK, id_jogador FK, texto, link, lida, criada_em)
noticia (id_noticia PK, categoria, titulo, resumo, texto, arte, link, publicada_em)
chamado_suporte (protocolo PK, id_jogador FK, nome, email, assunto, mensagem, criado_em)
interessado (email PK, cadastrado_em)
```

## Dicionário de dados

### guerreiro
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_guerreiro | TINYINT | PK | 1 Secutor, 2 Retiarius, 3 Sagittarius, 4 Dimachaerus |
| nome | VARCHAR(20) | NOT NULL, UNIQUE | Nome do guerreiro |
| apelido | VARCHAR(40) | NOT NULL | Ex.: "O Escudo de Ferro" |
| descricao | VARCHAR(200) | NOT NULL | Descrição |
| forca, agilidade, resistencia | TINYINT | NOT NULL, até 100 | Atributos |

### jogador
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_jogador | INT | PK, AUTO_INCREMENT | Código do jogador |
| usuario | VARCHAR(20) | NOT NULL, UNIQUE | Nome que aparece no site |
| nome | VARCHAR(40) | NOT NULL | Nome da pessoa |
| email | VARCHAR(80) | NOT NULL, UNIQUE | E-mail de login |
| senha_hash | VARCHAR(255) | | Senha criptografada (vazia nas contas de demonstração) |
| bio | VARCHAR(200) | | Texto do perfil |
| cor_avatar | CHAR(7) | NOT NULL | Cor do avatar |
| id_ultimo_guerreiro | TINYINT | FK guerreiro | Último guerreiro usado |
| pontos | INT | NOT NULL, padrão 1000 | Pontos no ranking |
| vitorias, derrotas, titulos | INT | NOT NULL, padrão 0 | Estatísticas |
| criado_em | DATETIME | NOT NULL | Data do cadastro |

### equipe
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_equipe | INT | PK, AUTO_INCREMENT | Código da equipe |
| nome | VARCHAR(30) | NOT NULL, UNIQUE | Nome do time |
| tag | VARCHAR(4) | NOT NULL, UNIQUE | Sigla (ex.: LGF) |
| id_capitao | INT | FK jogador, NOT NULL | Capitão |
| bio | VARCHAR(200) | | Descrição |
| cor | CHAR(7) | NOT NULL | Cor do escudo |
| pontos, vitorias, derrotas, titulos | INT | NOT NULL | Estatísticas |
| criado_em | DATETIME | NOT NULL | Data de criação |

### equipe_membro
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_equipe | INT | PK, FK equipe | Equipe |
| id_jogador | INT | PK, FK jogador | Jogador |
| entrou_em | DATETIME | NOT NULL | Data de entrada |

### torneio
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_torneio | INT | PK, AUTO_INCREMENT | Código do torneio |
| nome | VARCHAR(40) | NOT NULL | Nome |
| modo | ENUM('1v1','2v2','3v3') | NOT NULL | Tamanho dos times |
| modo_de_jogo | ENUM | NOT NULL | Mata-Mata, Estandarte do Império ou Fuga do Coliseu |
| formato | ENUM('eliminacao','pontos') | NOT NULL | Mata-mata ou pontos corridos |
| vagas | TINYINT | NOT NULL, de 2 a 64 | Número de vagas |
| inicio | DATETIME | NOT NULL | Data e hora de início |
| premio | VARCHAR(50) | | Premiação |
| regiao | VARCHAR(30) | NOT NULL | Região |
| descricao | VARCHAR(400) | | Descrição |
| regras | TEXT | | Regras |
| arte | TINYINT | NOT NULL | Imagem do banner |
| status | ENUM('inscricoes','andamento','finalizado') | NOT NULL | Situação |
| id_organizador | INT | FK jogador, NOT NULL | Quem criou |
| id_inscricao_campea | INT | FK inscricao | Campeão |
| criado_em, finalizado_em | DATETIME | | Datas |

### inscricao
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_inscricao | INT | PK, AUTO_INCREMENT | Código da inscrição |
| id_torneio | INT | FK torneio, NOT NULL | Torneio |
| id_jogador | INT | FK jogador | Preenchido em torneio 1v1 |
| id_equipe | INT | FK equipe | Preenchido em torneio 2v2 ou 3v3 |
| inscrito_em | DATETIME | NOT NULL | Data da inscrição |

Também tem duas regras UNIQUE (o mesmo jogador ou equipe não se inscreve duas vezes no mesmo
torneio) e um CHECK que obriga a preencher só um entre id_jogador e id_equipe.

### partida
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_partida | INT | PK, AUTO_INCREMENT | Código da partida |
| id_torneio | INT | FK torneio | Torneio |
| rodada, ordem | TINYINT | NOT NULL | Posição no chaveamento |
| id_inscricao_a, id_inscricao_b | INT | FK inscricao | Os dois lados (vazio = a definir) |
| placar_a, placar_b | TINYINT | não pode empatar | Placar |
| id_inscricao_vencedora | INT | FK inscricao | Vencedor |
| status | ENUM('aguardando','agendada','finalizada') | NOT NULL | Situação |
| passou_direto | BOOLEAN | NOT NULL | Vitória sem adversário |
| data_hora | DATETIME | NOT NULL | Horário |
| id_proxima_partida | INT | FK partida | Para onde o vencedor vai |
| lado_na_proxima | ENUM('a','b') | | Lado na próxima partida |
| finalizada_em | DATETIME | | Quando o resultado foi enviado |

### partida_guerreiro
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_partida | INT | PK, FK partida | Partida |
| id_jogador | INT | PK, FK jogador | Jogador |
| id_guerreiro | TINYINT | FK guerreiro, NOT NULL | Guerreiro escolhido |
| escolhido_em | DATETIME | NOT NULL | Data da escolha |

### mensagem_partida
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_mensagem | INT | PK, AUTO_INCREMENT | Código |
| id_partida | INT | FK partida | Partida |
| id_jogador | INT | FK jogador | Quem enviou |
| texto | VARCHAR(300) | NOT NULL | Mensagem |
| enviada_em | DATETIME | NOT NULL | Data |

### resultado_jogo
| Campo | Tipo | Restrição | Descrição |
|---|---|---|---|
| id_resultado | INT | PK, AUTO_INCREMENT | Código |
| id_jogador | INT | FK jogador | Quem jogou |
| modo | ENUM('sobrevivencia','infinito') | NOT NULL | Modo do jogo |
| ondas | SMALLINT | NOT NULL | Ondas sobrevividas |
| pontos | INT | NOT NULL | Pontuação |
| venceu | BOOLEAN | NOT NULL | Se venceu |
| id_guerreiro | TINYINT | FK guerreiro | Guerreiro usado |
| duracao_segundos | INT | NOT NULL | Duração |
| id_partida | INT | FK partida | Partida de torneio (opcional) |
| jogado_em | DATETIME | NOT NULL | Data |

### Demais tabelas
| Tabela | Campos |
|---|---|
| notificacao | id_notificacao (PK), id_jogador (FK), texto, link, lida, criada_em |
| noticia | id_noticia (PK), categoria, titulo, resumo, texto, arte, link, publicada_em |
| chamado_suporte | protocolo (PK), id_jogador (FK), nome, email, assunto, mensagem, criado_em |
| interessado | email (PK), cadastrado_em |

## Views

Criamos três views para as telas de ranking:

- `vw_ranking_jogadores`: ranking dos jogadores, com posição e porcentagem de vitórias
- `vw_ranking_equipes`: ranking das equipes, com o número de membros
- `vw_ranking_jogo`: melhor resultado de cada jogador em cada modo do Bellator

## Normalização

As tabelas estão na terceira forma normal (3FN). Os campos guardam um valor só (as listas de
membros e de participantes viraram as tabelas `equipe_membro` e `inscricao`). Nas tabelas com
chave composta, os outros campos dependem da chave inteira, e não há campos que dependam de
outros campos que não sejam a chave. O nome do guerreiro, por exemplo, só existe na tabela
`guerreiro`; as outras tabelas guardam apenas o código dele.

A única exceção são os campos de pontos, vitórias, derrotas e títulos em `jogador` e `equipe`.
Eles poderiam ser calculados a partir das partidas, mas deixamos guardados para o ranking
carregar mais rápido. Eles são atualizados sempre que um resultado é enviado.
