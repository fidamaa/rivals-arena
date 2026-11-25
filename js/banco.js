/* =====================================================================
   banco.js — "BANCO DE DADOS" E REGRAS DA RIVALS ARENA
   ---------------------------------------------------------------------
   Como o site ainda não tem servidor, guardamos tudo no localStorage
   do navegador, dentro de um único objeto chamado `banco`:

     banco.jogadores      lista de jogadores (contas)
     banco.times          lista de times
     banco.torneios       lista de torneios
     banco.partidas       lista de partidas (criadas ao iniciar um torneio)
     banco.noticias       lista de novidades
     banco.notificacoes   avisos para cada jogador
     banco.chamados       mensagens enviadas ao suporte

   Regra de ouro: sempre que mudar algo no `banco`, chame salvarBanco().

   Este arquivo NÃO mexe no HTML. Ele só lê/grava dados e aplica as
   regras (inscrição, chaveamento, resultados, ranking...).
   Precisa ser carregado DEPOIS de dados.js.
   ===================================================================== */

const CHAVE_BANCO = 'rivals_arena_banco_v4'; // mude o número para recriar os dados de exemplo em todos os navegadores
const CHAVE_SESSAO = 'rivals_arena_sessao';

// Pontos ganhos/perdidos no ranking
const PONTOS_VITORIA = 25;
const PONTOS_DERROTA = 15;
const PONTOS_CAMPEAO = 100;
const MAXIMO_MEMBROS_TIME = 6;

const GUERREIROS = ['Secutor', 'Retiarius', 'Sagittarius', 'Dimachaerus'];
const MODOS_DE_JOGO = ['Mata-Mata', 'Estandarte do Império', 'Fuga do Coliseu'];

let banco = null;
banco = carregarBanco();


/* =========================== BÁSICO =========================== */

function carregarBanco() {
  try {
    const texto = localStorage.getItem(CHAVE_BANCO);
    if (texto) return JSON.parse(texto);
  } catch (erro) {
    console.warn('Não foi possível ler o banco salvo. Criando um novo.', erro);
  }
  return criarBancoInicial();
}

function salvarBanco() {
  try {
    localStorage.setItem(CHAVE_BANCO, JSON.stringify(banco));
  } catch (erro) {
    console.warn('Não foi possível salvar no navegador.', erro);
  }
}

// Copia os DADOS_INICIAIS (dados.js) e prepara os torneios de exemplo.
function criarBancoInicial() {
  banco = JSON.parse(JSON.stringify(DADOS_INICIAIS));

  banco.jogadores.forEach(function (j) {
    j.email = j.usuario.toLowerCase() + '@exemplo.com';
    j.senha = '';            // contas de exemplo não têm senha (use "conta de demonstração")
    j.titulos = 0;
    j.criadoEm = daqui(-60, 0);
  });
  banco.times.forEach(function (t) {
    t.titulos = 0;
    t.criadoEm = daqui(-40, 0);
  });

  // Alguns torneios de exemplo já começam "em andamento" ou "finalizados".
  banco.torneios.forEach(function (t) {
    t.vencedor = null;
    t.criadoEm = daqui(-20, 0);
    if (t.iniciarDemo) {
      iniciarTorneio(t.id, true);
      (t.resultadosDemo || []).forEach(function (placar) {
        const partida = proximaPartidaJogavel(t.id);
        if (partida) registrarResultado(partida.id, placar[0], placar[1], true);
      });
    }
    delete t.iniciarDemo;
    delete t.resultadosDemo;
  });

  salvarBanco();
  return banco;
}

function restaurarDadosDeExemplo() {
  localStorage.removeItem(CHAVE_BANCO);
  localStorage.removeItem(CHAVE_SESSAO);
  banco = criarBancoInicial();
}

// Cria um id único, ex.: gerarId('tr') -> "tr-lq2k9x"
function gerarId(prefixo) {
  return prefixo + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}


/* =========================== BUSCAS =========================== */

function buscarJogador(id) { return banco.jogadores.find(function (j) { return j.id === id; }) || null; }
function buscarTime(id)    { return banco.times.find(function (t) { return t.id === id; }) || null; }
function buscarTorneio(id) { return banco.torneios.find(function (t) { return t.id === id; }) || null; }
function buscarPartida(id) { return banco.partidas.find(function (p) { return p.id === id; }) || null; }
function buscarNoticia(id) { return banco.noticias.find(function (n) { return n.id === id; }) || null; }

function buscarJogadorPorUsuario(usuario) {
  const procurado = String(usuario || '').trim().toLowerCase();
  return banco.jogadores.find(function (j) {
    return j.usuario.toLowerCase() === procurado || (j.email && j.email.toLowerCase() === procurado);
  }) || null;
}

// Times dos quais o jogador faz parte
function timesDoJogador(jogadorId) {
  return banco.times.filter(function (t) { return t.membros.indexOf(jogadorId) !== -1; });
}

function partidasDoTorneio(torneioId) {
  return banco.partidas
    .filter(function (p) { return p.torneioId === torneioId; })
    .sort(function (a, b) { return a.rodada - b.rodada || a.ordem - b.ordem; });
}


/* =========================== LOGIN =========================== */

// ATENÇÃO: isto é só uma demonstração sem servidor.
// Num site real, a senha seria verificada no back-end, nunca no navegador.
function resumirSenha(senha) {
  let resultado = 0;
  for (let i = 0; i < senha.length; i++) {
    resultado = (resultado * 31 + senha.charCodeAt(i)) | 0;
  }
  return 'h' + resultado.toString(16);
}

