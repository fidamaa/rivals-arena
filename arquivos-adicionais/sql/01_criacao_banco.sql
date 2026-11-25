-- =====================================================================
-- RIVALS ARENA — Script 01: CRIAÇÃO DO BANCO DE DADOS E DAS TABELAS
-- ---------------------------------------------------------------------
-- SGBD: MySQL 8.0.16 ou superior (também roda no MariaDB 10.5+)
-- Como executar (terminal):   mysql -u root -p < 01_criacao_banco.sql
-- Ou abra no MySQL Workbench e clique no raio (Execute).
--
-- Depois rode o 02_insercao_dados.sql para preencher com os dados de exemplo.
--
-- Correspondência com o site: cada tabela abaixo equivale a uma lista
-- do objeto `banco` em js/banco.js (ex.: tabela jogador = banco.jogadores).
-- =====================================================================

DROP DATABASE IF EXISTS rivals_arena;
CREATE DATABASE rivals_arena CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rivals_arena;


-- ---------------------------------------------------------------------
-- 1. GUERREIRO — os 4 personagens do Bellator (tabela de apoio)
-- ---------------------------------------------------------------------
CREATE TABLE guerreiro (
  id_guerreiro  TINYINT UNSIGNED NOT NULL,
  nome          VARCHAR(20)  NOT NULL,
  apelido       VARCHAR(40)  NOT NULL,
  descricao     VARCHAR(200) NOT NULL,
  forca         TINYINT UNSIGNED NOT NULL,
  agilidade     TINYINT UNSIGNED NOT NULL,
  resistencia   TINYINT UNSIGNED NOT NULL,
  CONSTRAINT pk_guerreiro PRIMARY KEY (id_guerreiro),
  CONSTRAINT uq_guerreiro_nome UNIQUE (nome),
  CONSTRAINT ck_guerreiro_atributos CHECK (forca <= 100 AND agilidade <= 100 AND resistencia <= 100)
);


-- ---------------------------------------------------------------------
-- 2. JOGADOR — contas de usuário (banco.jogadores)
-- ---------------------------------------------------------------------
CREATE TABLE jogador (
  id_jogador           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  usuario              VARCHAR(20)  NOT NULL,
  nome                 VARCHAR(40)  NOT NULL,
  email                VARCHAR(80)  NOT NULL,
  senha_hash           VARCHAR(255) NULL COMMENT 'NULL = conta de demonstração, sem senha',
  bio                  VARCHAR(200) NULL,
  cor_avatar           CHAR(7)      NOT NULL DEFAULT '#e14036',
  id_ultimo_guerreiro  TINYINT UNSIGNED NULL COMMENT 'último guerreiro usado em uma partida',
  pontos               INT UNSIGNED NOT NULL DEFAULT 1000,
  vitorias             INT UNSIGNED NOT NULL DEFAULT 0,
  derrotas             INT UNSIGNED NOT NULL DEFAULT 0,
  titulos              INT UNSIGNED NOT NULL DEFAULT 0,
  criado_em            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_jogador PRIMARY KEY (id_jogador),
  CONSTRAINT uq_jogador_usuario UNIQUE (usuario),
  CONSTRAINT uq_jogador_email UNIQUE (email),
  CONSTRAINT fk_jogador_guerreiro FOREIGN KEY (id_ultimo_guerreiro)
    REFERENCES guerreiro (id_guerreiro) ON DELETE SET NULL
);


-- ---------------------------------------------------------------------
-- 3. EQUIPE — times (banco.times)
--    (no banco usamos "equipe" porque TIME também é um tipo de dado do SQL)
-- ---------------------------------------------------------------------
CREATE TABLE equipe (
  id_equipe   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(30)  NOT NULL,
  tag         VARCHAR(4)   NOT NULL COMMENT 'sigla de 2 a 4 letras, ex.: LGF',
  id_capitao  INT UNSIGNED NOT NULL,
  bio         VARCHAR(200) NULL,
  cor         CHAR(7)      NOT NULL DEFAULT '#e14036',
  pontos      INT UNSIGNED NOT NULL DEFAULT 1000,
  vitorias    INT UNSIGNED NOT NULL DEFAULT 0,
  derrotas    INT UNSIGNED NOT NULL DEFAULT 0,
  titulos     INT UNSIGNED NOT NULL DEFAULT 0,
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_equipe PRIMARY KEY (id_equipe),
  CONSTRAINT uq_equipe_nome UNIQUE (nome),
  CONSTRAINT uq_equipe_tag UNIQUE (tag),
  CONSTRAINT fk_equipe_capitao FOREIGN KEY (id_capitao) REFERENCES jogador (id_jogador)
);


