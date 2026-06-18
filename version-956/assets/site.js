(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function text(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  ready(function () {
    var toggle = document.querySelector('.mobile-toggle');
    var panel = document.querySelector('.mobile-panel');

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('open');
      });
    }

    document.querySelectorAll('.hero-carousel').forEach(function (carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
      var prev = carousel.querySelector('.hero-control.prev');
      var next = carousel.querySelector('.hero-control.next');
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(Number(dot.getAttribute('data-target')) || 0);
          start();
        });
      });

      if (prev) {
        prev.addEventListener('click', function () {
          show(index - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener('click', function () {
          show(index + 1);
          start();
        });
      }

      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      show(0);
      start();
    });

    document.querySelectorAll('.filter-panel').forEach(function (panel) {
      var root = panel.parentElement || document;
      var cards = Array.prototype.slice.call(root.querySelectorAll('.movie-card'));
      var keyword = panel.querySelector('.filter-input');
      var year = panel.querySelector('.filter-year');
      var region = panel.querySelector('.filter-region');
      var category = panel.querySelector('[data-filter="category"]');
      var grid = root.querySelector('.movie-grid');
      var empty = null;

      if (!grid || !cards.length) {
        return;
      }

      function getCardText(card) {
        return text([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category'),
          card.innerText
        ].join(' '));
      }

      function apply() {
        var q = text(keyword && keyword.value);
        var y = text(year && year.value);
        var r = text(region && region.value);
        var c = text(category && category.value);
        var shown = 0;

        cards.forEach(function (card) {
          var haystack = getCardText(card);
          var ok = true;
          if (q && haystack.indexOf(q) === -1) {
            ok = false;
          }
          if (y && text(card.getAttribute('data-year')).indexOf(y) === -1) {
            ok = false;
          }
          if (r && text(card.getAttribute('data-region')).indexOf(r) === -1) {
            ok = false;
          }
          if (c && text(card.getAttribute('data-category')) !== c) {
            ok = false;
          }
          card.classList.toggle('hidden', !ok);
          if (ok) {
            shown += 1;
          }
        });

        if (!empty) {
          empty = document.createElement('div');
          empty.className = 'no-results';
          empty.textContent = '未找到匹配影片';
          grid.appendChild(empty);
        }
        empty.style.display = shown ? 'none' : 'block';
      }

      [keyword, year, region, category].forEach(function (control) {
        if (control) {
          control.addEventListener('input', apply);
          control.addEventListener('change', apply);
        }
      });

      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q');
      if (initialQuery && keyword) {
        keyword.value = initialQuery;
      }
      apply();
    });
  });
})();
