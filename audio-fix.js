(() => {
  let ctx = null;

  function getContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!ctx) ctx = new AudioCtx();
      return ctx;
    } catch (_) {
      return null;
    }
  }

  function unlock() {
    const c = getContext();
    if (!c) return null;
    if (c.state === 'suspended') {
      const p = c.resume();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    }
    return c;
  }

  window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
  window.addEventListener('touchstart', unlock, { capture: true, passive: true });
  window.addEventListener('keydown', unlock, { capture: true, once: true });

  window.tone = function (frequency, volume, duration) {
    const c = unlock();
    if (!c) return;

    const play = () => {
      try {
        const osc = c.createOscillator();
        const gain = c.createGain();
        const now = c.currentTime;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(gain).connect(c.destination);
        osc.start(now);
        osc.stop(now + duration + 0.01);
      } catch (_) {}
    };

    if (c.state === 'running') play();
    else c.resume().then(play).catch(() => {});
  };
})();
