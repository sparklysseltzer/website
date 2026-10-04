if (!customElements.get('content-slider')) {
  customElements.define('content-slider', class extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('.content-slider__track');
      this.controls = this.querySelector('.content-slider__controls');
      if (!this.track || !this.controls) return;
      this.preference = matchMedia('(prefers-reduced-motion: reduce)');
      this.schedule = () => {
        if (!this.frame) this.frame = requestAnimationFrame(() => {
          this.frame = null;
          this.update();
        });
      };
      this.onClick = event => {
        const button = event.target.closest('[data-direction]');
        if (!button || button.getAttribute('aria-disabled') === 'true') return;
        this.cancelSnap();
        const card = this.track.firstElementChild;
        if (!card) return;
        const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(this.track).columnGap);
        const rtl = getComputedStyle(this.track).direction === 'rtl' ? -1 : 1;
        this.track.scrollBy({ left: Number(button.dataset.direction) * rtl * step, behavior: this.preference.matches ? 'instant' : 'smooth' });
      };
      this.onSelect = event => {
        const item = event.target.closest('.content-slider__item');
        if (!item || !this.contains(item)) return;
        this.cancelSnap();
        const trackRect = this.track.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const style = getComputedStyle(this.track);
        const padding = parseFloat(style.paddingInlineStart);
        const left = style.direction === 'rtl' ? itemRect.right - trackRect.right + padding : itemRect.left - trackRect.left - padding;
        this.track.scrollBy({ left, behavior: 'instant' });
      };
      this.onPointerDown = event => {
        if (event.pointerType !== 'mouse' || event.button !== 0 || !event.isPrimary || this.track.scrollWidth <= this.track.clientWidth + 2) return;
        this.cancelSnap(false);
        this.suppressClickUntil = 0;
        this.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: this.track.scrollLeft, active: false };
      };
      this.onPointerMove = event => {
        const drag = this.drag;
        if (!drag || event.pointerId !== drag.id) return;
        if (!(event.buttons & 1)) { this.endDrag(); return; }
        const distance = event.clientX - drag.x;
        if (!drag.active) {
          if (Math.abs(distance) < 6) return;
          if (Math.abs(event.clientY - drag.y) > Math.abs(distance)) { this.endDrag(); return; }
          drag.active = true;
          this.track.setAttribute('data-dragging', '');
          this.track.setPointerCapture(event.pointerId);
        }
        event.preventDefault();
        this.track.scrollLeft = drag.left - distance;
      };
      this.onPointerEnd = event => {
        if (this.drag?.id === event.pointerId) this.endDrag();
      };
      this.onPointerLeave = () => { if (this.drag && !this.drag.active) this.endDrag(); };
      this.onInterrupt = () => this.cancelSnap();
      this.onMotionChange = () => { if (this.preference.matches && this.snapAnimation) this.settleToCard(); };
      this.preference.addEventListener('change', this.onMotionChange);
      this.track.addEventListener('wheel', this.onInterrupt, { passive: true });
      this.track.addEventListener('keydown', this.onInterrupt);
      this.onNativeDrag = event => { if (this.drag) event.preventDefault(); };
      this.onTrackClick = event => {
        if (event.detail > 0 && performance.now() < (this.suppressClickUntil || 0)) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      };
      this.track.addEventListener('pointerdown', this.onPointerDown);
      this.track.addEventListener('pointermove', this.onPointerMove);
      this.track.addEventListener('pointerup', this.onPointerEnd);
      this.track.addEventListener('pointercancel', this.onPointerEnd);
      this.track.addEventListener('lostpointercapture', this.onPointerEnd);
      this.track.addEventListener('pointerleave', this.onPointerLeave);
      this.track.addEventListener('dragstart', this.onNativeDrag);
      this.track.addEventListener('click', this.onTrackClick, true);
      this.controls.addEventListener('click', this.onClick);
      this.track.addEventListener('scroll', this.schedule, { passive: true });
      this.addEventListener('shopify:block:select', this.onSelect);
      this.onResize = () => { this.layoutViewport(); this.schedule(); };
      window.addEventListener('resize', this.onResize);
      this.modeObserver = new MutationObserver(this.onResize);
      this.modeObserver.observe(this, { attributes: true, attributeFilter: ['data-width-mode'] });
      this.resizeObserver = new ResizeObserver(this.onResize);
      this.resizeObserver.observe(this);
      this.layoutViewport();
      this.resizeObserver.observe(this.track);
      [...this.track.children].forEach(item => this.resizeObserver.observe(item));
      this.update();
    }
    layoutViewport() {
      if (this.dataset.widthMode !== 'viewport') {
        this.removeAttribute('data-viewport-ready');
        this.style.removeProperty('--slider-viewport-width');
        this.style.removeProperty('--slider-viewport-inset');
        return;
      }
      const bounds = this.getBoundingClientRect();
      const width = document.documentElement.clientWidth;
      const inset = getComputedStyle(this).direction === 'rtl' ? width - bounds.right : bounds.left;
      for (const [property, value] of [['--slider-viewport-width', width], ['--slider-viewport-inset', Math.max(0, inset)]]) {
        const next = `${value.toFixed(3)}px`;
        if (this.style.getPropertyValue(property) !== next) this.style.setProperty(property, next);
      }
      this.setAttribute('data-viewport-ready', '');
    }
    endDrag(settle = true) {
      const drag = this.drag;
      this.drag = null;
      if (!drag) return;
      if (drag.active) {
        this.suppressClickUntil = performance.now() + 400;
        // Keep native snapping disabled until the release animation is complete.
        this.track.setAttribute('data-settling', '');
      }
      this.track.removeAttribute('data-dragging');
      if (this.track.hasPointerCapture(drag.id)) this.track.releasePointerCapture(drag.id);
      if (settle && this.track.hasAttribute('data-settling')) this.settleToCard();
      this.schedule();
    }
    cancelSnap(restore = true) {
      cancelAnimationFrame(this.snapFrame);
      this.snapFrame = null;
      this.snapAnimation?.cancel();
      this.snapAnimation = null;
      if (restore) this.track?.removeAttribute('data-settling');
    }
    settleToCard() {
      this.cancelSnap(false);
      const start = this.track.scrollLeft;
      const style = getComputedStyle(this.track);
      const rtl = style.direction === 'rtl';
      const max = this.track.scrollWidth - this.track.clientWidth;
      const bounds = this.track.getBoundingClientRect();
      const padding = parseFloat(style.scrollPaddingInlineStart) || 0;
      const positions = [0, rtl ? -max : max, ...[...this.track.children].map(item => {
        const rect = item.getBoundingClientRect();
        const margin = parseFloat(getComputedStyle(item).scrollMarginInlineStart) || 0;
        const position = start + (rtl ? rect.right - bounds.right + padding + margin : rect.left - bounds.left - padding - margin);
        return rtl ? Math.max(-max, Math.min(0, position)) : Math.max(0, Math.min(max, position));
      })];
      const target = positions.reduce((nearest, position) => Math.abs(position - start) < Math.abs(nearest - start) ? position : nearest);
      const finish = () => {
        this.track.scrollLeft = target;
        this.cancelSnap();
        this.update();
      };
      if (this.preference.matches || Math.abs(target - start) < .5) { finish(); return; }
      const durationToken = style.getPropertyValue('--motion-duration-slow').trim();
      const duration = parseFloat(durationToken) * (durationToken.endsWith('ms') ? 1 : 1000) || 360;
      // An empty effect supplies the shared CSS easing without animating layout.
      this.snapAnimation = this.track.animate([{}, {}], {
        duration, easing: style.getPropertyValue('--motion-ease').trim() || 'ease-out', fill: 'both',
      });
      const step = () => {
        if (!this.snapAnimation) return;
        const progress = this.snapAnimation.effect.getComputedTiming().progress || 0;
        this.track.scrollLeft = start + (target - start) * progress;
        if (this.snapAnimation.playState === 'finished') finish();
        else this.snapFrame = requestAnimationFrame(step);
      };
      this.snapFrame = requestAnimationFrame(step);
    }
    update() {
      const max = this.track.scrollWidth - this.track.clientWidth;
      const offset = Math.abs(this.track.scrollLeft);
      this.controls.hidden = max <= 2;
      this.track.toggleAttribute('data-draggable', max > 2);
      this.controls.querySelector('[data-direction="-1"]').setAttribute('aria-disabled', String(offset <= 2));
      this.controls.querySelector('[data-direction="1"]').setAttribute('aria-disabled', String(offset >= max - 2));
    }
    disconnectedCallback() {
      this.endDrag(false);
      this.cancelSnap();
      this.preference?.removeEventListener('change', this.onMotionChange);
      this.track?.removeEventListener('wheel', this.onInterrupt);
      this.track?.removeEventListener('keydown', this.onInterrupt);
      for (const [type, handler] of [
        ['pointerdown', this.onPointerDown], ['pointermove', this.onPointerMove],
        ['pointerup', this.onPointerEnd], ['pointercancel', this.onPointerEnd],
        ['lostpointercapture', this.onPointerEnd], ['pointerleave', this.onPointerLeave],
        ['dragstart', this.onNativeDrag],
      ]) this.track?.removeEventListener(type, handler);
      this.track?.removeEventListener('click', this.onTrackClick, true);
      this.track?.removeAttribute('data-draggable');
      this.removeAttribute('data-viewport-ready');
      this.controls?.removeEventListener('click', this.onClick);
      this.track?.removeEventListener('scroll', this.schedule);
      this.removeEventListener('shopify:block:select', this.onSelect);
      this.resizeObserver?.disconnect();
      this.modeObserver?.disconnect();
      window.removeEventListener('resize', this.onResize);
      cancelAnimationFrame(this.frame);
      this.frame = null;
    }
  });
}