function usuarioLogado() {
  const id = localStorage.getItem(CHAVE_SESSAO);
  return id ? buscarJogador(id) : null;
}

function entrar(usuarioOuEmail, senha) {
  const jogador = buscarJogadorPorUsuario(usuarioOuEmail);
  if (!jogador) return { ok: false, erro: 'Usuário ou e-mail não encontrado.' };
  if (!jogador.senha) return { ok: false, erro: 'Esta é uma conta de exemplo. Use "Entrar com conta de demonstração".' };
  if (jogador.senha !== resumirSenha(senha)) return { ok: false, erro: 'Senha incorreta.' };
  localStorage.setItem(CHAVE_SESSAO, jogador.id);
  return { ok: true, jogador: jogador };
}

// Entra com a conta de exemplo "Cadu" (organizador e capitão de time).
function entrarComoDemo() {
  localStorage.setItem(CHAVE_SESSAO, 'j2');
  return buscarJogador('j2');
}

function sair() {
  localStorage.removeItem(CHAVE_SESSAO);
}

function cadastrar(dados) {
  const usuario = String(dados.usuario || '').trim();
  const email = String(dados.email || '').trim().toLowerCase();

  if (usuario.length < 3) return { ok: false, erro: 'O nome de usuário precisa ter pelo menos 3 letras.' };
  if (!/^[A-Za-z0-9_.]+$/.test(usuario)) return { ok: false, erro: 'Use só letras, números, ponto ou _ no nome de usuário.' };
  if (email.indexOf('@') === -1) return { ok: false, erro: 'Digite um e-mail válido.' };
  if (String(dados.senha || '').length < 6) return { ok: false, erro: 'A senha precisa ter pelo menos 6 caracteres.' };
  if (buscarJogadorPorUsuario(usuario)) return { ok: false, erro: 'Esse nome de usuário já existe.' };
  if (buscarJogadorPorUsuario(email)) return { ok: false, erro: 'Esse e-mail já está cadastrado.' };

  const cores = ['#e14036', '#f97b2e', '#eccc7e', '#c2410c', '#b91c1c', '#d97706'];
  const jogador = {
    id: gerarId('j'),
    usuario: usuario,
    nome: String(dados.nome || usuario).trim(),
    email: email,
    senha: resumirSenha(dados.senha),
    guerreiro: '',   // preenchido quando o jogador escolhe um guerreiro numa partida
    pontos: 1000,
    vitorias: 0,
    derrotas: 0,
    titulos: 0,
    bio: '',
    cor: cores[Math.floor(Math.random() * cores.length)],
    criadoEm: new Date().toISOString()
  };
  banco.jogadores.push(jogador);
  localStorage.setItem(CHAVE_SESSAO, jogador.id);
  notificar(jogador.id, 'Bem-vindo(a) à Rivals Arena! Encontre um torneio e inscreva-se para a sua primeira partida.', 'torneios.html?status=inscricoes');
  salvarBanco();
  return { ok: true, jogador: jogador };
}

function atualizarPerfil(dados) {
  const eu = usuarioLogado();
  if (!eu) return { ok: false, erro: 'Entre na sua conta primeiro.' };
  const email = String(dados.email || '').trim().toLowerCase();
  if (email && email.indexOf('@') === -1) return { ok: false, erro: 'Digite um e-mail válido.' };
  const dono = email ? buscarJogadorPorUsuario(email) : null;
  if (dono && dono.id !== eu.id) return { ok: false, erro: 'Esse e-mail já está em uso.' };

  eu.nome = String(dados.nome || eu.usuario).trim();
  eu.bio = String(dados.bio || '').trim().slice(0, 200);
  eu.cor = dados.cor || eu.cor;
  if (email) eu.email = email;
  if (dados.novaSenha) {
    if (dados.novaSenha.length < 6) return { ok: false, erro: 'A nova senha precisa ter pelo menos 6 caracteres.' };
    eu.senha = resumirSenha(dados.novaSenha);
  }
  salvarBanco();
  return { ok: true };
}

/* Escolha do guerreiro: acontece DENTRO da partida, antes de jogar.
   Fica salvo em partida.guerreiros = { idDoJogador: 'Secutor', ... }
   e o perfil do jogador guarda o último guerreiro usado. */
function souJogadorDaPartida(partida) {
  const eu = usuarioLogado();
  if (!eu) return false;
  const torneio = buscarTorneio(partida.torneioId);
  const jogadores = jogadoresDoParticipante(torneio, partida.a).concat(jogadoresDoParticipante(torneio, partida.b));
  return jogadores.indexOf(eu.id) !== -1;
}

function escolherGuerreiroNaPartida(partidaId, nomeDoGuerreiro) {
  const eu = usuarioLogado();
  const partida = buscarPartida(partidaId);
  if (!eu || !partida) return { ok: false, erro: 'Entre na sua conta primeiro.' };
  if (!souJogadorDaPartida(partida)) return { ok: false, erro: 'Só quem joga a partida escolhe guerreiro.' };
  if (partida.status !== 'agendada') return { ok: false, erro: 'Esta partida já foi encerrada.' };
  if (GUERREIROS.indexOf(nomeDoGuerreiro) === -1) return { ok: false, erro: 'Guerreiro inválido.' };
  if (!partida.guerreiros) partida.guerreiros = {};
  partida.guerreiros[eu.id] = nomeDoGuerreiro;
  eu.guerreiro = nomeDoGuerreiro; // último guerreiro usado (aparece no perfil)
  salvarBanco();
  return { ok: true };
}


