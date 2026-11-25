/* =====================================================================
   inicio.js — página index.html (Home)
   - carrossel do topo
   - cartão "Hub competitivo" com abas (torneios, ranking, equipes,
     partidas), tudo com os dados reais do site
   ===================================================================== */


/* ---------------- Carrossel do topo ---------------- */
const slides = document.querySelectorAll('.hero-slide');
const bolinhas = document.querySelectorAll('#heroDots button');
let slideAtual = 0;
let temporizador = null;

function mostrarSlide(numero) {
  slideAtual = numero;
  slides.forEach(function (s, i) { s.classList.toggle('active', i === numero); });
  bolinhas.forEach(function (b, i) { b.classList.toggle('active', i === numero); });
}

function reiniciarTemporizador() {
  clearInterval(temporizador);
  const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!semAnimacao) {
    temporizador = setInterval(function () { mostrarSlide((slideAtual + 1) % slides.length); }, 7000);
  }
}

bolinhas.forEach(function (bolinha, i) {
  bolinha.addEventListener('click', function () { mostrarSlide(i); reiniciarTemporizador(); });
});
reiniciarTemporizador();


/* ---------------- Hub competitivo ---------------- */
ativarAbas('abasHub');

// Aba "Torneios": ao vivo primeiro, depois inscrições abertas
const peso = { andamento: 0, inscricoes: 1, finalizado: 2 };
const torneiosEmDestaque = banco.torneios.slice()
  .sort(function (a, b) { return peso[a.status] - peso[b.status] || new Date(a.inicio) - new Date(b.inicio); })
  .slice(0, 4);

document.getElementById('miniTorneios').innerHTML = torneiosEmDestaque.map(function (t) {
  const tipo = ehTorneioDeTimes(t) ? ' EQUIPES' : ' JOGADORES';
  let status = '<span class="status soon">FIM</span>';
  if (t.status === 'andamento') status = '<span class="status live">AO VIVO</span>';
  if (t.status === 'inscricoes') status = '<span class="status soon">ABERTO</span>';
  return '<li><img src="img/logo-rivals-arena-reduzida-RA-png.png" alt="">' +
    '<div><a class="ti-name" href="torneio.html?id=' + t.id + '">' + escaparHtml(t.nome.toUpperCase()) + '</a>' +
    '<span class="ti-meta">' + escaparHtml(t.modo) + ' · ' + escaparHtml(t.modoDeJogo) + '</span>' +
    '<span class="ti-count">' + t.participantes.length + '/' + t.vagas + tipo + '</span></div>' + status + '</li>';
}).join('');

// Aba "Ranking": 5 melhores jogadores
document.getElementById('miniRanking').innerHTML = rankingDeJogadores().slice(0, 5).map(function (j, i) {
  return '<li class="' + (i === 0 ? 'rank-1' : '') + '"><span class="pos">' + (i + 1) + '</span>' +
    avatarHtml(j, 'pequeno') +
    '<a class="who" href="perfil.html?id=' + j.id + '">' + escaparHtml(j.usuario) + '</a>' +
    '<span class="pts">' + formatarNumero(j.pontos) + '</span></li>';
}).join('');

// Aba "Equipes": 5 melhores times
document.getElementById('miniEquipes').innerHTML = rankingDeTimes().slice(0, 5).map(function (t, i) {
  return '<li class="' + (i === 0 ? 'rank-1' : '') + '"><span class="pos">' + (i + 1) + '</span>' +
    escudoHtml(t, 'pequeno') +
    '<a class="who" href="time.html?id=' + t.id + '">' + escaparHtml(t.nome) + '</a>' +
    '<span class="pts">' + formatarNumero(t.pontos) + '</span></li>';
}).join('');

// Aba "Partidas": próximas e ao vivo
const proximasPartidas = banco.partidas
  .filter(function (p) { return !p.bye && p.status === 'agendada'; })
  .sort(function (a, b) { return new Date(a.data) - new Date(b.data); })
  .slice(0, 4);

const listaPartidas = document.getElementById('miniPartidas');
if (!proximasPartidas.length) {
  listaPartidas.innerHTML = '<li><div><span class="ti-meta">Nenhuma partida agendada no momento.</span></div></li>';
} else {
  listaPartidas.innerHTML = proximasPartidas.map(function (p) {
    const torneio = buscarTorneio(p.torneioId);
    const status = statusDaPartida(p);
    const etiqueta = status.classe === 'ao-vivo' ? '<span class="status live">AO VIVO</span>' : '<span class="status soon">' + formatarData(p.data).split(' · ')[1] + '</span>';
    return '<li>' + iconeParticipanteHtml(torneio, p.a, 'pequeno') +
      '<div><a class="ti-name" href="partida.html?id=' + p.id + '">' + escaparHtml(nomeParticipante(torneio, p.a)) + ' vs ' + escaparHtml(nomeParticipante(torneio, p.b)) + '</a>' +
      '<span class="ti-meta">' + escaparHtml(torneio.nome) + ' · ' + nomeDaRodada(torneio, p.rodada) + '</span></div>' + etiqueta + '</li>';
  }).join('');
}
