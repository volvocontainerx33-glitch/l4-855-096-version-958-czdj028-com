(function () {
  var body = document.body;
  var toggle = document.querySelector('.menu-toggle');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var opened = body.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        var active = i === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', active ? 'false' : 'true');
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
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

    show(0);
    restart();
  });

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var keywordInput = document.getElementById('searchKeyword');
  var yearInput = document.getElementById('filterYear');
  var regionInput = document.getElementById('filterRegion');
  var genreInput = document.getElementById('filterGenre');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
  var empty = document.querySelector('[data-search-empty]');

  if (keywordInput && initialQuery) {
    keywordInput.value = initialQuery;
  }

  function cardText(card) {
    return [
      card.getAttribute('data-title') || '',
      card.getAttribute('data-region') || '',
      card.getAttribute('data-year') || '',
      card.getAttribute('data-genre') || '',
      card.getAttribute('data-tags') || ''
    ].join(' ').toLowerCase();
  }

  function applyFilters() {
    if (!keywordInput || !cards.length) {
      return;
    }

    var q = keywordInput.value.trim().toLowerCase();
    var year = yearInput ? yearInput.value : '';
    var region = regionInput ? regionInput.value : '';
    var genre = genreInput ? genreInput.value : '';
    var visible = 0;

    cards.forEach(function (card) {
      var text = cardText(card);
      var cardRegion = card.getAttribute('data-region') || '';
      var cardYear = card.getAttribute('data-year') || '';
      var cardGenre = card.getAttribute('data-genre') || '';
      var matched = true;

      if (q && text.indexOf(q) === -1) {
        matched = false;
      }

      if (year && cardYear !== year) {
        matched = false;
      }

      if (region) {
        if (region === '日韩') {
          matched = matched && (cardRegion.indexOf('日本') !== -1 || cardRegion.indexOf('韩国') !== -1 || cardRegion.indexOf('日韩') !== -1);
        } else if (region === '华语') {
          matched = matched && (cardRegion.indexOf('中国') !== -1 || cardRegion.indexOf('香港') !== -1 || cardRegion.indexOf('台湾') !== -1 || cardRegion.indexOf('大陆') !== -1 || cardRegion.indexOf('内地') !== -1);
        } else if (region === '欧美') {
          matched = matched && /(美国|英国|法国|德国|西班牙|意大利|俄罗斯|欧美|加拿大|澳大利亚|比利时|瑞典|丹麦|荷兰|挪威)/.test(cardRegion);
        } else {
          matched = matched && !/(日本|韩国|日韩|中国|香港|台湾|大陆|内地|美国|英国|法国|德国|西班牙|意大利|俄罗斯|欧美|加拿大|澳大利亚|比利时|瑞典|丹麦|荷兰|挪威)/.test(cardRegion);
        }
      }

      if (genre && cardGenre.indexOf(genre) === -1 && text.indexOf(genre.toLowerCase()) === -1) {
        matched = false;
      }

      card.style.display = matched ? '' : 'none';

      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-active', visible === 0);
    }
  }

  [keywordInput, yearInput, regionInput, genreInput].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  applyFilters();
})();

function initVideoPlayer(mediaUrl) {
  var video = document.querySelector('[data-player-video]');
  var mask = document.querySelector('[data-player-mask]');
  var button = document.querySelector('[data-player-button]');
  var shortcuts = Array.prototype.slice.call(document.querySelectorAll('[data-player-shortcut]'));
  var ready = false;
  var hlsInstance = null;

  if (!video || !mediaUrl) {
    return;
  }

  function loadMedia() {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = mediaUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(mediaUrl);
      hlsInstance.attachMedia(video);
    } else {
      video.src = mediaUrl;
    }
  }

  function start() {
    loadMedia();
    video.setAttribute('controls', 'controls');

    if (mask) {
      mask.classList.add('is-hidden');
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {});
    }
  }

  if (mask) {
    mask.addEventListener('click', start);
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      start();
    });
  }

  shortcuts.forEach(function (shortcut) {
    shortcut.addEventListener('click', start);
  });

  video.addEventListener('click', function () {
    if (video.paused) {
      start();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
