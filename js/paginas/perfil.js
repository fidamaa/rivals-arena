/* =====================================================================
   perfil.js — página perfil.html?id=...
   Perfil público de um jogador. Sem ?id= mostra o seu próprio perfil.
   ===================================================================== */

let idDoJogador = parametroDaUrl('id');
if (!idDoJogador) {
  const eu = exigirLogin();
  if (eu) idDoJogador = eu.id;
}
if (idDoJogador && !buscarJogador(idDoJogador)) window.location.replace('404.html');

// Descrição curta de cada guerreiro (mesma da página Bellator)
const DESCRICAO_GUERREIROS = {
  Secutor: 'O Escudo de Ferro — pesado e blindado.',
  Retiarius: 'Sombra da Rede — faminto e rápido.',
  Sagittarius: 'Vento de Aço — combate à distância.',
  Dimachaerus: 'Fúria Gêmea — duas lâminas, dano bruto.'
};

function mostrarPerfil() {
  const jogador = buscarJogador(idDoJogador);
  if (!jogador) return;
  const eu = usuarioLogado();
  const ehMeuPerfil = eu && eu.id === jogador.id;
  const total = jogador.vitorias + jogador.derrotas;

  document.title = jogador.usuario + ' — Rivals Arena';
  document.getElementById('migalhaJogador').textContent = jogador.usuario;
  document.getElementById('avatarJogador').innerHTML = avatarHtml(jogador, 'grande');
  document.getElementById('nomeJogador').textContent = jogador.usuario;
  document.getElementById('subtituloJogador').textContent = (jogador.nome || '') + ' · Na arena desde ' + formatarDataCurta(jogador.criadoEm);
  document.getElementById('bioJogador').textContent = jogador.bio || (ehMeuPerfil ? 'Escreva algo sobre você em Configurações.' : '');
  document.getElementById('acoesPerfil').innerHTML = ehMeuPerfil
    ? '<a class="btn btn-ghost btn-sm" href="configuracoes.html">EDITAR PERFIL</a>' : '';

  // Números
  const numeros = [
    ['Pontos', formatarNumero(jogador.pontos), 'ouro'],
    ['Ranking', posicaoNoRanking(jogador.id) + 'º', 'laranja'],
    ['Vitórias', jogador.vitorias, ''],
    ['Derrotas', jogador.derrotas, ''],
    ['% Vitórias', total ? Math.round(jogador.vitorias / total * 100) + '%' : '—', ''],
    ['Títulos', jogador.titulos || 0, '']
  ];
  document.getElementById('numerosJogador').innerHTML = numeros.map(function (n) {
    return '<div class="numero ' + n[2] + '"><b>' + n[1] + '</b><span>' + n[0] + '</span></div>';
  }).join('');

  // Guerreiro
  document.getElementById('guerreiroJogador').innerHTML = jogador.guerreiro
    ? '<p style="color:#fff; font-weight:700; font-size:1.1rem">' + escaparHtml(jogador.guerreiro) + '</p><p style="font-size:.82rem; margin-top:4px">' + (DESCRICAO_GUERREIROS[jogador.guerreiro] || '') + '</p>'
    : '<p style="font-size:.85rem">Ainda não jogou nenhuma partida. O guerreiro é escolhido na página de cada partida.</p>';

  // Recordes no jogo (resultados enviados pelo Bellator)
  const linhasRecorde = Object.keys(MODOS_DO_JOGO).map(function (modo) {
    const recorde = recordeDoJogador(jogador.id, modo);
    return '<div><dt>' + MODOS_DO_JOGO[modo] + '</dt><dd>' +
      (recorde ? recorde.ondas + ' ondas · ' + formatarNumero(recorde.pontos) + ' pts' : '—') + '</dd></div>';
  });
  document.getElementById('recordesJogo').innerHTML = linhasRecorde.join('') +
    (ehMeuPerfil ? '<div><dt></dt><dd><a href="jogar.html" style="color:var(--orange)">Jogar agora →</a></dd></div>' : '');

  // Times
  const times = timesDoJogador(jogador.id);
  document.getElementById('timesJogador').innerHTML = times.length ? times.map(function (t) {
    return '<li>' + escudoHtml(t) + '<div class="quem"><a href="time.html?id=' + t.id + '">' + escaparHtml(t.nome) + '</a><small>' +
      t.membros.length + ' membros</small></div>' + (t.capitao === jogador.id ? '<span class="selo">Capitão</span>' : '') + '</li>';
  }).join('') : '<li style="color:var(--dim); font-size:.85rem">Não faz parte de nenhum time.</li>';

  // Histórico de partidas (mais recentes primeiro)
  const partidas = partidasDoJogador(jogador.id)
    .filter(function (p) { return p.status !== 'aguardando'; })
    .sort(function (a, b) { return new Date(b.data) - new Date(a.data); })
    .slice(0, 8);
  preencherLista(document.getElementById('historicoJogador'), partidas, linhaPartidaHtml, 'Nenhuma partida registrada ainda.');

  // Torneios
  preencherLista(document.getElementById('torneiosJogador'), torneiosDoJogador(jogador.id), cartaoTorneioHtml, 'Nenhum torneio ainda.');
}

mostrarPerfil();
