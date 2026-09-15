/* Shared catalog filtering. Native collection links and pagination remain the fallback. */
if (!customElements.get('collection-catalog')) customElements.define('collection-catalog', class extends HTMLElement {
  connectedCallback() {
    if (this.controller) return;
    this.controller = new AbortController();
    const { signal } = this.controller;
    this.grid = this.querySelector('[data-catalog-grid]');
    this.status = this.querySelector('[data-catalog-status]');
    this.links = [...this.querySelectorAll('[data-filter]')];
    this.animations = [];
    this.revision = 0;
    this.selected = 'all';
    this.updateEmpty();
    this.addEventListener('click', event => {
      const link = event.target.closest('[data-filter]');
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      this.filter(link.dataset.filter, true);
    }, { signal });
    const restore = () => {
      const value = new URLSearchParams(location.hash.slice(1)).get('collection') || 'all';
      this.filter(this.links.some(link => link.dataset.filter === value) ? value : 'all');
    };
    if (this.links.length) { window.addEventListener('popstate', restore, { signal }); restore(); }
  }
  disconnectedCallback() {
    this.controller?.abort(); this.controller = null;
    this.fetchController?.abort();
    this.animations?.forEach(animation => animation.cancel());
  }
  updateEmpty() {
    this.querySelector('[data-catalog-empty]').hidden = !!this.grid.querySelector('.catalog-card:not([hidden])');
  }
  async loadPages() {
    if (this.loaded) return;
    if (this.loading) return this.loading;
    this.fetchController = new AbortController();
    this.loading = (async () => {
      let next = this.querySelector('[data-catalog-next]')?.href;
      // Direct entry to a later page must still filter the complete collection.
      const initial = new URL(location.href);
      if (Number(initial.searchParams.get('page')) > 1) {
        initial.searchParams.delete('page'); initial.hash = ''; next = initial.href;
      }
      const seen = new Set();
      const cards = [];
      while (next && !seen.has(next)) {
        seen.add(next);
        const url = new URL(next, location.href);
        if (url.origin !== location.origin) throw new Error('Unexpected catalog origin');
        url.searchParams.set('section_id', this.dataset.sectionId);
        const response = await fetch(url, { signal: this.fetchController.signal });
        if (!response.ok) throw new Error('Catalog request failed');
        const document = new DOMParser().parseFromString(await response.text(), 'text/html');
        const catalog = document.querySelector('collection-catalog');
        if (!catalog) throw new Error('Missing catalog');
        cards.push(...catalog.querySelectorAll('.catalog-card'));
        next = catalog.querySelector('[data-catalog-next]')?.getAttribute('href');
      }
      const ids = new Set([...this.grid.children].map(card => card.dataset.productId));
      cards.forEach(card => { if (!ids.has(card.dataset.productId)) { card.hidden = true; this.grid.append(card); ids.add(card.dataset.productId); } });
      this.loaded = true;
      this.querySelector('[data-catalog-pagination]').hidden = true;
    })().finally(() => { this.loading = null; });
    return this.loading;
  }
  async filter(value, updateURL = false) {
    if (value === this.selected && !this.busy) return;
    const revision = ++this.revision;
    this.busy = true;
    this.setAttribute('aria-busy', 'true');
    this.status.classList.add('visually-hidden');
    try {
      if (!this.loaded) { this.status.textContent = this.dataset.loading; await this.loadPages(); }
      if (revision !== this.revision || !this.isConnected) return;
      const currentOpacity = getComputedStyle(this.grid).opacity;
      this.animations.forEach(animation => animation.cancel());
      this.animations = [];
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const oldHeight = this.grid.getBoundingClientRect().height;
      if (!reduced) {
        const out = this.grid.animate([{ opacity: currentOpacity }, { opacity: 0 }], { duration: 120, fill: 'forwards' });
        this.animations.push(out); await out.finished.catch(() => {});
      }
      if (revision !== this.revision || !this.isConnected) return;
      const rank = card => ({ soda: 0, hardseltzer: 1 }[card.dataset.world] ?? 2);
      this.grid.replaceChildren(...[...this.grid.children].sort((a, b) => rank(a) - rank(b)));
      let count = 0;
      for (const card of this.grid.children) {
        card.hidden = value !== 'all' && !card.dataset.collections.split(' ').includes(value);
        if (!card.hidden) count++;
      }
      this.updateEmpty();
      this.links.forEach(link => {
        if (link.dataset.filter === value) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      const newHeight = this.grid.getBoundingClientRect().height;
      this.animations.forEach(animation => animation.cancel());
      this.animations = [];
      if (!reduced) {
        this.animations.push(this.grid.animate([{ height: `${oldHeight}px` }, { height: `${newHeight}px` }], { duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }));
        this.animations.push(this.grid.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }));
      }
      this.selected = value;
      this.status.textContent = this.dataset.count.replace('[count]', count);
      if (updateURL) {
        const url = new URL(location.href);
        url.hash = value === 'all' ? '' : new URLSearchParams({ collection: value }).toString();
        history.pushState(null, '', url);
      }
    } catch (error) {
      if (revision === this.revision && error.name !== 'AbortError') {
        this.status.classList.remove('visually-hidden');
        this.status.textContent = this.dataset.error;
      }
    } finally {
      if (revision === this.revision) { this.busy = false; this.removeAttribute('aria-busy'); }
    }
  }
});

