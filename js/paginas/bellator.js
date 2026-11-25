/* =====================================================================
   bellator.js — página bellator.html
   Formulário "Receba as atualizações" do Bellator.
   ===================================================================== */

// Já preenche com o e-mail de quem está logado
const quemEsta = usuarioLogado();
if (quemEsta) document.getElementById('emailLancamento').value = quemEsta.email || '';

document.getElementById('formLancamento').addEventListener('submit', function (evento) {
  evento.preventDefault();
  const campo = document.getElementById('emailLancamento');
  if (avisarResultado(registrarInteresse(campo.value), 'Pronto! Você vai receber as novidades do Bellator.')) {
    campo.value = '';
  }
});
