/* =====================================================================
   dados.js — DADOS INICIAIS (de exemplo) DA RIVALS ARENA
   ---------------------------------------------------------------------
   O site ainda não tem servidor (back-end). Por isso, na primeira vez
   que alguém abre o site, estes dados são copiados para o
   localStorage do navegador (veja banco.js). A partir daí, tudo o que
   o usuário cria (torneios, times, resultados...) fica salvo lá.

   Para "zerar" o site e voltar a estes dados, use o botão
   "Restaurar dados de exemplo" em configuracoes.html.
   ===================================================================== */

// Devolve uma data (em texto ISO) daqui a X dias e Y horas.
// Usamos datas relativas para que os exemplos nunca fiquem "velhos".
function daqui(dias, horas) {
  const data = new Date();
  data.setMinutes(0, 0, 0);
  data.setHours(data.getHours() + (horas || 0));
  data.setDate(data.getDate() + dias);
  return data.toISOString();
}

const DADOS_INICIAIS = {

  /* ---------------- JOGADORES ---------------- */
  jogadores: [
    { id: 'j1',  usuario: 'Plwhite',    nome: 'Paulo White',     guerreiro: 'Retiarius',   pontos: 2487, vitorias: 48, derrotas: 9,  bio: 'Rápido na rede, mais rápido no ranking.', cor: '#e14036' },
    { id: 'j2',  usuario: 'Cadu',       nome: 'Carlos Eduardo',  guerreiro: 'Secutor',     pontos: 2431, vitorias: 44, derrotas: 11, bio: 'Capitão da Legio Ferro. Organizador da Arena Cup.', cor: '#f97b2e' },
    { id: 'j3',  usuario: 'Maabague',   nome: 'Maria Abague',    guerreiro: 'Sagittarius', pontos: 2398, vitorias: 41, derrotas: 12, bio: 'Quem chega perto demais não volta.', cor: '#eccc7e' },
    { id: 'j4',  usuario: 'Sarneiaflc', nome: 'Sarah Neia',      guerreiro: 'Dimachaerus', pontos: 2341, vitorias: 39, derrotas: 14, bio: 'Duas lâminas, zero paciência.', cor: '#c2410c' },
    { id: 'j5',  usuario: 'Ferrum',     nome: 'Felipe Ramos',    guerreiro: 'Secutor',     pontos: 2280, vitorias: 35, derrotas: 15, bio: '', cor: '#9a3412' },
    { id: 'j6',  usuario: 'Nyx',        nome: 'Nicole Xavier',   guerreiro: 'Retiarius',   pontos: 2215, vitorias: 33, derrotas: 16, bio: 'Sombra da rede.', cor: '#7c2d12' },
    { id: 'j7',  usuario: 'Corvinus',   nome: 'Caio Corvino',    guerreiro: 'Dimachaerus', pontos: 2190, vitorias: 31, derrotas: 17, bio: '', cor: '#b91c1c' },
    { id: 'j8',  usuario: 'Ossa',       nome: 'Otávio Sá',       guerreiro: 'Secutor',     pontos: 2040, vitorias: 27, derrotas: 18, bio: '', cor: '#ea580c' },
    { id: 'j9',  usuario: 'Vesper',     nome: 'Vera Spinelli',   guerreiro: 'Sagittarius', pontos: 1975, vitorias: 25, derrotas: 19, bio: 'Do alto da arquibancada.', cor: '#d97706' },
    { id: 'j10', usuario: 'Tullius',    nome: 'Túlio Barros',    guerreiro: 'Dimachaerus', pontos: 1890, vitorias: 22, derrotas: 20, bio: '', cor: '#dc2626' },
    { id: 'j11', usuario: 'Aurelia',    nome: 'Aurélia Lima',    guerreiro: 'Retiarius',   pontos: 1820, vitorias: 20, derrotas: 21, bio: '', cor: '#f59e0b' },
    { id: 'j12', usuario: 'Brutus',     nome: 'Bruno Tavares',   guerreiro: 'Secutor',     pontos: 1760, vitorias: 18, derrotas: 22, bio: '', cor: '#991b1b' },
    { id: 'j13', usuario: 'Cassia',     nome: 'Cássia Moura',    guerreiro: 'Sagittarius', pontos: 1690, vitorias: 16, derrotas: 22, bio: '', cor: '#fb923c' },
    { id: 'j14', usuario: 'Draco',      nome: 'Diego Rocha',     guerreiro: 'Dimachaerus', pontos: 1610, vitorias: 14, derrotas: 23, bio: '', cor: '#b45309' },
    { id: 'j15', usuario: 'Livia',      nome: 'Lívia Prado',     guerreiro: 'Retiarius',   pontos: 1540, vitorias: 12, derrotas: 24, bio: '', cor: '#ef4444' },
    { id: 'j16', usuario: 'Maximus',    nome: 'Max Oliveira',    guerreiro: 'Secutor',     pontos: 1480, vitorias: 10, derrotas: 25, bio: '', cor: '#f97316' }
  ],

  /* ---------------- TIMES (EQUIPES) ----------------
     capitao = id do jogador que manda no time
     membros = ids dos jogadores que fazem parte               */
  times: [
    { id: 't1', nome: 'Legio Ferro',    tag: 'LGF', capitao: 'j2',  membros: ['j2', 'j5', 'j9'],   pontos: 1840, vitorias: 21, derrotas: 6,  bio: 'Disciplina de legião. Escudo na frente, sempre.', cor: '#f97b2e' },
    { id: 't2', nome: 'Aquila Negra',   tag: 'AQN', capitao: 'j1',  membros: ['j1', 'j6', 'j11'],  pontos: 1795, vitorias: 19, derrotas: 7,  bio: 'Voamos acima da arena.', cor: '#e14036' },
    { id: 't3', nome: 'Corvos de Roma', tag: 'CVR', capitao: 'j7',  membros: ['j7', 'j10', 'j14'], pontos: 1660, vitorias: 16, derrotas: 9,  bio: '', cor: '#b91c1c' },
    { id: 't4', nome: 'Lupi do Areal',  tag: 'LPA', capitao: 'j8',  membros: ['j8', 'j12', 'j16'], pontos: 1580, vitorias: 14, derrotas: 10, bio: 'A matilha não deixa ninguém para trás.', cor: '#ea580c' },
    { id: 't5', nome: 'Ventos de Aço',  tag: 'VDA', capitao: 'j3',  membros: ['j3', 'j13', 'j15'], pontos: 1525, vitorias: 12, derrotas: 11, bio: 'Alcance é tudo.', cor: '#eccc7e' },
    { id: 't6', nome: 'Gladius Rubrum', tag: 'GLR', capitao: 'j4',  membros: ['j4'],               pontos: 1400, vitorias: 8,  derrotas: 12, bio: 'Recrutando guerreiros! Fale com a capitã.', cor: '#dc2626' }
  ],

  /* ---------------- TORNEIOS ----------------
     modo        : '1v1' (jogadores) ou '2v2' / '3v3' (times)
     modoDeJogo  : modo dentro do Bellator
     formato     : 'eliminacao' (mata-mata) ou 'pontos' (todos contra todos)
     status      : 'inscricoes' | 'andamento' | 'finalizado'
     participantes: ids de jogadores (1v1) ou de times (2v2/3v3)
     resultadosDemo: placares aplicados automaticamente na 1ª carga,
                     só para os exemplos já começarem "jogados".     */
  torneios: [
    {
      id: 'tr1', nome: 'Rivals Clash #12', modo: '2v2', modoDeJogo: 'Mata-Mata', formato: 'eliminacao',
      vagas: 8, inicio: daqui(0, -2), premio: 'R$ 500 + skins exclusivas', regiao: 'Brasil',
      organizador: 'j1', status: 'inscricoes', arte: 1,
      descricao: 'O torneio mais tradicional da comunidade. Duplas se enfrentam no Mata-Mata até restar apenas uma.',
      regras: 'Partidas em melhor de 3.\nAtraso máximo de 10 minutos.\nResultados devem ser enviados pelo capitão vencedor.',
      participantes: ['t1', 't2', 't3', 't4', 't5'],
      iniciarDemo: true, resultadosDemo: [[2, 0], [2, 1]]
    },
    {
      id: 'tr2', nome: 'Arena Cup', modo: '1v1', modoDeJogo: 'Mata-Mata', formato: 'eliminacao',
      vagas: 16, inicio: daqui(3, 2), premio: 'R$ 250', regiao: 'Brasil',
      organizador: 'j2', status: 'inscricoes', arte: 7,
      descricao: 'Copa individual aberta a todos os níveis. Mostre que você é o melhor guerreiro da Arena.',
      regras: 'Partidas em melhor de 3.\nFinal em melhor de 5.\nProibido trocar de guerreiro durante a série.',
      participantes: ['j1', 'j3', 'j4', 'j6', 'j8', 'j10', 'j12', 'j13', 'j15']
    },
    {
      id: 'tr3', nome: 'Liberty Series', modo: '3v3', modoDeJogo: 'Estandarte do Império', formato: 'eliminacao',
      vagas: 8, inicio: daqui(6, 4), premio: 'Troféu Liberty + 3.000 moedas', regiao: 'América do Sul',
      organizador: 'j2', status: 'inscricoes', arte: 3,
      descricao: 'Capture o estandarte inimigo e defenda o seu. Série para trios organizados.',
      regras: 'Times com 3 jogadores titulares.\nPartidas em melhor de 3.',
      participantes: ['t2', 't3', 't5']
    },
    {
      id: 'tr4', nome: 'Copa do Coliseu', modo: '1v1', modoDeJogo: 'Mata-Mata', formato: 'eliminacao',
      vagas: 8, inicio: daqui(-12, 0), premio: 'R$ 300', regiao: 'Brasil',
      organizador: 'j3', status: 'inscricoes', arte: 4,
      descricao: 'Edição de abertura da Temporada I.',
      regras: 'Partidas em melhor de 3.',
      participantes: ['j1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7', 'j8'],
      iniciarDemo: true, resultadosDemo: [[2, 0], [2, 1], [0, 2], [2, 1], [2, 1], [1, 2], [2, 0]]
    },
    {
      id: 'tr5', nome: 'Liga Fuga do Coliseu', modo: '1v1', modoDeJogo: 'Fuga do Coliseu', formato: 'pontos',
      vagas: 4, inicio: daqui(0, -1), premio: '1.500 moedas', regiao: 'Brasil',
      organizador: 'j4', status: 'inscricoes', arte: 7,
      descricao: 'Todos contra todos: quem somar mais vitórias escapa do Coliseu como campeão.',
      regras: 'Cada confronto em partida única.\nVitória = 3 pontos.',
      participantes: ['j9', 'j10', 'j11', 'j14'],
      iniciarDemo: true, resultadosDemo: [[1, 0], [0, 1], [1, 0]]
    },
    {
      id: 'tr6', nome: 'Torneio Estandarte Duplo', modo: '2v2', modoDeJogo: 'Estandarte do Império', formato: 'eliminacao',
      vagas: 8, inicio: daqui(10, 0), premio: 'Estandarte dourado (item exclusivo)', regiao: 'Brasil',
      organizador: 'j1', status: 'inscricoes', arte: 3,
      descricao: 'Evento especial da comunidade no modo Estandarte do Império, em duplas.',
      regras: 'Partidas em melhor de 3.',
      participantes: ['t4']
    }
  ],

  // As partidas são criadas pelo próprio site quando um torneio começa.
  partidas: [],

  /* ---------------- NOVIDADES ---------------- */
  noticias: [
    {
      id: 'n1', categoria: 'TORNEIO', titulo: 'Rival Cup #12', data: daqui(-3, 0), arte: 6,
      resumo: 'O maior torneio da comunidade está de volta! Reúna seu time, prepare sua estratégia e lute pelo título.',
      texto: [
        'O Rivals Clash #12 já começou e promete ser a edição mais disputada da história da Rivals Arena.',
        'Cinco equipes se inscreveram no modo Mata-Mata e o chaveamento já está rolando. Acompanhe cada confronto em tempo real na página do torneio.',
        'Quem vencer leva R$ 500 e skins exclusivas para os dois guerreiros da dupla.'
      ],
      link: 'torneio.html?id=tr1'
    },
    {
      id: 'n2', categoria: 'EVENTO', titulo: 'Festival da Arena', data: daqui(-1, 0), arte: 2,
      resumo: 'Um evento especial com recompensas exclusivas, desafios e muito mais. Não fique de fora!',
      texto: [
        'Durante o Festival da Arena, todas as vitórias em torneios oficiais valem pontos em dobro no ranking.',
        'Além disso, haverá desafios diários com recompensas cosméticas para quem completar todas as missões.',
        'Fique de olho na aba de torneios: novos campeonatos relâmpago serão abertos durante o evento.'
      ],
      link: 'torneios.html'
    },
    {
      id: 'n3', categoria: 'ATUALIZAÇÃO', titulo: 'Nova Temporada', data: daqui(-6, 0), arte: 5,
      resumo: 'Novos conteúdos, ajustes e novidades chegam para transformar a próxima temporada.',
      texto: [
        'A Temporada I trouxe o ranking oficial de jogadores e equipes, além da criação de torneios pela comunidade.',
        'Os próximos passos incluem novos mapas no Coliseu, ajustes de equilíbrio entre os quatro guerreiros e integração direta com o jogo Bellator.',
        'Envie suas sugestões pela página de Suporte ao Jogador.'
      ],
      link: 'bellator.html'
    },
    {
      id: 'n4', categoria: 'TORNEIO', titulo: 'Inscrições abertas: Arena Cup', data: daqui(-2, 0), arte: 1,
      resumo: 'Copa individual com 16 vagas. Garanta a sua antes que acabe!',
      texto: [
        'A Arena Cup é a copa 1v1 da Rivals Arena, aberta a jogadores de todos os níveis.',
        'São 16 vagas no total e as inscrições ficam abertas até o início do torneio.'
      ],
      link: 'torneio.html?id=tr2'
    },
    {
      id: 'n5', categoria: 'COMUNIDADE', titulo: 'Gladius Rubrum está recrutando', data: daqui(-4, 0), arte: 4,
      resumo: 'A equipe da capitã Sarneiaflc procura guerreiros para fechar o elenco.',
      texto: [
        'Quer jogar em equipe? A Gladius Rubrum está recrutando jogadores de qualquer guerreiro.',
        'Acesse a página do time e clique em "Entrar no time".'
      ],
      link: 'time.html?id=t6'
    },
    {
      id: 'n6', categoria: 'ATUALIZAÇÃO', titulo: 'Bellator: diário de desenvolvimento #3', data: daqui(-9, 0), arte: 3,
      resumo: 'Bastidores do desenvolvimento do jogo: combate, mapas e o modo Fuga do Coliseu.',
      texto: [
        'Bellator nasceu como Projeto Integrador e continua em desenvolvimento.',
        'Neste diário mostramos o novo sistema de combate corpo a corpo e os primeiros testes do modo Fuga do Coliseu.'
      ],
      link: 'bellator.html'
    }
  ],

  notificacoes: [],
  chamados: [],     // mensagens enviadas pela página de suporte
  interessados: [], // e-mails de quem pediu aviso de novidades do Bellator

  /* ---------------- RESULTADOS VINDOS DO JOGO ----------------
     Cada vez que alguém termina uma partida no Bellator (jogar.html),
     o jogo manda o resultado e ele entra nesta lista.
     modo: 'sobrevivencia' (5 ondas) ou 'infinito' (ondas infinitas)  */
  resultadosDoJogo: [
    { id: 'rj1', jogadorId: 'j1', modo: 'infinito',      ondas: 27, pontos: 4120, venceu: false, guerreiro: 'Retiarius',   duracaoSegundos: 1310, partidaId: '', data: daqui(-1, -3) },
    { id: 'rj2', jogadorId: 'j3', modo: 'infinito',      ondas: 24, pontos: 3780, venceu: false, guerreiro: 'Sagittarius', duracaoSegundos: 1185, partidaId: '', data: daqui(-2, 0) },
    { id: 'rj3', jogadorId: 'j2', modo: 'infinito',      ondas: 21, pontos: 3260, venceu: false, guerreiro: 'Secutor',     duracaoSegundos: 1102, partidaId: '', data: daqui(-1, 0) },
    { id: 'rj4', jogadorId: 'j4', modo: 'infinito',      ondas: 19, pontos: 3015, venceu: false, guerreiro: 'Dimachaerus', duracaoSegundos: 940,  partidaId: '', data: daqui(-3, 0) },
    { id: 'rj5', jogadorId: 'j6', modo: 'infinito',      ondas: 15, pontos: 2290, venceu: false, guerreiro: 'Retiarius',   duracaoSegundos: 760,  partidaId: '', data: daqui(-4, 0) },
    { id: 'rj6', jogadorId: 'j1', modo: 'sobrevivencia', ondas: 5,  pontos: 980,  venceu: true,  guerreiro: 'Retiarius',   duracaoSegundos: 402,  partidaId: '', data: daqui(-2, -5) },
    { id: 'rj7', jogadorId: 'j2', modo: 'sobrevivencia', ondas: 5,  pontos: 910,  venceu: true,  guerreiro: 'Secutor',     duracaoSegundos: 455,  partidaId: '', data: daqui(-2, -2) },
    { id: 'rj8', jogadorId: 'j5', modo: 'sobrevivencia', ondas: 4,  pontos: 640,  venceu: false, guerreiro: 'Secutor',     duracaoSegundos: 390,  partidaId: '', data: daqui(-5, 0) }
  ]
};
