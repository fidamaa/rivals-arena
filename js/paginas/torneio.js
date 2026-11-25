/* =====================================================================
   torneio.js — página torneio.html?id=...
   Mostra um torneio: informações, inscrição, chaveamento,
   participantes, regras e a área do organizador.
   ===================================================================== */

const idDoTorneio = parametroDaUrl('id');
let torneio = buscarTorneio(idDoTorneio);

if (!torneio) {
  // Torneio não existe: manda para a página de erro
  window.location.replace('404.html');
}

const ICONE_TROFEU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/></svg>';


/* ---------------- Monta a página inteira ---------------- */
function mostrarTorneio() {
  torneio = buscarTorneio(idDoTorneio);
  if (!torneio) return;
  const organizador = buscarJogador(torneio.organizador);

  document.title = torneio.nome + ' — Rivals Arena';
  document.getElementById('migalhaNome').textContent = torneio.nome;
  document.getElementById('nomeTorneio').textContent = torneio.nome;
  document.getElementById('bannerTorneio').classList.add('arte-' + torneio.arte);
  document.getElementById('organizadorTorneio').innerHTML = 'Organizado por <a href="perfil.html?id=' + torneio.organizador + '" style="color:var(--orange)">' +
    escaparHtml(organizador ? organizador.usuario : '—') + '</a>';
  document.getElementById('etiquetasTorneio').innerHTML =
    '<span class="pilula ' + classeStatusTorneio(torneio) + '">' + textoStatusTorneio(torneio) + '</span>' +
    '<span class="etiqueta">' + escaparHtml(torneio.modo) + '</span>' +
    '<span class="etiqueta">' + escaparHtml(torneio.modoDeJogo) + '</span>' +
    '<span class="etiqueta">' + textoFormato(torneio) + '</span>';

  document.getElementById('descricaoTorneio').textContent = torneio.descricao || 'O organizador ainda não escreveu uma descrição.';
  document.getElementById('regrasTorneio').textContent = torneio.regras || 'Sem regras adicionais.';
  document.getElementById('botaoAbaChaveamento').textContent = torneio.formato === 'pontos' ? 'Classificação' : 'Chaveamento';

  mostrarInformacoes();
  mostrarAcoesDeInscricao();
  mostrarCampeao();
  mostrarPartidasEmDestaque();
  mostrarChaveamento();
  mostrarParticipantes();
  mostrarAreaDoOrganizador();
}

function mostrarInformacoes() {
  const tipo = ehTorneioDeTimes(torneio) ? 'equipes' : 'jogadores';
  const linhas = [
    ['Início', formatarData(torneio.inicio)],
    ['Vagas', torneio.participantes.length + ' / ' + torneio.vagas + ' ' + tipo],
    ['Premiação', torneio.premio],
    ['Região', torneio.regiao],
    ['Formato', textoFormato(torneio)],
    ['Equipes', torneio.modo]
  ];
  document.getElementById('infoTorneio').innerHTML = linhas.map(function (l) {
    return '<div><dt>' + l[0] + '</dt><dd>' + escaparHtml(l[1]) + '</dd></div>';
  }).join('');
}


