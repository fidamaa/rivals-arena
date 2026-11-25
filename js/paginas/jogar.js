/* =====================================================================
   jogar.js — página jogar.html
   Coloca o Bellator (Unity WebGL do itch.io) dentro do site e faz a
   "conversa" entre o site e o jogo usando window.postMessage:

   SITE -> JOGO  (quando o jogo avisa que está pronto)
     { origem: 'rivals-arena', tipo: 'jogador', usuario, guerreiro, partidaId }

   JOGO -> SITE
     { origem: 'bellator', tipo: 'pronto' }                    o jogo abriu
     { origem: 'bellator', tipo: 'resultado', modo, ondas,     a partida
       pontos, venceu, guerreiro, duracaoSegundos }            terminou

   O lado do jogo está pronto na pasta integracao-unity/ (para colar no
   projeto Unity). Enquanto a build publicada não tiver esse código, o jogo
   funciona normalmente, mas não envia resultados.

   Camadas: este site > iframe do itch.io (embed) > iframe do jogo.
   Por isso o jogo fala com "window.top" (este site) e o site fala com
   o "frame de dentro" do embed.
   ===================================================================== */

const telaJogo = document.getElementById('telaJogo');
const ENDERECO_DO_JOGO = telaJogo.getAttribute('data-endereco-do-jogo');
const ORIGEM_DO_JOGO = 'https://html-classic.itch.zone'; // onde o itch.io hospeda o jogo: só aceitamos mensagens daqui
const CHAVE_RESULTADO_PENDENTE = 'bellator_resultado_pendente';

let janelaDoJogo = null;      // o <iframe> do jogo (criado ao clicar em Jogar)
let jogoConectado = false;    // vira true quando o jogo manda { tipo: 'pronto' }

// Partida da Rivals Arena ligada a esta sessão de jogo (jogar.html?partida=...)
const partidaVinculada = buscarPartida(parametroDaUrl('partida'));


/* ---------------- Carregar o jogo ---------------- */
// Celular ou tablet (tela de toque)?
const ehCelular = window.matchMedia('(pointer: coarse)').matches;

function carregarJogo() {
  if (janelaDoJogo) return;
  janelaDoJogo = document.createElement('iframe');
  janelaDoJogo.src = ENDERECO_DO_JOGO;
  janelaDoJogo.title = 'Bellator';
  janelaDoJogo.setAttribute('allow', 'autoplay; fullscreen *; gamepad');
  document.getElementById('capaJogo').remove();   // tira a capa e coloca o jogo no lugar
  telaJogo.appendChild(janelaDoJogo);
  mostrarStatus('Carregando o jogo... (pode demorar na primeira vez)', '');

  // Se depois de 40 segundos o jogo não se apresentou, ele está rodando,
  // mas a versão publicada ainda não tem o código de integração.
  setTimeout(function () {
    if (!jogoConectado) {
      mostrarStatus('O jogo está rodando, mas esta versão ainda não envia resultados ao site (veja integracao-unity/LEIA-ME.md).', 'aviso');
    }
  }, 40000);
}

/* Tela cheia:
   1) tenta a tela cheia de verdade do navegador e, no celular, deitar a tela;
   2) se o navegador não deixar (ex.: iPhone), usa a classe .tela-cheia,
      que estica o jogo por cima da página inteira. */
function entrarEmTelaCheia() {
  if (telaJogo.requestFullscreen) {
    telaJogo.requestFullscreen().then(function () {
      if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function () {});
    }).catch(function () {
      telaJogo.classList.add('tela-cheia');
    });
  } else {
    telaJogo.classList.add('tela-cheia');
  }
}

function sairDaTelaCheia() {
  telaJogo.classList.remove('tela-cheia');
  if (document.fullscreenElement) document.exitFullscreen();
}

document.getElementById('botaoJogar').addEventListener('click', function () {
  carregarJogo();
  if (ehCelular) entrarEmTelaCheia();   // no celular o jogo já abre ocupando a tela toda
});

document.getElementById('botaoTelaCheia').addEventListener('click', function () {
  carregarJogo();
  entrarEmTelaCheia();
});

document.getElementById('botaoSairTelaCheia').addEventListener('click', sairDaTelaCheia);

// Abre direto se veio de uma partida (jogar.html?partida=...&iniciar=1)
if (parametroDaUrl('iniciar')) carregarJogo();

function mostrarStatus(texto, tipo) {
  const status = document.getElementById('statusIntegracao');
  status.textContent = texto;
  status.className = 'status-integracao ' + (tipo || '');
}


