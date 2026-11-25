# Modelagem Lógica — Rivals Arena

A modelagem lógica transforma o modelo conceitual em **tabelas relacionais**, com chaves
primárias (PK), chaves estrangeiras (FK), tipos de dados e restrições.
SGBD escolhido: **MySQL 8**. O script que cria tudo isso está em
[`arquivos-adicionais/sql/01_criacao_banco.sql`](../arquivos-adicionais/sql/01_criacao_banco.sql).

## Decisões da passagem do conceitual para o lógico

- **pertence (JOGADOR N:N EQUIPE)** virou a tabela associativa `equipe_membro`, com chave
  primária composta `(id_equipe, id_jogador)`.
- **INSCRIÇÃO** guarda `id_jogador` **ou** `id_equipe`. Uma restrição `CHECK` garante que
  exatamente um dos dois está preenchido. Assim, a tabela `partida` aponta sempre para
  inscrições e funciona igual para torneios 1v1 e por equipes.
- **avança para (PARTIDA → PARTIDA)** virou a FK `partida.id_proxima_partida`, que aponta
  para a própria tabela, mais a coluna `lado_na_proxima` (a/b).
- **escolhe (ternário)** virou a tabela `partida_guerreiro`, com PK `(id_partida, id_jogador)`:
  um guerreiro por jogador em cada partida.
- **é campeã de** virou a FK `torneio.id_inscricao_campea`, que pode ser nula.
- Listas fechadas (modo, formato, status...) usam `ENUM`.
- A tabela de times se chama `equipe`, porque `TIME` também é um tipo de dado no SQL.

## Esquema relacional

Legenda: **sublinhado/negrito = PK**, `#` = FK, `?` = pode ser nulo.

