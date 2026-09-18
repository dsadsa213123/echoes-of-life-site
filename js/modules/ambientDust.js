// Fixed, decorative dust/ash particles. Injected once per page load — no markup
// needed anywhere else. Respects prefers-reduced-motion via the CSS itself, but
// we also skip creating the nodes at all for that case to save a little work.

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const layer = document.createElement("div");
  layer.className = "dust-layer";
  layer.setAttribute("aria-hidden", "true");

  const COUNT = 16;
  for (let i = 0; i < COUNT; i++) {
    const mote = document.createElement("span");
    mote.className = "dust-mote";
    const left = Math.random() * 100;
    const duration = 14 + Math.random() * 16; // 14s - 30s fall
    const delay = Math.random() * -duration; // stagger so they don't all start together
    const drift = (Math.random() * 60 - 30).toFixed(0) + "px";
    const size = (1.5 + Math.random() * 2).toFixed(1) + "px";
    mote.style.left = left + "vw";
    mote.style.width = size;
    mote.style.height = size;
    mote.style.setProperty("--drift", drift);
    mote.style.animationDuration = duration + "s";
    mote.style.animationDelay = delay + "s";
    layer.appendChild(mote);
  }

  document.body.appendChild(layer);
})();