/* ---------------- Botões de inscrição ---------------- */
function mostrarAcoesDeInscricao() {
  const area = document.getElementById('acoesInscricao');
  const eu = usuarioLogado();

  if (torneio.status !== 'inscricoes') {
    const texto = torneio.status === 'finalizado' ? 'VER RESULTADO FINAL' : 'ACOMPANHAR AO VIVO';
    area.innerHTML = '<a class="btn btn-primary btn-bloco" href="#chaveamento">' + texto + '</a>';
    area.querySelector('a').addEventListener('click', function (e) { e.preventDefault(); abrirAba('chaveamento'); });
    return;
  }
  if (!eu) {
    area.innerHTML = '<a class="btn btn-primary btn-bloco" href="entrar.html?voltar=' + encodeURIComponent('torneio.html?id=' + torneio.id) + '">ENTRE PARA SE INSCREVER</a>';
    return;
  }

  const minhaInscricao = participacaoDoJogador(torneio, eu.id);
  if (minhaInscricao) {
    const nome = nomeParticipante(torneio, minhaInscricao);
    area.innerHTML =
      '<p style="font-size:.85rem; color:#4ade80">✓ Inscrito como <b>' + escaparHtml(nome) + '</b></p>' +
      '<button class="btn btn-perigo btn-bloco" type="button" id="botaoCancelar">CANCELAR INSCRIÇÃO</button>';
    document.getElementById('botaoCancelar').addEventListener('click', function () {
      if (!confirm('Cancelar a inscrição de ' + nome + '?')) return;
      if (avisarResultado(cancelarInscricao(torneio.id, minhaInscricao), 'Inscrição cancelada.')) mostrarTorneio();
    });
    return;
  }

  const lotado = torneio.participantes.length >= torneio.vagas;
  area.innerHTML = '<button class="btn btn-primary btn-bloco" type="button" id="botaoInscrever"' + (lotado ? ' disabled' : '') + '>' +
    (lotado ? 'VAGAS ESGOTADAS' : 'INSCREVER-SE') + '</button>';
  document.getElementById('botaoInscrever').addEventListener('click', function () {
    if (ehTorneioDeTimes(torneio)) abrirJanelaDeInscricao();
    else if (avisarResultado(inscrever(torneio.id, eu.id), 'Inscrição confirmada! Boa sorte na arena.')) mostrarTorneio();
  });
}

// Janela para escolher o time (torneios 2v2 e 3v3)
const janela = document.getElementById('janelaInscricao');
const erroInscricao = document.getElementById('erroInscricao');

function abrirJanelaDeInscricao() {
  const eu = usuarioLogado();
  const meusTimes = banco.times.filter(function (t) { return t.capitao === eu.id; });
  const seletor = document.getElementById('seletorTime');
  erroInscricao.classList.remove('visivel');

  document.getElementById('textoJanelaInscricao').textContent =
    'Este torneio é ' + torneio.modo + ': seu time precisa ter pelo menos ' + tamanhoDoTime(torneio) + ' jogadores. Só o capitão pode inscrever.';

  if (!meusTimes.length) {
    seletor.innerHTML = '<option value="">Você não é capitão de nenhum time</option>';
    erroInscricao.innerHTML = 'Crie um time primeiro em <a href="times.html" style="color:#fff;text-decoration:underline">Times</a>.';
    erroInscricao.classList.add('visivel');
  } else {
    seletor.innerHTML = meusTimes.map(function (t) {
      return '<option value="' + t.id + '">' + escaparHtml(t.nome) + ' (' + t.membros.length + ' jogadores)</option>';
    }).join('');
  }
  janela.showModal();
}

document.getElementById('confirmarInscricao').addEventListener('click', function () {
  const timeId = document.getElementById('seletorTime').value;
  const resultado = inscrever(torneio.id, timeId);
  if (resultado.ok) {
    janela.close();
    mostrarAviso('Time inscrito! Boa sorte na arena.', 'sucesso');
    mostrarTorneio();
  } else {
    erroInscricao.textContent = resultado.erro;
    erroInscricao.classList.add('visivel');
  }
});


/* ---------------- Campeão e partidas em destaque ---------------- */
function mostrarCampeao() {
  const caixa = document.getElementById('caixaCampeao');
  if (torneio.status !== 'finalizado' || !torneio.vencedor) { caixa.innerHTML = ''; return; }
  caixa.innerHTML =
    '<div class="campeao">' + ICONE_TROFEU +
      '<div><small>Campeão</small><a href="' + linkParticipante(torneio, torneio.vencedor) + '">' + escaparHtml(nomeParticipante(torneio, torneio.vencedor)) + '</a></div>' +
    '</div>';
}

