/* =====================================================================
   torneios.js — página torneios.html
   Lista todos os torneios e aplica os filtros escolhidos.
   ===================================================================== */

const campoBusca = document.getElementById('buscaTorneio');
const seletorModo = document.getElementById('filtroModo');
const seletorModoDeJogo = document.getElementById('filtroModoDeJogo');
const seletorOrdem = document.getElementById('ordenarTorneios');
const listaTorneios = document.getElementById('listaTorneios');
const contagem = document.getElementById('contagemTorneios');
const chips = document.querySelectorAll('#chipsStatus .chip');

let statusEscolhido = 'todos';

function mostrarTorneios() {
  const busca = campoBusca.value.trim().toLowerCase();
  const eu = usuarioLogado();

  // 1) Filtra
  let lista = banco.torneios.filter(function (t) {
    if (busca && t.nome.toLowerCase().indexOf(busca) === -1) return false;
    if (seletorModo.value && t.modo !== seletorModo.value) return false;
    if (seletorModoDeJogo.value && t.modoDeJogo !== seletorModoDeJogo.value) return false;
    if (statusEscolhido === 'meus') {
      return eu && (t.organizador === eu.id || participacaoDoJogador(t, eu.id));
    }
    if (statusEscolhido !== 'todos' && t.status !== statusEscolhido) return false;
    return true;
  });

  // 2) Ordena
  if (seletorOrdem.value === 'nome') {
    lista.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
  } else if (seletorOrdem.value === 'vagas') {
    lista.sort(function (a, b) { return (b.vagas - b.participantes.length) - (a.vagas - a.participantes.length); });
  } else {
    // ao vivo primeiro, depois os próximos, e os finalizados por último
    const peso = { andamento: 0, inscricoes: 1, finalizado: 2 };
    lista.sort(function (a, b) { return peso[a.status] - peso[b.status] || new Date(a.inicio) - new Date(b.inicio); });
  }

  // 3) Mostra na tela
  contagem.textContent = lista.length + (lista.length === 1 ? ' torneio encontrado' : ' torneios encontrados');

  let textoVazio = '<b>Nenhum torneio encontrado</b>Tente mudar os filtros ou crie um torneio novo.<br><a class="btn btn-primary btn-sm" href="criar-torneio.html">CRIAR TORNEIO</a>';
  if (statusEscolhido === 'meus' && !eu) {
    textoVazio = '<b>Entre na sua conta</b>Para ver os seus torneios, faça login.<br><a class="btn btn-primary btn-sm" href="entrar.html?voltar=torneios.html">ENTRAR</a>';
  }
  preencherLista(listaTorneios, lista, cartaoTorneioHtml, textoVazio);
}

// Cliques nos botões de status
chips.forEach(function (chip) {
  chip.addEventListener('click', function () {
    chips.forEach(function (c) { c.classList.remove('ativo'); });
    chip.classList.add('ativo');
    statusEscolhido = chip.getAttribute('data-status');
    mostrarTorneios();
  });
});

campoBusca.addEventListener('input', mostrarTorneios);
seletorModo.addEventListener('change', mostrarTorneios);
seletorModoDeJogo.addEventListener('change', mostrarTorneios);
seletorOrdem.addEventListener('change', mostrarTorneios);

// Permite abrir já filtrado, ex.: torneios.html?status=andamento ou ?modoDeJogo=Mata-Mata
const statusDaUrl = parametroDaUrl('status');
if (statusDaUrl) {
  chips.forEach(function (c) { c.classList.toggle('ativo', c.getAttribute('data-status') === statusDaUrl); });
  statusEscolhido = statusDaUrl;
}
if (parametroDaUrl('modoDeJogo')) seletorModoDeJogo.value = parametroDaUrl('modoDeJogo');
if (parametroDaUrl('modo')) seletorModo.value = parametroDaUrl('modo');

mostrarTorneios();