/* ---------------- Site -> Jogo ---------------- */
function enviarDadosParaOJogo() {
  if (!janelaDoJogo) return;
  const eu = usuarioLogado();
  let guerreiro = eu ? eu.guerreiro : '';
  if (partidaVinculada && eu && partidaVinculada.guerreiros && partidaVinculada.guerreiros[eu.id]) {
    guerreiro = partidaVinculada.guerreiros[eu.id];
  }
  // O jogo é o primeiro frame dentro do embed do itch.io
  const janelaInterna = janelaDoJogo.contentWindow.frames[0] || janelaDoJogo.contentWindow;
  janelaInterna.postMessage({
    origem: 'rivals-arena',
    tipo: 'jogador',
    usuario: eu ? eu.usuario : '',
    guerreiro: guerreiro || '',
    partidaId: partidaVinculada ? partidaVinculada.id : ''
  }, ORIGEM_DO_JOGO);
}


/* ---------------- Jogo -> Site ---------------- */
window.addEventListener('message', function (evento) {
  // Segurança: ignoramos mensagens que não vieram do jogo
  if (evento.origin !== ORIGEM_DO_JOGO) return;
  const dados = evento.data;
  if (!dados || dados.origem !== 'bellator') return;
  receberMensagemDoJogo(dados);
});

function receberMensagemDoJogo(dados) {
  if (dados.tipo === 'pronto') {
    jogoConectado = true;
    mostrarStatus('Integração com o site: conectado ✓ — seus resultados serão salvos automaticamente.', 'ok');
    enviarDadosParaOJogo();
    return;
  }

  if (dados.tipo === 'resultado') {
    const resultado = {
      modo: dados.modo,
      ondas: dados.ondas,
      pontos: dados.pontos,
      venceu: dados.venceu,
      guerreiro: dados.guerreiro,
      duracaoSegundos: dados.duracaoSegundos,
      partidaId: partidaVinculada ? partidaVinculada.id : ''
    };

    if (!usuarioLogado()) {
      // Guarda para salvar depois que a pessoa entrar na conta
      localStorage.setItem(CHAVE_RESULTADO_PENDENTE, JSON.stringify(resultado));
      mostrarAviso('Fim de partida! Entre na sua conta para salvar esse resultado no ranking.', 'info');
      mostrarPainelDoJogador();
      return;
    }
    salvarResultado(resultado);
  }
}

function salvarResultado(resultado) {
  const retorno = registrarResultadoDoJogo(resultado);
  if (!retorno.ok) { mostrarAviso(retorno.erro, 'erro'); return; }
  const texto = retorno.resultado.ondas + ' ondas · ' + formatarNumero(retorno.resultado.pontos) + ' pontos';
  mostrarAviso((retorno.novoRecorde ? 'NOVO RECORDE! ' : 'Resultado salvo: ') + texto, 'sucesso');
  montarAreaDoUsuario();   // atualiza o sino de notificações
  mostrarListas();
}

// Resultado que ficou guardado enquanto a pessoa não estava logada
const pendente = localStorage.getItem(CHAVE_RESULTADO_PENDENTE);
if (pendente && usuarioLogado()) {
  localStorage.removeItem(CHAVE_RESULTADO_PENDENTE);
  try { salvarResultado(JSON.parse(pendente)); } catch (e) { /* ignora dado estragado */ }
}


/* ---------------- Painéis da página ---------------- */
function mostrarPainelDoJogador() {
  const caixa = document.getElementById('caixaJogador');
  const eu = usuarioLogado();
  if (!eu) {
    const temPendente = !!localStorage.getItem(CHAVE_RESULTADO_PENDENTE);
    caixa.innerHTML = '<h3>Jogando como visitante</h3>' +
      '<p style="font-size:.85rem; margin-bottom:14px">' + (temPendente ? 'Você tem um resultado esperando para ser salvo! ' : '') +
      'Entre na sua conta para seus resultados irem para o ranking.</p>' +
      '<a class="btn btn-primary btn-bloco" href="entrar.html?voltar=' + encodeURIComponent('jogar.html' + window.location.search) + '">ENTRAR</a>';
    return;
  }
  const recorde = recordeDoJogador(eu.id, 'infinito');
  caixa.innerHTML = '<h3>Jogando como</h3>' +
    '<div class="celula-nome" style="margin-bottom:12px">' + avatarHtml(eu, 'medio') +
    '<div><a href="perfil.html?id=' + eu.id + '">' + escaparHtml(eu.usuario) + '</a><small>' + escaparHtml(eu.guerreiro || 'Sem guerreiro ainda') + '</small></div></div>' +
    '<dl class="lista-info"><div><dt>Recorde (ondas infinitas)</dt><dd>' + (recorde ? recorde.ondas + ' ondas' : '—') + '</dd></div>' +
    '<div><dt>Partidas jogadas no Bellator</dt><dd>' + resultadosDoJogador(eu.id).length + '</dd></div></dl>';
}

