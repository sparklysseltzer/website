if (!customElements.get('header-navigation')) customElements.define('header-navigation', class extends HTMLElement {
  connectedCallback() {
    if (this.abort) return;
    this.abort = new AbortController();
    const { signal } = this.abort;
    this.mobile = this.dataset.presentation === 'mobile';
    this.breakpoint = matchMedia('(min-width: 64rem)');
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)');
    this.effects = new Map();
    this.heightEffects = new Map();
    this.roots = [...this.querySelectorAll('[data-nav-root]')];
    this.categories = [...this.querySelectorAll('[data-nav-category]')];
    this.tree = this.querySelector('.navigation-tree');
    this.pill = this.querySelector('.navigation-pill');
    this.group = this.querySelector('.navigation-roots');
    this.header = this.closest('.site-header');
    this.roots.concat(this.categories).forEach(details => this.state(details, false));
    if (this.mobile) {
      this.disclosure = this.querySelector('[data-mobile-disclosure]');
      this.opener = this.disclosure.querySelector(':scope > summary');
      this.content = this.querySelector('[data-mobile-content]');
      this.home = this.content.parentElement;
      this.dialog = document.createElement('dialog');
      this.dialog.className = 'navigation-dialog';
      this.dialog.setAttribute('aria-label', this.tree.getAttribute('aria-label'));
      this.append(this.dialog);
      this.dialog.append(this.content);
      this.querySelector('[data-mobile-close]').hidden = false;
      this.dialog.addEventListener('cancel', event => { event.preventDefault(); this.closeMobile(); }, { signal });
      this.dialog.addEventListener('close', () => { this.opener.setAttribute('aria-expanded', 'false'); }, { signal });
      this.opener.setAttribute('aria-expanded', 'false');
    }
    this.addEventListener('click', event => this.click(event), { signal });
    this.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        if (this.mobile) this.closeMobile();
        else this.closeRoot(true);
      }
      if (this.mobile && this.dialog.open && event.key === 'Tab') {
        const controls = [...this.dialog.querySelectorAll('a[href],button,summary,[tabindex="0"]')].filter(node => !node.disabled && !node.closest('[inert]') && node.getClientRects().length && node.checkVisibility());
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    }, { signal });
    document.addEventListener('click', event => {
      if (!this.contains(event.target)) this.closeRoot(false);
      if (event.target.closest('[data-cart-open],header-corporate-menu summary')) this.dismiss();
    }, { capture: true, signal });
    document.addEventListener('sparklys:navigation-dismiss', () => this.dismiss(), { signal });
    document.addEventListener('focusin', event => {
      if (!this.mobile && !this.contains(event.target)) this.closeRoot(false);
      this.positionPill();
      this.categoryPills?.forEach(pill => this.positionCategoryPill(pill));
    }, { signal });
    this.group.addEventListener('pointerover', event => { const target = event.target.closest('.navigation-trigger'); if (target) { this.hovered = target; this.positionPill(); } }, { signal });
    this.group.addEventListener('pointerleave', () => { this.hovered = null; this.positionPill(); }, { signal });
    this.breakpoint.addEventListener('change', () => {
      const hadFocus = this.contains(document.activeElement);
      this.dismiss();
      if (hadFocus) this.header.querySelector(this.breakpoint.matches ? '.site-header__logo' : '.navigation-mobile-opener')?.focus();
      this.measure();
    }, { signal });
    this.reduced.addEventListener('change', () => {
      this.effects.forEach(animation => animation.finish());
      this.heightEffects.forEach(animation => animation.finish());
      this.positionPill();
    }, { signal });
    window.addEventListener('scroll', () => this.measure(), { passive: true, signal });
    this.resize = new ResizeObserver(() => { this.measure(); this.updateScrollers(); });
    this.resize.observe(this.header);
    this.resize.observe(this.group);
    this.panelHeights = new WeakMap();
    this.panelResize = new ResizeObserver(entries => {
      for (const { target } of entries) {
        const panel = target.closest('.navigation-panel');
        if (this.mobile || panel.closest('[data-nav-root]') !== this.root) continue;
        const height = panel.getBoundingClientRect().height;
        const previous = this.panelHeights.get(panel);
        this.panelHeights.set(panel, height);
        if (previous) this.easePanelHeight(panel, previous);
      }
    });
    this.querySelectorAll('.navigation-categories, .navigation-panel > .navigation-content').forEach(body => this.panelResize.observe(body));
    this.querySelectorAll('.navigation-cards').forEach(rail => {
      rail.addEventListener('scroll', () => this.updateScrollers(), { passive: true, signal });
      this.resize.observe(rail);
    });
    this.categoryPills = [];
    if (!this.mobile) this.querySelectorAll('.navigation-categories').forEach(group => {
      const pill = document.createElement('div');
      pill.className = 'navigation-category-pill';
      pill.setAttribute('aria-hidden', 'true');
      pill.hidden = true;
      group.append(pill);
      this.categoryPills.push(pill);
      group.addEventListener('pointerover', event => {
        const target = event.target.closest('[data-nav-category] > summary, .navigation-category-link');
        if (target) { pill.hovered = target; this.positionCategoryPill(pill); }
        else if (event.target.closest('.navigation-content')) { pill.hovered = null; this.positionCategoryPill(pill); }
      }, { signal });
      group.addEventListener('pointerleave', () => { pill.hovered = null; this.positionCategoryPill(pill); }, { signal });
    });
    this.dataset.enhanced = '';
    this.measure();
    document.fonts.ready.then(() => { if (this.isConnected) this.measure(); });
  }
  state(details, open) {
    details.open = open;
    details.querySelector(':scope > summary').setAttribute('aria-expanded', String(open));
    const panel = details.querySelector(':scope > div');
    if (panel) panel.inert = !open;
  }
  animate(node, frames, kind = 'base', done) {
    this.effects.get(node)?.cancel();
    if (this.reduced.matches) { done?.(); return; }
    const styles = getComputedStyle(this);
    const duration = parseFloat(styles.getPropertyValue(`--motion-duration-${kind}`)) || 260;
    const animation = node.animate(frames, { duration, easing: styles.getPropertyValue('--motion-ease').trim() || 'ease-out', fill: 'both' });
    this.effects.set(node, animation);
    animation.finished.then(() => {
      if (this.effects.get(node) !== animation) return;
      this.effects.delete(node);
      animation.cancel();
      done?.();
    }).catch(() => {});
  }
  transition(details, open, immediate = false) {
    const panel = details.querySelector(':scope > div');
    const previous = getComputedStyle(panel);
    const opacity = details.open ? previous.opacity : '0';
    const height = details.open ? panel.getBoundingClientRect().height : 0;
    const transform = details.open ? previous.transform : 'translateY(-6px)';
    this.effects.get(panel)?.cancel(); this.effects.delete(panel);
    details.querySelector(':scope > summary').setAttribute('aria-expanded', String(open));
    panel.inert = !open;
    if (immediate || this.reduced.matches) { this.state(details, open); return; }
    details.open = true;
    const accordion = this.mobile && details.hasAttribute('data-nav-category');
    const frames = accordion
      ? [{ height: `${height}px`, opacity, overflow: 'hidden' }, { height: `${open ? panel.scrollHeight : 0}px`, opacity: open ? 1 : 0, overflow: 'hidden' }]
      : [{ opacity, transform }, { opacity: open ? 1 : 0, transform: `translateY(${open ? 0 : -6}px)` }];
    this.animate(panel, frames, accordion ? 'base' : 'slow', () => { if (!open) details.open = false; });
  }
  selectRoot(root) {
    if (this.root === root) { this.closeRoot(false); return; }
    if (this.root) this.transition(this.root, false);
    this.root = root;
    this.header.querySelectorAll('[data-corporate-menu][open]').forEach(details => { details.open = false; });
    const categories = [...root.querySelectorAll('[data-nav-category]')];
    categories.forEach((details, index) => this.transition(details, index === 0, true));
    root.selectedCategory = categories[0] || null;
    this.transition(root, true);
    this.reveal(root.selectedCategory || root);
    this.updateScrollers();
    this.positionPill();
  }
  closeRoot(restore = false, immediate = false) {
    if (!this.root) return;
    const root = this.root;
    this.root = null;
    this.transition(root, false, immediate);
    if (restore) root.querySelector('summary').focus({ preventScroll: true });
    this.positionPill();
  }
  easePanelHeight(panel, fromHeight) {
    if (this.mobile || this.reduced.matches || !panel.closest('[data-nav-root]').open) return;
    this.heightEffects.get(panel)?.cancel();
    const toHeight = panel.getBoundingClientRect().height;
    if (Math.abs(fromHeight - toHeight) < 1) return;
    const style = getComputedStyle(this);
    const animation = panel.animate([{ height: `${fromHeight}px` }, { height: `${toHeight}px` }], { duration: parseFloat(style.getPropertyValue('--motion-duration-base')), easing: style.getPropertyValue('--motion-ease').trim() });
    this.heightEffects.set(panel, animation);
    animation.finished.then(() => { if (this.heightEffects.get(panel) === animation) this.heightEffects.delete(panel); }).catch(() => {});
  }
  selectCategory(category) {
    const root = category.closest('[data-nav-root]');
    const current = root.selectedCategory;
    if (current === category && !this.mobile) return;
    if (current) this.transition(current, false);
    root.selectedCategory = current === category ? null : category;
    if (root.selectedCategory) { this.transition(category, true); this.reveal(category); }
    this.updateScrollers();
  }
  reveal(owner) {
    if (this.reduced.matches) return;
    [...owner.querySelectorAll('.navigation-cards > *')].filter(card => !card.closest('[inert]')).forEach((card, index) => {
      const delay = Math.min(index * 40, 160);
      this.animate(card, [{ opacity: 0, transform: 'translateY(8px)', offset: 0 }, { opacity: 0, transform: 'translateY(8px)', offset: delay / (360 + delay) }, { opacity: 1, transform: 'translateY(0)', offset: 1 }], 'slow');
    });
  }
  click(event) {
    const summary = event.target.closest('summary');
    if (summary === this.opener) { event.preventDefault(); this.openMobile(); return; }
    if (event.target.closest('[data-mobile-close]')) { this.closeMobile(); return; }
    if (summary?.parentElement.matches('[data-nav-root]')) { event.preventDefault(); this.selectRoot(summary.parentElement); return; }
    if (summary?.parentElement.matches('[data-nav-category]')) { event.preventDefault(); this.selectCategory(summary.parentElement); return; }
    const button = event.target.closest('[data-scroll]');
    if (button) {
      const rail = button.closest('.navigation-content').querySelector('.navigation-cards');
      rail.scrollBy({ left: Number(button.dataset.scroll) * rail.clientWidth * .85, behavior: this.reduced.matches ? 'instant' : 'smooth' });
    }
    if (event.target.closest('a[href]')) this.dismiss();
  }
  openMobile() {
    if (!this.dialog || this.dialog.open) return;
    this.header.querySelectorAll('header-navigation').forEach(nav => { if (nav !== this) nav.dismiss(); });
    this.header.querySelectorAll('[data-corporate-menu][open]').forEach(details => { details.open = false; });
    this.dialog.showModal();
    this.opener.setAttribute('aria-expanded', 'true');
    if (this.roots[0]) this.selectRoot(this.roots[0]);
    this.animate(this.dialog, [{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'translateY(0)' }], 'slow');
    this.querySelector('[data-mobile-close]').focus();
  }
  closeMobile(immediate = false, restore = true) {
    if (!this.dialog?.open) return;
    const finish = () => { this.dialog.close(); this.closeRoot(false, true); if (restore && this.isConnected) this.opener.focus({ preventScroll: true }); };
    if (immediate) { this.effects.get(this.dialog)?.cancel(); finish(); }
    else this.animate(this.dialog, [{ opacity: getComputedStyle(this.dialog).opacity }, { opacity: 0 }], 'base', finish);
  }
  dismiss() { this.closeRoot(false, true); this.closeMobile(true, false); }
  updateScrollers() {
    this.querySelectorAll('.navigation-content').forEach(content => {
      const rail = content.querySelector('.navigation-cards');
      const previous = content.querySelector('[data-scroll="-1"]');
      const next = content.querySelector('[data-scroll="1"]');
      const controls = content.querySelector('.navigation-controls');
      if (controls) controls.hidden = rail.clientWidth === 0 || rail.scrollWidth <= rail.clientWidth + 2;
      if (previous) previous.disabled = rail.scrollLeft <= 1;
      if (next) next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
    });
  }
  measure() {
    if (!this.header) return;
    // Overlay panels do not contribute to the existing sticky-header height observer.
    this.style.setProperty('--navigation-top', `${this.header.querySelector('.site-header__main').getBoundingClientRect().bottom}px`);
    this.positionPill();
    this.categoryPills?.forEach(pill => this.positionCategoryPill(pill));
  }
  positionCategoryPill(pill) {
    const group = pill.parentElement;
    const focused = group.contains(document.activeElement) && document.activeElement.matches("summary:focus-visible, .navigation-category-link:focus-visible") ? document.activeElement : null;
    const target = focused || pill.hovered;
    clearTimeout(pill.hideTimer);
    if (!target || !this.breakpoint.matches || !group.checkVisibility()) {
      if (!pill.hidden) pill.hideTimer = setTimeout(() => {
        const painted = getComputedStyle(pill);
        const opacity = painted.opacity;
        Object.assign(pill.style, { transform: painted.transform, width: painted.width, height: painted.height });
        pill.target = null;
        this.animate(pill, [{ opacity }, { opacity: 0 }], 'fast', () => { pill.hidden = true; });
      }, this.reduced.matches ? 0 : 140);
      return;
    }
    const origin = group.getBoundingClientRect(), rect = target.getBoundingClientRect();
    const previous = pill.hidden ? rect : pill.getBoundingClientRect();
    const opacity = pill.hidden ? 0 : getComputedStyle(pill).opacity;
    const frame = box => ({ transform: `translate(${box.left - origin.left}px, ${box.top - origin.top}px)`, width: `${box.width}px`, height: `${box.height}px` });
    const end = frame(rect), key = JSON.stringify(end);
    if (pill.target === target && pill.end === key) return;
    pill.hidden = false; pill.target = target; pill.end = key;
    Object.assign(pill.style, end, { opacity: "1" });
    this.animate(pill, [{ ...frame(previous), opacity }, { ...end, opacity: 1 }], "navigation");
  }
  positionPill() {
    if (this.mobile || !this.pill || !this.breakpoint.matches) return;
    const focused = this.contains(document.activeElement) && document.activeElement.matches('.navigation-trigger:focus-visible') ? document.activeElement : null;
    const target = focused || this.hovered || this.querySelector('.navigation-trigger[data-current]');
    clearTimeout(this.pillHideTimer);
    if (!target) {
      if (this.pill.hidden) return;
      this.pillHideTimer = setTimeout(() => {
        const painted = getComputedStyle(this.pill);
        const opacity = painted.opacity;
        Object.assign(this.pill.style, { transform: painted.transform, width: painted.width, height: painted.height });
        this.animate(this.pill, [{ opacity }, { opacity: 0 }], 'fast', () => {
          this.pill.hidden = true;
          this.pillTarget = null;
        });
      }, this.reduced.matches ? 0 : 140);
      return;
    }
    const origin = this.header.querySelector('.site-header__inner').getBoundingClientRect(), rect = target.getBoundingClientRect();
    const wasHidden = this.pill.hidden;
    const previous = wasHidden ? rect : this.pill.getBoundingClientRect();
    const opacity = wasHidden ? 0 : getComputedStyle(this.pill).opacity;
    this.pill.hidden = false;
    const frame = box => ({ transform: `translate(${box.left - origin.left}px, ${box.top - origin.top}px)`, width: `${box.width}px`, height: `${box.height}px` });
    // Snap the settled bounds, keeping the interrupted frame untouched for smooth reversal.
    const pixel = value => Math.round(value * window.devicePixelRatio) / window.devicePixelRatio;
    const end = { transform: `translate(${pixel(rect.left - origin.left)}px, ${pixel(rect.top - origin.top)}px)`, width: `${pixel(rect.width)}px`, height: `${pixel(rect.height)}px` };
    const key = JSON.stringify(end);
    if (this.pillTarget === target && this.pillEnd === key && opacity === '1') return;
    this.pillTarget = target; this.pillEnd = key;
    Object.assign(this.pill.style, end, { opacity: '1' });
    this.animate(this.pill, [{ ...frame(previous), opacity }, { ...end, opacity: 1 }], 'navigation');
  }

  disconnectedCallback() {
    clearTimeout(this.pillHideTimer);
    this.categoryPills?.forEach(pill => { clearTimeout(pill.hideTimer); pill.remove(); });
    this.dismiss();
    this.effects?.forEach(animation => animation.cancel());
    this.heightEffects?.forEach(animation => animation.cancel());
    this.panelResize?.disconnect();
    this.resize?.disconnect();
    this.abort?.abort(); this.abort = null;
    if (this.dialog) { this.home.append(this.content); this.dialog.remove(); }
    delete this.dataset.enhanced;
  }
});
