/* Native pagination remains available until this component is connected. */
class BlogList extends HTMLElement {
  connectedCallback() {
    if (this.controller) return;
    this.controller = new AbortController();
    this.grid = this.querySelector('[data-blog-grid]');
    this.more = this.querySelector('[data-blog-more]');
    this.status = this.querySelector('[data-blog-status]');
    this.next = this.more?.href;
    this.buffer = [];
    this.sidebar = this.querySelector('.blog-sidebar');
    const featured = this.querySelector('.article-card--featured');
    if (this.sidebar && featured) {
      this.sidebar.classList.add('is-fitting');
      this.sidebarObserver = new ResizeObserver(() => this.fitSidebar());
      this.sidebarObserver.observe(featured);
      this.sidebarObserver.observe(this.sidebar);
      document.fonts.ready.then(() => { if (this.isConnected) this.fitSidebar(); });
      this.fitSidebar();
    }
    this.more?.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      this.loadMore();
    }, { signal: this.controller.signal });
  }

  disconnectedCallback() {
    this.sidebarObserver?.disconnect();
    this.sidebar?.classList.remove('is-fitting');
    this.controller?.abort();
    this.controller = null;
    this.animations?.forEach((animation) => animation.cancel());
  }

  fitSidebar() {
    if (!this.sidebar || !this.sidebar.getClientRects().length) return;
    const items = [...this.sidebar.querySelectorAll('li')];
    const focused = document.activeElement;
    // Restore candidates for measurement in one frame; hidden links never stay tabbable.
    items.forEach((item) => { item.hidden = false; });
    let count = 8;
    if (matchMedia('(min-width: 990px)').matches) {
      const bottom = this.sidebar.getBoundingClientRect().bottom - parseFloat(getComputedStyle(this.sidebar).paddingBottom);
      count = items.findIndex((item) => item.getBoundingClientRect().bottom > bottom + 1);
      if (count < 0) count = items.length;
    }
    items.forEach((item, index) => { item.hidden = index >= count; });
    if (items.some((item) => item.hidden && item.contains(focused))) {
      (items[count - 1]?.querySelector('a') || this.querySelector('.article-card--featured a'))?.focus({ preventScroll: true });
    }
  }

  async loadMore() {
    if (this.busy) return;
    this.busy = true;
    this.more.setAttribute('aria-disabled', 'true');
    this.setAttribute('aria-busy', 'true');
    const count = matchMedia('(max-width: 767px)').matches ? 3 : 6;
    try {
      while (this.buffer.length < count && this.next) {
        const url = new URL(this.next, location.href);
        url.searchParams.set('section_id', this.dataset.sectionId);
        const response = await fetch(url, { signal: this.controller.signal });
        if (!response.ok) throw new Error('Unable to load posts');
        const page = new DOMParser().parseFromString(await response.text(), 'text/html');
        const list = page.querySelector('blog-list');
        if (!list?.querySelector('[data-blog-grid]')) throw new Error('Invalid blog response');
        this.buffer.push(...list.querySelectorAll('[data-blog-grid] > .article-card'));
        this.next = list.querySelector('[data-blog-more]')?.getAttribute('href');
      }
      const cards = this.buffer.splice(0, count);
      this.animations?.forEach((animation) => animation.finish());
      const oldHeight = this.grid.getBoundingClientRect().height;
      cards.forEach((card) => {
        card.removeAttribute('data-poster-reveal');
        card.classList.remove('article-card--featured');
        this.grid.append(card);
      });
      this.updateSchema();
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && cards.length) {
        const styles = getComputedStyle(this);
        const token = styles.getPropertyValue('--motion-duration-slow').trim();
        const duration = parseFloat(token) * (token.endsWith('ms') ? 1 : 1000);
        const options = { duration: duration || 400, easing: styles.getPropertyValue('--motion-ease').trim() || 'ease' };
        this.animations = [this.grid.animate([
          { height: `${oldHeight}px`, overflow: 'clip' },
          { height: `${this.grid.getBoundingClientRect().height}px`, overflow: 'clip' }
        ], options), ...cards.map((card) => card.animate([{ opacity: 0 }, { opacity: 1 }], options))];
      }
      window.SparklysNotifications?.dismiss(`blog-load-${this.dataset.sectionId}`);
      this.status.textContent = this.dataset.loadedLabel;
      const firstLink = cards[0]?.querySelector('a');
      firstLink?.focus({ preventScroll: true });
      if (!this.next && !this.buffer.length) this.more.hidden = true;
      else if (this.next) this.more.href = this.next;
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.status.textContent = this.dataset.errorLabel;
        window.SparklysNotifications?.show(this.dataset.errorLabel, { type: 'error', key: `blog-load-${this.dataset.sectionId}` });
      }
    } finally {
      this.busy = false;
      this.more.removeAttribute('aria-disabled');
      this.removeAttribute('aria-busy');
    }
  }

  updateSchema() {
    const script = this.querySelector('script[type="application/ld+json"]');
    if (!script) return;
    const schema = JSON.parse(script.textContent);
    const start = schema.itemListElement[0]?.position || 1;
    const origin = new URL(schema.itemListElement[0]?.url || location.href).origin;
    schema.itemListElement = [...this.grid.querySelectorAll('.article-card')].map((card, index) => ({
      '@type': 'ListItem', position: start + index,
      url: new URL(card.querySelector('a').getAttribute('href'), origin).href,
      name: card.querySelector('.article-card__title').textContent.trim()
    }));
    script.textContent = JSON.stringify(schema);
  }
}
if (!customElements.get('blog-list')) customElements.define('blog-list', BlogList);