/* =========================== NOTIFICAÇÕES =========================== */

function notificar(jogadorId, texto, link) {
  banco.notificacoes.unshift({
    id: gerarId('nt'),
    jogadorId: jogadorId,
    texto: texto,
    link: link || '',
    lida: false,
    data: new Date().toISOString()
  });
}

function notificacoesDoUsuario() {
  const eu = usuarioLogado();
  if (!eu) return [];
  return banco.notificacoes.filter(function (n) { return n.jogadorId === eu.id; });
}

function marcarNotificacoesComoLidas() {
  notificacoesDoUsuario().forEach(function (n) { n.lida = true; });
  salvarBanco();
}


/* =========================== TORNEIOS =========================== */

function ehTorneioDeTimes(torneio) { return torneio.modo !== '1v1'; }
function tamanhoDoTime(torneio)    { return parseInt(torneio.modo, 10) || 1; }

// Nome de quem está jogando (jogador ou time)
function nomeParticipante(torneio, id) {
  if (!id) return 'A definir';
  if (ehTorneioDeTimes(torneio)) {
    const time = buscarTime(id);
    return time ? time.nome : 'Time removido';
  }
  const jogador = buscarJogador(id);
  return jogador ? jogador.usuario : 'Jogador removido';
}

function linkParticipante(torneio, id) {
  if (!id) return '';
  return ehTorneioDeTimes(torneio) ? 'time.html?id=' + id : 'perfil.html?id=' + id;
}

// Ids dos jogadores que representam um participante
function jogadoresDoParticipante(torneio, id) {
  if (!id) return [];
  if (ehTorneioDeTimes(torneio)) {
    const time = buscarTime(id);
    return time ? time.membros.slice() : [];
  }
  return [id];
}

// Em qual participante do torneio o jogador está? (ele mesmo, ou o time dele)
function participacaoDoJogador(torneio, jogadorId) {
  for (let i = 0; i < torneio.participantes.length; i++) {
    const id = torneio.participantes[i];
    if (jogadoresDoParticipante(torneio, id).indexOf(jogadorId) !== -1) return id;
  }
  return null;
}

function souOrganizador(torneio) {
  const eu = usuarioLogado();
  return !!eu && torneio.organizador === eu.id;
}

function textoStatusTorneio(torneio) {
  if (torneio.status === 'finalizado') return 'Finalizado';
  if (torneio.status === 'andamento') return 'Ao vivo';
  if (torneio.participantes.length >= torneio.vagas) return 'Vagas esgotadas';
  return 'Inscrições abertas';
}

function classeStatusTorneio(torneio) {
  if (torneio.status === 'finalizado') return 'encerrado';
  if (torneio.status === 'andamento') return 'ao-vivo';
  return 'aberto';
}

function textoFormato(torneio) {
  return torneio.formato === 'pontos' ? 'Pontos corridos' : 'Eliminação simples';
}

function criarTorneio(dados) {
  const eu = usuarioLogado();
  if (!eu) return { ok: false, erro: 'Entre na sua conta para criar um torneio.' };

  const nome = String(dados.nome || '').trim();
  const vagas = parseInt(dados.vagas, 10);
  if (nome.length < 3) return { ok: false, erro: 'Dê um nome com pelo menos 3 letras ao torneio.' };
  if (['1v1', '2v2', '3v3'].indexOf(dados.modo) === -1) return { ok: false, erro: 'Escolha o tamanho das equipes.' };
  if (!(vagas >= 2 && vagas <= 64)) return { ok: false, erro: 'O número de vagas deve ficar entre 2 e 64.' };
  if (!dados.inicio) return { ok: false, erro: 'Escolha a data e o horário de início.' };

  const torneio = {
    id: gerarId('tr'),
    nome: nome,
    modo: dados.modo,
    modoDeJogo: dados.modoDeJogo || MODOS_DE_JOGO[0],
    formato: dados.formato === 'pontos' ? 'pontos' : 'eliminacao',
    vagas: vagas,
    inicio: new Date(dados.inicio).toISOString(),
    premio: String(dados.premio || '').trim() || 'Sem premiação',
    regiao: dados.regiao || 'Brasil',
    organizador: eu.id,
    status: 'inscricoes',
    arte: parseInt(dados.arte, 10) || 1,
    descricao: String(dados.descricao || '').trim(),
    regras: String(dados.regras || '').trim(),
    participantes: [],
    vencedor: null,
    criadoEm: new Date().toISOString()
  };
  banco.torneios.unshift(torneio);
  salvarBanco();
  return { ok: true, torneio: torneio };
}

function excluirTorneio(torneioId) {
  const torneio = buscarTorneio(torneioId);
  if (!torneio || !souOrganizador(torneio)) return { ok: false, erro: 'Só o organizador pode excluir o torneio.' };
  banco.torneios = banco.torneios.filter(function (t) { return t.id !== torneioId; });
  banco.partidas = banco.partidas.filter(function (p) { return p.torneioId !== torneioId; });
  salvarBanco();
  return { ok: true };
}

