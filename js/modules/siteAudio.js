(function () {
  const MUSIC_KEY = 'eol-music-enabled';
  const TIME_KEY = 'eol-music-time';

  function setupSiteMusic() {
    const audio = document.getElementById('siteMusic');
    const button = document.getElementById('musicToggle');
    const status = document.getElementById('musicStatus');
    if (!audio || !button) return;

    audio.volume = 0.55;
    audio.loop = true;

    let stored = localStorage.getItem(MUSIC_KEY);
    let enabled = stored !== 'false';
    const savedTime = Number.parseFloat(localStorage.getItem(TIME_KEY) || '0');

    function updateUI(playing) {
      button.classList.toggle('is-on', enabled);
      button.classList.toggle('is-playing', playing);
      button.setAttribute('aria-pressed', String(enabled));
      button.setAttribute('aria-label', enabled ? 'Turn music off' : 'Turn music on');
      if (status) status.textContent = playing ? 'PLAYING' : 'OFF';
    }

    function restorePosition() {
      if (Number.isFinite(savedTime) && savedTime >= 0 && Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = Math.min(savedTime, Math.max(0, audio.duration - 0.25));
      }
    }

    async function startMusic() {
      if (!enabled) { updateUI(false); return; }
      try {
        restorePosition();
        await audio.play();
        updateUI(true);
      } catch (error) {
        // Browser autoplay policy may block audible media until the site is engaged.
        // Keep music enabled and retry on the first browser-approved event.
        updateUI(false);
        console.warn('Echoes of Life music autoplay was blocked by the browser:', error);
      }
    }

    button.addEventListener('click', async function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (audio.paused) {
        enabled = true;
        localStorage.setItem(MUSIC_KEY, 'true');
        await startMusic();
      } else {
        enabled = false;
        localStorage.setItem(MUSIC_KEY, 'false');
        localStorage.setItem(TIME_KEY, String(audio.currentTime));
        audio.pause();
        updateUI(false);
      }
    });

    // Start music immediately when the page loads. Browsers block audio-with-sound
    // before the visitor has interacted with the page at all — that's a fixed
    // platform policy, not something any site code can override. So: try right
    // away (works if the visitor already engaged earlier this session), and if
    // that's blocked, start on the very first real click/tap/keypress anywhere
    // on the page — not specifically on the music button.
    startMusic();
    let armed = true;
    function retryOnFirstGesture() {
      if (!armed) return;
      armed = false;
      cleanup();
      if (enabled && audio.paused) startMusic();
    }
    function cleanup() {
      ['pointerdown', 'keydown', 'touchstart'].forEach(type => {
        window.removeEventListener(type, retryOnFirstGesture, { capture: true });
      });
    }
    ['pointerdown', 'keydown', 'touchstart'].forEach(type => {
      window.addEventListener(type, retryOnFirstGesture, { capture: true, passive: true });
    });

    audio.addEventListener('loadedmetadata', restorePosition);
    audio.addEventListener('play', function () { updateUI(true); });
    audio.addEventListener('pause', function () { updateUI(false); });
    audio.addEventListener('timeupdate', function () {
      if (Number.isFinite(audio.currentTime)) localStorage.setItem(TIME_KEY, String(audio.currentTime));
    });
    audio.addEventListener('error', function () {
      if (status) status.textContent = 'AUDIO ERROR';
      console.error('Echoes of Life: audio file failed to load:', audio.currentSrc);
    });

    window.addEventListener('pagehide', function () {
      if (Number.isFinite(audio.currentTime)) localStorage.setItem(TIME_KEY, String(audio.currentTime));
    });

    updateUI(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSiteMusic, { once: true });
  } else {
    setupSiteMusic();
  }
})();