- **GUERREIRO** (**id_guerreiro**, nome, apelido, descricao, forca, agilidade, resistencia)
- **JOGADOR** (**id_jogador**, usuario, nome, email, senha_hash?, bio?, cor_avatar, #id_ultimo_guerreiro?, pontos, vitorias, derrotas, titulos, criado_em)
- **EQUIPE** (**id_equipe**, nome, tag, #id_capitao, bio?, cor, pontos, vitorias, derrotas, titulos, criado_em)
- **EQUIPE_MEMBRO** (**#id_equipe, #id_jogador**, entrou_em)
- **TORNEIO** (**id_torneio**, nome, modo, modo_de_jogo, formato, vagas, inicio, premio?, regiao, descricao?, regras?, arte, status, #id_organizador, #id_inscricao_campea?, criado_em, finalizado_em?)
- **INSCRICAO** (**id_inscricao**, #id_torneio, #id_jogador?, #id_equipe?, inscrito_em)
- **PARTIDA** (**id_partida**, #id_torneio, rodada, ordem, #id_inscricao_a?, #id_inscricao_b?, placar_a?, placar_b?, #id_inscricao_vencedora?, status, passou_direto, data_hora, #id_proxima_partida?, lado_na_proxima?, finalizada_em?)
- **PARTIDA_GUERREIRO** (**#id_partida, #id_jogador**, #id_guerreiro, escolhido_em)
- **MENSAGEM_PARTIDA** (**id_mensagem**, #id_partida, #id_jogador, texto, enviada_em)
- **RESULTADO_JOGO** (**id_resultado**, #id_jogador, modo, ondas, pontos, venceu, #id_guerreiro?, duracao_segundos, #id_partida?, jogado_em)
- **NOTIFICACAO** (**id_notificacao**, #id_jogador, texto, link?, lida, criada_em)
- **NOTICIA** (**id_noticia**, categoria, titulo, resumo, texto, arte, link?, publicada_em)
- **CHAMADO_SUPORTE** (**protocolo**, #id_jogador?, nome, email, assunto, mensagem, criado_em)
- **INTERESSADO** (**email**, cadastrado_em)

## Dicionário de dados

### guerreiro
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_guerreiro | TINYINT UNSIGNED | PK | 1 Secutor, 2 Retiarius, 3 Sagittarius, 4 Dimachaerus |
| nome | VARCHAR(20) | NOT NULL, UNIQUE | Nome do guerreiro |
| apelido | VARCHAR(40) | NOT NULL | Ex.: "O Escudo de Ferro" |
| descricao | VARCHAR(200) | NOT NULL | Texto de apresentação |
| forca, agilidade, resistencia | TINYINT UNSIGNED | NOT NULL, CHECK ≤ 100 | Atributos de 0 a 100 |

### jogador
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_jogador | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador |
| usuario | VARCHAR(20) | NOT NULL, UNIQUE | Nome público (letras, números, `.` e `_`) |
| nome | VARCHAR(40) | NOT NULL | Nome da pessoa |
| email | VARCHAR(80) | NOT NULL, UNIQUE | E-mail de login |
| senha_hash | VARCHAR(255) | NULL | Senha criptografada (NULL = conta de demonstração) |
| bio | VARCHAR(200) | NULL | "Sobre você" |
| cor_avatar | CHAR(7) | NOT NULL | Cor do avatar (ex.: `#e14036`) |
| id_ultimo_guerreiro | TINYINT UNSIGNED | FK → guerreiro, NULL | Último guerreiro usado |
| pontos | INT UNSIGNED | NOT NULL, padrão 1000 | Pontuação do ranking |
| vitorias, derrotas, titulos | INT UNSIGNED | NOT NULL, padrão 0 | Estatísticas |
| criado_em | DATETIME | NOT NULL | Data do cadastro |

### equipe
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_equipe | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador |
| nome | VARCHAR(30) | NOT NULL, UNIQUE | Nome do time |
| tag | VARCHAR(4) | NOT NULL, UNIQUE | Sigla (ex.: LGF) |
| id_capitao | INT UNSIGNED | FK → jogador, NOT NULL | Capitão do time |
| bio | VARCHAR(200) | NULL | Descrição |
| cor | CHAR(7) | NOT NULL | Cor do escudo |
| pontos, vitorias, derrotas, titulos | INT UNSIGNED | NOT NULL | Estatísticas do time |
| criado_em | DATETIME | NOT NULL | Data de criação |

### equipe_membro
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_equipe | INT UNSIGNED | PK, FK → equipe (CASCADE) | Time |
| id_jogador | INT UNSIGNED | PK, FK → jogador (CASCADE) | Membro |
| entrou_em | DATETIME | NOT NULL | Data de entrada |

### torneio
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_torneio | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador |
| nome | VARCHAR(40) | NOT NULL | Nome do torneio |
| modo | ENUM('1v1','2v2','3v3') | NOT NULL | Tamanho das equipes |
| modo_de_jogo | ENUM('Mata-Mata','Estandarte do Império','Fuga do Coliseu') | NOT NULL | Modo do Bellator |
| formato | ENUM('eliminacao','pontos') | NOT NULL | Mata-mata ou pontos corridos |
| vagas | TINYINT UNSIGNED | NOT NULL, CHECK 2–64 | Máximo de inscrições |
| inicio | DATETIME | NOT NULL | Data e hora de início |
| premio, regiao, descricao, regras | VARCHAR / TEXT | — | Informações do torneio |
| arte | TINYINT UNSIGNED | NOT NULL | Número da imagem do banner |
| status | ENUM('inscricoes','andamento','finalizado') | NOT NULL | Situação atual |
| id_organizador | INT UNSIGNED | FK → jogador, NOT NULL | Quem criou |
| id_inscricao_campea | INT UNSIGNED | FK → inscricao, NULL | Campeão (quando finalizado) |
| criado_em, finalizado_em | DATETIME | — | Datas |

### inscricao
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_inscricao | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador |
| id_torneio | INT UNSIGNED | FK → torneio (CASCADE), NOT NULL | Torneio |
| id_jogador | INT UNSIGNED | FK → jogador, NULL | Preenchido em torneios 1v1 |
| id_equipe | INT UNSIGNED | FK → equipe, NULL | Preenchido em torneios 2v2/3v3 |
| inscrito_em | DATETIME | NOT NULL | Data da inscrição |
| *restrições* | | UNIQUE (id_torneio, id_jogador), UNIQUE (id_torneio, id_equipe), CHECK (só um dos dois preenchido) | |

### partida
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_partida | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador |
| id_torneio | INT UNSIGNED | FK → torneio (CASCADE) | Torneio |
| rodada, ordem | TINYINT UNSIGNED | UNIQUE (id_torneio, rodada, ordem) | Posição no chaveamento |
| id_inscricao_a, id_inscricao_b | INT UNSIGNED | FK → inscricao, NULL | Lados (NULL = a definir) |
| placar_a, placar_b | TINYINT UNSIGNED | NULL, CHECK sem empate | Placar |
| id_inscricao_vencedora | INT UNSIGNED | FK → inscricao, NULL | Vencedor |
| status | ENUM('aguardando','agendada','finalizada') | NOT NULL | Situação |
| passou_direto | BOOLEAN | NOT NULL | TRUE = vitória sem adversário (BYE) |
| data_hora | DATETIME | NOT NULL | Horário da partida |
| id_proxima_partida | INT UNSIGNED | FK → partida, NULL | Para onde o vencedor avança |
| lado_na_proxima | ENUM('a','b') | NULL | Em qual lado ele entra |
| finalizada_em | DATETIME | NULL | Quando o resultado foi enviado |

### partida_guerreiro
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_partida | INT UNSIGNED | PK, FK → partida (CASCADE) | Partida |
| id_jogador | INT UNSIGNED | PK, FK → jogador (CASCADE) | Jogador |
| id_guerreiro | TINYINT UNSIGNED | FK → guerreiro, NOT NULL | Guerreiro escolhido |
| escolhido_em | DATETIME | NOT NULL | Data da escolha |

### mensagem_partida
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_mensagem | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador |
| id_partida | INT UNSIGNED | FK → partida (CASCADE) | Partida |
| id_jogador | INT UNSIGNED | FK → jogador (CASCADE) | Autor |
| texto | VARCHAR(300) | NOT NULL | Mensagem |
| enviada_em | DATETIME | NOT NULL | Data |

### resultado_jogo
| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| id_resultado | INT UNSIGNED | PK, AUTO_INCREMENT | Identificador |
| id_jogador | INT UNSIGNED | FK → jogador (CASCADE) | Quem jogou |
| modo | ENUM('sobrevivencia','infinito') | NOT NULL | Modo do Bellator |
| ondas | SMALLINT UNSIGNED | NOT NULL | Ondas sobrevividas |
| pontos | INT UNSIGNED | NOT NULL | Pontuação |
| venceu | BOOLEAN | NOT NULL | Venceu a partida? |
| id_guerreiro | TINYINT UNSIGNED | FK → guerreiro, NULL | Guerreiro usado |
| duracao_segundos | INT UNSIGNED | NOT NULL | Duração |
| id_partida | INT UNSIGNED | FK → partida, NULL | Partida de torneio ligada (opcional) |
| jogado_em | DATETIME | NOT NULL | Data |

### notificacao, noticia, chamado_suporte, interessado
| Tabela | Colunas principais |
|---|---|
| notificacao | id_notificacao (PK), id_jogador (FK), texto, link, lida (BOOLEAN), criada_em |
| noticia | id_noticia (PK), categoria (ENUM), titulo, resumo, texto (TEXT), arte, link, publicada_em |
| chamado_suporte | protocolo (PK, ex.: RA-738199), id_jogador (FK, NULL), nome, email, assunto, mensagem, criado_em |
| interessado | email (PK), cadastrado_em |

## Visões (views)

| Visão | Para que serve |
|---|---|
| `vw_ranking_jogadores` | Ranking geral de jogadores com posição (RANK) e % de vitórias |
| `vw_ranking_equipes` | Ranking de equipes com número de membros |
| `vw_ranking_jogo` | Melhor resultado de cada jogador em cada modo do Bellator |

## Normalização

As tabelas estão na **3ª Forma Normal (3FN)**:
- **1FN:** todos os valores são atômicos. As listas do site (membros de um time, participantes
  de um torneio) viraram as tabelas `equipe_membro` e `inscricao`.
- **2FN:** nas tabelas com chave composta (`equipe_membro`, `partida_guerreiro`), as demais colunas
  dependem da chave inteira.
- **3FN:** não há dependências transitivas. Por exemplo, o nome do guerreiro fica só em `guerreiro`,
  e as outras tabelas guardam apenas `id_guerreiro`.

Exceção consciente: `pontos`, `vitorias`, `derrotas` e `titulos` em `jogador` e `equipe` poderiam
ser calculados a partir das partidas. Eles ficam guardados (desnormalização controlada) para o
ranking abrir rápido, e são atualizados a cada resultado enviado.