function mostrarPartidasEmDestaque() {
  const partidas = partidasDoTorneio(torneio.id).filter(function (p) { return !p.bye && p.status !== 'aguardando'; });
  // primeiro as que ainda vão acontecer, depois as últimas encerradas
  const abertas = partidas.filter(function (p) { return p.status === 'agendada'; });
  const encerradas = partidas.filter(function (p) { return p.status === 'finalizada'; }).reverse();
  const destaque = abertas.concat(encerradas).slice(0, 4);

  let vazio = '<b>Nenhuma partida ainda</b>As partidas aparecem quando o organizador iniciar o torneio.';
  preencherLista(document.getElementById('partidasDestaque'), destaque, linhaPartidaHtml, vazio);
}


/* ---------------- Chaveamento ---------------- */
function mostrarChaveamento() {
  const area = document.getElementById('areaChaveamento');
  const partidas = partidasDoTorneio(torneio.id);

  if (!partidas.length) {
    area.innerHTML = '<div class="vazio-estado"><b>O chaveamento ainda não foi gerado</b>Ele é criado automaticamente quando o organizador inicia o torneio.</div>';
    return;
  }

  if (torneio.formato === 'pontos') {
    area.innerHTML = tabelaClassificacaoHtml() + '<h3 class="titulo-secao" style="margin-top:28px">Partidas</h3><div class="lista-partidas">' +
      partidas.map(linhaPartidaHtml).join('') + '</div>';
    return;
  }

  // Eliminação: uma coluna para cada rodada
  const totalRodadas = Math.max.apply(null, partidas.map(function (p) { return p.rodada; }));
  let html = '<div class="chaveamento">';
  for (let r = 1; r <= totalRodadas; r++) {
    const daRodada = partidas.filter(function (p) { return p.rodada === r; });
    html += '<div class="coluna-rodada"><h4>' + nomeDaRodada(torneio, r) + '</h4><div class="partidas-coluna">';
    html += daRodada.map(cartaoPartidaHtml).join('');
    html += '</div></div>';
  }
  html += '</div>';
  area.innerHTML = html;
}

function cartaoPartidaHtml(p) {
  const status = statusDaPartida(p);
  const linha = function (id, placar) {
    const venceu = p.vencedor && p.vencedor === id ? ' vencedor' : '';
    const textoPlacar = p.status === 'finalizada' && !p.bye ? placar : '';
    return '<div class="linha-time' + venceu + '">' + iconeParticipanteHtml(torneio, id, 'pequeno') +
      '<span class="nome">' + escaparHtml(id ? nomeParticipante(torneio, id) : (p.bye ? '—' : 'A definir')) + '</span>' +
      '<span class="placar">' + textoPlacar + '</span></div>';
  };
  const conteudo = linha(p.a, p.placarA) + linha(p.b, p.placarB) +
    '<div class="info-partida"><span>' + formatarData(p.data) + '</span><span>' + status.texto + '</span></div>';

  if (p.bye) return '<div class="cartao-partida bye">' + conteudo + '</div>';
  return '<a class="cartao-partida" href="partida.html?id=' + p.id + '">' + conteudo + '</a>';
}

function tabelaClassificacaoHtml() {
  const linhas = classificacaoPontosCorridos(torneio).map(function (l, i) {
    return '<tr><td class="posicao">' + (i + 1) + 'º</td>' +
      '<td><div class="celula-nome">' + iconeParticipanteHtml(torneio, l.id, 'pequeno') +
      '<a href="' + linkParticipante(torneio, l.id) + '">' + escaparHtml(nomeParticipante(torneio, l.id)) + '</a></div></td>' +
      '<td>' + l.jogos + '</td><td>' + l.vitorias + '</td><td>' + l.derrotas + '</td><td>' + (l.saldo > 0 ? '+' : '') + l.saldo + '</td>' +
      '<td class="destaque">' + l.pontos + '</td></tr>';
  }).join('');
  return '<div class="caixa"><h3>Classificação</h3><div class="tabela-rolagem"><table class="tabela">' +
    '<thead><tr><th>#</th><th>Participante</th><th>J</th><th>V</th><th>D</th><th>Saldo</th><th>Pts</th></tr></thead>' +
    '<tbody>' + linhas + '</tbody></table></div></div>';
}


