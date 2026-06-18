function setupMoviePlayer(videoId, overlayId, streamUrl) {
  var video = document.getElementById(videoId);
  var overlay = document.getElementById(overlayId);
  var hlsInstance = null;
  var ready = false;

  if (!video || !overlay || !streamUrl) {
    return;
  }

  function attachStream() {
    if (ready) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      ready = true;
      return;
    }

    video.src = streamUrl;
    ready = true;
  }

  function play() {
    attachStream();
    overlay.classList.add("is-hidden");
    video.controls = true;
    var attempt = video.play();

    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {
        overlay.classList.remove("is-hidden");
      });
    }
  }

  overlay.addEventListener("click", play);

  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener("play", function () {
    overlay.classList.add("is-hidden");
  });

  video.addEventListener("ended", function () {
    overlay.classList.remove("is-hidden");
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance && typeof hlsInstance.destroy === "function") {
      hlsInstance.destroy();
    }
  });
}
