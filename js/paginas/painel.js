/* =====================================================================
   painel.js — página painel.html
   Resumo do usuário logado: partidas, torneios, números e avisos.
   ===================================================================== */

const eu = exigirLogin();

function mostrarPainel() {
  if (!eu) return;

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : (hora < 18 ? 'Boa tarde' : 'Boa noite');
  document.getElementById('avatarPainel').innerHTML = avatarHtml(eu, 'medio');
  document.getElementById('saudacao').textContent = saudacao + ', ' + eu.usuario + '!';
  document.getElementById('resumoPainel').textContent = 'Você está em ' + posicaoNoRanking(eu.id) + 'º no ranking com ' + formatarNumero(eu.pontos) + ' pontos.';
  document.getElementById('linkMeuPerfil').href = 'perfil.html?id=' + eu.id;

  // Próximas partidas (ainda não jogadas)
  const proximas = partidasDoJogador(eu.id)
    .filter(function (p) { return p.status === 'agendada'; })
    .sort(function (a, b) { return new Date(a.data) - new Date(b.data); });
  preencherLista(document.getElementById('proximasPartidas'), proximas, linhaPartidaHtml,
    '<b>Nenhuma partida marcada</b>Entre em um torneio para começar a jogar.<br><a class="btn btn-primary btn-sm" href="torneios.html?status=inscricoes">ENCONTRAR TORNEIO</a>');

  // Torneios
  const inscrito = banco.torneios.filter(function (t) { return participacaoDoJogador(t, eu.id); });
  const organizo = banco.torneios.filter(function (t) { return t.organizador === eu.id; });
  preencherLista(document.getElementById('torneiosInscrito'), inscrito, cartaoTorneioHtml, 'Você não está inscrito em nenhum torneio.');
  preencherLista(document.getElementById('torneiosOrganizo'), organizo, cartaoTorneioHtml,
    'Você ainda não organizou nenhum torneio.<br><a class="btn btn-primary btn-sm" href="criar-torneio.html">CRIAR MEU PRIMEIRO TORNEIO</a>');

  // Números
  const linhas = [
    ['Pontos', formatarNumero(eu.pontos)],
    ['Posição', posicaoNoRanking(eu.id) + 'º'],
    ['Vitórias / Derrotas', eu.vitorias + ' / ' + eu.derrotas],
    ['Títulos', eu.titulos || 0],
    ['Times', timesDoJogador(eu.id).length],
    ['Guerreiro', eu.guerreiro || '—']
  ];
  document.getElementById('numerosPainel').innerHTML = linhas.map(function (l) {
    return '<div><dt>' + l[0] + '</dt><dd>' + escaparHtml(l[1]) + '</dd></div>';
  }).join('');

  // Notificações
  const notificacoes = notificacoesDoUsuario().slice(0, 10);
  document.getElementById('notificacoesPainel').innerHTML = notificacoes.length ? notificacoes.map(function (n) {
    return '<li class="' + (n.lida ? '' : 'nao-lida') + '"><a href="' + escaparHtml(n.link || '#') + '">' + escaparHtml(n.texto) + '<small>' + tempoRelativo(n.data) + '</small></a></li>';
  }).join('') : '<li class="vazio">Nenhuma notificação por enquanto.</li>';
}

document.getElementById('limparNotificacoes').addEventListener('click', function () {
  marcarNotificacoesComoLidas();
  mostrarPainel();
  montarAreaDoUsuario();
});

mostrarPainel();
