-- =====================================================================
-- RIVALS ARENA — Script 02: INSERÇÃO DOS DADOS DE EXEMPLO
-- ---------------------------------------------------------------------
-- Rode DEPOIS do 01_criacao_banco.sql:   mysql -u root -p < 02_insercao_dados.sql
--
-- São os mesmos dados de exemplo que o site mostra na primeira visita
-- (js/dados.js), incluindo os torneios já iniciados/finalizados e as
-- partidas geradas pelo chaveamento automático.
-- Senhas: as contas de exemplo não têm senha (senha_hash = NULL);
-- no site elas são acessadas pelo botão "Entrar com conta de demonstração".
-- =====================================================================

USE rivals_arena;
START TRANSACTION;

-- ---------------------------------------------------------------- GUERREIROS
INSERT INTO guerreiro (id_guerreiro, nome, apelido, descricao, forca, agilidade, resistencia) VALUES
(1, 'Secutor',     'O Escudo de Ferro', 'Pesado e blindado. Avança devagar, mas nenhum golpe o derruba na primeira tentativa.', 88, 28, 95),
(2, 'Retiarius',   'Sombra da Rede',    'Faminto e rápido. Prende o oponente na rede e decide o combate em segundos.', 46, 94, 38),
(3, 'Sagittarius', 'Vento de Aço',      'Combate à distância com besta e flechas. Vence quem nunca deixa se aproximar.', 34, 76, 52),
(4, 'Dimachaerus', 'Fúria Gêmea',       'Duas lâminas, dano bruto. Compensa a resistência baixa com velocidade de ataque.', 90, 60, 30);

-- ---------------------------------------------------------------- JOGADORES
INSERT INTO jogador (id_jogador, usuario, nome, email, senha_hash, bio, cor_avatar, id_ultimo_guerreiro, pontos, vitorias, derrotas, titulos, criado_em) VALUES
(1, 'Plwhite', 'Paulo White', 'plwhite@exemplo.com', NULL, 'Rápido na rede, mais rápido no ranking.', '#e14036', 2, 2487, 48, 9, 1, '2026-09-26 19:00:00'),
(2, 'Cadu', 'Carlos Eduardo', 'cadu@exemplo.com', NULL, 'Capitão da Legio Ferro. Organizador da Arena Cup.', '#f97b2e', 1, 2431, 44, 11, 0, '2026-09-26 19:00:00'),
(3, 'Maabague', 'Maria Abague', 'maabague@exemplo.com', NULL, 'Quem chega perto demais não volta.', '#eccc7e', 3, 2398, 41, 12, 0, '2026-09-26 19:00:00'),
(4, 'Sarneiaflc', 'Sarah Neia', 'sarneiaflc@exemplo.com', NULL, 'Duas lâminas, zero paciência.', '#c2410c', 4, 2341, 39, 14, 0, '2026-09-26 19:00:00'),
(5, 'Ferrum', 'Felipe Ramos', 'ferrum@exemplo.com', NULL, NULL, '#9a3412', 1, 2280, 35, 15, 0, '2026-09-26 19:00:00'),
(6, 'Nyx', 'Nicole Xavier', 'nyx@exemplo.com', NULL, 'Sombra da rede.', '#7c2d12', 2, 2215, 33, 16, 0, '2026-09-26 19:00:00'),
(7, 'Corvinus', 'Caio Corvino', 'corvinus@exemplo.com', NULL, NULL, '#b91c1c', 4, 2190, 31, 17, 0, '2026-09-26 19:00:00'),
(8, 'Ossa', 'Otávio Sá', 'ossa@exemplo.com', NULL, NULL, '#ea580c', 1, 2040, 27, 18, 0, '2026-09-26 19:00:00'),
(9, 'Vesper', 'Vera Spinelli', 'vesper@exemplo.com', NULL, 'Do alto da arquibancada.', '#d97706', 3, 1975, 25, 19, 0, '2026-09-26 19:00:00'),
(10, 'Tullius', 'Túlio Barros', 'tullius@exemplo.com', NULL, NULL, '#dc2626', 4, 1890, 22, 20, 0, '2026-09-26 19:00:00'),
(11, 'Aurelia', 'Aurélia Lima', 'aurelia@exemplo.com', NULL, NULL, '#f59e0b', 2, 1820, 20, 21, 0, '2026-09-26 19:00:00'),
(12, 'Brutus', 'Bruno Tavares', 'brutus@exemplo.com', NULL, NULL, '#991b1b', 1, 1760, 18, 22, 0, '2026-09-26 19:00:00'),
(13, 'Cassia', 'Cássia Moura', 'cassia@exemplo.com', NULL, NULL, '#fb923c', 3, 1690, 16, 22, 0, '2026-09-26 19:00:00'),
(14, 'Draco', 'Diego Rocha', 'draco@exemplo.com', NULL, NULL, '#b45309', 4, 1610, 14, 23, 0, '2026-09-26 19:00:00'),
(15, 'Livia', 'Lívia Prado', 'livia@exemplo.com', NULL, NULL, '#ef4444', 2, 1540, 12, 24, 0, '2026-09-26 19:00:00'),
(16, 'Maximus', 'Max Oliveira', 'maximus@exemplo.com', NULL, NULL, '#f97316', 1, 1480, 10, 25, 0, '2026-09-26 19:00:00');

