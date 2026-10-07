(() => {
  if (customElements.get('hero-slider')) return;
  // Decorative only: no pixel readback, media cloning or full-resolution blur raster.
  class AmbientLight {
    constructor(frame) {
      this.frame = frame;
      this.media = frame.querySelector('video, img');
      this.video = this.media?.tagName === 'VIDEO' ? this.media : null;
      this.abort = new AbortController();
      this.canvas = document.createElement('canvas');
      this.canvas.width = 64;
      this.canvas.height = 36;
      this.canvas.className = 'hero-slider__ambient';
      this.canvas.setAttribute('aria-hidden', 'true');
      try { this.context = this.canvas.getContext('2d'); } catch { /* Optional decoration. */ }
      if (!this.media || !this.context) return;
      frame.prepend(this.canvas);
      const options = { signal: this.abort.signal };
      this.media.addEventListener('load', () => { this.staticSource = null; this.refresh(); }, options);
      if (this.video) {
        this.video.addEventListener('playing', () => this.refresh(), options);
        for (const event of ['pause', 'waiting', 'ended', 'error']) {
          this.video.addEventListener(event, () => this.stop(), options);
        }
      }
      this.resize = new ResizeObserver(([entry]) => {
        this.ratio = entry.contentRect.width / entry.contentRect.height;
        const position = getComputedStyle(this.media).objectPosition.split(' ');
        this.position = position.map(value => value.endsWith('%') ? parseFloat(value) / 100 : .5);
        this.staticSource = null;
        this.refresh();
      });
      this.resize.observe(frame);
    }
    update(active, reduced, paused) {
      this.active = active;
      this.reduced = reduced;
      this.paused = paused;
      this.refresh();
    }
    refresh() {
      this.stop();
      if (!this.active || !this.context || !this.ratio) return;
      if (!this.video) {
        if (this.media.complete && this.media.naturalWidth && this.staticSource !== this.media.currentSrc) {
          if (this.draw(this.media)) this.staticSource = this.media.currentSrc;
        }
        return;
      }
      if (this.reduced || !this.canvas.hasAttribute('data-painted')) this.poster();
      if (this.reduced || this.paused || this.video.paused || this.video.ended || this.video.readyState < 2) return;
      this.running = true;
      this.schedule();
    }
    poster() {
      if (!this.posterImage && this.frame.dataset.ambientPoster) {
        this.posterImage = new Image();
        this.posterImage.decoding = 'async';
        this.posterImage.fetchPriority = 'low';
        this.posterImage.addEventListener('load', () => {
          if (this.active && (this.reduced || !this.canvas.hasAttribute('data-painted'))) this.drawPoster();
        }, { signal: this.abort.signal });
        this.posterImage.src = this.frame.dataset.ambientPoster;
      }
      this.drawPoster();
    }
    drawPoster() {
      if (this.posterImage?.naturalWidth && this.staticSource !== this.posterImage.src) {
        if (this.draw(this.posterImage)) this.staticSource = this.posterImage.src;
      }
    }
    schedule() {
      // Wait before requesting one decoded frame: at most eight samples per second,
      // not a callback on every video/display frame merely to discard most of them.
      this.timer = setTimeout(() => {
        this.timer = null;
        if (!this.running) return;
        if (this.video.requestVideoFrameCallback) {
          this.callback = this.video.requestVideoFrameCallback(() => { this.callback = null; this.sample(); });
        } else this.sample();
      }, 125);
    }
    sample() {
      if (!this.running || this.video.paused || this.video.ended) return;
      if (this.video.readyState >= 2 && this.lastVideoTime !== this.video.currentTime) {
        this.lastVideoTime = this.video.currentTime;
        this.staticSource = null;
        if (!this.draw(this.video, true)) return;
      }
      this.schedule();
    }
    draw(source, blend = false) {
      const width = source.videoWidth || source.naturalWidth;
      const height = source.videoHeight || source.naturalHeight;
      if (!width || !height || !this.ratio) return false;
      // Match object-fit: cover and Shopify's percentage focal point, including mobile crops.
      const cropWidth = Math.min(width, height * this.ratio);
      const cropHeight = Math.min(height, width / this.ratio);
      const [x = .5, y = .5] = this.position || [];
      try {
        this.context.globalAlpha = blend && this.canvas.hasAttribute('data-painted') ? .35 : 1;
        if (!blend) this.context.clearRect(0, 0, 64, 36);
        this.context.drawImage(source, (width - cropWidth) * x, (height - cropHeight) * y, cropWidth, cropHeight, 0, 0, 64, 36);
        this.canvas.setAttribute('data-painted', '');
        return true;
      } catch {
        // A decoder/context failure must never interfere with the actual slider.
        this.stop();
        this.context = null;
        this.canvas.remove();
        return false;
      }
    }
    stop() {
      this.running = false;
      clearTimeout(this.timer);
      this.timer = null;
      if (this.callback != null) this.video.cancelVideoFrameCallback(this.callback);
      this.callback = null;
    }
    destroy() {
      this.active = false;
      this.stop();
      this.abort.abort();
      this.resize?.disconnect();
      this.canvas.remove();
      this.posterImage = null;
    }
  }
  class HeroSlider extends HTMLElement {
    connectedCallback() {
      this.ambient?.forEach(light => light.destroy());
      this.ambient = new Map();
      this.abort?.abort();
      this.observer?.disconnect();
      this.layoutObserver?.disconnect();
      cancelAnimationFrame(this.layoutFrame);
      cancelAnimationFrame(this.frame);
      this.removeAttribute('data-ready');
      this.introAnimations?.forEach(animation => animation.cancel());
      this.introAnimations = null;
      this.removeAttribute('data-intro-complete');
      this.removeAttribute('data-layout-ready');
      clearTimeout(this.startupTimer);
      this.abort = new AbortController();
      const options = { signal: this.abort.signal };
      this.slides = [...this.querySelectorAll('[data-slide]')];
      if (!this.slides.length) return;
      this.buttons = [...this.querySelectorAll('[data-slide-button]')];
      this.status = this.querySelector('[data-status]');
      this.motion = matchMedia('(prefers-reduced-motion: reduce)');
      this.index = 0;
      this.elapsed = 0;
      this.duration = Math.max(4000, Number(this.dataset.duration) || 6000);
      this.autoplay = this.dataset.autoplay === 'true';
      this.hovered = false;
      this.focusPaused = false;
      this.visible = false;
      this.editorPaused = Boolean(window.Shopify?.designMode);
      this.querySelector('.hero-slider__controls').hidden = this.slides.length < 2 || this.dataset.showIndicators === 'false';
      const paging = this.querySelector('.hero-slider__paging');
      if (paging) paging.hidden = this.slides.length < 2;
      this.toggleAttribute('data-has-navigation', this.slides.length > 1);
      this.buttons.forEach((button, index) => button.addEventListener('click', () => this.show(index, true), options));
      this.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => {
        this.show((this.index + Number(button.dataset.direction) + this.slides.length) % this.slides.length, true);
      }, options));
      const updateHover = target => {
        const hovered = Boolean(target?.closest?.('.hero-slider__frame, .hero-slider__controls, .hero-slider__paging, .hero-slider__action'));
        if (hovered !== this.hovered) { this.hovered = hovered; this.sync(); }
      };
      this.addEventListener('pointerover', event => {
        if (event.pointerType === 'mouse') updateHover(event.target);
      }, options);
      this.addEventListener('pointerout', event => {
        if (event.pointerType === 'mouse') updateHover(this.contains(event.relatedTarget) ? event.relatedTarget : null);
      }, options);
      this.addEventListener('keydown', event => {
        if (!event.target.matches('[data-slide-button]')) return;
        const current = this.buttons.indexOf(event.target);
        let next;
        if (event.key === 'ArrowRight') next = (current + 1) % this.buttons.length;
        if (event.key === 'ArrowLeft') next = (current - 1 + this.buttons.length) % this.buttons.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = this.buttons.length - 1;
        if (next === undefined) return;
        event.preventDefault(); this.buttons[next].focus(); this.show(next, true);
      }, options);
      if (this.hasAttribute('data-media-only')) {
        this.querySelectorAll('video').forEach(video => { video.controls = false; });
        this.addEventListener('shopify:block:select', event => {
          const slide = event.target.closest('[data-slide]');
          const index = this.slides.indexOf(slide);
          if (index !== -1) this.show(index);
        }, options);
        this.addEventListener('focusin', () => { this.focusPaused = true; this.sync(); }, options);
        this.addEventListener('focusout', event => {
          if (!this.contains(event.relatedTarget)) { this.focusPaused = false; this.sync(); }
        }, options);
      }
      if (this.dataset.captionLayout === 'split') {
        const updateFocus = target => {
          this.focusPaused = Boolean(target?.closest?.('.hero-slider__action, .hero-slider__paging'));
          this.sync();
        };
        this.addEventListener('focusin', event => updateFocus(event.target), options);
        this.addEventListener('focusout', event => updateFocus(this.contains(event.relatedTarget) ? event.relatedTarget : null), options);
      }
      document.addEventListener('visibilitychange', () => this.sync(), options);
      this.motion.addEventListener('change', () => {
        if (this.motion.matches && this.introAnimations) this.finishIntro();
        if (this.hasAttribute('data-media-only') && this.motion.matches) this.querySelectorAll('video').forEach(video => video.pause());
        this.sync();
      }, options);
      this.observer = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        this.sync();
      }, { threshold: .1 });
      this.observer.observe(this);
      this.show(0);
      this.setAttribute('data-ready', '');
      const scheduleLayout = () => {
        cancelAnimationFrame(this.layoutFrame);
        this.layoutFrame = requestAnimationFrame(() => this.layout());
      };
      this.layoutObserver = new ResizeObserver(scheduleLayout);
      this.layoutObserver.observe(this);
      this.querySelectorAll('.hero-slider__heading').forEach(heading => this.layoutObserver.observe(heading));
      this.querySelectorAll('.hero-slider__caption').forEach(caption => this.layoutObserver.observe(caption));
      const header = document.querySelector('.shopify-section-header');
      if (header) this.layoutObserver.observe(header);
      window.addEventListener('resize', scheduleLayout, options);
      this.layout();
      if (this.dataset.captionLayout === 'split') {
        const signal = this.abort.signal;
        // Font metrics affect caption wrapping and therefore the fitted media width.
        // Bound startup so a failed font request cannot hide otherwise usable content.
        const timeout = new Promise(resolve => { this.startupTimer = setTimeout(resolve, 2500); });
        Promise.race([document.fonts.ready, timeout]).then(() => {
          clearTimeout(this.startupTimer);
          if (signal.aborted || !this.isConnected) return;
          requestAnimationFrame(() => {
            if (signal.aborted || !this.isConnected) return;
            this.layout();
            this.startIntro();
            this.setAttribute('data-layout-ready', '');
            this.sync();
          });
        });
      }
    }
    startIntro() {
      if (this.motion.matches || window.Shopify?.designMode) { this.finishIntro(); return; }
      const slide = this.slides[this.index];
      const media = slide.querySelector('.hero-slider__media');
      const heading = slide.querySelector('.hero-slider__heading');
      const action = slide.querySelector('.hero-slider__action');
      const paging = this.querySelector('.hero-slider__paging');
      const style = getComputedStyle(this);
      const duration = (name, fallback) => parseFloat(style.getPropertyValue(name)) || fallback;
      const textTime = duration('--motion-duration-slow', 360);
      const panelTime = textTime * 3;
      const controlsTime = duration('--motion-duration-base', 260);
      const captionDelay = duration('--motion-duration-fast', 200);
      const stagger = captionDelay * .3;
      const easing = style.getPropertyValue('--motion-ease').trim() || 'ease';
      const animations = [];
      const animate = (element, frames, time, delay = 0, curve = easing) => {
        if (element) animations.push(element.animate(frames, { duration: time, delay, easing: curve, fill: 'both' }));
      };
      const rise = [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }];
      // Match the shared button sweep's 180% × 300% oval, moving downward.
      const sweepEase = style.getPropertyValue('--motion-ease-ui').trim();
      animate(media, [
        { clipPath: 'ellipse(90% 150% at 50% -150%)' },
        { clipPath: 'ellipse(90% 150% at 50% 0%)' }
      ], panelTime, 0, sweepEase || easing);
      animate(heading, rise, textTime, captionDelay);
      if (action) action.inert = true;
      animate(action, rise, textTime, captionDelay + stagger);
      if (paging && !paging.hidden) {
        paging.inert = true;
        animate(paging, [{ opacity: 0 }, { opacity: 1 }], controlsTime, captionDelay + stagger * (action ? 2 : 1));
      }
      this.introAnimations = animations;
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (this.isConnected && this.introAnimations === animations) this.finishIntro();
      }).catch(() => {});
    }
    finishIntro() {
      this.introAnimations?.forEach(animation => animation.cancel());
      this.introAnimations = null;
      this.querySelectorAll('.hero-slider__action, .hero-slider__paging').forEach(element => { element.inert = false; });
      this.setAttribute('data-intro-complete', '');
      this.sync();
    }
    layout() {
      if (!this.isConnected) return;
      // Poster Slideshow owns its media-only height through the Poster size roles.
      if (this.hasAttribute('data-media-only')) return;
      if (this.dataset.captionLayout === 'split') { this.layoutCaption(); return; }
      // Portrait layouts use natural media/title stacking, including after rotation.
      if (matchMedia('(orientation: portrait)').matches) {
        for (const key of ['height', 'width', 'space', 'heading']) this.style.removeProperty(`--hero-layout-${key}`);
        return;
      }
      const style = getComputedStyle(this);
      const shell = this.closest('.hero-slider-shell');
      const shellStyle = shell && getComputedStyle(shell);
      const padding = shellStyle ? parseFloat(shellStyle.paddingTop) + parseFloat(shellStyle.paddingBottom) : 0;
      const headerHeight = parseFloat(style.getPropertyValue('--sticky-header-height')) || 0;
      const viewport = window.innerHeight;
      const headingHeight = Math.max(...this.slides.map(slide => slide.querySelector('.hero-slider__heading').offsetHeight));
      const gap = Math.min(parseFloat(style.getPropertyValue('--hero-heading-gap')) || 40, innerWidth * .06);
      const height = Math.max(viewport - headerHeight - padding, headingHeight + 120 + gap * 3);
      const width = Math.min(this.clientWidth, (height - headingHeight - gap * 3) * 16 / 9);
      const space = (height - headingHeight - width * 9 / 16) / 3;
      for (const [key, value] of Object.entries({ height, width, space, heading: headingHeight })) {
        const next = `${value.toFixed(3)}px`;
        if (this.style.getPropertyValue(`--hero-layout-${key}`) !== next) this.style.setProperty(`--hero-layout-${key}`, next);
      }
    }
    layoutCaption() {
      const portrait = matchMedia('(orientation: portrait)').matches;
      const compact = matchMedia('(width < 768px)').matches;
      const style = getComputedStyle(this);
      const shell = this.closest('.hero-slider-shell');
      const shellStyle = shell && getComputedStyle(shell);
      const padding = shellStyle ? parseFloat(shellStyle.paddingTop) + parseFloat(shellStyle.paddingBottom) : 0;
      const header = document.querySelector('.shopify-section-header')?.getBoundingClientRect().height
        || parseFloat(style.getPropertyValue('--sticky-header-height')) || 0;
      const gap = Math.min(parseFloat(style.getPropertyValue('--hero-heading-gap')) || 40, innerWidth * .06);
      const captions = this.slides.map(slide => slide.querySelector('.hero-slider__caption'));
      const headings = this.slides.map(slide => slide.querySelector('.hero-slider__heading'));
      // Short landscape screens must scroll instead of squeezing the caption
      // into a few characters beside the persistent arrow controls.
      const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const minimumWidth = Math.min(this.clientWidth, rootSize * (compact ? 22 : 48));
      const set = (key, value) => {
        const next = `${value.toFixed(3)}px`;
        if (this.style.getPropertyValue(key) !== next) this.style.setProperty(key, next);
      };
      let width = this.clientWidth;
      let captionHeight = 0;
      let height = 0;
      // Fit monotonically from the available width, accounting for text wrapping
      // and the CTA. This avoids alternating between two widths at a line break.
      for (let pass = 0; pass < 8; pass += 1) {
        set('--hero-layout-width', width);
        captionHeight = Math.max(...captions.map(caption => caption.offsetHeight));
        height = Math.max(innerHeight - header - padding, captionHeight + minimumWidth * 9 / 16 + gap * 3);
        const fitted = Math.min(width, (height - captionHeight - gap * 3) * 16 / 9);
        if (portrait || Math.abs(width - fitted) < .5) break;
        width = fitted;
      }
      const space = portrait ? gap : (height - captionHeight - width * 9 / 16) / 3;
      if (portrait) {
        for (const key of ['height', 'space', 'heading']) this.style.removeProperty(`--hero-layout-${key}`);
      } else {
        set('--hero-layout-height', height);
        set('--hero-layout-space', space);
        set('--hero-layout-heading', captionHeight);
      }
      const captionGap = parseFloat(getComputedStyle(captions[0]).rowGap) || 0;
      set('--hero-paging-top', width * 9 / 16 + (portrait ? gap : space * 2) + (compact ? headings[this.index].offsetHeight + captionGap : 0));
    }
    show(index, announce = false) {
      if (index === this.index && this.hasAttribute('data-ready')) return;
      if (this.introAnimations) this.finishIntro();
      this.index = index;
      this.elapsed = 0;
      this.slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle('is-active', active);
        slide.inert = !active;
        slide.setAttribute('aria-hidden', String(!active));
        const video = slide.querySelector('video');
        if (video && !active) { video.pause(); video.currentTime = 0; }
      });
      this.buttons.forEach((button, i) => {
        if (i === index) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });
      if (announce) this.status.textContent = this.buttons[index]?.getAttribute('aria-label') || '';
      if (this.hasAttribute('data-ready') && this.dataset.captionLayout === 'split') this.layoutCaption();
      this.sync();
    }
    sync() {
      cancelAnimationFrame(this.frame);
      this.lastTime = null;
      const startup = this.dataset.captionLayout === 'split' && !this.hasAttribute('data-layout-ready');
      const suspended = startup || !this.visible || document.hidden || this.editorPaused;
      const videoPaused = suspended || this.motion.matches;
      this.slides.forEach((slide, i) => {
        const video = slide.querySelector('video');
        if (!video) return;
        if (this.hasAttribute('data-media-only')) {
          video.controls = this.motion.matches;
          // Reduced-motion visitors can choose native playback without autoplay.
          if (this.motion.matches && !suspended && i === this.index) return;
        }
        if (i !== this.index || videoPaused) video.pause();
        else video.play().catch(() => {});
      });
      if (this.dataset.ambient === 'true') {
        const activeSlide = this.slides[this.index];
        if (this.visible && !document.hidden && !this.ambient.has(activeSlide)) {
          this.ambient.set(activeSlide, new AmbientLight(activeSlide.querySelector('.hero-slider__frame')));
        }
        this.ambient.forEach((light, slide) => light.update(slide === activeSlide && this.visible && !document.hidden, this.motion.matches, videoPaused));
      } else {
        this.ambient.forEach(light => light.destroy());
        this.ambient.clear();
      }
      this.paint();
      const entering = this.dataset.captionLayout === 'split' && !this.hasAttribute('data-intro-complete');
      if (!entering && !this.hovered && !this.focusPaused && !videoPaused && this.autoplay && this.slides.length > 1 && !this.motion.matches) {
        this.frame = requestAnimationFrame(time => this.tick(time));
      }
    }
    tick(time) {
      if (this.lastTime !== null) this.elapsed += time - this.lastTime;
      this.lastTime = time;
      if (this.elapsed >= this.duration) { this.show((this.index + 1) % this.slides.length); return; }
      this.paint();
      this.frame = requestAnimationFrame(next => this.tick(next));
    }
    paint() {
      this.buttons.forEach((button, i) => {
        const progress = i === this.index ? (this.autoplay && !this.motion.matches ? this.elapsed / this.duration : 1) : 0;
        button.querySelector('.hero-slider__progress').style.transform = `scaleX(${progress})`;
      });
    }
    disconnectedCallback() {
      this.introAnimations?.forEach(animation => animation.cancel());
      this.introAnimations = null;
      clearTimeout(this.startupTimer);
      this.layoutObserver?.disconnect();
      cancelAnimationFrame(this.layoutFrame);
      this.ambient?.forEach(light => light.destroy());
      this.ambient?.clear();
      this.abort?.abort();
      this.observer?.disconnect();
      cancelAnimationFrame(this.frame);
      this.querySelectorAll('video').forEach(video => { video.pause(); if (this.hasAttribute('data-media-only')) video.controls = true; });
    }
  }
  customElements.define('hero-slider', HeroSlider);
})();