-- ---------------------------------------------------------------------
-- 4. EQUIPE_MEMBRO — quem faz parte de cada equipe (relação N:N)
--    Um jogador pode estar em várias equipes; uma equipe tem até 6 membros
--    (o limite de 6 é verificado pela aplicação).
-- ---------------------------------------------------------------------
CREATE TABLE equipe_membro (
  id_equipe   INT UNSIGNED NOT NULL,
  id_jogador  INT UNSIGNED NOT NULL,
  entrou_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_equipe_membro PRIMARY KEY (id_equipe, id_jogador),
  CONSTRAINT fk_membro_equipe  FOREIGN KEY (id_equipe)  REFERENCES equipe (id_equipe)   ON DELETE CASCADE,
  CONSTRAINT fk_membro_jogador FOREIGN KEY (id_jogador) REFERENCES jogador (id_jogador) ON DELETE CASCADE
);


-- ---------------------------------------------------------------------
-- 5. TORNEIO — campeonatos criados pelos jogadores (banco.torneios)
-- ---------------------------------------------------------------------
CREATE TABLE torneio (
  id_torneio           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome                 VARCHAR(40)  NOT NULL,
  modo                 ENUM('1v1','2v2','3v3') NOT NULL COMMENT '1v1 = jogadores; 2v2/3v3 = equipes',
  modo_de_jogo         ENUM('Mata-Mata','Estandarte do Império','Fuga do Coliseu') NOT NULL,
  formato              ENUM('eliminacao','pontos') NOT NULL COMMENT 'eliminacao = mata-mata; pontos = todos contra todos',
  vagas                TINYINT UNSIGNED NOT NULL,
  inicio               DATETIME     NOT NULL,
  premio               VARCHAR(50)  NULL,
  regiao               VARCHAR(30)  NOT NULL DEFAULT 'Brasil',
  descricao            VARCHAR(400) NULL,
  regras               TEXT         NULL,
  arte                 TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'número da imagem do banner (img/arte-N.jpg)',
  status               ENUM('inscricoes','andamento','finalizado') NOT NULL DEFAULT 'inscricoes',
  id_organizador       INT UNSIGNED NOT NULL,
  id_inscricao_campea  INT UNSIGNED NULL COMMENT 'preenchido quando o torneio termina',
  criado_em            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  finalizado_em        DATETIME     NULL,
  CONSTRAINT pk_torneio PRIMARY KEY (id_torneio),
  CONSTRAINT ck_torneio_vagas CHECK (vagas BETWEEN 2 AND 64),
  CONSTRAINT fk_torneio_organizador FOREIGN KEY (id_organizador) REFERENCES jogador (id_jogador)
);


-- ---------------------------------------------------------------------
-- 6. INSCRICAO — participantes de cada torneio (torneio.participantes)
--    Em torneios 1v1 quem se inscreve é um JOGADOR; em 2v2/3v3 é uma EQUIPE.
--    Por isso exatamente uma das colunas (id_jogador ou id_equipe) é preenchida.
-- ---------------------------------------------------------------------
CREATE TABLE inscricao (
  id_inscricao  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_torneio    INT UNSIGNED NOT NULL,
  id_jogador    INT UNSIGNED NULL,
  id_equipe     INT UNSIGNED NULL,
  inscrito_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_inscricao PRIMARY KEY (id_inscricao),
  CONSTRAINT uq_inscricao_jogador UNIQUE (id_torneio, id_jogador),
  CONSTRAINT uq_inscricao_equipe  UNIQUE (id_torneio, id_equipe),
  CONSTRAINT ck_inscricao_um_participante CHECK ((id_jogador IS NULL) <> (id_equipe IS NULL)),
  CONSTRAINT fk_inscricao_torneio FOREIGN KEY (id_torneio) REFERENCES torneio (id_torneio) ON DELETE CASCADE,
  CONSTRAINT fk_inscricao_jogador FOREIGN KEY (id_jogador) REFERENCES jogador (id_jogador),
  CONSTRAINT fk_inscricao_equipe  FOREIGN KEY (id_equipe)  REFERENCES equipe (id_equipe)
);

