/* =====================================================================
   noticia.js — página noticia.html?id=...
   Mostra uma notícia completa e sugere outras.
   ===================================================================== */

const noticia = buscarNoticia(parametroDaUrl('id'));

if (!noticia) {
  window.location.replace('404.html');
} else {
  document.title = noticia.titulo + ' — Rivals Arena';
  document.getElementById('migalhaNoticia').textContent = noticia.titulo;
  document.getElementById('categoriaNoticia').textContent = noticia.categoria;
  document.getElementById('tituloNoticia').textContent = noticia.titulo;
  document.getElementById('dataNoticia').textContent = formatarDataCurta(noticia.data);
  document.getElementById('arteNoticia').classList.add('arte-' + noticia.arte);

  // Cada item de "texto" vira um parágrafo
  document.getElementById('textoNoticia').innerHTML = noticia.texto.map(function (paragrafo) {
    return '<p>' + escaparHtml(paragrafo) + '</p>';
  }).join('');

  const link = document.getElementById('linkNoticia');
  if (noticia.link) link.href = noticia.link;
  else link.hidden = true;

  // Outras 3 notícias
  const outras = banco.noticias
    .filter(function (n) { return n.id !== noticia.id; })
    .sort(function (a, b) { return new Date(b.data) - new Date(a.data); })
    .slice(0, 3);
  document.getElementById('outrasNoticias').innerHTML = outras.map(cartaoNoticiaHtml).join(''); // função em comum.js
}