-- ---------------------------------------------------------------- EQUIPES (times)
INSERT INTO equipe (id_equipe, nome, tag, id_capitao, bio, cor, pontos, vitorias, derrotas, titulos, criado_em) VALUES
(1, 'Legio Ferro', 'LGF', 2, 'Disciplina de legião. Escudo na frente, sempre.', '#f97b2e', 1840, 21, 6, 0, '2026-10-16 19:00:00'),
(2, 'Aquila Negra', 'AQN', 1, 'Voamos acima da arena.', '#e14036', 1795, 19, 7, 0, '2026-10-16 19:00:00'),
(3, 'Corvos de Roma', 'CVR', 7, NULL, '#b91c1c', 1660, 16, 9, 0, '2026-10-16 19:00:00'),
(4, 'Lupi do Areal', 'LPA', 8, 'A matilha não deixa ninguém para trás.', '#ea580c', 1580, 14, 10, 0, '2026-10-16 19:00:00'),
(5, 'Ventos de Aço', 'VDA', 3, 'Alcance é tudo.', '#eccc7e', 1525, 12, 11, 0, '2026-10-16 19:00:00'),
(6, 'Gladius Rubrum', 'GLR', 4, 'Recrutando guerreiros! Fale com a capitã.', '#dc2626', 1400, 8, 12, 0, '2026-10-16 19:00:00');

-- ---------------------------------------------------------------- MEMBROS DAS EQUIPES
INSERT INTO equipe_membro (id_equipe, id_jogador, entrou_em) VALUES
(1, 2, '2026-10-16 19:00:00'),
(1, 5, '2026-10-16 19:00:00'),
(1, 9, '2026-10-16 19:00:00'),
(2, 1, '2026-10-16 19:00:00'),
(2, 6, '2026-10-16 19:00:00'),
(2, 11, '2026-10-16 19:00:00'),
(3, 7, '2026-10-16 19:00:00'),
(3, 10, '2026-10-16 19:00:00'),
(3, 14, '2026-10-16 19:00:00'),
(4, 8, '2026-10-16 19:00:00'),
(4, 12, '2026-10-16 19:00:00'),
(4, 16, '2026-10-16 19:00:00'),
(5, 3, '2026-10-16 19:00:00'),
(5, 13, '2026-10-16 19:00:00'),
(5, 15, '2026-10-16 19:00:00'),
(6, 4, '2026-10-16 19:00:00');

