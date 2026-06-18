(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var toggle = qs('[data-mobile-toggle]');
  var panel = qs('[data-mobile-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = qsa('[data-hero-slide]');
  var dots = qsa('[data-hero-dot]');
  var current = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  if (slides.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function filterCards(input, root) {
    var keyword = normalize(input.value);
    var cards = qsa('[data-card]', root || document);
    var shown = 0;
    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.textContent
      ].join(' '));
      var matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.classList.toggle('is-hidden', !matched);
      if (matched) {
        shown += 1;
      }
    });
    var count = qs('[data-result-count]');
    if (count) {
      count.textContent = keyword ? '找到 ' + shown + ' 部匹配影片' : '共 ' + cards.length + ' 部影片';
    }
  }

  qsa('[data-local-filter]').forEach(function (form) {
    var input = qs('[data-filter-input]', form);
    if (!input) {
      return;
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      filterCards(input, document);
    });
    input.addEventListener('input', function () {
      filterCards(input, document);
    });
  });

  var searchInput = qs('[data-search-input]');
  var searchForm = qs('[data-search-page-form]');
  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    searchInput.value = query;
    filterCards(searchInput, document);
    searchInput.addEventListener('input', function () {
      filterCards(searchInput, document);
    });
    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        filterCards(searchInput, document);
        if (history.replaceState) {
          var next = searchInput.value ? '?q=' + encodeURIComponent(searchInput.value) : window.location.pathname;
          history.replaceState(null, '', next);
        }
      });
    }
  }
})();
