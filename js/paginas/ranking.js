/* =====================================================================
   ranking.js — página ranking.html
   Pódio + tabela de jogadores e de equipes.
   ===================================================================== */

function porcentagemDeVitorias(vitorias, derrotas) {
  const total = vitorias + derrotas;
  return total ? Math.round(vitorias / total * 100) + '%' : '—';
}

// Pódio com os 3 primeiros. Ordem na tela: 2º, 1º, 3º
function podioHtml(top3, linkDe, iconeDe, nomeDe) {
  const ordem = [1, 0, 2];
  return ordem.map(function (i) {
    const item = top3[i];
    if (!item) return '<div></div>';
    return '<div class="degrau' + (i === 0 ? ' primeiro' : '') + '">' +
      '<span class="lugar">' + (i + 1) + 'º</span>' + iconeDe(item) +
      '<a href="' + linkDe(item) + '">' + escaparHtml(nomeDe(item)) + '</a>' +
      '<span class="pts">' + formatarNumero(item.pontos) + ' pts</span></div>';
  }).join('');
}

/* ---------------- Jogadores ---------------- */
function mostrarRankingDeJogadores() {
  const eu = usuarioLogado();
  const busca = document.getElementById('buscaJogador').value.trim().toLowerCase();
  const guerreiro = document.getElementById('filtroGuerreiro').value;
  const ranking = rankingDeJogadores();

  document.getElementById('podioJogadores').innerHTML = podioHtml(
    ranking.slice(0, 3),
    function (j) { return 'perfil.html?id=' + j.id; },
    function (j) { return avatarHtml(j, 'medio'); },
    function (j) { return j.usuario; }
  );

  const linhas = ranking
    .map(function (j, i) { return { jogador: j, posicao: i + 1 }; }) // guarda a posição real antes de filtrar
    .filter(function (item) {
      const j = item.jogador;
      if (guerreiro && j.guerreiro !== guerreiro) return false;
      return !busca || j.usuario.toLowerCase().indexOf(busca) !== -1 || (j.nome || '').toLowerCase().indexOf(busca) !== -1;
    });

  const tabela = document.getElementById('tabelaJogadores');
  if (!linhas.length) {
    tabela.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px">Nenhum jogador encontrado.</td></tr>';
    return;
  }
  tabela.innerHTML = linhas.map(function (item) {
    const j = item.jogador;
    const souEu = eu && eu.id === j.id;
    return '<tr' + (souEu ? ' class="eu"' : '') + '>' +
      '<td class="posicao">' + item.posicao + '</td>' +
      '<td><div class="celula-nome">' + avatarHtml(j, 'pequeno') + '<div><a href="perfil.html?id=' + j.id + '">' + escaparHtml(j.usuario) + (souEu ? ' (você)' : '') + '</a>' +
        '<small>' + escaparHtml(j.nome || '') + '</small></div></div></td>' +
      '<td>' + escaparHtml(j.guerreiro || '—') + '</td>' +
      '<td>' + j.vitorias + '</td>' +
      '<td>' + j.derrotas + '</td>' +
      '<td>' + porcentagemDeVitorias(j.vitorias, j.derrotas) + '</td>' +
      '<td class="destaque">' + formatarNumero(j.pontos) + '</td>' +
    '</tr>';
  }).join('');
}

/* ---------------- Equipes ---------------- */
function mostrarRankingDeTimes() {
  const eu = usuarioLogado();
  const busca = document.getElementById('buscaTime').value.trim().toLowerCase();
  const ranking = rankingDeTimes();

  document.getElementById('podioTimes').innerHTML = podioHtml(
    ranking.slice(0, 3),
    function (t) { return 'time.html?id=' + t.id; },
    function (t) { return escudoHtml(t, 'medio'); },
    function (t) { return t.nome; }
  );

  const linhas = ranking
    .map(function (t, i) { return { time: t, posicao: i + 1 }; })
    .filter(function (item) {
      return !busca || item.time.nome.toLowerCase().indexOf(busca) !== -1 || item.time.tag.toLowerCase().indexOf(busca) !== -1;
    });

  const tabela = document.getElementById('tabelaTimes');
  if (!linhas.length) {
    tabela.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:30px">Nenhuma equipe encontrada.</td></tr>';
    return;
  }
  tabela.innerHTML = linhas.map(function (item) {
    const t = item.time;
    const meuTime = eu && t.membros.indexOf(eu.id) !== -1;
    return '<tr' + (meuTime ? ' class="eu"' : '') + '>' +
      '<td class="posicao">' + item.posicao + '</td>' +
      '<td><div class="celula-nome">' + escudoHtml(t, 'pequeno') + '<div><a href="time.html?id=' + t.id + '">' + escaparHtml(t.nome) + '</a>' +
        '<small>[' + escaparHtml(t.tag) + ']' + (meuTime ? ' · seu time' : '') + '</small></div></div></td>' +
      '<td>' + t.membros.length + '</td>' +
      '<td>' + t.vitorias + '</td>' +
      '<td>' + t.derrotas + '</td>' +
      '<td>' + (t.titulos || 0) + '</td>' +
      '<td class="destaque">' + formatarNumero(t.pontos) + '</td>' +
    '</tr>';
  }).join('');
}

/* ---------------- Bellator (resultados vindos do jogo) ---------------- */
let modoDoJogo = 'infinito';

function mostrarRankingDoJogo() {
  const eu = usuarioLogado();
  const lista = rankingDoJogo(modoDoJogo); // função em banco.js
  const tabela = document.getElementById('tabelaJogo');
  if (!lista.length) {
    tabela.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:30px">Ninguém jogou este modo ainda.</td></tr>';
    return;
  }
  tabela.innerHTML = lista.map(function (r, i) {
    const j = buscarJogador(r.jogadorId);
    const souEu = eu && eu.id === j.id;
    return '<tr' + (souEu ? ' class="eu"' : '') + '>' +
      '<td class="posicao">' + (i + 1) + '</td>' +
      '<td><div class="celula-nome">' + avatarHtml(j, 'pequeno') + '<a href="perfil.html?id=' + j.id + '">' + escaparHtml(j.usuario) + (souEu ? ' (você)' : '') + '</a></div></td>' +
      '<td>' + escaparHtml(r.guerreiro || '—') + '</td>' +
      '<td>' + r.ondas + (r.venceu ? ' ✓' : '') + '</td>' +
      '<td class="destaque">' + formatarNumero(r.pontos) + '</td>' +
      '<td>' + tempoRelativo(r.data) + '</td>' +
    '</tr>';
  }).join('');
}

document.querySelectorAll('#abasModoJogo [data-modo]').forEach(function (botao) {
  botao.addEventListener('click', function () {
    document.querySelectorAll('#abasModoJogo [data-modo]').forEach(function (b) { b.classList.remove('ativa'); });
    botao.classList.add('ativa');
    modoDoJogo = botao.getAttribute('data-modo');
    mostrarRankingDoJogo();
  });
});

document.getElementById('buscaJogador').addEventListener('input', mostrarRankingDeJogadores);
document.getElementById('filtroGuerreiro').addEventListener('change', mostrarRankingDeJogadores);
document.getElementById('buscaTime').addEventListener('input', mostrarRankingDeTimes);

ativarAbas('abasRanking');
mostrarRankingDeJogadores();
mostrarRankingDeTimes();
mostrarRankingDoJogo();