-- ---------------------------------------------------------------- TORNEIOS
-- (o campeão é preenchido no final, depois das inscrições)
INSERT INTO torneio (id_torneio, nome, modo, modo_de_jogo, formato, vagas, inicio, premio, regiao, descricao, regras, arte, status, id_organizador, criado_em, finalizado_em) VALUES
(1, 'Rivals Clash #12', '2v2', 'Mata-Mata', 'eliminacao', 8, '2026-11-25 17:00:00', 'R$ 500 + skins exclusivas', 'Brasil', 'O torneio mais tradicional da comunidade. Duplas se enfrentam no Mata-Mata até restar apenas uma.', 'Partidas em melhor de 3.
Atraso máximo de 10 minutos.
Resultados devem ser enviados pelo capitão vencedor.', 1, 'andamento', 1, '2026-11-05 19:00:00', NULL),
(2, 'Arena Cup', '1v1', 'Mata-Mata', 'eliminacao', 16, '2026-11-28 21:00:00', 'R$ 250', 'Brasil', 'Copa individual aberta a todos os níveis. Mostre que você é o melhor guerreiro da Arena.', 'Partidas em melhor de 3.
Final em melhor de 5.
Proibido trocar de guerreiro durante a série.', 7, 'inscricoes', 2, '2026-11-05 19:00:00', NULL),
(3, 'Liberty Series', '3v3', 'Estandarte do Império', 'eliminacao', 8, '2026-12-01 23:00:00', 'Troféu Liberty + 3.000 moedas', 'América do Sul', 'Capture o estandarte inimigo e defenda o seu. Série para trios organizados.', 'Times com 3 jogadores titulares.
Partidas em melhor de 3.', 3, 'inscricoes', 2, '2026-11-05 19:00:00', NULL),
(4, 'Copa do Coliseu', '1v1', 'Mata-Mata', 'eliminacao', 8, '2026-11-13 19:00:00', 'R$ 300', 'Brasil', 'Edição de abertura da Temporada I.', 'Partidas em melhor de 3.', 4, 'finalizado', 3, '2026-11-05 19:00:00', '2026-11-13 21:40:00'),
(5, 'Liga Fuga do Coliseu', '1v1', 'Fuga do Coliseu', 'pontos', 4, '2026-11-25 18:00:00', '1.500 moedas', 'Brasil', 'Todos contra todos: quem somar mais vitórias escapa do Coliseu como campeão.', 'Cada confronto em partida única.
Vitória = 3 pontos.', 7, 'andamento', 4, '2026-11-05 19:00:00', NULL),
(6, 'Torneio Estandarte Duplo', '2v2', 'Estandarte do Império', 'eliminacao', 8, '2026-12-05 19:00:00', 'Estandarte dourado (item exclusivo)', 'Brasil', 'Evento especial da comunidade no modo Estandarte do Império, em duplas.', 'Partidas em melhor de 3.', 3, 'inscricoes', 1, '2026-11-05 19:00:00', NULL);

-- ---------------------------------------------------------------- INSCRIÇÕES
-- Torneios 1v1: id_jogador preenchido. Torneios 2v2/3v3: id_equipe preenchido.
INSERT INTO inscricao (id_inscricao, id_torneio, id_jogador, id_equipe, inscrito_em) VALUES
(1, 1, NULL, 1, '2026-11-05 19:00:00'),
(2, 1, NULL, 2, '2026-11-05 19:00:00'),
(3, 1, NULL, 3, '2026-11-05 19:00:00'),
(4, 1, NULL, 4, '2026-11-05 19:00:00'),
(5, 1, NULL, 5, '2026-11-05 19:00:00'),
(6, 2, 1, NULL, '2026-11-05 19:00:00'),
(7, 2, 3, NULL, '2026-11-05 19:00:00'),
(8, 2, 4, NULL, '2026-11-05 19:00:00'),
(9, 2, 6, NULL, '2026-11-05 19:00:00'),
(10, 2, 8, NULL, '2026-11-05 19:00:00'),
(11, 2, 10, NULL, '2026-11-05 19:00:00'),
(12, 2, 12, NULL, '2026-11-05 19:00:00'),
(13, 2, 13, NULL, '2026-11-05 19:00:00'),
(14, 2, 15, NULL, '2026-11-05 19:00:00'),
(15, 3, NULL, 2, '2026-11-05 19:00:00'),
(16, 3, NULL, 3, '2026-11-05 19:00:00'),
(17, 3, NULL, 5, '2026-11-05 19:00:00'),
(18, 4, 1, NULL, '2026-11-05 19:00:00'),
(19, 4, 2, NULL, '2026-11-05 19:00:00'),
(20, 4, 3, NULL, '2026-11-05 19:00:00'),
(21, 4, 4, NULL, '2026-11-05 19:00:00'),
(22, 4, 5, NULL, '2026-11-05 19:00:00'),
(23, 4, 6, NULL, '2026-11-05 19:00:00'),
(24, 4, 7, NULL, '2026-11-05 19:00:00'),
(25, 4, 8, NULL, '2026-11-05 19:00:00'),
(26, 5, 9, NULL, '2026-11-05 19:00:00'),
(27, 5, 10, NULL, '2026-11-05 19:00:00'),
(28, 5, 11, NULL, '2026-11-05 19:00:00'),
(29, 5, 14, NULL, '2026-11-05 19:00:00'),
(30, 6, NULL, 4, '2026-11-05 19:00:00');

-- ---------------------------------------------------------------- PARTIDAS
-- Geradas pelo chaveamento automático. Inseridas da última rodada para a primeira,
-- porque cada partida aponta para a "próxima" (para onde o vencedor avança).
INSERT INTO partida (id_partida, id_torneio, rodada, ordem, id_inscricao_a, id_inscricao_b, placar_a, placar_b, id_inscricao_vencedora, status, passou_direto, data_hora, id_proxima_partida, lado_na_proxima, finalizada_em) VALUES
(7, 1, 3, 1, 1, NULL, NULL, NULL, NULL, 'aguardando', FALSE, '2026-11-25 19:00:00', NULL, NULL, NULL),
(5, 1, 2, 1, 1, 2, 2, 1, 1, 'finalizada', FALSE, '2026-11-25 18:00:00', 7, 'a', '2026-11-25 18:40:00'),
(6, 1, 2, 2, 3, 4, NULL, NULL, NULL, 'agendada', FALSE, '2026-11-25 18:00:00', 7, 'b', NULL),
(1, 1, 1, 1, 1, 5, 2, 0, 1, 'finalizada', FALSE, '2026-11-25 17:00:00', 5, 'a', '2026-11-25 17:40:00'),
(2, 1, 1, 2, 2, NULL, NULL, NULL, 2, 'finalizada', TRUE, '2026-11-25 17:00:00', 5, 'b', NULL),
(3, 1, 1, 3, 3, NULL, NULL, NULL, 3, 'finalizada', TRUE, '2026-11-25 17:00:00', 6, 'a', NULL),
(4, 1, 1, 4, 4, NULL, NULL, NULL, 4, 'finalizada', TRUE, '2026-11-25 17:00:00', 6, 'b', NULL),
(14, 4, 3, 1, 18, 21, 2, 0, 18, 'finalizada', FALSE, '2026-11-13 21:00:00', NULL, NULL, '2026-11-13 21:40:00'),
(12, 4, 2, 1, 18, 19, 2, 1, 18, 'finalizada', FALSE, '2026-11-13 20:00:00', 14, 'a', '2026-11-13 20:40:00'),
(13, 4, 2, 2, 24, 21, 1, 2, 21, 'finalizada', FALSE, '2026-11-13 20:00:00', 14, 'b', '2026-11-13 20:40:00'),
(8, 4, 1, 1, 18, 22, 2, 0, 18, 'finalizada', FALSE, '2026-11-13 19:00:00', 12, 'a', '2026-11-13 19:40:00'),
(9, 4, 1, 2, 19, 23, 2, 1, 19, 'finalizada', FALSE, '2026-11-13 19:00:00', 12, 'b', '2026-11-13 19:40:00'),
(10, 4, 1, 3, 20, 24, 0, 2, 24, 'finalizada', FALSE, '2026-11-13 19:00:00', 13, 'a', '2026-11-13 19:40:00'),
(11, 4, 1, 4, 21, 25, 2, 1, 21, 'finalizada', FALSE, '2026-11-13 19:00:00', 13, 'b', '2026-11-13 19:40:00'),
(19, 5, 3, 1, 26, 27, NULL, NULL, NULL, 'agendada', FALSE, '2026-11-25 20:00:00', NULL, NULL, NULL),
(20, 5, 3, 2, 28, 29, NULL, NULL, NULL, 'agendada', FALSE, '2026-11-25 20:00:00', NULL, NULL, NULL),
(17, 5, 2, 1, 26, 28, 1, 0, 26, 'finalizada', FALSE, '2026-11-25 19:00:00', NULL, NULL, '2026-11-25 19:40:00'),
(18, 5, 2, 2, 29, 27, NULL, NULL, NULL, 'agendada', FALSE, '2026-11-25 19:00:00', NULL, NULL, NULL),
(15, 5, 1, 1, 26, 29, 1, 0, 26, 'finalizada', FALSE, '2026-11-25 18:00:00', NULL, NULL, '2026-11-25 18:40:00'),
(16, 5, 1, 2, 27, 28, 0, 1, 28, 'finalizada', FALSE, '2026-11-25 18:00:00', NULL, NULL, '2026-11-25 18:40:00');

-- ---------------------------------------------------------------- CAMPEÕES DOS TORNEIOS FINALIZADOS
UPDATE torneio SET id_inscricao_campea = 18 WHERE id_torneio = 4;  -- Copa do Coliseu

-- ---------------------------------------------------------------- GUERREIRO ESCOLHIDO NA PARTIDA (exemplo)
INSERT INTO partida_guerreiro (id_partida, id_jogador, id_guerreiro) VALUES
(6, 7, 4),
(6, 8, 1);

-- ---------------------------------------------------------------- CHAT DA PARTIDA (exemplo)
INSERT INTO mensagem_partida (id_partida, id_jogador, texto) VALUES
(6, 7, 'Bora! Pronto quando vocês estiverem.'),
(6, 8, 'Fechado, começamos em 5 minutos. Boa sorte!');

-- ---------------------------------------------------------------- RESULTADOS ENVIADOS PELO JOGO BELLATOR
INSERT INTO resultado_jogo (id_resultado, id_jogador, modo, ondas, pontos, venceu, id_guerreiro, duracao_segundos, id_partida, jogado_em) VALUES
(1, 1, 'infinito', 27, 4120, FALSE, 2, 1310, NULL, '2026-11-24 16:00:00'),
(2, 3, 'infinito', 24, 3780, FALSE, 3, 1185, NULL, '2026-11-23 19:00:00'),
(3, 2, 'infinito', 21, 3260, FALSE, 1, 1102, NULL, '2026-11-24 19:00:00'),
(4, 4, 'infinito', 19, 3015, FALSE, 4, 940, NULL, '2026-11-22 19:00:00'),
(5, 6, 'infinito', 15, 2290, FALSE, 2, 760, NULL, '2026-11-21 19:00:00'),
(6, 1, 'sobrevivencia', 5, 980, TRUE, 2, 402, NULL, '2026-11-23 14:00:00'),
(7, 2, 'sobrevivencia', 5, 910, TRUE, 1, 455, NULL, '2026-11-23 17:00:00'),
(8, 5, 'sobrevivencia', 4, 640, FALSE, 1, 390, NULL, '2026-11-20 19:00:00');

-- ---------------------------------------------------------------- NOTÍCIAS
INSERT INTO noticia (id_noticia, categoria, titulo, resumo, texto, arte, link, publicada_em) VALUES
(1, 'TORNEIO', 'Rival Cup #12', 'O maior torneio da comunidade está de volta! Reúna seu time, prepare sua estratégia e lute pelo título.', 'O Rivals Clash #12 já começou e promete ser a edição mais disputada da história da Rivals Arena.

Cinco equipes se inscreveram no modo Mata-Mata e o chaveamento já está rolando. Acompanhe cada confronto em tempo real na página do torneio.

Quem vencer leva R$ 500 e skins exclusivas para os dois guerreiros da dupla.', 6, 'torneio.html?id=tr1', '2026-11-22 19:00:00'),
(2, 'EVENTO', 'Festival da Arena', 'Um evento especial com recompensas exclusivas, desafios e muito mais. Não fique de fora!', 'Durante o Festival da Arena, todas as vitórias em torneios oficiais valem pontos em dobro no ranking.

Além disso, haverá desafios diários com recompensas cosméticas para quem completar todas as missões.

Fique de olho na aba de torneios: novos campeonatos relâmpago serão abertos durante o evento.', 2, 'torneios.html', '2026-11-24 19:00:00'),
(3, 'ATUALIZAÇÃO', 'Nova Temporada', 'Novos conteúdos, ajustes e novidades chegam para transformar a próxima temporada.', 'A Temporada I trouxe o ranking oficial de jogadores e equipes, além da criação de torneios pela comunidade.

Os próximos passos incluem novos mapas no Coliseu, ajustes de equilíbrio entre os quatro guerreiros e integração direta com o jogo Bellator.

Envie suas sugestões pela página de Suporte ao Jogador.', 5, 'bellator.html', '2026-11-19 19:00:00'),
(4, 'TORNEIO', 'Inscrições abertas: Arena Cup', 'Copa individual com 16 vagas. Garanta a sua antes que acabe!', 'A Arena Cup é a copa 1v1 da Rivals Arena, aberta a jogadores de todos os níveis.

São 16 vagas no total e as inscrições ficam abertas até o início do torneio.', 1, 'torneio.html?id=tr2', '2026-11-23 19:00:00'),
(5, 'COMUNIDADE', 'Gladius Rubrum está recrutando', 'A equipe da capitã Sarneiaflc procura guerreiros para fechar o elenco.', 'Quer jogar em equipe? A Gladius Rubrum está recrutando jogadores de qualquer guerreiro.

Acesse a página do time e clique em "Entrar no time".', 4, 'time.html?id=t6', '2026-11-21 19:00:00'),
(6, 'ATUALIZAÇÃO', 'Bellator: diário de desenvolvimento #3', 'Bastidores do desenvolvimento do jogo: combate, mapas e o modo Fuga do Coliseu.', 'Bellator nasceu como Projeto Integrador e continua em desenvolvimento.

Neste diário mostramos o novo sistema de combate corpo a corpo e os primeiros testes do modo Fuga do Coliseu.', 3, 'bellator.html', '2026-11-16 19:00:00');

-- ---------------------------------------------------------------- NOTIFICAÇÕES (exemplos)
INSERT INTO notificacao (id_jogador, texto, link, lida) VALUES
(2, 'Plwhite se inscreveu em Arena Cup.', 'torneio.html?id=2', FALSE),
(2, 'Rivals Clash #12 começou! Confira sua primeira partida.', 'torneio.html?id=1#chaveamento', TRUE),
(1, 'Parabéns! Você é campeão de Copa do Coliseu! +100 pontos no ranking.', 'torneio.html?id=4', TRUE);

-- ---------------------------------------------------------------- SUPORTE E NOVIDADES (exemplos)
INSERT INTO chamado_suporte (protocolo, id_jogador, nome, email, assunto, mensagem) VALUES
('RA-000001', 2, 'Carlos Eduardo', 'cadu@exemplo.com', 'Dúvida sobre torneio', 'Posso trocar de guerreiro entre as partidas de uma série?');

INSERT INTO interessado (email) VALUES
('fa.bellator@exemplo.com'),
('cadu@exemplo.com');

COMMIT;

-- Conferência rápida: quantas linhas cada tabela principal recebeu
SELECT 'jogador' AS tabela, COUNT(*) AS linhas FROM jogador
UNION ALL SELECT 'equipe', COUNT(*) FROM equipe
UNION ALL SELECT 'torneio', COUNT(*) FROM torneio
UNION ALL SELECT 'inscricao', COUNT(*) FROM inscricao
UNION ALL SELECT 'partida', COUNT(*) FROM partida
UNION ALL SELECT 'resultado_jogo', COUNT(*) FROM resultado_jogo
UNION ALL SELECT 'noticia', COUNT(*) FROM noticia;
