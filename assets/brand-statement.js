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
      this.render();
      window.addEventListener('scroll', this.schedule, { passive: true });
      window.addEventListener('resize', this.schedule);
      window.addEventListener('pageshow', this.schedule);
      this.resizeObserver = new ResizeObserver(this.schedule);
      this.resizeObserver.observe(this);
    }
    render() {
      if (!this.items) return;
      const top = this.getBoundingClientRect().top;
      const height = window.innerHeight;
      const width = this.clientWidth || 1;
      // offsetTop/Left describe untransformed layout, preventing animation feedback.
      // Each line clears before it reaches the middle of the reading viewport.
      for (const item of this.items) {
        // Artwork anchors have zero height at the baseline; time them from a
        // neighboring word on the same wrapped line, not from that lower anchor.
        let timingElement = item.element;
        if (item.art) {
          const baseline = item.element.offsetTop;
          const words = [...item.element.parentElement.querySelectorAll('.brand-statement__word')];
          const sameLine = words.filter(word => word.offsetTop <= baseline && word.offsetTop + word.offsetHeight >= baseline);
          timingElement = sameLine.sort((a, b) => Math.abs(a.offsetLeft - item.element.offsetLeft) - Math.abs(b.offsetLeft - item.element.offsetLeft))[0] || item.element.previousElementSibling || item.element;
        }
        const stagger = (timingElement.offsetLeft / width) * height * .04;
        const progress = Math.min(1, Math.max(0,
          (height * .94 - top - timingElement.offsetTop - stagger) / (height * .32)
        ));
        if (progress !== item.progress) {
          item.animation.currentTime = progress * 1000;
          item.progress = progress;
        }
      }
    }
    teardown() {
      window.removeEventListener('scroll', this.schedule);
      window.removeEventListener('resize', this.schedule);
      window.removeEventListener('pageshow', this.schedule);
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