-- O campeão do torneio aponta para uma inscrição (criada depois da tabela torneio)
ALTER TABLE torneio
  ADD CONSTRAINT fk_torneio_campeao FOREIGN KEY (id_inscricao_campea)
  REFERENCES inscricao (id_inscricao) ON DELETE SET NULL;


-- ---------------------------------------------------------------------
-- 7. PARTIDA — confrontos gerados quando o torneio começa (banco.partidas)
--    Lado A e lado B são inscrições do torneio (jogador ou equipe).
--    No mata-mata, o vencedor avança para id_proxima_partida, no lado indicado.
-- ---------------------------------------------------------------------
CREATE TABLE partida (
  id_partida              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_torneio              INT UNSIGNED NOT NULL,
  rodada                  TINYINT UNSIGNED NOT NULL,
  ordem                   TINYINT UNSIGNED NOT NULL,
  id_inscricao_a          INT UNSIGNED NULL COMMENT 'NULL = ainda a definir',
  id_inscricao_b          INT UNSIGNED NULL,
  placar_a                TINYINT UNSIGNED NULL,
  placar_b                TINYINT UNSIGNED NULL,
  id_inscricao_vencedora  INT UNSIGNED NULL,
  status                  ENUM('aguardando','agendada','finalizada') NOT NULL DEFAULT 'aguardando',
  passou_direto           BOOLEAN      NOT NULL DEFAULT FALSE COMMENT 'TRUE = vitória sem adversário (BYE)',
  data_hora               DATETIME     NOT NULL,
  id_proxima_partida      INT UNSIGNED NULL,
  lado_na_proxima         ENUM('a','b') NULL,
  finalizada_em           DATETIME     NULL,
  CONSTRAINT pk_partida PRIMARY KEY (id_partida),
  CONSTRAINT uq_partida_posicao UNIQUE (id_torneio, rodada, ordem),
  CONSTRAINT ck_partida_sem_empate CHECK (placar_a IS NULL OR placar_b IS NULL OR placar_a <> placar_b),
  CONSTRAINT fk_partida_torneio   FOREIGN KEY (id_torneio)             REFERENCES torneio (id_torneio) ON DELETE CASCADE,
  CONSTRAINT fk_partida_lado_a    FOREIGN KEY (id_inscricao_a)         REFERENCES inscricao (id_inscricao),
  CONSTRAINT fk_partida_lado_b    FOREIGN KEY (id_inscricao_b)         REFERENCES inscricao (id_inscricao),
  CONSTRAINT fk_partida_vencedora FOREIGN KEY (id_inscricao_vencedora) REFERENCES inscricao (id_inscricao),
  CONSTRAINT fk_partida_proxima   FOREIGN KEY (id_proxima_partida)     REFERENCES partida (id_partida) ON DELETE SET NULL
);


-- ---------------------------------------------------------------------
-- 8. PARTIDA_GUERREIRO — guerreiro escolhido por cada jogador na partida
-- ---------------------------------------------------------------------
CREATE TABLE partida_guerreiro (
  id_partida    INT UNSIGNED NOT NULL,
  id_jogador    INT UNSIGNED NOT NULL,
  id_guerreiro  TINYINT UNSIGNED NOT NULL,
  escolhido_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_partida_guerreiro PRIMARY KEY (id_partida, id_jogador),
  CONSTRAINT fk_pg_partida   FOREIGN KEY (id_partida)   REFERENCES partida (id_partida)     ON DELETE CASCADE,
  CONSTRAINT fk_pg_jogador   FOREIGN KEY (id_jogador)   REFERENCES jogador (id_jogador)     ON DELETE CASCADE,
  CONSTRAINT fk_pg_guerreiro FOREIGN KEY (id_guerreiro) REFERENCES guerreiro (id_guerreiro)
);


