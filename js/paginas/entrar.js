/* =====================================================================
   entrar.js — página entrar.html
   Login, cadastro e conta de demonstração.
   Depois de entrar, volta para a página de onde a pessoa veio
   (entrar.html?voltar=torneio.html%3Fid%3Dtr2) ou vai para o painel.
   ===================================================================== */

function irParaDestino() {
  const voltar = parametroDaUrl('voltar');
  // Só aceitamos páginas do próprio site (sem "//" nem "http")
  const seguro = voltar && voltar.indexOf('//') === -1 && voltar.indexOf(':') === -1;
  window.location.href = seguro ? voltar : 'painel.html';
}

// Já está logado? Não precisa ver esta tela.
if (usuarioLogado()) irParaDestino();

ativarAbas('abasLogin');

function mostrarErro(id, texto) {
  const caixa = document.getElementById(id);
  caixa.textContent = texto;
  caixa.classList.add('visivel');
}

document.getElementById('formEntrar').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const resultado = entrar(
    document.getElementById('loginUsuario').value,
    document.getElementById('loginSenha').value
  );
  if (!resultado.ok) { mostrarErro('erroEntrar', resultado.erro); return; }
  irParaDestino();
});

document.getElementById('formCadastro').addEventListener('submit', function (evento) {
  evento.preventDefault();
  if (!document.getElementById('cadTermos').checked) {
    mostrarErro('erroCadastro', 'Você precisa aceitar os Termos de Serviço para criar a conta.');
    return;
  }
  const resultado = cadastrar({
    usuario: document.getElementById('cadUsuario').value,
    nome: document.getElementById('cadNome').value,
    email: document.getElementById('cadEmail').value,
    senha: document.getElementById('cadSenha').value
  });
  if (!resultado.ok) { mostrarErro('erroCadastro', resultado.erro); return; }
  irParaDestino();
});

document.getElementById('botaoDemo').addEventListener('click', function () {
  entrarComoDemo();
  irParaDestino();
});
