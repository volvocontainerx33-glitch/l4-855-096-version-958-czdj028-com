(function () {
  const configNode = document.getElementById('movie-config');
  const video = document.querySelector('.movie-player');
  const startButton = document.querySelector('.js-player-start');

  if (!configNode || !video || !startButton) {
    return;
  }

  let config = {};
  let loaded = false;

  try {
    config = JSON.parse(configNode.textContent || '{}');
  } catch (error) {
    config = {};
  }

  function loadVideo() {
    if (loaded) {
      video.play();
      return;
    }

    loaded = true;
    startButton.classList.add('hide');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = config.url;
      video.play();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(config.url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
      return;
    }

    video.src = config.url;
    video.play();
  }

  startButton.addEventListener('click', loadVideo);
  video.addEventListener('click', function () {
    if (!loaded) {
      loadVideo();
    }
  });
})();
