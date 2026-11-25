/* =====================================================================
   criar-torneio.js — página criar-torneio.html
   Lê o formulário, mostra uma prévia e cria o torneio.
   ===================================================================== */

exigirLogin(); // só quem está logado pode criar torneio

const formulario = document.getElementById('formTorneio');
const caixaDeErro = document.getElementById('erroTorneio');
const previa = document.getElementById('previaTorneio');

// Data padrão: amanhã às 20h
const amanha = new Date();
amanha.setDate(amanha.getDate() + 1);
amanha.setHours(20, 0, 0, 0);
document.getElementById('inicio').value =
  amanha.getFullYear() + '-' + doisDigitos(amanha.getMonth() + 1) + '-' + doisDigitos(amanha.getDate()) + 'T20:00';

// Junta tudo o que foi digitado em um objeto
function lerFormulario() {
  const dados = new FormData(formulario);
  return {
    nome: dados.get('nome'),
    modo: dados.get('modo'),
    modoDeJogo: dados.get('modoDeJogo'),
    formato: dados.get('formato'),
    vagas: dados.get('vagas'),
    inicio: dados.get('inicio'),
    premio: dados.get('premio'),
    regiao: dados.get('regiao'),
    descricao: dados.get('descricao'),
    regras: dados.get('regras'),
    arte: dados.get('arte')
  };
}

// Atualiza a prévia do cartão sempre que algo muda
function atualizarPrevia() {
  const d = lerFormulario();
  const torneioDeMentira = {
    id: '',
    nome: d.nome || 'Nome do torneio',
    modo: d.modo,
    modoDeJogo: d.modoDeJogo,
    formato: d.formato,
    vagas: parseInt(d.vagas, 10),
    inicio: d.inicio ? new Date(d.inicio).toISOString() : new Date().toISOString(),
    premio: d.premio || 'Sem premiação',
    regiao: d.regiao,
    status: 'inscricoes',
    arte: d.arte,
    participantes: []
  };
  previa.innerHTML = cartaoTorneioHtml(torneioDeMentira);
  previa.querySelector('a').removeAttribute('href');
}

formulario.addEventListener('input', atualizarPrevia);
formulario.addEventListener('change', atualizarPrevia);
atualizarPrevia();

formulario.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const resultado = criarTorneio(lerFormulario());
  if (!resultado.ok) {
    caixaDeErro.textContent = resultado.erro;
    caixaDeErro.classList.add('visivel');
    return;
  }
  window.location.href = 'torneio.html?id=' + resultado.torneio.id;
});
