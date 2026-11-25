# DER (Diagrama Entidade-Relacionamento)

O diagrama abaixo mostra as tabelas principais do banco, com as chaves e os campos mais
importantes. Os números 1 e N nas linhas indicam a cardinalidade de cada relacionamento.

![DER](DER-simplificado.png)

Alguns pontos do diagrama:

- Um jogador organiza vários torneios, e cada torneio tem um organizador.
- A ligação entre jogador e equipe é N:N, por isso existe a tabela equipe_membro.
- Cada inscrição é de um jogador (torneio 1v1) ou de uma equipe (torneio 2v2 ou 3v3).
- Cada partida tem dois lados, A e B, e cada lado é uma inscrição.
- Os resultados enviados pelo jogo Bellator ficam em resultado_jogo, ligados ao jogador e ao
  guerreiro usado.

Para não poluir o desenho, ficaram de fora as tabelas partida_guerreiro, mensagem_partida,
notificacao, noticia, chamado_suporte e interessado. Elas aparecem no DER completo, com todas as
14 tabelas e todos os campos:

![DER completo](DER-completo.png)

O arquivo `DER-simplificado.svg` pode ser aberto e editado no draw.io (diagrams.net).
