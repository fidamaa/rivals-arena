/* =====================================================================
   time.js — página time.html?id=...
   Perfil de um time: membros, números, partidas e torneios.
   O capitão pode editar, adicionar e remover jogadores.
   ===================================================================== */

const idDoTime = parametroDaUrl('id');
if (!buscarTime(idDoTime)) window.location.replace('404.html');

function mostrarTime() {
  const time = buscarTime(idDoTime);
  if (!time) return;
  const eu = usuarioLogado();
  const souCapitao = eu && time.capitao === eu.id;
  const souMembro = eu && time.membros.indexOf(eu.id) !== -1;
  const posicao = rankingDeTimes().findIndex(function (t) { return t.id === time.id; }) + 1;

  document.title = time.nome + ' — Rivals Arena';
  document.getElementById('migalhaTime').textContent = time.nome;
  document.getElementById('escudoTime').innerHTML = escudoHtml(time, 'grande');
  document.getElementById('nomeTime').textContent = time.nome;
  document.getElementById('subtituloTime').textContent = '[' + time.tag + '] · Criado em ' + formatarDataCurta(time.criadoEm);
  document.getElementById('bioTime').textContent = time.bio || 'Este time ainda não tem descrição.';

  // Botões de ação
  const acoes = document.getElementById('acoesTime');
  if (souCapitao) {
    acoes.innerHTML = '<button class="btn btn-ghost btn-sm" type="button" id="botaoEditar">EDITAR TIME</button>' +
      '<button class="btn btn-perigo btn-sm" type="button" id="botaoSair">SAIR DO TIME</button>';
  } else if (souMembro) {
    acoes.innerHTML = '<button class="btn btn-perigo btn-sm" type="button" id="botaoSair">SAIR DO TIME</button>';
  } else if (time.membros.length < MAXIMO_MEMBROS_TIME) {
    acoes.innerHTML = '<button class="btn btn-primary btn-sm" type="button" id="botaoEntrar">ENTRAR NO TIME</button>';
  } else {
    acoes.innerHTML = '<span class="pilula encerrado">Time completo</span>';
  }
  ligarBotoesDeAcao(time);

  // Números
  const numeros = [
    ['Pontos', formatarNumero(time.pontos), 'ouro'],
    ['Ranking', posicao + 'º', 'laranja'],
    ['Vitórias', time.vitorias, ''],
    ['Derrotas', time.derrotas, ''],
    ['Títulos', time.titulos || 0, '']
  ];
  document.getElementById('numerosTime').innerHTML = numeros.map(function (n) {
    return '<div class="numero ' + n[2] + '"><b>' + n[1] + '</b><span>' + n[0] + '</span></div>';
  }).join('');

  // Membros
  document.getElementById('tituloMembros').textContent = 'Membros (' + time.membros.length + '/' + MAXIMO_MEMBROS_TIME + ')';
  document.getElementById('membrosTime').innerHTML = time.membros.map(function (id) {
    const j = buscarJogador(id);
    if (!j) return '';
    const ehCapitao = time.capitao === id;
    const botaoRemover = souCapitao && !ehCapitao
      ? '<button class="link-simples" type="button" data-remover="' + id + '" style="color:var(--dim)">Remover</button>' : '';
    return '<li>' + avatarHtml(j) +
      '<div class="quem"><a href="perfil.html?id=' + j.id + '">' + escaparHtml(j.usuario) + '</a><small>' + escaparHtml(j.guerreiro || 'Sem guerreiro') + ' · ' + formatarNumero(j.pontos) + ' pts</small></div>' +
      (ehCapitao ? '<span class="selo">Capitão</span>' : '') + botaoRemover + '</li>';
  }).join('');

  document.querySelectorAll('[data-remover]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      const jogador = buscarJogador(botao.getAttribute('data-remover'));
      if (!confirm('Remover ' + jogador.usuario + ' do time?')) return;
      if (avisarResultado(removerDoTime(time.id, jogador.id), jogador.usuario + ' foi removido.')) mostrarTime();
    });
  });

  // Formulário de adicionar jogador (só capitão)
  document.getElementById('formConvidar').hidden = !souCapitao || time.membros.length >= MAXIMO_MEMBROS_TIME;
  document.getElementById('sugestoesJogadores').innerHTML = banco.jogadores
    .filter(function (j) { return time.membros.indexOf(j.id) === -1; })
    .map(function (j) { return '<option value="' + escaparHtml(j.usuario) + '">'; }).join('');

  // Partidas do time
  const partidas = banco.partidas.filter(function (p) {
    return !p.bye && (p.a === time.id || p.b === time.id) && p.status !== 'aguardando';
  }).sort(function (a, b) { return new Date(b.data) - new Date(a.data); }).slice(0, 6);
  preencherLista(document.getElementById('partidasTime'), partidas, linhaPartidaHtml, 'Este time ainda não jogou nenhuma partida.');

  // Torneios em que o time está inscrito
  const torneios = banco.torneios.filter(function (t) { return t.participantes.indexOf(time.id) !== -1; });
  preencherLista(document.getElementById('torneiosTime'), torneios, cartaoTorneioHtml,
    'Nenhum torneio ainda.' + (souCapitao ? '<br><a class="btn btn-primary btn-sm" href="torneios.html?status=inscricoes">INSCREVER O TIME</a>' : ''));
}

