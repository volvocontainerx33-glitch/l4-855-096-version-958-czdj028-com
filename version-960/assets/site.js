(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function text(value) {
    return String(value || '').toLowerCase().trim();
  }

  function escapeHTML(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function setupMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function setupSearchForms() {
    document.querySelectorAll('.search-form').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        var input = form.querySelector('input[name="q"]');
        if (!input || !input.value.trim()) {
          return;
        }
        event.preventDefault();
        window.location.href = './search.html?q=' + encodeURIComponent(input.value.trim());
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, pos) {
        slide.classList.toggle('active', pos === index);
      });
      dots.forEach(function (dot, pos) {
        dot.classList.toggle('active', pos === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5600);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    restart();
  }

  function setupCardFilter() {
    var input = document.querySelector('[data-card-filter]');
    if (!input) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    input.addEventListener('input', function () {
      var query = text(input.value);
      cards.forEach(function (card) {
        var source = text([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region')
        ].join(' '));
        card.classList.toggle('hidden-card', query && source.indexOf(query) === -1);
      });
    });
  }

  function setupRankFilter() {
    var input = document.querySelector('[data-rank-filter]');
    var list = document.querySelector('[data-rank-list]');
    if (!input || !list) {
      return;
    }
    var items = Array.prototype.slice.call(list.querySelectorAll('.rank-item'));
    input.addEventListener('input', function () {
      var query = text(input.value);
      items.forEach(function (item) {
        item.classList.toggle('hidden-rank', query && text(item.textContent).indexOf(query) === -1);
      });
    });
  }

  function cardHTML(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHTML(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '<a class="movie-poster" href="./' + escapeHTML(movie.file) + '">',
      '<img src="' + escapeHTML(movie.cover) + '" alt="' + escapeHTML(movie.title) + '" loading="lazy">',
      '<span class="poster-shade"></span>',
      '<span class="play-chip">▶</span>',
      '<span class="movie-badge">' + escapeHTML(movie.region) + ' · ' + escapeHTML(movie.year) + '</span>',
      '</a>',
      '<div class="movie-card-body">',
      '<h3><a href="./' + escapeHTML(movie.file) + '">' + escapeHTML(movie.title) + '</a></h3>',
      '<p>' + escapeHTML(movie.one_line) + '</p>',
      '<div class="movie-tags">' + tags + '</div>',
      '<div class="movie-meta">' + escapeHTML(movie.genre) + '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function renderSearchPage() {
    var panel = document.querySelector('[data-search-panel]');
    var results = document.querySelector('[data-search-results]');
    var summary = document.querySelector('[data-search-summary]');
    if (!panel || !results || !summary || !window.SEARCH_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    var category = params.get('category') || '';
    var year = params.get('year') || '';
    panel.q.value = q;
    panel.category.value = category;
    panel.year.value = year;

    function apply() {
      var query = text(panel.q.value);
      var selectedCategory = panel.category.value;
      var selectedYear = text(panel.year.value);
      var matches = window.SEARCH_INDEX.filter(function (movie) {
        var haystack = text([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          (movie.tags || []).join(' '),
          movie.one_line
        ].join(' '));
        var byQuery = !query || haystack.indexOf(query) !== -1;
        var byCategory = !selectedCategory || movie.category === selectedCategory;
        var byYear = !selectedYear || text(movie.year).indexOf(selectedYear) !== -1;
        return byQuery && byCategory && byYear;
      }).slice(0, 120);
      summary.textContent = matches.length ? '为你匹配到以下内容' : '没有找到匹配内容，可以调整关键词继续筛选';
      results.innerHTML = matches.map(cardHTML).join('');
    }

    panel.addEventListener('submit', function (event) {
      event.preventDefault();
      var next = new URLSearchParams();
      if (panel.q.value.trim()) {
        next.set('q', panel.q.value.trim());
      }
      if (panel.category.value) {
        next.set('category', panel.category.value);
      }
      if (panel.year.value.trim()) {
        next.set('year', panel.year.value.trim());
      }
      history.replaceState(null, '', './search.html' + (next.toString() ? '?' + next.toString() : ''));
      apply();
    });

    apply();
  }

  window.initMoviePlayer = function (streamUrl) {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var hls = null;
    if (!video || !streamUrl) {
      return;
    }

    function attach() {
      if (video.getAttribute('data-ready') === '1') {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
      video.setAttribute('data-ready', '1');
    }

    function play() {
      attach();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener('click', play);
    }

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  };

  ready(function () {
    setupMenu();
    setupSearchForms();
    setupHero();
    setupCardFilter();
    setupRankFilter();
    renderSearchPage();
  });
}());
