/* Position-driven reveals: every word is initialized before any scroll update. */
if (!customElements.get('brand-statement')) {
  customElements.define('brand-statement', class extends HTMLElement {
    connectedCallback() {
      this.preference = matchMedia('(prefers-reduced-motion: reduce)');
      this.schedule = () => {
        if (!this.frame) this.frame = requestAnimationFrame(() => {
          this.frame = null;
          this.render();
        });
      };
      this.onLayout = () => { this.geometryDirty = true; this.schedule(); };
      this.onPreference = () => {
        this.teardown();
        if (!this.preference.matches) this.setup();
      };
      this.preference.addEventListener('change', this.onPreference);
      this.onPreference();
    }
    setup() {
      if (!Element.prototype.animate) return;
      const easing = getComputedStyle(this).getPropertyValue('--motion-ease').trim() || 'ease-out';
      this.items = [...this.querySelectorAll('.brand-statement__word, .brand-statement__art')].map(element => {
        const art = element.classList.contains('brand-statement__art');
        const animation = element.animate([
          { opacity: 0, filter: 'blur(8px)', transform: art ? 'translateY(.2em) rotate(-14deg) scale(.8)' : 'translateY(.12em)' },
          { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0) rotate(0deg) scale(1)' }
        ], { duration: 1000, easing, fill: 'both' });
        animation.pause();
        animation.currentTime = 0;
        return { element, animation, art };
      });
      this.geometryDirty = true;
      this.render();
      window.addEventListener('scroll', this.schedule, { passive: true });
      window.addEventListener('resize', this.onLayout);
      window.addEventListener('pageshow', this.onLayout);
      document.fonts?.addEventListener('loadingdone', this.onLayout);
      this.resizeObserver = new ResizeObserver(this.onLayout);
      this.resizeObserver.observe(this);
    }
    measure() {
      const width = this.clientWidth || 1;
      // Read wrapping geometry together, only when layout changes. Never mix
      // per-word offset reads with animation writes on every scroll frame.
      const words = this.items.filter(item => !item.art).map(item => ({
        element: item.element, top: item.element.offsetTop,
        bottom: item.element.offsetTop + item.element.offsetHeight, left: item.element.offsetLeft
      }));
      for (const item of this.items) {
        let top = item.element.offsetTop;
        let left = item.element.offsetLeft;
        if (item.art) {
          const sameLine = words.filter(word => word.element.parentElement === item.element.parentElement && word.top <= top && word.bottom >= top);
          const neighbor = sameLine.reduce((nearest, word) => !nearest || Math.abs(word.left - left) < Math.abs(nearest.left - left) ? word : nearest, null);
          if (neighbor) { top = neighbor.top; left = neighbor.left; }
        }
        item.top = top;
        item.stagger = left / width * .04;
      }
      this.geometryDirty = false;
    }
    render() {
      if (!this.items) return;
      if (this.geometryDirty) this.measure();
      const top = this.getBoundingClientRect().top;
      const height = window.innerHeight;
      for (const item of this.items) {
        const stagger = item.stagger * height;
        const progress = Math.min(1, Math.max(0,
          (height * .94 - top - item.top - stagger) / (height * .32)
        ));
        if (progress !== item.progress) {
          item.animation.currentTime = progress * 1000;
          item.progress = progress;
        }
      }
    }
    teardown() {
      window.removeEventListener('scroll', this.schedule);
      window.removeEventListener('resize', this.onLayout);
      window.removeEventListener('pageshow', this.onLayout);
      document.fonts?.removeEventListener('loadingdone', this.onLayout);
      this.resizeObserver?.disconnect();
      cancelAnimationFrame(this.frame);
      this.frame = null;
      this.items?.forEach(({ animation }) => animation.cancel());
      this.items = null;
    }
    disconnectedCallback() {
      this.teardown();
      this.preference?.removeEventListener('change', this.onPreference);
    }
  });
}