function mostrarPartidaVinculada() {
  const caixa = document.getElementById('partidaVinculada');
  if (!partidaVinculada) return;
  const torneio = buscarTorneio(partidaVinculada.torneioId);
  const eu = usuarioLogado();
  const guerreiro = eu && partidaVinculada.guerreiros ? partidaVinculada.guerreiros[eu.id] : '';
  caixa.hidden = false;
  caixa.innerHTML =
    '<div><p class="eyebrow" style="margin-bottom:4px">PARTIDA DA RIVALS ARENA</p>' +
    '<b>' + escaparHtml(nomeParticipante(torneio, partidaVinculada.a)) + ' vs ' + escaparHtml(nomeParticipante(torneio, partidaVinculada.b)) + '</b>' +
    '<small>' + escaparHtml(torneio.nome) + ' · ' + nomeDaRodada(torneio, partidaVinculada.rodada) +
    (guerreiro ? ' · seu guerreiro: ' + escaparHtml(guerreiro) : '') + '</small></div>' +
    '<a class="btn btn-ghost btn-sm" href="partida.html?id=' + partidaVinculada.id + '">VOLTAR E ENVIAR O PLACAR</a>';
}

function mostrarListas() {
  const eu = usuarioLogado();

  const meus = eu ? resultadosDoJogador(eu.id).slice(0, 8) : [];
  document.getElementById('meusResultados').innerHTML = !eu
    ? '<p style="font-size:.85rem">Entre na sua conta para ver seus resultados.</p>'
    : (meus.length ? '<ul class="lista-simples">' + meus.map(function (r) {
        return '<li><span><b style="color:#fff">' + MODOS_DO_JOGO[r.modo] + '</b><small>' + tempoRelativo(r.data) +
          (r.guerreiro ? ' · ' + escaparHtml(r.guerreiro) : '') + (r.venceu ? ' · vitória' : '') + '</small></span>' +
          '<span style="text-align:right; color:var(--gold); font-weight:700">' + r.ondas + ' ondas<small>' + formatarNumero(r.pontos) + ' pts</small></span></li>';
      }).join('') + '</ul>'
      : '<p style="font-size:.85rem">Nenhum resultado ainda. Jogue uma partida!</p>');

  document.getElementById('rankingInfinito').innerHTML = itensRankingDoJogo('infinito', 8);
  document.getElementById('rankingSobrevivencia').innerHTML = itensRankingDoJogo('sobrevivencia', 5);
  mostrarPainelDoJogador();
}

// Itens <li> do ranking do jogo (melhor resultado de cada jogador)
function itensRankingDoJogo(modo, quantidade) {
  const eu = usuarioLogado();
  const lista = rankingDoJogo(modo).slice(0, quantidade);
  if (!lista.length) return '<li class="vazio">Ninguém jogou este modo ainda.</li>';
  return lista.map(function (r, i) {
    const j = buscarJogador(r.jogadorId);
    return '<li' + (eu && eu.id === j.id ? ' class="eu"' : '') + '><span class="pos">' + (i + 1) + '</span>' + avatarHtml(j, 'pequeno') +
      '<a href="perfil.html?id=' + j.id + '">' + escaparHtml(j.usuario) + '</a>' +
      '<span class="pts">' + r.ondas + ' ondas</span></li>';
  }).join('');
}


/* ---------------- Teste da integração ---------------- */
document.getElementById('botaoTeste').addEventListener('click', function () {
  const ondas = parseInt(document.getElementById('testeOndas').value, 10) || 0;
  const modo = document.getElementById('testeModo').value;
  // Mesma mensagem que o jogo manda de verdade
  receberMensagemDoJogo({
    origem: 'bellator',
    tipo: 'resultado',
    modo: modo,
    ondas: modo === 'sobrevivencia' ? Math.min(ondas, 5) : ondas,
    pontos: ondas * 150,
    venceu: modo === 'sobrevivencia' && ondas >= 5,
    guerreiro: '',
    duracaoSegundos: ondas * 45
  });
});


mostrarPartidaVinculada();
mostrarListas();
