# DER — Diagrama Entidade-Relacionamento (Rivals Arena)

## DER simplificado

As tabelas principais do sistema, com as chaves e os campos mais importantes. As linhas indicam
os relacionamentos, e os números **1** e **N** indicam a cardinalidade (um / muitos).

![DER simplificado](DER-simplificado.png)

Como ler:
- **JOGADOR 1 — N TORNEIO**: um jogador organiza vários torneios; cada torneio tem um organizador.
- **JOGADOR N — N EQUIPE**: resolvido pela tabela **EQUIPE_MEMBRO**. Uma equipe tem vários
  jogadores, e um jogador pode estar em várias equipes.
- **TORNEIO 1 — N INSCRICAO**: cada inscrição é de um jogador (torneio 1v1) **ou** de uma
  equipe (torneio 2v2/3v3).
- **TORNEIO 1 — N PARTIDA** e **INSCRICAO 1 — N PARTIDA**: cada partida tem dois lados (A e B),
  e cada lado é uma inscrição.
- **JOGADOR 1 — N RESULTADO_JOGO** e **GUERREIRO 1 — N RESULTADO_JOGO**: resultados enviados
  pelo jogo Bellator.

O arquivo [`DER-simplificado.svg`](DER-simplificado.svg) pode ser aberto e editado no draw.io
(diagrams.net) ou no Inkscape.

## DER completo

Diagrama no padrão "pé de galinha" (Crow's Foot), com **todas** as 14 tabelas e colunas. Ele
corresponde exatamente ao script
[`01_criacao_banco.sql`](../arquivos-adicionais/sql/01_criacao_banco.sql).

![DER completo](DER-completo.png)

Como ler as linhas:
- `||--o{` : um (obrigatório) para muitos (opcional)
- `|o--o{` : zero ou um para muitos
- `||--|{` : um para um ou mais

```mermaid
erDiagram
  GUERREIRO {
    tinyint id_guerreiro PK
    varchar nome UK
    varchar apelido
    varchar descricao
    tinyint forca
    tinyint agilidade
    tinyint resistencia
  }
  JOGADOR {
    int id_jogador PK
    varchar usuario UK
    varchar nome
    varchar email UK
    varchar senha_hash
    varchar bio
    char cor_avatar
    tinyint id_ultimo_guerreiro FK
    int pontos
    int vitorias
    int derrotas
    int titulos
    datetime criado_em
  }
  EQUIPE {
    int id_equipe PK
    varchar nome UK
    varchar tag UK
    int id_capitao FK
    varchar bio
    char cor
    int pontos
    int vitorias
    int derrotas
    int titulos
    datetime criado_em
  }
  EQUIPE_MEMBRO {
    int id_equipe PK, FK
    int id_jogador PK, FK
    datetime entrou_em
  }
  TORNEIO {
    int id_torneio PK
    varchar nome
    enum modo "1v1, 2v2, 3v3"
    enum modo_de_jogo
    enum formato "eliminacao, pontos"
    tinyint vagas
    datetime inicio
    varchar premio
    varchar regiao
    varchar descricao
    text regras
    tinyint arte
    enum status "inscricoes, andamento, finalizado"
    int id_organizador FK
    int id_inscricao_campea FK
    datetime criado_em
    datetime finalizado_em
  }
  INSCRICAO {
    int id_inscricao PK
    int id_torneio FK
    int id_jogador FK "1v1"
    int id_equipe FK "2v2 ou 3v3"
    datetime inscrito_em
  }
  PARTIDA {
    int id_partida PK
    int id_torneio FK
    tinyint rodada
    tinyint ordem
    int id_inscricao_a FK
    int id_inscricao_b FK
    tinyint placar_a
    tinyint placar_b
    int id_inscricao_vencedora FK
    enum status "aguardando, agendada, finalizada"
    boolean passou_direto
    datetime data_hora
    int id_proxima_partida FK
    enum lado_na_proxima "a, b"
    datetime finalizada_em
  }
  PARTIDA_GUERREIRO {
    int id_partida PK, FK
    int id_jogador PK, FK
    tinyint id_guerreiro FK
    datetime escolhido_em
  }
  MENSAGEM_PARTIDA {
    int id_mensagem PK
    int id_partida FK
    int id_jogador FK
    varchar texto
    datetime enviada_em
  }
  RESULTADO_JOGO {
    int id_resultado PK
    int id_jogador FK
    enum modo "sobrevivencia, infinito"
    smallint ondas
    int pontos
    boolean venceu
    tinyint id_guerreiro FK
    int duracao_segundos
    int id_partida FK
    datetime jogado_em
  }
  NOTIFICACAO {
    int id_notificacao PK
    int id_jogador FK
    varchar texto
    varchar link
    boolean lida
    datetime criada_em
  }
  CHAMADO_SUPORTE {
    varchar protocolo PK
    int id_jogador FK
    varchar nome
    varchar email
    varchar assunto
    text mensagem
    datetime criado_em
  }
  NOTICIA {
    int id_noticia PK
    enum categoria
    varchar titulo
    varchar resumo
    text texto
    tinyint arte
    varchar link
    datetime publicada_em
  }
  INTERESSADO {
    varchar email PK
    datetime cadastrado_em
  }

  GUERREIRO |o--o{ JOGADOR : "último usado por"
  JOGADOR ||--o{ EQUIPE : "é capitão de"
  EQUIPE ||--|{ EQUIPE_MEMBRO : "tem"
  JOGADOR ||--o{ EQUIPE_MEMBRO : "participa de"
  JOGADOR ||--o{ TORNEIO : "organiza"
  TORNEIO ||--o{ INSCRICAO : "recebe"
  JOGADOR |o--o{ INSCRICAO : "inscreve-se (1v1)"
  EQUIPE |o--o{ INSCRICAO : "inscreve-se (equipes)"
  INSCRICAO |o--o| TORNEIO : "é campeã de"
  TORNEIO ||--o{ PARTIDA : "contém"
  INSCRICAO |o--o{ PARTIDA : "joga como lado A/B / vence"
  PARTIDA |o--o{ PARTIDA : "vencedor avança para"
  PARTIDA ||--o{ PARTIDA_GUERREIRO : "tem escolhas"
  JOGADOR ||--o{ PARTIDA_GUERREIRO : "escolhe"
  GUERREIRO ||--o{ PARTIDA_GUERREIRO : "é escolhido"
  PARTIDA ||--o{ MENSAGEM_PARTIDA : "tem chat"
  JOGADOR ||--o{ MENSAGEM_PARTIDA : "envia"
  JOGADOR ||--o{ RESULTADO_JOGO : "registra"
  GUERREIRO |o--o{ RESULTADO_JOGO : "usado em"
  PARTIDA |o--o{ RESULTADO_JOGO : "ligada a"
  JOGADOR ||--o{ NOTIFICACAO : "recebe"
  JOGADOR |o--o{ CHAMADO_SUPORTE : "abre"
```

`NOTICIA` e `INTERESSADO` não têm relacionamentos: são tabelas independentes.
