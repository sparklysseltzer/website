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
      this.composition = this.querySelector('.brand-statement__composition');
      this.fitLayout = () => {
        cancelAnimationFrame(this.fitFrame);
        this.fitFrame = requestAnimationFrame(() => {
          this.fitFrame = requestAnimationFrame(() => {
            this.fitFrame = null;
            this.fitKey = null;
            this.fitMobile();
            this.onLayout();
          });
        });
      };
      this.fitFonts = () => { this.fitKey = null; this.fitLayout(); };
      this.fitObserver = new ResizeObserver(this.fitLayout);
      this.fitObserver.observe(this);
      document.fonts?.addEventListener('loadingdone', this.fitFonts);
      this.fitMobile();
      this.onPreference = () => {
        this.teardown();
        if (!this.preference.matches) this.setup();
      };
      this.preference.addEventListener('change', this.onPreference);
      this.onPreference();
    }
    fitMobile() {
      if (!this.composition) return;
      const mobile = matchMedia('(width < 768px)').matches;
      const font = getComputedStyle(this).fontSize;
      const key = `${mobile}:${this.clientWidth}:${font}`;
      if (this.fitKey === key) return;
      this.fitKey = key;
      this.composition.removeAttribute('style');
      this.removeAttribute('data-fitted');
      this.compositionScale = 1;
      if (!mobile) return;
      // Keep the approved wrapping canvas. Enlarge only its finished composition.
      const width = this.clientWidth - parseFloat(getComputedStyle(document.documentElement).fontSize);
      this.composition.style.width = `${width}px`;
      let longest = 0;
      for (const paragraph of this.composition.children) {
        const words = [...paragraph.querySelectorAll('.brand-statement__word')];
        const lines = new Map();
        for (const element of paragraph.querySelectorAll('.brand-statement__word, .brand-statement__art')) {
          const neighbor = words.find(word => word.offsetTop <= element.offsetTop && word.offsetTop + word.offsetHeight >= element.offsetTop);
          const line = element.classList.contains('brand-statement__art') && neighbor ? neighbor.offsetTop : element.offsetTop;
          const row = [...lines.keys()].find(top => Math.abs(top - line) <= 2) ?? line;
          const bounds = lines.get(row) || [Infinity, -Infinity];
          lines.set(row, [Math.min(bounds[0], element.offsetLeft), Math.max(bounds[1], element.offsetLeft + element.offsetWidth)]);
        }
        for (const [left, right] of lines.values()) longest = Math.max(longest, right - left);
      }
      if (!longest) return;
      const scale = Math.max(1, (this.clientWidth - 2) / longest);
      this.compositionScale = scale;
      this.composition.style.width = `${width}px`;
      this.composition.style.transform = `scale(${scale})`;
      this.composition.style.marginBottom = `${this.composition.offsetHeight * (scale - 1)}px`;
      this.setAttribute('data-fitted', '');
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
      this.canItem = this.items.find(item => item.element.classList.contains('brand-statement__art--cans'));
      this.canInner = this.canItem?.element.firstElementChild;
      this.canAnimations = [...(this.canInner?.querySelectorAll('img') || [])].map((can, index) => {
        const animation = can.animate([
          { opacity: 0, translate: '0 .2em', scale: '.7' },
          { opacity: 1, translate: '0 0', scale: '1' }
        ], { duration: 700, delay: index * 60, easing, fill: 'both' });
        animation.pause();
        return animation;
      });
      // Cans own their stagger; avoid compounding it with the generic badge reveal.
      this.canItem?.animation.cancel();
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
      const width = this.composition?.clientWidth || this.clientWidth || 1;
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
        item.top = (this.composition?.offsetTop || 0) + top * (this.compositionScale || 1);
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
          if (item === this.canItem) {
            // Preserve the reversible scroll timeline, with the selected 700/60 rhythm.
            const total = 700 + Math.max(0, this.canAnimations.length - 1) * 60;
            this.canAnimations.forEach(animation => { animation.currentTime = progress * total; });
          } else item.animation.currentTime = progress * 1000;
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
      this.canAnimations?.forEach(animation => animation.cancel());
      this.canAnimations = [];
      this.items = null;
    }
    disconnectedCallback() {
      this.teardown();
      this.fitObserver?.disconnect();
      cancelAnimationFrame(this.fitFrame);
      document.fonts?.removeEventListener('loadingdone', this.fitFonts);
      this.preference?.removeEventListener('change', this.onPreference);
    }
  });
}
