// =====================================================================
// RivalsArena.jslib — ponte entre o Bellator (Unity WebGL) e o site
// ---------------------------------------------------------------------
// Coloque este arquivo no projeto Unity em: Assets/Plugins/WebGL/
// Ele só funciona na build WebGL (no editor do Unity é ignorado).
//
// Mensagens que o JOGO manda para o SITE (window.top = a página do site;
// no meio existe o iframe do itch.io, por isso não usamos window.parent):
//   { origem: 'bellator', tipo: 'pronto' }
//   { origem: 'bellator', tipo: 'resultado', modo, ondas, pontos, venceu, guerreiro, duracaoSegundos }
//
// Mensagem que o SITE manda para o JOGO:
//   { origem: 'rivals-arena', tipo: 'jogador', usuario, guerreiro, partidaId }
// =====================================================================

mergeInto(LibraryManager.library, {

  // Começa a escutar o site e avisa que o jogo está pronto
  RA_Iniciar: function () {
    if (window.__rivalsArenaIniciado) return;
    window.__rivalsArenaIniciado = true;
    window.__rivalsArenaDados = '';

    window.addEventListener('message', function (evento) {
      var dados = evento.data;
      if (!dados || dados.origem !== 'rivals-arena') return;
      window.__rivalsArenaDados = JSON.stringify(dados);
    });

    // Só avisa se o jogo estiver dentro de outra página (iframe)
    if (window.top && window.top !== window) {
      window.top.postMessage({ origem: 'bellator', tipo: 'pronto' }, '*');
    }
  },

  // Devolve para o C# o último dado recebido do site (texto JSON, ou "" se nada chegou)
  RA_LerDadosDoSite: function () {
    var texto = window.__rivalsArenaDados || '';
    var tamanho = lengthBytesUTF8(texto) + 1;
    var memoria = _malloc(tamanho);
    stringToUTF8(texto, memoria, tamanho);
    return memoria;
  },

  // Recebe o resultado em JSON (montado no C#) e manda para o site
  RA_EnviarResultado: function (jsonPtr) {
    var json = UTF8ToString(jsonPtr);
    try {
      var dados = JSON.parse(json);
      dados.origem = 'bellator';
      dados.tipo = 'resultado';
      if (window.top && window.top !== window) {
        window.top.postMessage(dados, '*');
      }
    } catch (erro) {
      console.warn('[RivalsArena] Resultado inválido:', erro);
    }
  }
});
