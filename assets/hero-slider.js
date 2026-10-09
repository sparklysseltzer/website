(() => {
  if (customElements.get('hero-slider')) return;
  // Shopify may optimize CSS millisecond tokens to seconds on hosted themes.
  const motionMilliseconds = (style, name, fallback) => {
    const token = style.getPropertyValue(name).trim();
    const value = Number.parseFloat(token);
    if (!Number.isFinite(value) || value < 0) return fallback;
    return value * (token.endsWith('ms') ? 1 : token.endsWith('s') ? 1000 : 1);
  };
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
      this.mobile = matchMedia('(width < 768px)');
      this.index = 0;
      this.elapsed = 0;
      this.duration = Math.max(4000, Number(this.dataset.duration) || 6000);
      this.autoplay = this.dataset.autoplay === 'true';
      this.hovered = false;
      this.focusPaused = false;
      this.visible = false;
      this.editorPaused = Boolean(window.Shopify?.designMode);
      if (this.dataset.captionLayout === 'split') {
        this.updateMedia();
        this.mobile.addEventListener('change', () => {
          this.finishIntro();
          this.finishSlideTransition();
          this.updateMedia();
          this.layout();
          this.sync();
        }, options);
      }
      this.querySelector('.hero-slider__controls').hidden = this.slides.length < 2 || this.dataset.showIndicators === 'false';
      const paging = this.querySelector('.hero-slider__paging');
      if (paging) paging.hidden = this.slides.length < 2;
      this.toggleAttribute('data-has-navigation', this.slides.length > 1);
      this.buttons.forEach((button, index) => button.addEventListener('click', () => this.show(index, true), options));
      this.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => {
        this.show((this.index + Number(button.dataset.direction) + this.slides.length) % this.slides.length, true, Number(button.dataset.direction));
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
        event.preventDefault(); this.buttons[next].focus(); this.show(next, true, event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : Math.sign(next - current));
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
        if (this.motion.matches) this.finishSlideTransition();
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
      const duration = (name, fallback) => motionMilliseconds(style, name, fallback);
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
      // A wider phone oval keeps the downward leading edge shallow.
      const sweepEase = style.getPropertyValue('--motion-ease-ui').trim();
      animate(media, [
        { clipPath: `ellipse(${this.mobile.matches ? 180 : 90}% 150% at 50% -150%)` },
        { clipPath: `ellipse(${this.mobile.matches ? 180 : 90}% 150% at 50% 0%)` }
      ], panelTime, 0, sweepEase || easing);
      animate(heading, rise, textTime, captionDelay);
      if (action) action.inert = true;
      animate(action, [
        { opacity: 0, transform: 'translate3d(0, 8px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ], textTime, captionDelay + stagger);
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
      const compact = this.mobile.matches;
      const gap = parseFloat(getComputedStyle(this.slides[this.index]).rowGap) || 0;
      const captions = this.slides.map(slide => slide.querySelector('.hero-slider__caption'));
      const set = (key, value) => {
        const next = `${value.toFixed(3)}px`;
        if (this.style.getPropertyValue(key) !== next) this.style.setProperty(key, next);
      };
      // CSS owns responsive media dimensions and ratio. Reserve only the tallest caption
      // so changing slides cannot move the following section.
      set('--hero-layout-heading', Math.max(...captions.map(caption => caption.offsetHeight)));
      set('--hero-layout-space', gap);
      const mediaHeight = this.slides[this.index].querySelector('.hero-slider__media').offsetHeight;
      const heading = this.slides[this.index].querySelector('.hero-slider__heading');
      const captionGap = parseFloat(getComputedStyle(captions[this.index]).rowGap) || 0;
      set('--hero-paging-top', mediaHeight + gap + (compact ? heading.offsetHeight + captionGap : 0));
    }
    finishSlideTransition() {
      const transition = this.slideTransition;
      this.slideTransition = null;
      transition?.animations.forEach(animation => animation.cancel());
      this.slides?.forEach(slide => slide.classList.remove('is-leaving'));
      this.removeAttribute('data-transitioning');
      // Reset only after the outgoing panel is hidden, including interrupted sweeps.
      const outgoing = transition && this.slides[transition.previous]?.querySelector('video');
      if (outgoing && transition.previous !== this.index) {
        outgoing.pause();
        outgoing.currentTime = 0;
      }
    }
    updateMedia() {
      this.ambient.forEach(light => light.destroy());
      this.ambient.clear();
      this.slides.forEach(slide => {
        const template = slide.querySelector('template[data-mobile-media]');
        if (!template) return;
        const frame = slide.querySelector('.hero-slider__frame');
        const media = slide.querySelector('.hero-slider__media');
        if (!slide.heroMedia) {
          slide.heroMedia = {
            desktop: media.querySelector('img, video, svg'),
            mobile: template.content.firstElementChild.cloneNode(true),
            poster: frame.dataset.ambientPoster || ''
          };
        }
        const sources = slide.heroMedia;
        const selected = this.mobile.matches ? sources.mobile : sources.desktop;
        const current = media.querySelector('img, video, svg');
        if (current !== selected) {
          if (current?.tagName === 'VIDEO') { current.pause(); current.currentTime = 0; }
          current.replaceWith(selected);
        }
        frame.dataset.ambientPoster = this.mobile.matches ? template.dataset.ambientPoster || '' : sources.poster;
      });
    }
    transitionSlide(previous, direction) {
      const incoming = this.slides[this.index].querySelector('.hero-slider__media');
      if (!incoming) return;
      const style = getComputedStyle(this);
      const duration = motionMilliseconds(style, '--motion-duration-slow', 360) * 3;
      const easing = style.getPropertyValue('--motion-ease-ui').trim() || 'ease';
      // Stretch the sideways entrance oval vertically for a gentler leading curve.
      // Keep its size fixed, with the leading edge starting outside the panel.
      const from = direction < 0 ? 250 : -150;
      const to = direction < 0 ? 100 : 0;
      this.slides[previous].classList.add('is-leaving');
      this.setAttribute('data-transitioning', '');
      const frames = this.mobile.matches ? [
        { clipPath: 'ellipse(180% 150% at 50% -150%)' },
        { clipPath: 'ellipse(180% 150% at 50% 0%)' }
      ] : [
        { clipPath: `ellipse(150% 150% at ${from}% 50%)` },
        { clipPath: `ellipse(150% 150% at ${to}% 50%)` }
      ];
      const animation = incoming.animate(frames, { duration, easing, fill: 'both' });
      const animations = [animation];
      const artwork = incoming.querySelector('img, video');
      if (artwork) animations.push(artwork.animate([
        { transform: 'scale(1.045)' }, { transform: 'scale(1)' }
      ], { duration, easing, fill: 'both' }));
      const transition = { animations, previous };
      this.slideTransition = transition;
      animation.finished.then(() => {
        if (this.slideTransition === transition) {
          this.finishSlideTransition();
          this.sync();
        }
      }).catch(() => {});
    }
    show(index, announce = false, direction = Math.sign(index - this.index)) {
      if (index === this.index && this.hasAttribute('data-ready')) return;
      if (this.introAnimations) this.finishIntro();
      const previous = this.index;
      const animate = this.hasAttribute('data-ready') && this.dataset.ovalTransition === 'true' && !this.motion.matches;
      this.finishSlideTransition();
      this.index = index;
      this.elapsed = 0;
      this.slides.forEach((slide, i) => {
        const active = i === index;
        slide.classList.toggle('is-active', active);
        slide.inert = !active;
        slide.setAttribute('aria-hidden', String(!active));
        const video = slide.querySelector('video');
        if (video && !active && !(animate && i === previous)) { video.pause(); video.currentTime = 0; }
      });
      if (animate) this.transitionSlide(previous, direction);
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
        const visibleDuringSweep = i === this.slideTransition?.previous;
        if ((i !== this.index && !visibleDuringSweep) || videoPaused) video.pause();
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
      if (!entering && !this.slideTransition && !this.hovered && !this.focusPaused && !videoPaused && this.autoplay && this.slides.length > 1 && !this.motion.matches) {
        this.frame = requestAnimationFrame(time => this.tick(time));
      }
    }
    tick(time) {
      if (this.lastTime !== null) this.elapsed += time - this.lastTime;
      this.lastTime = time;
      if (this.elapsed >= this.duration) { this.show((this.index + 1) % this.slides.length, false, 1); return; }
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
      this.finishSlideTransition();
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
