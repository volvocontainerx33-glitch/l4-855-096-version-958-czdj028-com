import { H as Hls } from "./hls.js";

function initPlayers() {
  document.querySelectorAll("[data-player]").forEach(function (player) {
    var video = player.querySelector("video[data-stream]");
    var overlay = player.querySelector(".player-overlay");
    var attached = false;
    var hls = null;

    if (!video) {
      return;
    }

    function attachStream() {
      var stream = video.getAttribute("data-stream");

      if (attached || !stream) {
        return;
      }

      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        return;
      }

      if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
        return;
      }

      video.src = stream;
    }

    function startPlayback() {
      attachStream();

      if (overlay) {
        overlay.classList.add("is-hidden");
      }

      video.setAttribute("controls", "controls");
      var result = video.play();

      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPlayers);
} else {
  initPlayers();
}