-- ---------------------------------------------------------------------
-- 9. MENSAGEM_PARTIDA — chat de cada partida (partida.chat)
-- ---------------------------------------------------------------------
CREATE TABLE mensagem_partida (
  id_mensagem  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_partida   INT UNSIGNED NOT NULL,
  id_jogador   INT UNSIGNED NOT NULL,
  texto        VARCHAR(300) NOT NULL,
  enviada_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_mensagem_partida PRIMARY KEY (id_mensagem),
  CONSTRAINT fk_mensagem_partida FOREIGN KEY (id_partida) REFERENCES partida (id_partida) ON DELETE CASCADE,
  CONSTRAINT fk_mensagem_jogador FOREIGN KEY (id_jogador) REFERENCES jogador (id_jogador) ON DELETE CASCADE
);


-- ---------------------------------------------------------------------
-- 10. RESULTADO_JOGO — resultados enviados pelo jogo Bellator (banco.resultadosDoJogo)
-- ---------------------------------------------------------------------
CREATE TABLE resultado_jogo (
  id_resultado      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_jogador        INT UNSIGNED NOT NULL,
  modo              ENUM('sobrevivencia','infinito') NOT NULL COMMENT 'sobrevivencia = 5 ondas; infinito = ondas infinitas',
  ondas             SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  pontos            INT UNSIGNED NOT NULL DEFAULT 0,
  venceu            BOOLEAN NOT NULL DEFAULT FALSE,
  id_guerreiro      TINYINT UNSIGNED NULL,
  duracao_segundos  INT UNSIGNED NOT NULL DEFAULT 0,
  id_partida        INT UNSIGNED NULL COMMENT 'partida de torneio ligada a esta sessão de jogo (opcional)',
  jogado_em         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_resultado_jogo PRIMARY KEY (id_resultado),
  CONSTRAINT fk_resultado_jogador   FOREIGN KEY (id_jogador)   REFERENCES jogador (id_jogador)     ON DELETE CASCADE,
  CONSTRAINT fk_resultado_guerreiro FOREIGN KEY (id_guerreiro) REFERENCES guerreiro (id_guerreiro) ON DELETE SET NULL,
  CONSTRAINT fk_resultado_partida   FOREIGN KEY (id_partida)   REFERENCES partida (id_partida)     ON DELETE SET NULL
);


-- ---------------------------------------------------------------------
-- 11. NOTIFICACAO — avisos para cada jogador (banco.notificacoes)
-- ---------------------------------------------------------------------
CREATE TABLE notificacao (
  id_notificacao  INT UNSIGNED NOT NULL AUTO_INCREMENT,
  id_jogador      INT UNSIGNED NOT NULL,
  texto           VARCHAR(255) NOT NULL,
  link            VARCHAR(255) NULL,
  lida            BOOLEAN      NOT NULL DEFAULT FALSE,
  criada_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_notificacao PRIMARY KEY (id_notificacao),
  CONSTRAINT fk_notificacao_jogador FOREIGN KEY (id_jogador) REFERENCES jogador (id_jogador) ON DELETE CASCADE
);


-- ---------------------------------------------------------------------
-- 12. NOTICIA — página de novidades (banco.noticias)
-- ---------------------------------------------------------------------
CREATE TABLE noticia (
  id_noticia    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  categoria     ENUM('TORNEIO','EVENTO','ATUALIZAÇÃO','COMUNIDADE') NOT NULL,
  titulo        VARCHAR(80)  NOT NULL,
  resumo        VARCHAR(255) NOT NULL,
  texto         TEXT         NOT NULL,
  arte          TINYINT UNSIGNED NOT NULL DEFAULT 1,
  link          VARCHAR(255) NULL COMMENT 'página do site relacionada (botão "Saiba mais")',
  publicada_em  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_noticia PRIMARY KEY (id_noticia)
);


