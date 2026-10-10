// Local animation transport. Never loaded by the storefront.
(() => {
  const bar = document.querySelector('#StudioPlayback');
  const play = bar.querySelector('[data-play]');
  const scrub = bar.querySelector('[data-scrub]');
  const time = bar.querySelector('[data-time]');
  const loop = bar.querySelector('[data-loop]');
  const status = bar.querySelector('[data-status]');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const adapters = new Map();
  const motionPages = new Set(['BrandStatement', 'ButtonMotion', 'AmbientLight', 'ContentSlider', 'Buttons', 'TextLinks', 'SocialButtons', 'BlogPanels', 'BlogPanelSurfaces', 'FormsPage']);
  let animations = [], duration = 0, position = 0, playing = false, frame, last;
  const page = () => document.querySelector('[data-studio-page]:not([hidden])');
  const adapter = () => adapters.get(page()?.id);
  const reduced = () => preference.matches || adapter()?.reduced?.() || (page()?.id === 'ButtonMotion' && document.querySelector('#MotionTuner').elements.reduced.checked);
  function paint() {
    play.textContent = playing ? 'Pause' : 'Play';
    play.setAttribute('aria-pressed', String(playing));
    scrub.value = duration ? Math.round(position / duration * 1000) : 0;
    time.value = `${(position / 1000).toFixed(2)} / ${(duration / 1000).toFixed(2)} s`;
    scrub.disabled = !duration || reduced();
    play.disabled = reduced();
    bar.querySelector('[data-replay]').disabled = reduced();
    loop.disabled = reduced();
  }
  function pause() { playing = false; cancelAnimationFrame(frame); paint(); }
  function seek(value) {
    position = Math.max(0, Math.min(duration, value));
    animations.forEach(a => { try { a.pause(); a.currentTime = position; } catch {} });
    paint();
  }
  function tick(now) {
    if (!playing) return;
    const next = position + now - last;
    last = now;
    seek(next);
    if (next >= duration) {
      if (loop.checked) seek(0);
      else { pause(); return; }
    }
    frame = requestAnimationFrame(tick);
  }
  function resume() {
    if (reduced() || !duration) return;
    if (position >= duration) seek(0);
    playing = true; last = performance.now(); paint(); frame = requestAnimationFrame(tick);
  }
  function clear() {
    pause();
    animations.forEach(a => a.cancel());
    animations = []; duration = 0; position = 0;
    status.textContent = reduced() ? 'Reduced motion: animation playback is disabled.' : 'Trigger an interaction to capture its animation.';
    paint();
  }
  function capture(source) {
    if (reduced()) return;
    const usable = source.filter(a => Number.isFinite(a.effect?.getComputedTiming().endTime) && a.effect.getComputedTiming().endTime > 0);
    if (!usable.length) return;
    pause();
    animations = usable;
    duration = Math.max(...animations.map(a => a.effect.getComputedTiming().endTime));
    animations.forEach(a => a.pause());
    position = 0;
    bar.hidden = false;
    status.textContent = 'Scrub to inspect a frame. Loop repeats this captured sequence.';
    seek(0); resume();
  }
  function replay() {
    if (reduced()) return;
    if (adapter()?.replay) { adapter().replay(); return; }
    if (duration) { pause(); seek(0); resume(); }
    else status.textContent = 'Hover, focus or activate a preview control to capture its animation first.';
  }
  play.addEventListener('click', () => playing ? pause() : duration ? resume() : replay());
  bar.querySelector('[data-replay]').addEventListener('click', replay);
  scrub.addEventListener('input', () => { const value = Number(scrub.value); pause(); seek(duration * value / 1000); });
  // Capture real CSS transitions and animations, including pseudo-elements.
  let captureFrame;
  function discover(event) {
    const current = page();
    if (!current?.contains(event.target) || reduced()) return;
    cancelAnimationFrame(captureFrame);
    captureFrame = requestAnimationFrame(() => {
      const active = current.getAnimations({ subtree: true }).filter(a => !animations.includes(a));
      if (active.length) {
        const copies = active.map(original => {
          const effect = original.effect;
          let timing = effect.getTiming();
          let frames = effect.getKeyframes();
          if (current.id === 'ButtonMotion' && document.querySelector('#MotionPreview').hasAttribute('data-playing')) {
            const fields = document.querySelector('#MotionTuner').elements;
            const enter = Number(fields.enter.value), exit = Number(fields.exit.value), hold = 300;
            const total = enter + hold + exit;
            const first = frames[0], lastFrame = frames.at(-1);
            frames = [{ ...first, offset: 0, easing: fields.easing.value }, { ...lastFrame, offset: enter / total }, { ...lastFrame, offset: (enter + hold) / total, easing: fields.easing.value }, { ...first, offset: 1 }];
            timing = { ...timing, duration: total, delay: 0, easing: 'linear' };
          }
          const copy = new Animation(new KeyframeEffect(effect.target, frames, { ...timing, fill: 'both', pseudoElement: effect.pseudoElement }), document.timeline);
          original.cancel();
          return copy;
        });
        animations.forEach(a => a.cancel());
        capture(copies);
      }
    });
  }
  document.addEventListener('transitionrun', discover);
  document.addEventListener('animationstart', discover);
  document.addEventListener('click', discover);
  document.addEventListener('change', discover);
  function route() { clear(); bar.hidden = !motionPages.has(page()?.id); }
  window.addEventListener('hashchange', () => setTimeout(route, 0));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
  preference.addEventListener('change', clear);
  document.addEventListener('input', event => {
    if (event.target.closest('.studio-tuner') && !bar.contains(event.target)) clear();
  });
  window.studioPlayback = { register: (id, options) => adapters.set(id, options), capture, clear };
  window.addEventListener('load', () => queueMicrotask(route), { once: true });
})();
