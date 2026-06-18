import { H as Hls } from './hls-module.js';

function setupPlayer(root) {
  const video = root.querySelector('video');
  const button = root.querySelector('[data-play-button]');
  const status = root.querySelector('[data-player-status]');
  const hlsSrc = root.getAttribute('data-hls');
  const mp4Src = root.getAttribute('data-mp4');
  let initialized = false;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function initSource() {
    if (initialized) {
      return;
    }
    initialized = true;

    if (hlsSrc && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = hlsSrc;
      setStatus('正在使用浏览器原生 HLS 播放。');
      return;
    }

    if (hlsSrc && Hls && Hls.isSupported && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(hlsSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setStatus('m3u8 播放源已加载。');
      });
      hls.on(Hls.Events.ERROR, function (eventName, data) {
        if (data && data.fatal && mp4Src) {
          video.src = mp4Src;
          setStatus('m3u8 加载异常，已切换备用 MP4。');
        }
      });
      return;
    }

    if (mp4Src) {
      video.src = mp4Src;
      setStatus('当前浏览器使用 MP4 备用源播放。');
    }
  }

  async function playVideo() {
    initSource();
    root.classList.add('is-playing');
    try {
      await video.play();
      setStatus('正在播放。');
    } catch (error) {
      root.classList.remove('is-playing');
      setStatus('浏览器阻止了自动播放，请再次点击播放按钮。');
    }
  }

  if (button) {
    button.addEventListener('click', playVideo);
  }

  video.addEventListener('play', function () {
    root.classList.add('is-playing');
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) {
      root.classList.remove('is-playing');
    }
  });
}

document.querySelectorAll('[data-player]').forEach(setupPlayer);
