/* =====================================================================
   times.js — página times.html
   Lista de times, "Meus times" e a janela de criar time.
   ===================================================================== */

// Cartão de um time
function cartaoTimeHtml(time) {
  const capitao = buscarJogador(time.capitao);
  const membros = time.membros.map(buscarJogador).filter(Boolean);
  const vagas = MAXIMO_MEMBROS_TIME - time.membros.length;
  return `
    <a class="cartao-time" href="time.html?id=${time.id}">
      <div class="cabeca">
        ${escudoHtml(time, 'medio')}
        <div><h3>${escaparHtml(time.nome)}</h3><small>Capitão: ${escaparHtml(capitao ? capitao.usuario : '—')}</small></div>
      </div>
      <p>${escaparHtml(time.bio || 'Sem descrição.')}</p>
      <div class="avatares">${membros.map(function (j) { return avatarHtml(j, 'pequeno'); }).join('')}</div>
      <div class="rodape-cartao">
        <span>${time.membros.length} membro(s) ${vagas > 0 ? '· <b style="color:var(--orange)">recrutando</b>' : ''}</span>
        <span style="color:var(--gold)">${formatarNumero(time.pontos)} pts</span>
      </div>
    </a>`;
}

function mostrarTimes() {
  const eu = usuarioLogado();
  const busca = document.getElementById('buscaTimes').value.trim().toLowerCase();
  const soRecrutando = document.getElementById('soRecrutando').checked;

  // Meus times
  const blocoMeus = document.getElementById('meus-times');
  blocoMeus.hidden = !eu;
  if (eu) {
    preencherLista(document.getElementById('listaMeusTimes'), timesDoJogador(eu.id), cartaoTimeHtml,
      '<b>Você ainda não está em nenhum time</b>Crie o seu ou entre em um time que está recrutando.');
  }

  // Todos os times
  const lista = rankingDeTimes().filter(function (t) {
    if (soRecrutando && t.membros.length >= MAXIMO_MEMBROS_TIME) return false;
    return !busca || t.nome.toLowerCase().indexOf(busca) !== -1 || t.tag.toLowerCase().indexOf(busca) !== -1;
  });
  preencherLista(document.getElementById('listaTimes'), lista, cartaoTimeHtml, '<b>Nenhum time encontrado</b>');
}

document.getElementById('buscaTimes').addEventListener('input', mostrarTimes);
document.getElementById('soRecrutando').addEventListener('change', mostrarTimes);


/* ---------------- Janela "Criar time" ---------------- */
const janelaCriar = document.getElementById('janelaCriarTime');
const erroCriar = document.getElementById('erroCriarTime');

document.getElementById('botaoCriarTime').addEventListener('click', function () {
  if (!exigirLogin()) return;
  erroCriar.classList.remove('visivel');
  janelaCriar.showModal();
});
document.getElementById('cancelarCriarTime').addEventListener('click', function () { janelaCriar.close(); });

document.getElementById('formCriarTime').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const resultado = criarTime({
    nome: document.getElementById('nomeTime').value,
    tag: document.getElementById('tagTime').value,
    bio: document.getElementById('bioTime').value,
    cor: document.getElementById('corTime').value
  });
  if (!resultado.ok) {
    erroCriar.textContent = resultado.erro;
    erroCriar.classList.add('visivel');
    return;
  }
  window.location.href = 'time.html?id=' + resultado.time.id;
});

// times.html?criar=1 já abre a janela
if (parametroDaUrl('criar') && usuarioLogado()) janelaCriar.showModal();

mostrarTimes();