// participanteId = id do jogador (1v1) ou do time (2v2/3v3)
function inscrever(torneioId, participanteId) {
  const eu = usuarioLogado();
  const torneio = buscarTorneio(torneioId);
  if (!eu) return { ok: false, erro: 'Entre na sua conta para se inscrever.' };
  if (!torneio) return { ok: false, erro: 'Torneio não encontrado.' };
  if (torneio.status !== 'inscricoes') return { ok: false, erro: 'As inscrições deste torneio já fecharam.' };
  if (torneio.participantes.length >= torneio.vagas) return { ok: false, erro: 'Não há mais vagas.' };
  if (torneio.participantes.indexOf(participanteId) !== -1) return { ok: false, erro: 'Já está inscrito.' };

  if (ehTorneioDeTimes(torneio)) {
    const time = buscarTime(participanteId);
    if (!time) return { ok: false, erro: 'Escolha um time.' };
    if (time.capitao !== eu.id) return { ok: false, erro: 'Só o capitão pode inscrever o time.' };
    if (time.membros.length < tamanhoDoTime(torneio)) {
      return { ok: false, erro: 'Seu time precisa ter pelo menos ' + tamanhoDoTime(torneio) + ' jogadores para este torneio.' };
    }
    const repetido = time.membros.some(function (m) { return participacaoDoJogador(torneio, m); });
    if (repetido) return { ok: false, erro: 'Algum membro do seu time já está inscrito por outro time.' };
  } else if (participanteId !== eu.id) {
    return { ok: false, erro: 'Em torneios 1v1 você só pode inscrever a si mesmo.' };
  }

  torneio.participantes.push(participanteId);
  notificar(torneio.organizador, nomeParticipante(torneio, participanteId) + ' se inscreveu em ' + torneio.nome + '.', 'torneio.html?id=' + torneio.id);
  salvarBanco();
  return { ok: true };
}

function cancelarInscricao(torneioId, participanteId) {
  const eu = usuarioLogado();
  const torneio = buscarTorneio(torneioId);
  if (!eu || !torneio) return { ok: false, erro: 'Não foi possível cancelar.' };
  if (torneio.status !== 'inscricoes') return { ok: false, erro: 'O torneio já começou.' };

  const podeCancelar = souOrganizador(torneio) ||
    participanteId === eu.id ||
    (buscarTime(participanteId) && buscarTime(participanteId).capitao === eu.id);
  if (!podeCancelar) return { ok: false, erro: 'Você não pode remover esta inscrição.' };

  torneio.participantes = torneio.participantes.filter(function (id) { return id !== participanteId; });
  salvarBanco();
  return { ok: true };
}

// Ajuda na apresentação: completa as vagas com jogadores/times de exemplo.
function preencherComExemplos(torneioId) {
  const torneio = buscarTorneio(torneioId);
  if (!torneio || !souOrganizador(torneio)) return { ok: false, erro: 'Só o organizador pode fazer isso.' };
  if (torneio.status !== 'inscricoes') return { ok: false, erro: 'As inscrições já fecharam.' };

  const candidatos = ehTorneioDeTimes(torneio)
    ? banco.times.filter(function (t) { return t.membros.length >= tamanhoDoTime(torneio); }).map(function (t) { return t.id; })
    : banco.jogadores.map(function (j) { return j.id; });

  let adicionados = 0;
  candidatos.forEach(function (id) {
    if (torneio.participantes.length >= torneio.vagas) return;
    if (torneio.participantes.indexOf(id) !== -1) return;
    if (ehTorneioDeTimes(torneio)) {
      const time = buscarTime(id);
      const repetido = time.membros.some(function (m) { return participacaoDoJogador(torneio, m); });
      if (repetido) return;
    }
    torneio.participantes.push(id);
    adicionados++;
  });
  salvarBanco();
  if (!adicionados) return { ok: false, erro: 'Não há mais participantes de exemplo disponíveis.' };
  return { ok: true, adicionados: adicionados };
}

// Fecha as inscrições e cria as partidas.
// demo = true é usado só na criação dos dados de exemplo.
function iniciarTorneio(torneioId, demo) {
  const torneio = buscarTorneio(torneioId);
  if (!torneio) return { ok: false, erro: 'Torneio não encontrado.' };
  if (!demo && !souOrganizador(torneio)) return { ok: false, erro: 'Só o organizador pode iniciar o torneio.' };
  if (torneio.status !== 'inscricoes') return { ok: false, erro: 'Este torneio já foi iniciado.' };
  if (torneio.participantes.length < 2) return { ok: false, erro: 'São necessários pelo menos 2 participantes.' };

  torneio.status = 'andamento';
  if (new Date(torneio.inicio) > new Date()) torneio.inicio = new Date().toISOString();

  if (torneio.formato === 'pontos') gerarPontosCorridos(torneio);
  else gerarEliminacao(torneio);

  if (!demo) {
    torneio.participantes.forEach(function (id) {
      jogadoresDoParticipante(torneio, id).forEach(function (jogadorId) {
        notificar(jogadorId, torneio.nome + ' começou! Confira sua primeira partida.', 'torneio.html?id=' + torneio.id + '#chaveamento');
      });
    });
  }
  salvarBanco();
  return { ok: true };
}

// Horário de cada rodada: 1 hora depois da anterior
function dataDaRodada(torneio, rodada) {
  const data = new Date(torneio.inicio);
  data.setHours(data.getHours() + (rodada - 1));
  return data.toISOString();
}

function novaPartida(torneio, rodada, ordem, a, b) {
  return {
    id: gerarId('p'),
    torneioId: torneio.id,
    rodada: rodada,
    ordem: ordem,
    a: a || null,
    b: b || null,
    placarA: null,
    placarB: null,
    vencedor: null,
    status: (a && b) ? 'agendada' : 'aguardando',
    data: dataDaRodada(torneio, rodada),
    proxima: null,   // id da partida para onde o vencedor vai
    lado: null,      // 'a' ou 'b' na próxima partida
    bye: false,      // true = passou direto (sem adversário)
    guerreiros: {},  // guerreiro escolhido por cada jogador nesta partida
    chat: []
  };
}

