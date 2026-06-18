var video = document.getElementById('movie-video');
var action = document.getElementById('player-action');
var configNode = document.getElementById('player-config');
var attached = false;
var instance = null;

function source() {
  try {
    return JSON.parse(configNode.textContent || '{}').src || '';
  } catch (error) {
    return '';
  }
}

function attach() {
  if (!video || attached) return;
  var src = source();
  if (!src) return;
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
  } else if (window.Hls && window.Hls.isSupported()) {
    instance = new window.Hls({
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 60
    });
    instance.loadSource(src);
    instance.attachMedia(video);
  } else {
    video.src = src;
  }
  attached = true;
}

function play() {
  attach();
  if (action) action.classList.add('is-hidden');
  var promise = video && video.play ? video.play() : null;
  if (promise && promise.catch) promise.catch(function () {});
}

if (action) {
  action.addEventListener('click', play);
}

if (video) {
  video.addEventListener('click', function () {
    if (!attached) play();
  });
  video.addEventListener('play', function () {
    if (!attached) attach();
    if (action) action.classList.add('is-hidden');
  });
}

window.addEventListener('pagehide', function () {
  if (instance) instance.destroy();
});