if (!customElements.get('collection-hero-motion')) customElements.define('collection-hero-motion', class extends HTMLElement {
  connectedCallback() {
    if (this.controller) return;
    this.media = matchMedia('(prefers-reduced-motion: reduce)');
    this.pointerMedia = matchMedia('(hover: hover) and (pointer: fine)');
    this.controller = new AbortController();
    const { signal } = this.controller;
    this.animations = [];
    this.cans = [...this.querySelectorAll('[data-floating-can]')];

    this.time = 0;
    this.pointer = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.media.addEventListener('change', () => this.update(), { signal });
    this.pointerMedia.addEventListener('change', () => this.resetPointer(), { signal });
    window.addEventListener('pointermove', event => {
      if (!this.running || !this.pointerMedia.matches || event.pointerType === 'touch') return;
      this.target.x = Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1));
      this.target.y = Math.max(-1, Math.min(1, event.clientY / window.innerHeight * 2 - 1));
    }, { passive: true, signal });
    document.documentElement.addEventListener('pointerleave', () => this.resetPointer(), { signal });
    window.addEventListener('pointercancel', () => this.resetPointer(), { signal });
    window.addEventListener('blur', () => this.resetPointer(), { signal });
    this.observer = new IntersectionObserver(entries => {
      this.visible = entries[0].isIntersecting;
      this.measure();
      this.update();
    });
    this.observer.observe(this);
    this.resizeObserver = new ResizeObserver(() => this.measure());
    this.resizeObserver.observe(this);
    window.addEventListener('scroll', () => this.measure(), { passive: true, signal });
    window.addEventListener('resize', () => this.measure(), { passive: true, signal });
    document.addEventListener('visibilitychange', () => this.update(), { signal });
    this.measure();
    this.revealCopy();
  }
  revealCopy() {
    if (this.revealed || this.media.matches || !this.hasAttribute('data-animate')) return;
    this.revealed = true;
    const style = getComputedStyle(this);
    const duration = parseFloat(style.getPropertyValue('--motion-duration-slow')) || 360;
    const easing = style.getPropertyValue('--motion-ease').trim() || 'ease-out';
    this.introAnimations = [...this.querySelectorAll('.collection-hero__copy > *')].map((node, index) =>
      node.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration, delay: Math.min(index * 50, 200), easing, fill: 'backwards' })
    );
  }
  resetPointer() { this.target.x = 0; this.target.y = 0; }
  measure() {
    this.bounds = this.getBoundingClientRect();
  }
  update() {
    const enabled = this.hasAttribute('data-animate') && !this.media.matches;
    const hasArtwork = this.cans.length || this.querySelector('[data-glow]');
    this.running = Boolean(enabled && hasArtwork && this.visible && !document.hidden);
    if (!this.running) {
      cancelAnimationFrame(this.frame);
      this.frame = null;
      this.lastTime = null;
      this.resetPointer();
    }
    if (!enabled) {
      this.introAnimations?.forEach(animation => animation.cancel());
      this.animations.forEach(animation => animation.cancel());
      this.animations = [];
      this.cans.forEach(can => { can.style.transform = ''; });
      this.pointer = { x: 0, y: 0 };
      this.time = 0;
      return;
    }
    if (!this.animations.length) {
      this.querySelectorAll('[data-glow]').forEach((glow, index) => {
        this.animations.push(glow.animate([{ transform: 'translate(0, 0) scale(1, 1)' }, { transform: `translate(${index ? -12 : 14}%, ${index ? 5 : -5}%) scale(1.15, .9)` }, { transform: 'translate(0, 0) scale(1, 1)' }], { duration: index ? 22000 : 26000, iterations: Infinity, easing: 'ease-in-out' }));
      });
    }
    this.animations.forEach(animation => { if (this.running) animation.play(); else animation.pause(); });
    if (this.running && !this.frame) this.frame = requestAnimationFrame(time => this.tick(time));
  }
  tick(timestamp) {
    this.frame = null;
    if (!this.running) return;
    const dt = this.lastTime == null ? 0 : Math.min((timestamp - this.lastTime) / 1000, .05);
    this.lastTime = timestamp;
    this.time += dt;
    // Frame-rate-independent damping follows the pointer without snapping or trailing forever.
    const follow = 1 - Math.exp(-dt * 5);
    this.pointer.x += (this.target.x - this.pointer.x) * follow;
    this.pointer.y += (this.target.y - this.pointer.y) * follow;
    const t = this.time;
    const entry = Math.min(1, t / 1.2);
    const strength = entry * entry * (3 - 2 * entry);
    const mobileScale = Math.min(1, this.bounds.width / 900);
    this.cans.forEach((can, index) => {
      // Different, overlapping orbital periods avoid a synchronized up/down pendulum.
      const phase = index * 2.4;
      const depth = index ? .75 : 1;
      const x = (Math.sin(t * .43 + phase) * 13 + Math.sin(t * .19 + phase) * 5) * mobileScale;
      const y = (Math.cos(t * .37 + phase) * 16 + Math.sin(t * .61 + phase) * 4) * mobileScale;
      const roll = Math.sin(t * .31 + phase) * 3;
      can.style.transform = `perspective(1000px) translate3d(${(x + this.pointer.x * 20 * depth) * strength}px, ${(y + this.pointer.y * 14 * depth) * strength}px, 0) rotateX(${-this.pointer.y * 4 * depth * strength}deg) rotateY(${this.pointer.x * 6 * depth * strength}deg) rotateZ(${(roll + this.pointer.x * 2 * depth) * strength}deg)`;
    });
    this.frame = requestAnimationFrame(time => this.tick(time));
  }
  disconnectedCallback() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    this.frame = null;
    this.lastTime = null;
    this.observer?.disconnect();
    this.resizeObserver?.disconnect();
    this.controller?.abort();
    this.controller = null;
    this.animations?.forEach(animation => animation.cancel());
    this.introAnimations?.forEach(animation => animation.cancel());
  }
});
