class ArticleShare extends HTMLElement {
  connectedCallback() {
    this.abort?.abort();
    this.abort = new AbortController();
    const options = { signal: this.abort.signal };
    this.details = this.querySelector('details');
    this.summary = this.querySelector('summary');
    this.panel = this.querySelector('.article-share__panel');
    this.expanded = this.details.open;
    this.summary.setAttribute('aria-expanded', String(this.expanded));
    this.summary.addEventListener('click', event => { event.preventDefault(); this.setOpen(!this.expanded); }, options);
    this.addEventListener('keydown', event => {
      if (event.key === 'Escape' && this.expanded) { event.preventDefault(); this.summary.focus(); this.setOpen(false); }
    }, options);
    document.addEventListener('pointerdown', event => {
      if (!this.contains(event.target) && this.expanded) this.setOpen(false);
    }, options);
    const copy = this.querySelector('[data-copy]');
    copy.hidden = !navigator.clipboard?.writeText;
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.dataset.url);
        if (this.isConnected) window.SparklysNotifications?.show(this.dataset.copied, { type: 'success', key: 'article-copy' });
      } catch {
        const input = this.querySelector('input');
        input.focus(); input.select();
      }
    }, options);
    this.querySelector('input').addEventListener('click', event => event.target.select(), options);
  }
  setOpen(open) {
    const start = this.details.getBoundingClientRect().height;
    const opacity = this.details.open ? getComputedStyle(this.panel).opacity : '0';
    this.animation?.cancel(); this.fade?.cancel();
    this.expanded = open;
    this.summary.setAttribute('aria-expanded', String(open));
    this.details.open = true;
    this.panel.inert = !open;
    const end = open ? this.details.getBoundingClientRect().height : this.summary.getBoundingClientRect().height;
    const style = getComputedStyle(this);
    const rawDuration = style.getPropertyValue('--motion-duration-base').trim();
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : parseFloat(rawDuration) * (rawDuration.endsWith('ms') ? 1 : 1000);
    const options = { duration, easing: style.getPropertyValue('--motion-ease').trim(), fill: 'both' };
    this.details.style.overflow = 'hidden';
    this.animation = this.details.animate([{ height: `${start}px` }, { height: `${end}px` }], options);
    this.fade = this.panel.animate([{ opacity: opacity }, { opacity: open ? 1 : 0 }], options);
    this.animation.onfinish = () => {
      this.details.open = open;
      this.animation.cancel(); this.fade.cancel();
      this.details.style.overflow = '';
    };
  }
  disconnectedCallback() { this.abort?.abort(); this.animation?.cancel(); this.fade?.cancel(); }
}
if (!customElements.get('article-share')) customElements.define('article-share', ArticleShare);
