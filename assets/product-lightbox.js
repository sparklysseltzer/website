/* Native image links remain usable when the modal enhancement is unavailable. */
(() => {
  class ProductLightbox extends HTMLElement {
    connectedCallback() {
      if (this.abort) return;
      this.dialog = this.querySelector('dialog');
      if (!this.dialog?.showModal) return;
      this.abort = new AbortController();
      const events = { signal: this.abort.signal };
      this.product = this.closest('product-detail');
      this.links = [...this.product.querySelectorAll('[data-lightbox-image]')];
      this.stage = this.querySelector('.product-lightbox__stage');
      this.image = this.querySelector('.product-lightbox__image');
      this.zoom = this.querySelector('[data-lightbox-zoom]');
      this.error = this.querySelector('[data-lightbox-error]');
      this.thumbnails = this.querySelector('.product-lightbox__thumbnails');
      this.thumbnails.replaceChildren();
      this.opener = this.product.querySelector('[data-lightbox-open]');
      if (!this.opener || !this.links.length) return;
      this.opener.setAttribute('aria-haspopup', 'dialog');
      const track = this.product.querySelector('.pdp-gallery__track');
      const syncOpener = () => {
        const slides = [...track.children];
        const active = slides[Math.round(track.scrollLeft / track.clientWidth)];
        this.opener.hidden = !active?.dataset.lightboxImage;
        if (active?.dataset.lightboxImage) this.opener.href = active.dataset.lightboxImage;
      };
      track.addEventListener('scroll', syncOpener, { ...events, passive: true });
      syncOpener();
      this.opener.addEventListener('click', event => {
        if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        this.product.stopGalleryMotion?.();
        this.product.querySelectorAll('video').forEach(video => video.pause());
        const index = this.links.findIndex(link => link.dataset.lightboxImage === this.opener.getAttribute('href'));
        this.dialog.showModal();
        this.select(Math.max(0, index));
        this.querySelector('[data-lightbox-close]').focus({ preventScroll: true });
        this.animate(this.dialog, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }]);
      }, events);
      this.links.forEach((link, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', link.dataset.imageLabel);
        const source = link.querySelector('img');
        const thumbnail = document.createElement('img');
        const url = new URL(link.dataset.lightboxImage, location.href); url.searchParams.set('width', '120');
        thumbnail.src = url.href; thumbnail.alt = ''; thumbnail.loading = 'lazy';
        thumbnail.width = 56; thumbnail.height = 56;
        button.append(thumbnail);
        button.addEventListener('click', () => this.select(index), events);
        this.thumbnails.append(button);
        link.dataset.imageAlt = source?.alt || '';
      });
      this.querySelectorAll('[data-lightbox-step]').forEach(button => {
        button.hidden = this.links.length < 2;
        button.addEventListener('click', () => this.select(this.index + Number(button.dataset.lightboxStep)), events);
      });
      this.zoom.addEventListener('click', () => this.setZoom(!this.dialog.hasAttribute('data-zoomed')), events);
      // Pointer capture retargets zoomed mouse clicks to the stage.
      this.stage.addEventListener('click', () => {
        if (!this.dragged) this.setZoom(!this.dialog.hasAttribute('data-zoomed'));
      }, events);
      this.image.draggable = false;
      this.stage.addEventListener('pointerdown', event => {
        this.start = { x: event.clientX, y: event.clientY, left: this.stage.scrollLeft, top: this.stage.scrollTop };
        this.dragged = false;
        if (event.pointerType === 'mouse' && this.dialog.hasAttribute('data-zoomed')) this.stage.setPointerCapture(event.pointerId);
      }, events);
      this.stage.addEventListener('pointermove', event => {
        if (this.start && Math.hypot(event.clientX - this.start.x, event.clientY - this.start.y) > 8) this.dragged = true;
        if (this.start && event.pointerType === 'mouse' && this.dialog.hasAttribute('data-zoomed')) {
          this.stage.scrollLeft = this.start.left - (event.clientX - this.start.x);
          this.stage.scrollTop = this.start.top - (event.clientY - this.start.y);
        }
      }, events);
      this.stage.addEventListener('pointerup', () => { this.start = null; }, events);
      this.stage.addEventListener('pointercancel', () => { this.start = null; this.dragged = true; }, events);
      this.querySelector('[data-lightbox-close]').addEventListener('click', () => this.close(), events);
      this.dialog.addEventListener('cancel', event => { event.preventDefault(); this.close(); }, events);
      this.dialog.addEventListener('close', () => { this.opener?.focus({ preventScroll: true }); }, events);
      this.dialog.addEventListener('keydown', event => {
        if (this.dialog.hasAttribute('data-zoomed') || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault(); this.select(this.index + (event.key === 'ArrowRight' ? 1 : -1));
      }, events);
    }
    animate(node, frames) {
      node.getAnimations().forEach(animation => animation.cancel());
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
      const style = getComputedStyle(node);
      return node.animate(frames, { duration: parseFloat(style.getPropertyValue('--motion-duration-base')) || 260, easing: style.getPropertyValue('--motion-ease-ui').trim() || 'ease' });
    }
    select(index) {
      const next = (index + this.links.length) % this.links.length;
      if (this.index === next && this.image.getAttribute('src')) { this.setZoom(false); return; }
      this.index = next;
      this.setZoom(false);
      const link = this.links[next];
      const source = link.querySelector('img');
      // Show the already loaded preview while the larger asset is fetched.
      this.image.src = source.currentSrc || source.src;
      this.image.alt = link.dataset.imageAlt;
      this.error.hidden = true;
      this.querySelector('.product-lightbox__count').textContent = `${next + 1} / ${this.links.length}`;
      [...this.thumbnails.children].forEach((button, i) => button.setAttribute('aria-current', String(i === next)));
      this.thumbnails.children[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
      this.animate(this.image, [{ opacity: .35 }, { opacity: 1 }]);
      const request = this.request = (this.request || 0) + 1;
      const full = new Image();
      full.onload = () => { if (this.isConnected && this.request === request) this.image.src = full.src; };
      full.onerror = () => { if (this.isConnected && this.request === request) this.error.hidden = false; };
      full.src = link.dataset.lightboxImage;
    }
    setZoom(zoomed) {
      this.dialog.toggleAttribute('data-zoomed', zoomed);
      this.zoom.setAttribute('aria-pressed', String(zoomed));
      this.zoom.querySelector('[data-lightbox-zoom-label]').textContent = zoomed ? this.zoom.dataset.out : this.zoom.dataset.in;
      this.stage.scrollLeft = zoomed ? this.stage.clientWidth / 2 : 0;
      this.stage.scrollTop = zoomed ? this.stage.clientHeight / 2 : 0;
      this.animate(this.image, [{ opacity: .6 }, { opacity: 1 }]);
    }
    async close() {
      if (this.closing || !this.dialog.open) return;
      this.closing = true;
      const animation = this.animate(this.dialog, [{ opacity: 1 }, { opacity: 0 }]);
      if (animation) {
        let timer;
        await Promise.race([animation.finished.catch(() => {}), new Promise(resolve => { timer = setTimeout(resolve, 350); })]);
        clearTimeout(timer);
      }
      this.dialog.close();
      animation?.cancel();
      this.closing = false;
    }
    disconnectedCallback() {
      this.abort?.abort(); this.abort = null; this.request = (this.request || 0) + 1;
      this.dialog?.getAnimations().forEach(animation => animation.cancel());
      this.dialog?.close(); this.image?.getAnimations().forEach(animation => animation.cancel());
    }
  }
  if (!customElements.get('product-lightbox')) customElements.define('product-lightbox', ProductLightbox);
})();
