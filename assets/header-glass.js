// Decorative black strip with an active-tab opening onto the shared header glass.
class HeaderGlass extends HTMLElement {
  connectedCallback() {
    this.header = this.closest('.site-header');
    this.strip = this.closest('.site-header__switcher');
    this.tab = this.header?.querySelector('.site-header__brand-tab--active .site-header__brand-tab-surface');
    this.svg = this.querySelector('svg');
    this.path = this.querySelector('path');
    if (!this.tab || !this.svg || !this.path) return;
    this.observer = new ResizeObserver(() => this.measure());
    [this.strip, this.tab, this.header.querySelector('.site-header__switcher-inner')].forEach(element => this.observer.observe(element, { box: 'border-box' }));
    this.measure();
    document.fonts.ready.then(() => { if (this.isConnected) this.measure(); });
  }

  measure() {
    const strip = this.strip.getBoundingClientRect();
    const tab = this.tab.getBoundingClientRect();
    if (!strip.width || !strip.height || !tab.width) {
      this.header.classList.remove('site-header--glass');
      return;
    }
    const x = tab.left - strip.left;
    const y = tab.top - strip.top;
    const right = x + tab.width;
    const bottom = strip.height;
    const radius = Math.min(parseFloat(getComputedStyle(this.tab).borderTopLeftRadius) || 0, tab.height / 2);
    const curve = parseFloat(getComputedStyle(this.tab.parentElement, '::before').width);
    const join = Math.min(curve || 14, tab.height - radius);
    // One contour leaves the tab open at the strip's bottom. An even-odd hole
    // overlapping the outer bottom edge can rasterize a seam at fractional heights.
    const d = `M0 0H${strip.width}V${bottom}H${right + join}
      Q${right} ${bottom} ${right} ${bottom - join} V${y + radius}
      Q${right} ${y} ${right - radius} ${y} H${x + radius}
      Q${x} ${y} ${x} ${y + radius} V${bottom - join}
      Q${x} ${bottom} ${x - join} ${bottom} H0Z`;
    this.svg.setAttribute('viewBox', `0 0 ${strip.width} ${bottom}`);
    if (this.path.getAttribute('d') !== d) this.path.setAttribute('d', d);
    this.header.classList.add('site-header--glass');
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this.header?.classList.remove('site-header--glass');
  }
}
if (!customElements.get('header-glass')) customElements.define('header-glass', HeaderGlass);