/* ELIMINAÇÃO SIMPLES (mata-mata)
   1) Arredonda o número de participantes para 2, 4, 8, 16...
   2) Quem sobrar sem adversário "passa direto" (BYE).
   3) O vencedor de cada partida vai para a próxima rodada. */
function gerarEliminacao(torneio) {
  const lista = torneio.participantes.slice();
  let tamanho = 2;
  while (tamanho < lista.length) tamanho = tamanho * 2;
  const totalRodadas = Math.round(Math.log(tamanho) / Math.log(2));
  const metade = tamanho / 2;

  // Cria todas as partidas, rodada por rodada
  const rodadas = [];
  for (let r = 1; r <= totalRodadas; r++) {
    const quantidade = tamanho / Math.pow(2, r);
    const partidasDaRodada = [];
    for (let i = 0; i < quantidade; i++) {
      partidasDaRodada.push(novaPartida(torneio, r, i + 1, null, null));
    }
    rodadas.push(partidasDaRodada);
  }

  // Liga cada partida à próxima
  for (let r = 0; r < rodadas.length - 1; r++) {
    rodadas[r].forEach(function (partida, i) {
      partida.proxima = rodadas[r + 1][Math.floor(i / 2)].id;
      partida.lado = (i % 2 === 0) ? 'a' : 'b';
    });
  }

  // Coloca os participantes na 1ª rodada
  rodadas[0].forEach(function (partida, i) {
    partida.a = lista[i] || null;
    partida.b = lista[i + metade] || null;
    partida.status = (partida.a && partida.b) ? 'agendada' : 'aguardando';
  });

  rodadas.forEach(function (r) { r.forEach(function (p) { banco.partidas.push(p); }); });

  // Quem não tem adversário passa direto
  rodadas[0].forEach(function (partida) {
    if (partida.a && !partida.b) {
      partida.vencedor = partida.a;
      partida.status = 'finalizada';
      partida.bye = true;
      avancarVencedor(partida);
    }
  });
}

/* PONTOS CORRIDOS (todos contra todos)
   Usa o "método do círculo": um participante fica parado e os outros
   giram, assim cada rodada tem confrontos diferentes. */
function gerarPontosCorridos(torneio) {
  const lista = torneio.participantes.slice();
  if (lista.length % 2 === 1) lista.push(null); // número ímpar: alguém folga
  const n = lista.length;

  for (let r = 0; r < n - 1; r++) {
    let ordem = 1;
    for (let i = 0; i < n / 2; i++) {
      const a = lista[i];
      const b = lista[n - 1 - i];
      if (a && b) banco.partidas.push(novaPartida(torneio, r + 1, ordem++, a, b));
    }
    lista.splice(1, 0, lista.pop()); // gira
  }
}

function avancarVencedor(partida) {
  if (!partida.proxima) return;
  const proxima = buscarPartida(partida.proxima);
  proxima[partida.lado] = partida.vencedor;
  if (proxima.a && proxima.b) proxima.status = 'agendada';
}

// Primeira partida pronta para jogar (usada nos dados de exemplo)
function proximaPartidaJogavel(torneioId) {
  return partidasDoTorneio(torneioId).find(function (p) { return p.status === 'agendada'; }) || null;
}

function nomeDaRodada(torneio, rodada) {
  if (torneio.formato === 'pontos') return 'Rodada ' + rodada;
  const total = Math.max.apply(null, partidasDoTorneio(torneio.id).map(function (p) { return p.rodada; }));
  if (rodada === total) return 'Final';
  if (rodada === total - 1) return 'Semifinal';
  if (rodada === total - 2) return 'Quartas de final';
  if (rodada === total - 3) return 'Oitavas de final';
  return 'Rodada ' + rodada;
}

function statusDaPartida(partida) {
  if (partida.status === 'finalizada') {
    return partida.bye ? { texto: 'Passou direto', classe: 'encerrada' } : { texto: 'Encerrada', classe: 'encerrada' };
  }
  if (partida.status === 'aguardando') return { texto: 'A definir', classe: 'aguardando' };
  if (new Date(partida.data) <= new Date()) return { texto: 'Ao vivo', classe: 'ao-vivo' };
  return { texto: 'Agendada', classe: 'agendada' };
}

// Quem pode enviar o resultado: o organizador ou alguém que joga a partida
function podeEnviarResultado(partida) {
  const eu = usuarioLogado();
  if (!eu || partida.status !== 'agendada') return false;
  const torneio = buscarTorneio(partida.torneioId);
  return torneio.organizador === eu.id || souJogadorDaPartida(partida);
}

