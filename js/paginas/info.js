/* =====================================================================
   info.js — página info.html?p=...
   Mostra só a seção escolhida (sobre, suporte, termos, privacidade...).
   O texto de cada seção está escrito direto no info.html.
   ===================================================================== */

const secaoEscolhida = parametroDaUrl('p') || 'sobre';
let secao = document.getElementById(secaoEscolhida);
if (!secao || !secao.classList.contains('texto-info')) secao = document.getElementById('sobre');

secao.hidden = false;
document.getElementById('tituloInfo').textContent = secao.getAttribute('data-titulo');
document.title = secao.getAttribute('data-titulo') + ' — Rivals Arena';

// Destaca o item do menu lateral
document.querySelectorAll('#menuInfo a').forEach(function (link) {
  if (link.getAttribute('href') === 'info.html?p=' + secao.id) link.classList.add('ativo');
});

// Formulário de suporte
const formSuporte = document.getElementById('formSuporte');
const logado = usuarioLogado();
if (logado) {
  document.getElementById('supNome').value = logado.nome || logado.usuario;
  document.getElementById('supEmail').value = logado.email || '';
}

formSuporte.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const resultado = abrirChamado({
    nome: document.getElementById('supNome').value,
    email: document.getElementById('supEmail').value,
    assunto: document.getElementById('supAssunto').value,
    mensagem: document.getElementById('supMensagem').value
  });
  const erro = document.getElementById('erroSuporte');
  if (!resultado.ok) {
    erro.textContent = resultado.erro;
    erro.classList.add('visivel');
    return;
  }
  erro.classList.remove('visivel');
  formSuporte.innerHTML = '<h3>Mensagem enviada!</h3><p>Seu protocolo é <b style="color:var(--orange)">' + resultado.protocolo +
    '</b>. Responderemos no e-mail informado.</p>';
});
