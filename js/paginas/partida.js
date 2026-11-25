/* =====================================================================
   partida.js — página partida.html?id=...
   Placar, envio de resultado, escalações e chat de uma partida.
   ===================================================================== */

const idDaPartida = parametroDaUrl('id');
if (!buscarPartida(idDaPartida)) window.location.replace('404.html');

function mostrarPartida() {
  const partida = buscarPartida(idDaPartida);
  if (!partida) return;
  const torneio = buscarTorneio(partida.torneioId);
  const status = statusDaPartida(partida);
  const nomeA = nomeParticipante(torneio, partida.a);
  const nomeB = nomeParticipante(torneio, partida.b);

  document.title = nomeA + ' vs ' + nomeB + ' — Rivals Arena';
  const linkTorneio = document.getElementById('linkTorneio');
  linkTorneio.textContent = torneio.nome;
  linkTorneio.href = 'torneio.html?id=' + torneio.id;
  document.getElementById('botaoVerTorneio').href = 'torneio.html?id=' + torneio.id + '#chaveamento';
  document.getElementById('migalhaRodada').textContent = nomeDaRodada(torneio, partida.rodada);
  document.getElementById('statusPartida').innerHTML = '<span class="pilula ' + status.classe + '">' + status.texto + '</span>';
  document.getElementById('dataPartida').textContent = formatarData(partida.data);

  // Placar grande
  const finalizada = partida.status === 'finalizada';
  function lado(id) {
    const venceu = partida.vencedor && partida.vencedor === id ? ' vencedor' : '';
    const link = id ? '<a href="' + linkParticipante(torneio, id) + '">' + escaparHtml(nomeParticipante(torneio, id)) + '</a>' : '<a>A definir</a>';
    return '<div class="lado' + venceu + '">' + iconeParticipanteHtml(torneio, id, 'grande') + link + (venceu ? '<span class="selo">Vencedor</span>' : '') + '</div>';
  }
  document.getElementById('placarGrande').innerHTML =
    lado(partida.a) +
    '<div class="numeros-placar"><small>' + escaparHtml(nomeDaRodada(torneio, partida.rodada).toUpperCase()) + '</small>' +
      (finalizada ? partida.placarA + ' : ' + partida.placarB : 'VS') + '</div>' +
    lado(partida.b);

  // Detalhes
  const linhas = [
    ['Torneio', torneio.nome],
    ['Rodada', nomeDaRodada(torneio, partida.rodada)],
    ['Modo de jogo', torneio.modoDeJogo],
    ['Equipes', torneio.modo],
    ['Horário', formatarData(partida.data)]
  ];
  document.getElementById('detalhesPartida').innerHTML = linhas.map(function (l) {
    return '<div><dt>' + l[0] + '</dt><dd>' + escaparHtml(l[1]) + '</dd></div>';
  }).join('');

  // Formulário de resultado
  document.getElementById('caixaResultado').hidden = !podeEnviarResultado(partida);
  document.getElementById('rotuloPlacarA').textContent = nomeA;
  document.getElementById('rotuloPlacarB').textContent = nomeB;

  // Escolha do guerreiro (só para quem joga, enquanto a partida não terminou)
  mostrarEscolhaDeGuerreiro(partida);

  // Escalações (jogadores de cada lado + guerreiro escolhido nesta partida)
  const guerreiros = partida.guerreiros || {};
  function escalacao(id) {
    const jogadores = jogadoresDoParticipante(torneio, id).map(buscarJogador).filter(Boolean);
    const itens = jogadores.length ? jogadores.map(function (j) {
      const guerreiro = guerreiros[j.id] || (partida.status === 'finalizada' ? 'Não informado' : 'Escolhendo guerreiro...');
      return '<li>' + avatarHtml(j, 'pequeno') + '<div class="quem"><a href="perfil.html?id=' + j.id + '">' + escaparHtml(j.usuario) + '</a>' +
        '<small>' + escaparHtml(guerreiro) + '</small></div></li>';
    }).join('') : '<li class="vazio" style="color:var(--dim)">A definir</li>';
    return '<div><p class="rotulo" style="margin-bottom:10px">' + escaparHtml(nomeParticipante(torneio, id)) + '</p><ul class="lista-membros">' + itens + '</ul></div>';
  }
  document.getElementById('escalacoes').innerHTML = escalacao(partida.a) + escalacao(partida.b);

  mostrarChat(partida);
}

// Apelido de cada guerreiro (mostrado nos botões de escolha)
const APELIDO_GUERREIRO = {
  Secutor: 'O Escudo de Ferro',
  Retiarius: 'Sombra da Rede',
  Sagittarius: 'Vento de Aço',
  Dimachaerus: 'Fúria Gêmea'
};

function mostrarEscolhaDeGuerreiro(partida) {
  const caixa = document.getElementById('caixaGuerreiro');
  const podeEscolher = souJogadorDaPartida(partida) && partida.status === 'agendada';
  caixa.hidden = !podeEscolher;
  if (!podeEscolher) return;

  const eu = usuarioLogado();
  const escolhido = (partida.guerreiros || {})[eu.id] || '';
  // O jogo abre na página Jogar, já sabendo qual é a partida e o guerreiro
  document.getElementById('botaoAbrirJogo').href = 'jogar.html?partida=' + partida.id + '&iniciar=1';
  document.getElementById('opcoesGuerreiro').innerHTML = GUERREIROS.map(function (nome) {
    return '<label class="opcao"><input type="radio" name="guerreiro" value="' + nome + '"' + (nome === escolhido ? ' checked' : '') + '>' +
      '<span>' + nome + '<small>' + APELIDO_GUERREIRO[nome] + '</small></span></label>';
  }).join('');

  document.querySelectorAll('#opcoesGuerreiro input').forEach(function (opcao) {
    opcao.addEventListener('change', function () {
      if (avisarResultado(escolherGuerreiroNaPartida(idDaPartida, opcao.value), 'Você vai entrar na arena com ' + opcao.value + '!')) {
        mostrarPartida();
      }
    });
  });
}

function mostrarChat(partida) {
  const chat = document.getElementById('chat');
  if (!partida.chat.length) {
    chat.innerHTML = '<p style="font-size:.82rem; color:var(--dim)">Nenhuma mensagem ainda. Diga olá!</p>';
    return;
  }
  chat.innerHTML = partida.chat.map(function (m) {
    const autor = buscarJogador(m.jogadorId);
    return '<div class="mensagem">' + avatarHtml(autor, 'pequeno') +
      '<div class="balao"><small>' + escaparHtml(autor ? autor.usuario : '?') + ' · ' + tempoRelativo(m.data) + '</small>' + escaparHtml(m.texto) + '</div></div>';
  }).join('');
  chat.scrollTop = chat.scrollHeight;
}

document.getElementById('formResultado').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const a = document.getElementById('placarA').value;
  const b = document.getElementById('placarB').value;
  if (!confirm('Confirmar o resultado ' + a + ' x ' + b + '? Depois de enviado, ele não pode ser alterado.')) return;
  if (avisarResultado(registrarResultado(idDaPartida, a, b), 'Resultado registrado!')) {
    mostrarPartida();
    montarAreaDoUsuario(); // atualiza o sino de notificações
  }
});

document.getElementById('formChat').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const campo = document.getElementById('mensagemChat');
  const resultado = enviarMensagemNaPartida(idDaPartida, campo.value);
  if (!resultado.ok) { mostrarAviso(resultado.erro, 'erro'); return; }
  campo.value = '';
  mostrarChat(buscarPartida(idDaPartida));
});

mostrarPartida();
