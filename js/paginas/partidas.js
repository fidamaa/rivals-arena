/* =====================================================================
   partidas.js — página partidas.html
   Separa as partidas em: ao vivo, próximas, encerradas e minhas.
   ===================================================================== */

const filtroTorneio = document.getElementById('filtroTorneio');

// Preenche o seletor de torneios (só os que já têm partidas)
banco.torneios
  .filter(function (t) { return partidasDoTorneio(t.id).length > 0; })
  .forEach(function (t) {
    const opcao = document.createElement('option');
    opcao.value = t.id;
    opcao.textContent = t.nome;
    filtroTorneio.appendChild(opcao);
  });

function mostrarPartidas() {
  const eu = usuarioLogado();

  // Partidas "de verdade" (sem os BYEs) do torneio escolhido
  const todas = banco.partidas.filter(function (p) {
    if (p.bye || !buscarTorneio(p.torneioId)) return false;
    return !filtroTorneio.value || p.torneioId === filtroTorneio.value;
  });

  const aoVivo = todas.filter(function (p) { return statusDaPartida(p).classe === 'ao-vivo'; });
  const proximas = todas.filter(function (p) {
    const classe = statusDaPartida(p).classe;
    return classe === 'agendada' || classe === 'aguardando';
  });
  const encerradas = todas.filter(function (p) { return p.status === 'finalizada'; });
  const minhas = eu ? partidasDoJogador(eu.id).filter(function (p) {
    return !filtroTorneio.value || p.torneioId === filtroTorneio.value;
  }) : [];

  // Ordem por data (encerradas: mais recentes primeiro)
  const porData = function (a, b) { return new Date(a.data) - new Date(b.data); };
  aoVivo.sort(porData);
  proximas.sort(porData);
  encerradas.sort(function (a, b) { return new Date(b.finalizadaEm || b.data) - new Date(a.finalizadaEm || a.data); });
  minhas.sort(porData);

  preencherLista(document.getElementById('listaAoVivo'), aoVivo, linhaPartidaHtml,
    '<b>Nenhuma partida ao vivo agora</b>Confira as próximas partidas na aba ao lado.');
  preencherLista(document.getElementById('listaProximas'), proximas, linhaPartidaHtml,
    '<b>Nenhuma partida agendada</b>Partidas aparecem aqui quando um torneio é iniciado.<br><a class="btn btn-primary btn-sm" href="torneios.html?status=inscricoes">VER TORNEIOS ABERTOS</a>');
  preencherLista(document.getElementById('listaEncerradas'), encerradas, linhaPartidaHtml,
    '<b>Nenhum resultado ainda</b>');
  preencherLista(document.getElementById('listaMinhas'), minhas, linhaPartidaHtml,
    eu ? '<b>Você ainda não tem partidas</b>Inscreva-se em um torneio para começar.<br><a class="btn btn-primary btn-sm" href="torneios.html?status=inscricoes">ENCONTRAR TORNEIO</a>'
       : '<b>Entre na sua conta</b>para ver as suas partidas.<br><a class="btn btn-primary btn-sm" href="entrar.html?voltar=partidas.html%23minhas">ENTRAR</a>');

  // Mostra quantas partidas cada aba tem
  const quantidades = { 'ao-vivo': aoVivo.length, proximas: proximas.length, encerradas: encerradas.length, minhas: minhas.length };
  const nomes = { 'ao-vivo': 'Ao vivo', proximas: 'Próximas', encerradas: 'Resultados', minhas: 'Minhas partidas' };
  document.querySelectorAll('#abasPartidas [data-aba]').forEach(function (botao) {
    const aba = botao.getAttribute('data-aba');
    botao.textContent = nomes[aba] + ' (' + quantidades[aba] + ')';
  });
}

filtroTorneio.addEventListener('change', mostrarPartidas);
ativarAbas('abasPartidas');
mostrarPartidas();