// demo = true: usado só nos dados de exemplo (não mexe no ranking nem notifica)
function registrarResultado(partidaId, placarA, placarB, demo) {
  const partida = buscarPartida(partidaId);
  if (!partida) return { ok: false, erro: 'Partida não encontrada.' };
  if (!demo && !podeEnviarResultado(partida)) return { ok: false, erro: 'Você não pode enviar o resultado desta partida.' };

  placarA = parseInt(placarA, 10);
  placarB = parseInt(placarB, 10);
  if (isNaN(placarA) || isNaN(placarB) || placarA < 0 || placarB < 0) return { ok: false, erro: 'Digite placares válidos (0 ou mais).' };
  if (placarA === placarB) return { ok: false, erro: 'Não pode haver empate: alguém precisa vencer.' };

  const torneio = buscarTorneio(partida.torneioId);
  partida.placarA = placarA;
  partida.placarB = placarB;
  partida.vencedor = placarA > placarB ? partida.a : partida.b;
  const perdedor = placarA > placarB ? partida.b : partida.a;
  partida.status = 'finalizada';
  partida.finalizadaEm = new Date().toISOString();

  if (!demo) {
    atualizarRanking(torneio, partida.vencedor, perdedor);
    jogadoresDoParticipante(torneio, partida.a).concat(jogadoresDoParticipante(torneio, partida.b)).forEach(function (id) {
      notificar(id, 'Resultado registrado: ' + nomeParticipante(torneio, partida.a) + ' ' + placarA + ' x ' + placarB + ' ' + nomeParticipante(torneio, partida.b) + '.', 'partida.html?id=' + partida.id);
    });
  }

  if (torneio.formato === 'pontos') {
    const faltam = partidasDoTorneio(torneio.id).some(function (p) { return p.status !== 'finalizada'; });
    if (!faltam) finalizarTorneio(torneio, classificacaoPontosCorridos(torneio)[0].id, demo);
  } else if (partida.proxima) {
    avancarVencedor(partida);
  } else {
    finalizarTorneio(torneio, partida.vencedor, demo);
  }

  salvarBanco();
  return { ok: true };
}

function atualizarRanking(torneio, vencedorId, perdedorId) {
  jogadoresDoParticipante(torneio, vencedorId).forEach(function (id) {
    const j = buscarJogador(id);
    if (j) { j.pontos += PONTOS_VITORIA; j.vitorias++; }
  });
  jogadoresDoParticipante(torneio, perdedorId).forEach(function (id) {
    const j = buscarJogador(id);
    if (j) { j.pontos = Math.max(0, j.pontos - PONTOS_DERROTA); j.derrotas++; }
  });
  if (ehTorneioDeTimes(torneio)) {
    const vencedor = buscarTime(vencedorId);
    const perdedor = buscarTime(perdedorId);
    if (vencedor) { vencedor.pontos += PONTOS_VITORIA; vencedor.vitorias++; }
    if (perdedor) { perdedor.pontos = Math.max(0, perdedor.pontos - PONTOS_DERROTA); perdedor.derrotas++; }
  }
}

function finalizarTorneio(torneio, campeaoId, demo) {
  torneio.status = 'finalizado';
  torneio.vencedor = campeaoId;
  torneio.finalizadoEm = new Date().toISOString();

  jogadoresDoParticipante(torneio, campeaoId).forEach(function (id) {
    const j = buscarJogador(id);
    if (!j) return;
    j.titulos = (j.titulos || 0) + 1;
    if (!demo) {
      j.pontos += PONTOS_CAMPEAO;
      notificar(id, 'Parabéns! Você é campeão de ' + torneio.nome + '! +' + PONTOS_CAMPEAO + ' pontos no ranking.', 'torneio.html?id=' + torneio.id);
    }
  });
  if (ehTorneioDeTimes(torneio)) {
    const time = buscarTime(campeaoId);
    if (time) {
      time.titulos = (time.titulos || 0) + 1;
      if (!demo) time.pontos += PONTOS_CAMPEAO;
    }
  }
}

// Tabela de classificação (usada nos torneios de pontos corridos)
function classificacaoPontosCorridos(torneio) {
  const tabela = torneio.participantes.map(function (id) {
    return { id: id, jogos: 0, vitorias: 0, derrotas: 0, pontos: 0, saldo: 0 };
  });
  function linha(id) { return tabela.find(function (l) { return l.id === id; }); }

  partidasDoTorneio(torneio.id).forEach(function (p) {
    if (p.status !== 'finalizada' || p.bye) return;
    const a = linha(p.a), b = linha(p.b);
    if (!a || !b) return;
    a.jogos++; b.jogos++;
    a.saldo += p.placarA - p.placarB;
    b.saldo += p.placarB - p.placarA;
    if (p.vencedor === p.a) { a.vitorias++; a.pontos += 3; b.derrotas++; }
    else { b.vitorias++; b.pontos += 3; a.derrotas++; }
  });

  return tabela.sort(function (x, y) { return y.pontos - x.pontos || y.saldo - x.saldo; });
}

function enviarMensagemNaPartida(partidaId, texto) {
  const eu = usuarioLogado();
  const partida = buscarPartida(partidaId);
  texto = String(texto || '').trim();
  if (!eu) return { ok: false, erro: 'Entre na sua conta para conversar.' };
  if (!partida || !texto) return { ok: false, erro: 'Escreva uma mensagem.' };
  partida.chat.push({ jogadorId: eu.id, texto: texto.slice(0, 300), data: new Date().toISOString() });
  salvarBanco();
  return { ok: true };
}

// Todas as partidas em que o jogador jogou ou vai jogar
function partidasDoJogador(jogadorId) {
  return banco.partidas.filter(function (p) {
    if (p.bye) return false;
    const torneio = buscarTorneio(p.torneioId);
    if (!torneio) return false;
    const jogadores = jogadoresDoParticipante(torneio, p.a).concat(jogadoresDoParticipante(torneio, p.b));
    return jogadores.indexOf(jogadorId) !== -1;
  });
}

