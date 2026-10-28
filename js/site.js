(function () {
  var doc = document.documentElement;
  var reduz = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Abertura: revela a foto da equipe assim que ela carrega */
  var foto = document.getElementById('foto-equipe');
  function heroPronto() { requestAnimationFrame(function () { requestAnimationFrame(function () { doc.classList.add('hero-pronto'); }); }); }
  if (foto && !foto.complete) { foto.addEventListener('load', heroPronto); foto.addEventListener('error', heroPronto); } else { heroPronto(); }

  /* Cabeçalho sólido após o início da rolagem */
  var topo = document.getElementById('topo');
  function atualizaTopo() { topo.classList.toggle('solido', window.scrollY > 24); }
  atualizaTopo();
  window.addEventListener('scroll', atualizaTopo, { passive: true });

  /* Menu mobile */
  var bt = document.querySelector('.menu-bt');
  var nav = document.getElementById('nav');
  function fechaMenu() {
    nav.classList.remove('aberto'); bt.setAttribute('aria-expanded', 'false'); bt.setAttribute('aria-label', 'Abrir menu');
  }
  bt.addEventListener('click', function () {
    var aberto = nav.classList.toggle('aberto');
    bt.setAttribute('aria-expanded', String(aberto));
    bt.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    if (aberto) topo.classList.add('solido'); else atualizaTopo();
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) fechaMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('aberto')) { fechaMenu(); bt.focus(); } });

  /* Entrada alternada dos perfis: esquerda, direita, esquerda... */
  var perfis = document.querySelectorAll('.perfil[data-entrada]');
  if (!reduz && 'IntersectionObserver' in window) {
    doc.classList.add('js');
    var obs = new IntersectionObserver(function (itens) {
      itens.forEach(function (it) {
        if (it.isIntersecting) { it.target.classList.add('visivel'); obs.unobserve(it.target); }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    perfis.forEach(function (p) { obs.observe(p); });
    /* Um link direto (#nome) mostra o perfil imediatamente */
    function revelaAlvo() {
      var alvo = location.hash && document.getElementById(location.hash.slice(1));
      if (alvo && alvo.classList.contains('perfil')) alvo.classList.add('visivel');
    }
    revelaAlvo(); window.addEventListener('hashchange', revelaAlvo);
  }

  /* Copiar telefone e e-mail */
  document.querySelectorAll('.copiar').forEach(function (b) {
    b.addEventListener('click', function () {
      var el = document.getElementById(b.getAttribute('data-copiar'));
      var txt = el.textContent.trim();
      function ok() { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1800); }
      function seleciona() {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        b.textContent = 'Selecionado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1800);
      }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, seleciona);
        else seleciona();
      } catch (e) { seleciona(); }
    });
  });

  /* Mapa sob demanda (carrega o Google Maps só quando o visitante pede) */
  var carregar = document.getElementById('carregar-mapa');
  if (carregar) {
    carregar.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=Av.+Ailton+Gomes%2C+5051%2C+Lagoa+Seca%2C+Juazeiro+do+Norte+-+CE%2C+63048-282&output=embed';
      f.title = 'Mapa com a localização do Costa Matos Advogados';
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      document.getElementById('mapa').appendChild(f);
      carregar.parentNode.hidden = true;
    });
  }

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
