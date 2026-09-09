class NotificationCenter {
  constructor(host) {
    this.host = host;
    this.entries = new Map();
    this.observer = new MutationObserver(() => this.mount());
    this.observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    document.addEventListener('visibilitychange', () => {
      this.entries.forEach((entry) => document.hidden ? this.pause(entry) : this.resume(entry));
    });
  }

  mount() {
    const parent = [...document.querySelectorAll('dialog[open]')].at(-1) || document.body;
    if (this.host.parentElement !== parent) {
      if (this.host.hidePopover && this.host.matches(':popover-open')) this.host.hidePopover();
      parent.append(this.host);
    }
    const visible = this.host.childElementCount > 0;
    if (visible && this.host.showPopover && !this.host.matches(':popover-open')) this.host.showPopover();
    this.host.classList.toggle('is-active', visible);
  }

  pause(entry) {
    if (!entry.timer) return;
    clearTimeout(entry.timer);
    entry.timer = null;
    entry.remaining = Math.max(0, entry.remaining - (performance.now() - entry.started));
  }

  resume(entry) {
    if (!this.entries.has(entry.key) || entry.type === 'error' || entry.timer || document.hidden || entry.node.matches(':hover, :focus-within')) return;
    entry.started = performance.now();
    entry.timer = setTimeout(() => this.dismiss(entry.key), entry.remaining);
  }

  show(message, { type = 'info', key = message } = {}) {
    if (!message?.trim()) return;
    if (!['info', 'success', 'warning', 'error'].includes(type)) type = 'info';
    const existing = this.entries.get(key);
    if (existing?.message === message && existing.type === type) {
      this.pause(existing);
      existing.remaining = 5000;
      this.resume(existing);
      return;
    }
    if (existing) this.dismiss(key, true);
    while (this.entries.size >= 3) {
      const oldest = [...this.entries.values()].find((entry) => !entry.node.contains(document.activeElement));
      if (!oldest) return;
      this.dismiss(oldest.key, true);
    }
    const node = document.createElement('div');
    node.className = `toast toast--${type}`;
    const icon = document.createElement('span');
    icon.className = 'toast__icon';
    icon.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('p');
    copy.setAttribute('role', type === 'error' ? 'alert' : 'status');
    copy.setAttribute('aria-atomic', 'true');
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'toast__close';
    close.setAttribute('aria-label', this.host.dataset.dismissLabel);
    const closeIcon = document.createElement('span');
    closeIcon.setAttribute('aria-hidden', 'true');
    close.append(closeIcon);
    node.append(icon, copy, close);
    const entry = { node, key, message, type, remaining: 5000, returnFocus: document.activeElement, returnId: document.activeElement?.id };
    this.entries.set(key, entry);
    this.host.append(node);
    this.mount();
    // Insert live text after its region is attached; never move focus into the toast.
    requestAnimationFrame(() => { if (node.isConnected) copy.textContent = message; });
    close.addEventListener('click', () => this.dismiss(key));
    node.addEventListener('pointerenter', () => this.pause(entry));
    node.addEventListener('pointerleave', () => this.resume(entry));
    node.addEventListener('focusin', () => this.pause(entry));
    node.addEventListener('focusout', () => queueMicrotask(() => this.resume(entry)));
    this.resume(entry);
  }

  dismiss(key, immediate = false) {
    const entry = this.entries.get(key);
    if (!entry) return;
    this.pause(entry);
    this.entries.delete(key);
    if (entry.node.contains(document.activeElement)) {
      const fallback = this.host.closest('dialog')?.querySelector('[data-cart-close]');
      (entry.returnFocus?.isConnected ? entry.returnFocus : document.getElementById(entry.returnId) || fallback)?.focus({ preventScroll: true });
    }
    entry.node.inert = true;
    const remove = () => {
      const positions = [...this.entries.values()].map(({ node }) => [node, node.getBoundingClientRect().top]);
      entry.node.remove();
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) positions.forEach(([node, top]) => {
        const distance = top - node.getBoundingClientRect().top;
        if (distance) node.animate([{ transform: `translateY(${distance}px)` }, { transform: 'translateY(0)' }], {
          duration: 260, easing: getComputedStyle(this.host).getPropertyValue('--motion-ease').trim() || 'ease-out',
        });
      });
      if (!this.host.childElementCount) {
        if (this.host.hidePopover && this.host.matches(':popover-open')) this.host.hidePopover();
        this.host.classList.remove('is-active');
      }
    };
    if (immediate || matchMedia('(prefers-reduced-motion: reduce)').matches) { remove(); return; }
    const style = getComputedStyle(entry.node);
    const animation = entry.node.animate([{ opacity: style.opacity }, { opacity: 0 }], {
      duration: parseFloat(getComputedStyle(this.host).getPropertyValue('--motion-duration-slow')) || 360,
      easing: getComputedStyle(this.host).getPropertyValue('--motion-ease').trim() || 'ease-out', fill: 'forwards',
    });
    animation.finished.catch(() => {}).then(remove);
  }
}

const notificationHost = document.querySelector('[data-notifications]');
if (notificationHost) window.SparklysNotifications = new NotificationCenter(notificationHost);