function ligarBotoesDeAcao(time) {
  const entrar = document.getElementById('botaoEntrar');
  const sair = document.getElementById('botaoSair');
  const editar = document.getElementById('botaoEditar');

  if (entrar) entrar.addEventListener('click', function () {
    if (!exigirLogin()) return;
    if (avisarResultado(entrarNoTime(time.id), 'Bem-vindo(a) ao ' + time.nome + '!')) mostrarTime();
  });

  if (sair) sair.addEventListener('click', function () {
    const aviso = time.membros.length === 1
      ? 'Você é o único membro. Sair vai apagar o time. Continuar?'
      : 'Sair do time ' + time.nome + '?';
    if (!confirm(aviso)) return;
    const resultado = removerDoTime(time.id, usuarioLogado().id);
    if (!avisarResultado(resultado, 'Você saiu do time.')) return;
    if (resultado.timeExcluido) window.location.href = 'times.html';
    else mostrarTime();
  });

  if (editar) editar.addEventListener('click', function () {
    document.getElementById('editarNome').value = time.nome;
    document.getElementById('editarBio').value = time.bio || '';
    document.getElementById('editarCor').value = time.cor;
    document.getElementById('erroEditarTime').classList.remove('visivel');
    janelaEditar.showModal();
  });
}

document.getElementById('formConvidar').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const campo = document.getElementById('usuarioConvidado');
  const resultado = convidarParaTime(idDoTime, campo.value);
  if (avisarResultado(resultado, (resultado.jogador ? resultado.jogador.usuario : '') + ' entrou no time!')) {
    campo.value = '';
    mostrarTime();
  }
});


/* ---------------- Janela "Editar time" ---------------- */
const janelaEditar = document.getElementById('janelaEditarTime');

document.getElementById('cancelarEditarTime').addEventListener('click', function () { janelaEditar.close(); });

document.getElementById('formEditarTime').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const resultado = editarTime(idDoTime, {
    nome: document.getElementById('editarNome').value,
    bio: document.getElementById('editarBio').value,
    cor: document.getElementById('editarCor').value
  });
  if (!resultado.ok) {
    const erro = document.getElementById('erroEditarTime');
    erro.textContent = resultado.erro;
    erro.classList.add('visivel');
    return;
  }
  janelaEditar.close();
  mostrarAviso('Time atualizado.', 'sucesso');
  mostrarTime();
});

document.getElementById('botaoExcluirTime').addEventListener('click', function () {
  if (!confirm('Excluir o time para sempre? Isso não pode ser desfeito.')) return;
  if (avisarResultado(excluirTime(idDoTime), 'Time excluído.')) window.location.href = 'times.html';
});

mostrarTime();