function torneiosDoJogador(jogadorId) {
  return banco.torneios.filter(function (t) {
    return t.organizador === jogadorId || participacaoDoJogador(t, jogadorId);
  });
}


/* =========================== TIMES =========================== */

function criarTime(dados) {
  const eu = usuarioLogado();
  if (!eu) return { ok: false, erro: 'Entre na sua conta para criar um time.' };
  const nome = String(dados.nome || '').trim();
  const tag = String(dados.tag || '').trim().toUpperCase();
  if (nome.length < 3) return { ok: false, erro: 'O nome do time precisa ter pelo menos 3 letras.' };
  if (!/^[A-Z0-9]{2,4}$/.test(tag)) return { ok: false, erro: 'A TAG deve ter de 2 a 4 letras ou números (ex.: LGF).' };
  const repetido = banco.times.some(function (t) { return t.nome.toLowerCase() === nome.toLowerCase() || t.tag === tag; });
  if (repetido) return { ok: false, erro: 'Já existe um time com esse nome ou TAG.' };

  const time = {
    id: gerarId('t'),
    nome: nome,
    tag: tag,
    capitao: eu.id,
    membros: [eu.id],
    pontos: 1000,
    vitorias: 0,
    derrotas: 0,
    titulos: 0,
    bio: String(dados.bio || '').trim().slice(0, 200),
    cor: dados.cor || '#e14036',
    criadoEm: new Date().toISOString()
  };
  banco.times.push(time);
  salvarBanco();
  return { ok: true, time: time };
}

function editarTime(timeId, dados) {
  const eu = usuarioLogado();
  const time = buscarTime(timeId);
  if (!time || !eu || time.capitao !== eu.id) return { ok: false, erro: 'Só o capitão pode editar o time.' };
  const nome = String(dados.nome || '').trim();
  if (nome.length < 3) return { ok: false, erro: 'O nome do time precisa ter pelo menos 3 letras.' };
  time.nome = nome;
  time.bio = String(dados.bio || '').trim().slice(0, 200);
  time.cor = dados.cor || time.cor;
  salvarBanco();
  return { ok: true };
}

function entrarNoTime(timeId) {
  const eu = usuarioLogado();
  const time = buscarTime(timeId);
  if (!eu) return { ok: false, erro: 'Entre na sua conta para entrar em um time.' };
  if (!time) return { ok: false, erro: 'Time não encontrado.' };
  if (time.membros.indexOf(eu.id) !== -1) return { ok: false, erro: 'Você já faz parte deste time.' };
  if (time.membros.length >= MAXIMO_MEMBROS_TIME) return { ok: false, erro: 'O time está cheio (máx. ' + MAXIMO_MEMBROS_TIME + ').' };
  time.membros.push(eu.id);
  notificar(time.capitao, eu.usuario + ' entrou no seu time ' + time.nome + '.', 'time.html?id=' + time.id);
  salvarBanco();
  return { ok: true };
}

function convidarParaTime(timeId, usuario) {
  const eu = usuarioLogado();
  const time = buscarTime(timeId);
  const jogador = buscarJogadorPorUsuario(usuario);
  if (!time || !eu || time.capitao !== eu.id) return { ok: false, erro: 'Só o capitão pode adicionar jogadores.' };
  if (!jogador) return { ok: false, erro: 'Jogador "' + usuario + '" não encontrado.' };
  if (time.membros.indexOf(jogador.id) !== -1) return { ok: false, erro: 'Esse jogador já está no time.' };
  if (time.membros.length >= MAXIMO_MEMBROS_TIME) return { ok: false, erro: 'O time está cheio (máx. ' + MAXIMO_MEMBROS_TIME + ').' };
  time.membros.push(jogador.id);
  notificar(jogador.id, eu.usuario + ' adicionou você ao time ' + time.nome + '.', 'time.html?id=' + time.id);
  salvarBanco();
  return { ok: true, jogador: jogador };
}

function removerDoTime(timeId, jogadorId) {
  const eu = usuarioLogado();
  const time = buscarTime(timeId);
  if (!time || !eu) return { ok: false, erro: 'Não foi possível remover.' };
  const saindoSozinho = jogadorId === eu.id;
  if (!saindoSozinho && time.capitao !== eu.id) return { ok: false, erro: 'Só o capitão pode remover jogadores.' };

  time.membros = time.membros.filter(function (id) { return id !== jogadorId; });

  if (time.membros.length === 0) {
    // ninguém sobrou: o time deixa de existir
    banco.times = banco.times.filter(function (t) { return t.id !== timeId; });
    salvarBanco();
    return { ok: true, timeExcluido: true };
  }
  if (time.capitao === jogadorId) time.capitao = time.membros[0]; // passa a capitania
  if (!saindoSozinho) notificar(jogadorId, 'Você foi removido do time ' + time.nome + '.', 'times.html');
  salvarBanco();
  return { ok: true };
}

function excluirTime(timeId) {
  const eu = usuarioLogado();
  const time = buscarTime(timeId);
  if (!time || !eu || time.capitao !== eu.id) return { ok: false, erro: 'Só o capitão pode excluir o time.' };
  const emTorneio = banco.torneios.some(function (t) { return t.status === 'andamento' && t.participantes.indexOf(timeId) !== -1; });
  if (emTorneio) return { ok: false, erro: 'O time está jogando um torneio em andamento.' };
  banco.torneios.forEach(function (t) {
    if (t.status === 'inscricoes') t.participantes = t.participantes.filter(function (id) { return id !== timeId; });
  });
  banco.times = banco.times.filter(function (t) { return t.id !== timeId; });
  salvarBanco();
  return { ok: true };
}


