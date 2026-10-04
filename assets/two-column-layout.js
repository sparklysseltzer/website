class TwoColumnLayout extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute('data-sticky-sidebar') || !('ResizeObserver' in window)) return;
    // Shopify wraps static theme blocks; stick the grid item, not its inner aside.
    const sidebar = [...this.children].find(child => child.matches('.editorial-column--sidebar') || child.querySelector('.editorial-column--sidebar'));
    if (!sidebar) return;
    this.sidebar = sidebar;
    sidebar.setAttribute('data-sticky-sidebar-column', '');
    this.observer = new ResizeObserver(() => {
      const height = `${Math.ceil(sidebar.getBoundingClientRect().height)}px`;
      if (this.style.getPropertyValue('--editorial-sidebar-height') !== height) {
        this.style.setProperty('--editorial-sidebar-height', height);
      }
      this.setAttribute('data-sidebar-measured', '');
    });
    this.observer.observe(sidebar);
  }

  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = null;
    this.sidebar?.removeAttribute('data-sticky-sidebar-column');
    this.sidebar = null;
    this.removeAttribute('data-sidebar-measured');
    this.style.removeProperty('--editorial-sidebar-height');
  }
}

if (!customElements.get('two-column-layout')) customElements.define('two-column-layout', TwoColumnLayout);
