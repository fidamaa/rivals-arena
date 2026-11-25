/* =====================================================================
   comum.js — FUNÇÕES USADAS EM TODAS AS PÁGINAS
   ---------------------------------------------------------------------
   - pequenas utilidades (formatar data, escapar texto, ler a URL...)
   - área de login no cabeçalho (botão Entrar ou menu do usuário)
   - menu do celular, botão "voltar ao topo", animação ao rolar
   - avisos rápidos na tela (mostrarAviso)
   Precisa ser carregado DEPOIS de dados.js e banco.js.
   ===================================================================== */


/* =========================== UTILIDADES =========================== */

// Evita que textos digitados pelo usuário virem HTML (segurança)
function escaparHtml(texto) {
  return String(texto == null ? '' : texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Lê um valor da URL. Ex.: torneio.html?id=tr1 -> parametroDaUrl('id') = 'tr1'
function parametroDaUrl(nome) {
  return new URLSearchParams(window.location.search).get(nome);
}

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

function doisDigitos(n) { return (n < 10 ? '0' : '') + n; }

// "sáb, 14 NOV · 20:00"
function formatarData(iso) {
  const d = new Date(iso);
  return DIAS[d.getDay()] + ', ' + d.getDate() + ' ' + MESES[d.getMonth()] + ' · ' + doisDigitos(d.getHours()) + ':' + doisDigitos(d.getMinutes());
}

// "14 NOV 2026"
function formatarDataCurta(iso) {
  const d = new Date(iso);
  return doisDigitos(d.getDate()) + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear();
}

// "há 5 min", "há 2 h", "há 3 dias"
function tempoRelativo(iso) {
  const minutos = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return 'há ' + minutos + ' min';
  const horas = Math.round(minutos / 60);
  if (horas < 24) return 'há ' + horas + ' h';
  const dias = Math.round(horas / 24);
  return 'há ' + dias + (dias === 1 ? ' dia' : ' dias');
}

function formatarNumero(n) {
  return Number(n || 0).toLocaleString('pt-BR');
}

// Bolinha com as iniciais do jogador
function avatarHtml(jogador, classeExtra) {
  if (!jogador) return '<span class="avatar ' + (classeExtra || '') + '">?</span>';
  const iniciais = jogador.usuario.slice(0, 2).toUpperCase();
  return '<span class="avatar ' + (classeExtra || '') + '" style="background:' + escaparHtml(jogador.cor) + '">' + escaparHtml(iniciais) + '</span>';
}

// Quadradinho com a TAG do time
function escudoHtml(time, classeExtra) {
  if (!time) return '<span class="escudo ' + (classeExtra || '') + '">?</span>';
  return '<span class="escudo ' + (classeExtra || '') + '" style="border-color:' + escaparHtml(time.cor) + ';color:' + escaparHtml(time.cor) + '">' + escaparHtml(time.tag) + '</span>';
}

// Avatar do jogador OU escudo do time, conforme o torneio
function iconeParticipanteHtml(torneio, id, classeExtra) {
  if (!id) return '<span class="avatar vazio ' + (classeExtra || '') + '">?</span>';
  return ehTorneioDeTimes(torneio) ? escudoHtml(buscarTime(id), classeExtra) : avatarHtml(buscarJogador(id), classeExtra);
}

// Se ninguém estiver logado, manda para a tela de login e depois volta
function exigirLogin() {
  const eu = usuarioLogado();
  if (!eu) {
    const voltar = encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search + window.location.hash);
    window.location.href = 'entrar.html?voltar=' + voltar;
  }
  return eu;
}


/* =========================== PEDAÇOS DE HTML REUTILIZADOS =========================== */

// Cartão de um torneio (usado na lista de torneios, home, painel e perfil)
function cartaoTorneioHtml(torneio) {
  const ocupadas = torneio.participantes.length;
  const porcentagem = Math.min(100, Math.round(ocupadas / torneio.vagas * 100));
  const tipo = ehTorneioDeTimes(torneio) ? 'equipes' : 'jogadores';
  return `
    <a class="cartao-torneio" href="torneio.html?id=${torneio.id}">
      <div class="arte arte-${torneio.arte}">
        <span class="pilula ${classeStatusTorneio(torneio)}">${textoStatusTorneio(torneio)}</span>
        <span class="modo">${escaparHtml(torneio.modo)}</span>
      </div>
      <div class="corpo">
        <h3>${escaparHtml(torneio.nome)}</h3>
        <span class="meta">${escaparHtml(torneio.modoDeJogo)} · ${textoFormato(torneio)} · ${escaparHtml(torneio.regiao)}</span>
        <div class="barra-vagas">
          <span>${ocupadas} / ${torneio.vagas} ${tipo}</span>
          <div class="trilho"><div class="preenchido" style="width:${porcentagem}%"></div></div>
        </div>
        <div class="rodape-cartao">
          <span>${formatarData(torneio.inicio)}</span>
          <span class="premio">${escaparHtml(torneio.premio)}</span>
        </div>
      </div>
    </a>`;
}

// Uma linha com "Time A  2 : 1  Time B" (usada em listas de partidas)
function linhaPartidaHtml(partida) {
  const torneio = buscarTorneio(partida.torneioId);
  const status = statusDaPartida(partida);
  const placar = partida.status === 'finalizada' ? partida.placarA + ' : ' + partida.placarB : 'VS';
  const venceuA = partida.vencedor && partida.vencedor === partida.a ? 'vencedor' : '';
  const venceuB = partida.vencedor && partida.vencedor === partida.b ? 'vencedor' : '';
  return `
    <a class="linha-partida" href="partida.html?id=${partida.id}">
      <div class="quando"><b>${escaparHtml(torneio.nome)}</b>${nomeDaRodada(torneio, partida.rodada)} · ${formatarData(partida.data)}</div>
      <div class="lado ${venceuA}">${iconeParticipanteHtml(torneio, partida.a, 'pequeno')}<span>${escaparHtml(nomeParticipante(torneio, partida.a))}</span></div>
      <div class="placar-central">${placar}<small>${escaparHtml(torneio.modo)}</small></div>
      <div class="lado direita ${venceuB}">${iconeParticipanteHtml(torneio, partida.b, 'pequeno')}<span>${escaparHtml(nomeParticipante(torneio, partida.b))}</span></div>
      <div class="status-coluna"><span class="pilula ${status.classe}">${status.texto}</span></div>
    </a>`;
}

// Cartão de notícia (página inicial, novidades e notícia)
function cartaoNoticiaHtml(noticia) {
  return `
    <a class="cartao-noticia" href="noticia.html?id=${noticia.id}">
      <div class="arte arte-${noticia.arte}"></div>
      <div class="corpo">
        <span class="badge">${escaparHtml(noticia.categoria)}</span>
        <span class="news-date">${formatarDataCurta(noticia.data)}</span>
        <h3>${escaparHtml(noticia.titulo)}</h3>
        <p>${escaparHtml(noticia.resumo)}</p>
        <span class="news-link">LER MAIS</span>
      </div>
    </a>`;
}

// Mostra uma lista de itens ou uma mensagem de "vazio"
function preencherLista(elemento, itens, funcaoHtml, textoVazio) {
  if (!elemento) return;
  if (!itens.length) {
    elemento.innerHTML = '<div class="vazio-estado">' + textoVazio + '</div>';
  } else {
    elemento.innerHTML = itens.map(funcaoHtml).join('');
  }
}

/* =========================== ABAS =========================== */
/* HTML esperado:
     <div class="abas" id="minhasAbas">
       <button data-aba="visao">Visão</button> ...
     </div>
     <div class="aba-conteudo" id="aba-visao">...</div>
   O endereço com #nome-da-aba (ex.: torneio.html?id=tr1#chaveamento)
   abre a aba direto. */
function ativarAbas(idDasAbas, aoTrocar) {
  const abas = document.getElementById(idDasAbas);
  if (!abas) return;
  const botoes = abas.querySelectorAll('[data-aba]');

  function abrir(nome) {
    let achou = false;
    botoes.forEach(function (b) {
      const ativa = b.getAttribute('data-aba') === nome;
      b.classList.toggle('ativa', ativa);
      if (ativa) achou = true;
      const conteudo = document.getElementById('aba-' + b.getAttribute('data-aba'));
      if (conteudo) conteudo.classList.toggle('ativa', ativa);
    });
    if (achou && aoTrocar) aoTrocar(nome);
    return achou;
  }

  botoes.forEach(function (b) {
    b.addEventListener('click', function () {
      abrir(b.getAttribute('data-aba'));
      history.replaceState(null, '', '#' + b.getAttribute('data-aba'));
    });
  });

  // Links que mandam abrir uma aba: <a data-ir-aba="chaveamento">
  document.querySelectorAll('[data-ir-aba]').forEach(function (link) {
    link.addEventListener('click', function (evento) {
      evento.preventDefault();
      abrir(link.getAttribute('data-ir-aba'));
      abas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (window.location.hash) abrir(window.location.hash.slice(1));
  return abrir;
}


/* =========================== AVISOS NA TELA =========================== */

// tipo: 'sucesso' | 'erro' | 'info'
function mostrarAviso(texto, tipo) {
  let caixa = document.getElementById('caixaDeAvisos');
  if (!caixa) {
    caixa = document.createElement('div');
    caixa.id = 'caixaDeAvisos';
    caixa.setAttribute('role', 'status');
    caixa.setAttribute('aria-live', 'polite');
    document.body.appendChild(caixa);
  }
  const aviso = document.createElement('div');
  aviso.className = 'aviso ' + (tipo || 'info');
  aviso.textContent = texto;
  caixa.appendChild(aviso);
  setTimeout(function () { aviso.classList.add('saindo'); }, 3500);
  setTimeout(function () { aviso.remove(); }, 4000);
}

// Mostra o resultado de uma função do banco.js ({ ok, erro })
function avisarResultado(resultado, textoDeSucesso) {
  if (resultado.ok) mostrarAviso(textoDeSucesso, 'sucesso');
  else mostrarAviso(resultado.erro, 'erro');
  return resultado.ok;
}


/* =========================== CABEÇALHO =========================== */

const ICONE_SINO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>';

function montarAreaDoUsuario() {
  const area = document.getElementById('areaUsuario');
  if (!area) return;
  const eu = usuarioLogado();

  if (!eu) {
    area.innerHTML =
      '<a class="btn btn-ghost btn-sm" href="entrar.html">ENTRAR</a>' +
      '<a class="btn btn-primary btn-sm esconder-celular" href="entrar.html#cadastro">CRIAR CONTA</a>';
    return;
  }

  const naoLidas = notificacoesDoUsuario().filter(function (n) { return !n.lida; }).length;

  area.innerHTML =
    // Sino de notificações
    '<div class="menu-suspenso" id="menuNotificacoes">' +
      '<button class="botao-icone" type="button" aria-label="Notificações" data-abrir-menu>' + ICONE_SINO +
        (naoLidas ? '<span class="contador">' + naoLidas + '</span>' : '') +
      '</button>' +
      '<div class="menu-suspenso-caixa largo">' +
        '<div class="menu-suspenso-topo"><b>Notificações</b><button type="button" class="link-simples" id="marcarLidas">Marcar como lidas</button></div>' +
        '<ul class="lista-notificacoes" id="listaNotificacoes"></ul>' +
      '</div>' +
    '</div>' +
    // Menu do usuário
    '<div class="menu-suspenso" id="menuUsuario">' +
      '<button class="botao-usuario" type="button" data-abrir-menu>' + avatarHtml(eu) +
        '<span class="esconder-celular">' + escaparHtml(eu.usuario) + '</span></button>' +
      '<div class="menu-suspenso-caixa">' +
        '<a href="painel.html">Meu painel</a>' +
        '<a href="perfil.html?id=' + eu.id + '">Meu perfil</a>' +
        '<a href="criar-torneio.html">Criar torneio</a>' +
        '<a href="times.html#meus-times">Meus times</a>' +
        '<a href="configuracoes.html">Configurações</a>' +
        '<button type="button" id="botaoSair">Sair</button>' +
      '</div>' +
    '</div>';

  // Lista de notificações
  const lista = document.getElementById('listaNotificacoes');
  const notificacoes = notificacoesDoUsuario().slice(0, 8);
  if (!notificacoes.length) {
    lista.innerHTML = '<li class="vazio">Nenhuma notificação por enquanto.</li>';
  } else {
    lista.innerHTML = notificacoes.map(function (n) {
      return '<li class="' + (n.lida ? '' : 'nao-lida') + '"><a href="' + escaparHtml(n.link || 'painel.html') + '">' +
        escaparHtml(n.texto) + '<small>' + tempoRelativo(n.data) + '</small></a></li>';
    }).join('');
  }

  document.getElementById('marcarLidas').addEventListener('click', function () {
    marcarNotificacoesComoLidas();
    montarAreaDoUsuario();
  });

  document.getElementById('botaoSair').addEventListener('click', function () {
    sair();
    window.location.href = 'index.html';
  });

  // Abrir/fechar os menus suspensos
  area.querySelectorAll('[data-abrir-menu]').forEach(function (botao) {
    botao.addEventListener('click', function (evento) {
      evento.stopPropagation();
      const menu = botao.closest('.menu-suspenso');
      const estavaAberto = menu.classList.contains('aberto');
      fecharMenusSuspensos();
      if (!estavaAberto) menu.classList.add('aberto');
    });
  });
}

function fecharMenusSuspensos() {
  document.querySelectorAll('.menu-suspenso.aberto').forEach(function (m) { m.classList.remove('aberto'); });
}

// Clicar fora fecha os menus
document.addEventListener('click', function (evento) {
  if (!evento.target.closest('.menu-suspenso-caixa')) fecharMenusSuspensos();
});


/* =========================== INICIALIZAÇÃO =========================== */

function iniciarPaginaComum() {
  montarAreaDoUsuario();

  // Sombra no cabeçalho ao rolar
  const cabecalho = document.getElementById('siteHeader');
  function aoRolar() {
    if (cabecalho) cabecalho.classList.toggle('scrolled', window.scrollY > 8);
    const botaoTopo = document.getElementById('backToTop');
    if (botaoTopo) botaoTopo.classList.toggle('show', window.scrollY > 600);
  }
  document.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  // Menu do celular
  const botaoMenu = document.getElementById('burgerBtn');
  const menuCelular = document.getElementById('mobileMenu');
  if (botaoMenu && menuCelular) {
    botaoMenu.addEventListener('click', function () {
      const aberto = menuCelular.classList.toggle('open');
      botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
  }

  // Botão voltar ao topo
  const botaoTopo = document.getElementById('backToTop');
  if (botaoTopo) {
    botaoTopo.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Links de redes sociais que ainda não existem
  document.querySelectorAll('[data-em-breve]').forEach(function (link) {
    link.addEventListener('click', function (evento) {
      evento.preventDefault();
      mostrarAviso(link.getAttribute('data-em-breve') || 'Em breve!', 'info');
    });
  });

  ativarAnimacaoAoRolar();
}

// Elementos com a classe "reveal" aparecem suavemente ao rolar a página
function ativarAnimacaoAoRolar() {
  const itens = document.querySelectorAll('.reveal:not(.in)');
  const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (semAnimacao || !('IntersectionObserver' in window)) {
    itens.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('in');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });
  itens.forEach(function (el) { observador.observe(el); });
}

iniciarPaginaComum();
