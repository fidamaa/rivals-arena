/* =====================================================================
   novidades.js — página novidades.html
   Lista as notícias, com filtro por categoria.
   ===================================================================== */

// cartaoNoticiaHtml() está em comum.js
let categoriaEscolhida = parametroDaUrl('categoria') || '';
const chipsCategoria = document.querySelectorAll('#chipsCategoria .chip');

function mostrarNoticias() {
  const lista = banco.noticias
    .filter(function (n) { return !categoriaEscolhida || n.categoria === categoriaEscolhida; })
    .sort(function (a, b) { return new Date(b.data) - new Date(a.data); });
  preencherLista(document.getElementById('listaNoticias'), lista, cartaoNoticiaHtml, '<b>Nenhuma novidade nesta categoria</b>');
  chipsCategoria.forEach(function (c) { c.classList.toggle('ativo', c.getAttribute('data-categoria') === categoriaEscolhida); });
}

chipsCategoria.forEach(function (chip) {
  chip.addEventListener('click', function () {
    categoriaEscolhida = chip.getAttribute('data-categoria');
    mostrarNoticias();
  });
});

mostrarNoticias();
