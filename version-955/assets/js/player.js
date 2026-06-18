document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (shell) {
        var video = shell.querySelector('video[data-stream]');
        var overlay = shell.querySelector('.play-overlay');
        var status = shell.querySelector('.player-status');
        var streamUrl = video ? video.getAttribute('data-stream') : '';
        var ready = false;
        var hls = null;

        if (!video || !streamUrl) {
            return;
        }

        function setStatus(text) {
            if (status) {
                status.textContent = text || '';
            }
        }

        function attachStream() {
            if (ready) {
                return;
            }

            if (/\.mp4($|\?)/i.test(streamUrl)) {
                video.src = streamUrl;
                ready = true;
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                ready = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setStatus('播放加载遇到异常，可刷新后重试');
                    }
                });
                ready = true;
                return;
            }

            video.src = streamUrl;
            ready = true;
        }

        function startPlay() {
            attachStream();
            var playTask = video.play();
            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {
                    setStatus('点击视频区域继续播放');
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', startPlay);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlay();
            }
        });

        video.addEventListener('play', function () {
            shell.classList.add('is-playing');
            setStatus('');
        });

        video.addEventListener('pause', function () {
            shell.classList.remove('is-playing');
        });

        video.addEventListener('ended', function () {
            shell.classList.remove('is-playing');
        });

        attachStream();
    });
});