/* ---------------- Participantes ---------------- */
function mostrarParticipantes() {
  const lista = document.getElementById('listaParticipantes');
  const eu = usuarioLogado();
  const tipo = ehTorneioDeTimes(torneio) ? 'equipes' : 'jogadores';
  document.getElementById('contagemParticipantes').textContent = torneio.participantes.length + ' de ' + torneio.vagas + ' ' + tipo + ' inscritos';

  if (!torneio.participantes.length) {
    lista.innerHTML = '<div class="vazio-estado"><b>Nenhum inscrito ainda</b>Seja o primeiro a entrar na arena!</div>';
    return;
  }

  lista.innerHTML = torneio.participantes.map(function (id) {
    let detalhe = '';
    if (ehTorneioDeTimes(torneio)) {
      const time = buscarTime(id);
      detalhe = time ? time.membros.length + ' jogadores · [' + time.tag + ']' : '';
    } else {
      const jogador = buscarJogador(id);
      detalhe = jogador ? formatarNumero(jogador.pontos) + ' pts · ' + (jogador.guerreiro || 'Sem guerreiro') : '';
    }
    // O organizador pode remover qualquer inscrito enquanto as inscrições estão abertas
    const podeRemover = torneio.status === 'inscricoes' && eu && torneio.organizador === eu.id;
    return '<div class="participante">' + iconeParticipanteHtml(torneio, id) +
      '<div><a href="' + linkParticipante(torneio, id) + '">' + escaparHtml(nomeParticipante(torneio, id)) + '</a><small>' + escaparHtml(detalhe) + '</small></div>' +
      (podeRemover ? '<button class="remover" type="button" data-remover="' + id + '" aria-label="Remover inscrição">×</button>' : '') +
      '</div>';
  }).join('');

  lista.querySelectorAll('[data-remover]').forEach(function (botao) {
    botao.addEventListener('click', function () {
      const id = botao.getAttribute('data-remover');
      if (!confirm('Remover ' + nomeParticipante(torneio, id) + ' do torneio?')) return;
      if (avisarResultado(cancelarInscricao(torneio.id, id), 'Inscrição removida.')) mostrarTorneio();
    });
  });
}


/* ---------------- Área do organizador ---------------- */
function mostrarAreaDoOrganizador() {
  const caixa = document.getElementById('caixaOrganizador');
  caixa.hidden = !souOrganizador(torneio);
  const inscricoesAbertas = torneio.status === 'inscricoes';
  document.getElementById('botaoIniciar').hidden = !inscricoesAbertas;
  document.getElementById('botaoPreencher').hidden = !inscricoesAbertas;
}

document.getElementById('botaoIniciar').addEventListener('click', function () {
  if (!confirm('Iniciar o torneio agora? As inscrições serão encerradas e as partidas criadas.')) return;
  if (avisarResultado(iniciarTorneio(torneio.id), 'Torneio iniciado! O chaveamento foi gerado.')) {
    mostrarTorneio();
    abrirAba('chaveamento');
  }
});

document.getElementById('botaoPreencher').addEventListener('click', function () {
  const resultado = preencherComExemplos(torneio.id);
  if (avisarResultado(resultado, (resultado.adicionados || 0) + ' participantes de exemplo adicionados.')) mostrarTorneio();
});

document.getElementById('botaoExcluir').addEventListener('click', function () {
  if (!confirm('Excluir "' + torneio.nome + '" para sempre? Isso não pode ser desfeito.')) return;
  if (avisarResultado(excluirTorneio(torneio.id), 'Torneio excluído.')) {
    window.location.href = 'torneios.html';
  }
});


/* ---------------- Início ---------------- */
const abrirAba = ativarAbas('abasTorneio');
if (torneio) mostrarTorneio();
