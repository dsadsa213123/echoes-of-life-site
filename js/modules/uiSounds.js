/* Echoes of Life — UI audio, V2.5
   Interaction sounds are synthesized on the fly with the Web Audio API
   (square/triangle oscillator blips) instead of loaded from .wav files —
   cheap, crisp, and properly "pixel" instead of a soft sampled click.
   Same unlock-on-first-gesture pattern as before: audio contexts also
   need a real user gesture before they're allowed to make sound.
*/
(function () {
  'use strict';

  const STORAGE_KEY = 'eol-ui-sounds';
  let enabled = localStorage.getItem(STORAGE_KEY) !== 'false';
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function blip({ freqStart, freqEnd, duration = 0.07, type = 'square', gain = 0.05, delay = 0 }) {
    const audioCtx = getCtx();
    if (!audioCtx) return;
    const start = audioCtx.currentTime + delay;

    const osc = audioCtx.createOscillator();
    const amp = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, start);
    if (freqEnd && freqEnd !== freqStart) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), start + duration);
    }

    amp.gain.setValueAtTime(0, start);
    amp.gain.linearRampToValueAtTime(gain, start + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(amp).connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  }

  const recipes = {
    hover() {
      blip({ freqStart: 920, freqEnd: 980, duration: 0.035, type: 'square', gain: 0.028 });
    },
    click() {
      blip({ freqStart: 300, freqEnd: 640, duration: 0.07, type: 'square', gain: 0.06 });
    },
    open() {
      blip({ freqStart: 523, freqEnd: 523, duration: 0.06, type: 'triangle', gain: 0.05 });
      blip({ freqStart: 784, freqEnd: 784, duration: 0.09, type: 'triangle', gain: 0.05, delay: 0.05 });
    },
    toggle() {
      blip({ freqStart: 440, freqEnd: 660, duration: 0.05, type: 'square', gain: 0.05 });
      blip({ freqStart: 660, freqEnd: 660, duration: 0.05, type: 'square', gain: 0.04, delay: 0.055 });
    }
  };

  function play(kind) {
    if (!enabled) return false;
    const fn = recipes[kind] || recipes.click;
    try { fn(); } catch (_) { /* never let a UI sound break navigation */ }
    return true;
  }

  function unlock() {
    getCtx();
  }

  function interactive(target) {
    if (!(target instanceof Element)) return null;
    return target.closest(
      'a[href], button, input[type="button"], input[type="submit"], select,' +
      ' [role="button"], .mechanic, .info-card, .category-card, .state-card,' +
      ' .type-card, .contact-card, .weapon-choice, .filter, .back-link,' +
      ' .pixel-button, .text-link, .site-music, .menu-btn, .sound-btn'
    );
  }

  function soundKind(el) {
    if (!el) return 'click';
    if (el.dataset.soundType && recipes[el.dataset.soundType]) return el.dataset.soundType;
    if (el.classList.contains('menu-btn') || el.classList.contains('site-music') || el.classList.contains('sound-btn')) return 'toggle';
    if (
      el.classList.contains('weapon-choice') ||
      el.classList.contains('state-card') ||
      el.classList.contains('type-card') ||
      el.classList.contains('category-card') ||
      el.classList.contains('contact-card')
    ) return 'open';
    return 'click';
  }

  document.addEventListener('pointerdown', function (event) {
    unlock();
    const el = interactive(event.target);
    if (!el || el.dataset.soundClick === 'off') return;
    const kind = soundKind(el);
    el.dataset.eolPointerSound = '1';
    play(kind);
  }, { capture: true, passive: true });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const el = interactive(document.activeElement);
    if (!el || el.dataset.soundClick === 'off') return;
    play(soundKind(el));
  }, { capture: true });

  document.addEventListener('click', function (event) {
    const el = interactive(event.target);
    if (!el || el.dataset.soundClick === 'off') return;
    if (el.dataset.eolPointerSound === '1') {
      el.dataset.eolPointerSound = '0';
      return;
    }
    play(soundKind(el));
  });

  document.addEventListener('mouseover', function (event) {
    const el = interactive(event.target);
    if (!el || el.dataset.soundClick === 'off') return;
    if (el.dataset.eolHovered === '1') return;
    el.dataset.eolHovered = '1';
    play('hover');
  }, { capture: true, passive: true });

  document.addEventListener('mouseout', function (event) {
    const el = interactive(event.target);
    if (el) el.dataset.eolHovered = '0';
  }, { capture: true, passive: true });

  window.EOLUISounds = {
    play,
    unlock,
    setEnabled(value) {
      enabled = Boolean(value);
      localStorage.setItem(STORAGE_KEY, String(enabled));
    }
  };
})();