/* =========================== RANKING =========================== */

function rankingDeJogadores() {
  return banco.jogadores.slice().sort(function (a, b) { return b.pontos - a.pontos; });
}

function rankingDeTimes() {
  return banco.times.slice().sort(function (a, b) { return b.pontos - a.pontos; });
}

function posicaoNoRanking(jogadorId) {
  return rankingDeJogadores().findIndex(function (j) { return j.id === jogadorId; }) + 1;
}


/* =========================== SUPORTE =========================== */

function abrirChamado(dados) {
  const nome = String(dados.nome || '').trim();
  const email = String(dados.email || '').trim();
  const mensagem = String(dados.mensagem || '').trim();
  if (!nome || email.indexOf('@') === -1 || mensagem.length < 10) {
    return { ok: false, erro: 'Preencha nome, e-mail válido e uma mensagem com pelo menos 10 caracteres.' };
  }
  const protocolo = 'RA-' + Date.now().toString().slice(-6);
  banco.chamados.push({ protocolo: protocolo, nome: nome, email: email, assunto: dados.assunto || 'Outro', mensagem: mensagem, data: new Date().toISOString() });
  salvarBanco();
  return { ok: true, protocolo: protocolo };
}

// "Avise-me quando o Bellator for lançado"
function registrarInteresse(email) {
  email = String(email || '').trim().toLowerCase();
  if (email.indexOf('@') === -1) return { ok: false, erro: 'Digite um e-mail válido.' };
  if (!banco.interessados) banco.interessados = [];
  if (banco.interessados.indexOf(email) !== -1) return { ok: false, erro: 'Esse e-mail já está na lista.' };
  banco.interessados.push(email);
  salvarBanco();
  return { ok: true };
}


/* =========================== JOGO BELLATOR (integração) ===========================
   O jogo roda dentro da página jogar.html (versão WebGL publicada no itch.io).
   Quando uma partida no jogo termina, o jogo manda o resultado para o site
   (ver js/paginas/jogar.js e a pasta integracao-unity/), e ele é guardado em
   banco.resultadosDoJogo.

   Modos que existem hoje no jogo:                                          */
const MODOS_DO_JOGO = {
  sobrevivencia: 'Sobrevivência (5 ondas)',
  infinito: 'Ondas infinitas'
};

// dados = { modo, ondas, pontos, venceu, guerreiro, duracaoSegundos, partidaId }
function registrarResultadoDoJogo(dados) {
  const eu = usuarioLogado();
  if (!eu) return { ok: false, erro: 'Entre na sua conta para salvar o resultado.' };
  if (!MODOS_DO_JOGO[dados.modo]) return { ok: false, erro: 'Modo de jogo desconhecido: ' + dados.modo };

  const ondas = Math.max(0, parseInt(dados.ondas, 10) || 0);
  // Se o jogo não mandar pontos, cada onda vale 100
  const pontos = Math.max(0, parseInt(dados.pontos, 10) || ondas * 100);
  if (!banco.resultadosDoJogo) banco.resultadosDoJogo = [];

  const recordeAnterior = recordeDoJogador(eu.id, dados.modo);
  const resultado = {
    id: gerarId('rj'),
    jogadorId: eu.id,
    modo: dados.modo,
    ondas: ondas,
    pontos: pontos,
    venceu: !!dados.venceu,
    guerreiro: GUERREIROS.indexOf(dados.guerreiro) !== -1 ? dados.guerreiro : (eu.guerreiro || ''),
    duracaoSegundos: Math.max(0, parseInt(dados.duracaoSegundos, 10) || 0),
    partidaId: dados.partidaId || '',
    data: new Date().toISOString()
  };
  banco.resultadosDoJogo.unshift(resultado);
  if (resultado.guerreiro) eu.guerreiro = resultado.guerreiro;

  const novoRecorde = !recordeAnterior || pontos > recordeAnterior.pontos;
  if (novoRecorde) {
    notificar(eu.id, 'Novo recorde no Bellator (' + MODOS_DO_JOGO[dados.modo] + '): ' + ondas + ' ondas, ' + pontos + ' pontos!', 'jogar.html');
  }
  salvarBanco();
  return { ok: true, resultado: resultado, novoRecorde: novoRecorde };
}

function resultadosDoJogador(jogadorId) {
  return (banco.resultadosDoJogo || []).filter(function (r) { return r.jogadorId === jogadorId; });
}

// Melhor resultado (mais pontos) de um jogador em um modo
function recordeDoJogador(jogadorId, modo) {
  let melhor = null;
  resultadosDoJogador(jogadorId).forEach(function (r) {
    if (r.modo === modo && (!melhor || r.pontos > melhor.pontos)) melhor = r;
  });
  return melhor;
}

// Ranking do jogo: o melhor resultado de cada jogador, do maior para o menor
function rankingDoJogo(modo) {
  const melhores = {};
  (banco.resultadosDoJogo || []).forEach(function (r) {
    if (r.modo !== modo) return;
    if (!melhores[r.jogadorId] || r.pontos > melhores[r.jogadorId].pontos) melhores[r.jogadorId] = r;
  });
  return Object.keys(melhores)
    .map(function (id) { return melhores[id]; })
    .filter(function (r) { return buscarJogador(r.jogadorId); })
    .sort(function (a, b) { return b.pontos - a.pontos || b.ondas - a.ondas; });
}
