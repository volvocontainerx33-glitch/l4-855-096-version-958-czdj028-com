(function () {
  var hlsLoader = null;
  var hlsUrl = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js';

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (hlsLoader) {
      return hlsLoader;
    }
    hlsLoader = new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = hlsUrl;
      script.async = true;
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return hlsLoader;
  }

  function playVideo(shell, video, source) {
    shell.classList.add('is-loading');

    function begin() {
      shell.classList.remove('is-loading');
      shell.classList.add('is-playing');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          shell.classList.remove('is-playing');
        });
      }
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = source;
      }
      begin();
      return;
    }

    loadHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        if (video._hls) {
          video._hls.destroy();
        }
        var hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        video._hls = hls;
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, begin);
        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            shell.classList.remove('is-loading');
            video.src = source;
          }
        });
      } else {
        video.src = source;
        begin();
      }
    }).catch(function () {
      shell.classList.remove('is-loading');
      video.src = source;
      begin();
    });
  }

  function setup(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-overlay');
    var source = shell.getAttribute('data-src');

    if (!video || !button || !source) {
      return;
    }

    var started = false;

    function start(event) {
      if (event) {
        event.preventDefault();
      }
      if (started && !video.paused) {
        return;
      }
      started = true;
      playVideo(shell, video, source);
    }

    button.addEventListener('click', start);
    shell.addEventListener('click', function (event) {
      if (event.target === video && !started) {
        start(event);
      }
    });
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        shell.classList.remove('is-playing');
      }
    });
  }

  if (document.readyState !== 'loading') {
    document.querySelectorAll('.player-shell').forEach(setup);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.querySelectorAll('.player-shell').forEach(setup);
    });
  }
})();
