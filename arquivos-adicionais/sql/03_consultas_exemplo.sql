-- =====================================================================
-- RIVALS ARENA — Script 03: CONSULTAS DE EXEMPLO
-- ---------------------------------------------------------------------
-- Consultas que respondem às principais telas do site.
-- Rode depois dos scripts 01 e 02.
-- =====================================================================

USE rivals_arena;

-- 1) Ranking de jogadores (tela ranking.html, aba Jogadores)
SELECT posicao, usuario, guerreiro, vitorias, derrotas, porcentagem_vitorias, pontos
FROM vw_ranking_jogadores
ORDER BY posicao
LIMIT 10;

-- 2) Ranking de equipes (aba Equipes)
SELECT posicao, nome, tag, membros, vitorias, derrotas, titulos, pontos
FROM vw_ranking_equipes
ORDER BY posicao;

-- 3) Ranking do jogo Bellator — modo Ondas infinitas (aba Bellator)
SELECT posicao, usuario, ondas, pontos
FROM vw_ranking_jogo
WHERE modo = 'infinito'
ORDER BY posicao;

-- 4) Torneios com inscrições abertas e quantas vagas ainda restam (tela torneios.html)
SELECT t.id_torneio, t.nome, t.modo, t.modo_de_jogo, t.inicio,
       COUNT(i.id_inscricao) AS inscritos,
       t.vagas - COUNT(i.id_inscricao) AS vagas_livres
FROM torneio t
LEFT JOIN inscricao i ON i.id_torneio = t.id_torneio
WHERE t.status = 'inscricoes'
GROUP BY t.id_torneio
ORDER BY t.inicio;

-- 5) Chaveamento de um torneio, com o nome de cada lado (tela torneio.html, aba Chaveamento)
--    COALESCE pega o nome do jogador (torneio 1v1) ou da equipe (2v2/3v3)
SELECT p.rodada, p.ordem,
       COALESCE(ja.usuario, ea.nome, 'A definir') AS lado_a,
       p.placar_a, p.placar_b,
       COALESCE(jb.usuario, eb.nome, IF(p.passou_direto, '— (passou direto)', 'A definir')) AS lado_b,
       p.status
FROM partida p
LEFT JOIN inscricao ia ON ia.id_inscricao = p.id_inscricao_a
LEFT JOIN jogador  ja ON ja.id_jogador = ia.id_jogador
LEFT JOIN equipe   ea ON ea.id_equipe  = ia.id_equipe
LEFT JOIN inscricao ib ON ib.id_inscricao = p.id_inscricao_b
LEFT JOIN jogador  jb ON jb.id_jogador = ib.id_jogador
LEFT JOIN equipe   eb ON eb.id_equipe  = ib.id_equipe
WHERE p.id_torneio = 4   -- Copa do Coliseu (finalizado)
ORDER BY p.rodada, p.ordem;

-- 6) Campeão de cada torneio finalizado
SELECT t.nome AS torneio, COALESCE(j.usuario, e.nome) AS campeao, t.finalizado_em
FROM torneio t
JOIN inscricao i ON i.id_inscricao = t.id_inscricao_campea
LEFT JOIN jogador j ON j.id_jogador = i.id_jogador
LEFT JOIN equipe  e ON e.id_equipe  = i.id_equipe
WHERE t.status = 'finalizado';

-- 7) Membros de uma equipe, com o capitão primeiro (tela time.html)
SELECT e.nome AS equipe, j.usuario, (j.id_jogador = e.id_capitao) AS eh_capitao, j.pontos
FROM equipe e
JOIN equipe_membro m ON m.id_equipe = e.id_equipe
JOIN jogador j ON j.id_jogador = m.id_jogador
WHERE e.id_equipe = 1
ORDER BY eh_capitao DESC, j.pontos DESC;

-- 8) Próximas partidas de um jogador, contando 1v1 e as partidas das equipes dele (tela painel.html)
SELECT p.id_partida, t.nome AS torneio, p.rodada, p.data_hora
FROM partida p
JOIN torneio t ON t.id_torneio = p.id_torneio
JOIN inscricao i ON i.id_inscricao IN (p.id_inscricao_a, p.id_inscricao_b)
LEFT JOIN equipe_membro m ON m.id_equipe = i.id_equipe
WHERE p.status = 'agendada'
  AND (i.id_jogador = 2 OR m.id_jogador = 2)   -- jogador 2 = Cadu
ORDER BY p.data_hora;

-- 9) Notificações não lidas de um jogador (sino do cabeçalho)
SELECT texto, link, criada_em
FROM notificacao
WHERE id_jogador = 2 AND lida = FALSE
ORDER BY criada_em DESC;

-- 10) Guerreiro mais usado nas partidas do jogo Bellator
SELECT g.nome AS guerreiro, COUNT(*) AS partidas_jogadas
FROM resultado_jogo r
JOIN guerreiro g ON g.id_guerreiro = r.id_guerreiro
GROUP BY g.nome
ORDER BY partidas_jogadas DESC;
