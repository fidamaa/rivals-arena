/* =====================================================================
   configuracoes.js — página configuracoes.html
   Editar perfil, trocar senha, sair e restaurar os dados de exemplo.
   ===================================================================== */

const usuarioAtual = exigirLogin();

if (usuarioAtual) {
  document.getElementById('campoUsuario').value = usuarioAtual.usuario;
  document.getElementById('campoNome').value = usuarioAtual.nome || '';
  document.getElementById('campoEmail').value = usuarioAtual.email || '';
  document.getElementById('campoBio').value = usuarioAtual.bio || '';
  document.getElementById('campoCor').value = usuarioAtual.cor || '#e14036';
  document.getElementById('nomeSessao').textContent = usuarioAtual.usuario;
}

document.getElementById('formPerfil').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const resultado = atualizarPerfil({
    nome: document.getElementById('campoNome').value,
    email: document.getElementById('campoEmail').value,
    bio: document.getElementById('campoBio').value,
    cor: document.getElementById('campoCor').value,
    novaSenha: document.getElementById('campoSenha').value
  });
  const erro = document.getElementById('erroPerfil');
  if (!resultado.ok) {
    erro.textContent = resultado.erro;
    erro.classList.add('visivel');
    return;
  }
  erro.classList.remove('visivel');
  document.getElementById('campoSenha').value = '';
  mostrarAviso('Perfil salvo!', 'sucesso');
  montarAreaDoUsuario(); // atualiza o avatar no cabeçalho
});

document.getElementById('botaoSairConta').addEventListener('click', function () {
  sair();
  window.location.href = 'index.html';
});

document.getElementById('botaoRestaurar').addEventListener('click', function () {
  if (!confirm('Apagar tudo o que foi criado neste navegador e voltar aos dados de exemplo?')) return;
  restaurarDadosDeExemplo();
  window.location.href = 'index.html';
});
