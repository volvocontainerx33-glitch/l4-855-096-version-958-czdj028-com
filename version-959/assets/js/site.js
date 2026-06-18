(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
      toggle.textContent = menu.classList.contains('is-open') ? '×' : '☰';
    });
  }

  function initSearchForms() {
    document.querySelectorAll('[data-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          event.preventDefault();
          input && input.focus();
        }
      });
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) return;
    var active = 0;
    var timer;
    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    }
    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }
    function stop() {
      if (timer) window.clearInterval(timer);
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);
    }
    start();
  }

  function initInlineFilter() {
    var input = document.querySelector('[data-inline-filter]');
    var scope = document.querySelector('[data-card-scope]');
    if (!input || !scope) return;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var hay = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        card.classList.toggle('is-hidden-card', value && hay.indexOf(value) === -1);
      });
    });
  }

  function esc(value) {
    return String(value || '').replace(/[&<>"]/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch];
    });
  }

  function card(item) {
    var tags = (item.tags || []).slice(0, 3).map(function (tag) {
      return '<span class="tag-pill">' + esc(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '<a href="' + esc(item.url) + '" class="movie-card-link" aria-label="' + esc(item.title) + '">',
      '<div class="movie-poster">',
      '<img src="' + esc(item.cover) + '" alt="' + esc(item.title) + '" loading="lazy">',
      '<div class="poster-shade"></div>',
      '<span class="poster-meta poster-meta-left">' + esc(item.region) + ' · ' + esc(item.type) + '</span>',
      '<span class="poster-meta poster-meta-right">' + esc(item.year) + '</span>',
      '<span class="poster-play">▶</span>',
      '</div>',
      '<div class="movie-card-body">',
      '<h3>' + esc(item.title) + '</h3>',
      '<p>' + esc(item.one_line) + '</p>',
      '<div class="tag-list">' + tags + '</div>',
      '</div>',
      '</a>',
      '</article>'
    ].join('');
  }

  function initSearchPage() {
    var input = document.getElementById('search-input');
    var region = document.getElementById('search-region');
    var type = document.getElementById('search-type');
    var results = document.getElementById('search-results');
    var status = document.getElementById('search-status');
    if (!input || !results || !window.SEARCH_INDEX) return;
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    input.value = q;
    function render() {
      var keyword = input.value.trim().toLowerCase();
      var regionValue = region ? region.value : '';
      var typeValue = type ? type.value : '';
      var items = window.SEARCH_INDEX.filter(function (item) {
        var hay = [item.title, item.region, item.type, item.year, item.genre, (item.tags || []).join(' '), item.one_line].join(' ').toLowerCase();
        if (keyword && hay.indexOf(keyword) === -1) return false;
        if (regionValue && String(item.region || '').indexOf(regionValue) === -1) return false;
        if (typeValue && String(item.type || '').indexOf(typeValue) === -1) return false;
        return true;
      }).slice(0, 96);
      results.innerHTML = items.map(card).join('');
      status.textContent = items.length ? '已为你筛选出相关影片' : '暂未找到匹配影片';
    }
    input.addEventListener('input', render);
    if (region) region.addEventListener('change', render);
    if (type) type.addEventListener('change', render);
    render();
  }

  ready(function () {
    initMenu();
    initSearchForms();
    initHero();
    initInlineFilter();
    initSearchPage();
  });
})();