-- ---------------------------------------------------------------------
-- 13. CHAMADO_SUPORTE — mensagens do formulário de suporte (banco.chamados)
-- ---------------------------------------------------------------------
CREATE TABLE chamado_suporte (
  protocolo   VARCHAR(12)  NOT NULL COMMENT 'ex.: RA-738199',
  id_jogador  INT UNSIGNED NULL COMMENT 'preenchido se a pessoa estava logada',
  nome        VARCHAR(60)  NOT NULL,
  email       VARCHAR(80)  NOT NULL,
  assunto     VARCHAR(40)  NOT NULL,
  mensagem    TEXT         NOT NULL,
  criado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_chamado_suporte PRIMARY KEY (protocolo),
  CONSTRAINT fk_chamado_jogador FOREIGN KEY (id_jogador) REFERENCES jogador (id_jogador) ON DELETE SET NULL
);


-- ---------------------------------------------------------------------
-- 14. INTERESSADO — e-mails para receber novidades do Bellator (banco.interessados)
-- ---------------------------------------------------------------------
CREATE TABLE interessado (
  email          VARCHAR(80) NOT NULL,
  cadastrado_em  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_interessado PRIMARY KEY (email)
);


-- =====================================================================
-- ÍNDICES — deixam mais rápidas as buscas mais usadas pelo site
-- =====================================================================
CREATE INDEX ix_jogador_pontos       ON jogador (pontos DESC);
CREATE INDEX ix_equipe_pontos        ON equipe (pontos DESC);
CREATE INDEX ix_torneio_status       ON torneio (status, inicio);
CREATE INDEX ix_partida_status       ON partida (status, data_hora);
CREATE INDEX ix_resultado_ranking    ON resultado_jogo (modo, pontos DESC);
CREATE INDEX ix_notificacao_jogador  ON notificacao (id_jogador, lida);


-- =====================================================================
-- VISÕES (VIEWS) — consultas prontas usadas nas telas de ranking
-- =====================================================================

-- Ranking de jogadores (página ranking.html, aba Jogadores)
CREATE VIEW vw_ranking_jogadores AS
SELECT
  RANK() OVER (ORDER BY j.pontos DESC) AS posicao,
  j.id_jogador, j.usuario, j.nome, g.nome AS guerreiro,
  j.vitorias, j.derrotas,
  ROUND(100 * j.vitorias / NULLIF(j.vitorias + j.derrotas, 0)) AS porcentagem_vitorias,
  j.titulos, j.pontos
FROM jogador j
LEFT JOIN guerreiro g ON g.id_guerreiro = j.id_ultimo_guerreiro;

-- Ranking de equipes (aba Equipes)
CREATE VIEW vw_ranking_equipes AS
SELECT
  RANK() OVER (ORDER BY e.pontos DESC) AS posicao,
  e.id_equipe, e.nome, e.tag,
  (SELECT COUNT(*) FROM equipe_membro m WHERE m.id_equipe = e.id_equipe) AS membros,
  e.vitorias, e.derrotas, e.titulos, e.pontos
FROM equipe e;

-- Ranking do jogo Bellator: melhor resultado de cada jogador em cada modo (aba Bellator)
CREATE VIEW vw_ranking_jogo AS
SELECT
  RANK() OVER (PARTITION BY modo ORDER BY pontos DESC, ondas DESC) AS posicao,
  modo, id_jogador, usuario, ondas, pontos, jogado_em
FROM (
  -- 1º passo: numera os resultados de cada jogador, do melhor para o pior
  SELECT
    r.modo, r.id_jogador, j.usuario, r.ondas, r.pontos, r.jogado_em,
    ROW_NUMBER() OVER (PARTITION BY r.modo, r.id_jogador ORDER BY r.pontos DESC, r.ondas DESC) AS numero
  FROM resultado_jogo r
  JOIN jogador j ON j.id_jogador = r.id_jogador
) resultados
WHERE numero = 1;  -- 2º passo: fica só com o melhor de cada jogador
