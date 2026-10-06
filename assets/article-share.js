class ArticleShare extends HTMLElement {
  connectedCallback() {
    if (this.abort) return;
    this.abort = new AbortController();
    const options = { signal: this.abort.signal };
    this.details = this.querySelector('details');
    this.summary = this.querySelector('summary');
    this.panel = this.querySelector('.article-share__panel');
    this.dialog = this.querySelector('dialog');
    if (this.dialog.showModal) {
      this.dialog.querySelector('[data-share-content]').append(this.panel);
      this.details.open = false;
      this.summary.setAttribute('aria-haspopup', 'dialog');
      this.summary.setAttribute('aria-controls', this.dialog.id);
      this.summary.setAttribute('aria-expanded', 'false');
      this.dialog.addEventListener('cancel', (event) => { event.preventDefault(); this.close(); }, options);
      this.querySelector('[data-close]').addEventListener('click', () => this.close(), options);
      this.dialog.addEventListener('click', (event) => {
        if (event.target !== this.dialog) return;
        const box = this.dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) this.close();
      }, options);
      this.dialog.addEventListener('close', () => {
        this.summary.setAttribute('aria-expanded', 'false');
        this.dialog.removeAttribute('data-closing');
        if (this.isConnected) this.summary.focus({ preventScroll: true });
      }, options);
    }
    this.summary.addEventListener('click', (event) => {
      if (navigator.share && matchMedia('(max-width: 767px), (pointer: coarse)').matches) {
        event.preventDefault();
        this.shareNative();
      } else if (this.dialog.showModal) {
        event.preventDefault();
        this.open();
      }
    }, options);
    const copy = this.querySelector('[data-copy]');
    copy.hidden = !navigator.clipboard?.writeText;
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(this.dataset.url);
        if (this.isConnected) window.SparklysNotifications?.show(this.dataset.copied, { type: 'success', key: 'article-copy' });
      } catch {
        if (!this.isConnected) return;
        const input = this.querySelector('input');
        input.focus(); input.select();
      }
    }, options);
    this.querySelector('input').addEventListener('click', (event) => event.target.select(), options);
  }

  timing() {
    const style = getComputedStyle(this);
    return { duration: matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : parseFloat(style.getPropertyValue('--motion-duration-base')) || 260, easing: style.getPropertyValue('--motion-ease-ui').trim() || 'ease' };
  }

  async shareNative() {
    if (this.sharing) return;
    this.sharing = true;
    try {
      await navigator.share({ title: this.querySelector('.article-share__description').textContent.trim(), url: this.dataset.url });
    } catch (error) {
      if (error.name !== 'AbortError' && this.isConnected) {
        if (this.dialog.showModal) this.open();
        else this.details.open = true;
      }
    } finally {
      this.sharing = false;
    }
  }

  open() {
    if (this.dialog.open) return;
    this.animation?.cancel();
    this.dialog.removeAttribute('data-closing');
    this.dialog.showModal();
    this.summary.setAttribute('aria-expanded', 'true');
    this.querySelector('[data-close]').focus({ preventScroll: true });
    this.animation = this.dialog.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], this.timing());
  }

  async close() {
    if (!this.dialog.open || this.closing) return;
    this.closing = true;
    const style = getComputedStyle(this.dialog);
    const first = { opacity: style.opacity, transform: style.transform };
    this.animation?.cancel();
    this.dialog.setAttribute('data-closing', '');
    this.animation = this.dialog.animate([first, { opacity: 0, transform: 'translateY(8px)' }], { ...this.timing(), fill: 'forwards' });
    const animation = this.animation;
    // Background tabs can defer animation-finish events; dismissal must still complete.
    let timer;
    await Promise.race([
      animation.finished.catch(() => {}),
      new Promise((resolve) => { timer = setTimeout(resolve, this.timing().duration + 50); }),
    ]);
    clearTimeout(timer);
    this.dialog.close();
    animation.cancel();
    this.closing = false;
  }

  disconnectedCallback() {
    this.abort?.abort(); this.abort = null;
    this.animation?.cancel();
    this.dialog?.close();
    if (this.panel && this.details) this.details.append(this.panel);
  }
}
if (!customElements.get('article-share')) customElements.define('article-share', ArticleShare);
