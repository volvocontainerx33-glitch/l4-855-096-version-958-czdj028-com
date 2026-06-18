(function () {
    var shell = document.querySelector("[data-player]");
    if (!shell) {
        return;
    }

    var video = shell.querySelector("video");
    var overlay = shell.querySelector(".play-overlay");

    if (!video) {
        return;
    }

    var src = video.getAttribute("data-src");
    var hlsInstance = null;

    function prepare() {
        if (!src || video.getAttribute("data-ready") === "1") {
            return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls({
                maxBufferLength: 30,
                backBufferLength: 30
            });
            hlsInstance.loadSource(src);
            hlsInstance.attachMedia(video);
        } else {
            video.src = src;
        }

        video.setAttribute("data-ready", "1");
    }

    function begin() {
        prepare();

        if (overlay) {
            overlay.classList.add("is-hidden");
        }

        var playing = video.play();
        if (playing && playing.catch) {
            playing.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener("click", begin);
    }

    video.addEventListener("click", function () {
        if (video.paused) {
            begin();
        }
    });

    video.addEventListener("play", function () {
        if (overlay) {
            overlay.classList.add("is-hidden");
        }
    });

    video.addEventListener("pause", function () {
        if (overlay && video.currentTime === 0) {
            overlay.classList.remove("is-hidden");
        }
    });

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
            hlsInstance = null;
        }
    });
})();
