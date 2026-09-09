/* Progressive select enhancement; native inputs remain the form's source of truth. */
(() => {
  let sequence = 0;
  class SparklysSelect extends HTMLElement {
    connectedCallback() {
      if (this.trigger) return;
      this.select = this.querySelector('select');
      if (!this.select || this.select.multiple || this.select.querySelector('optgroup')) return;
      this.abort = new AbortController();
      const events = { signal: this.abort.signal };
      const id = `FormSelect-${++sequence}`;
      this.trigger = document.createElement('button');
      this.trigger.type = 'button';
      this.trigger.className = 'form-control form-select__trigger';
      this.trigger.setAttribute('role', 'combobox');
      this.trigger.setAttribute('aria-haspopup', 'listbox');
      this.trigger.setAttribute('aria-controls', id);
      this.trigger.setAttribute('aria-expanded', 'false');
      const label = this.select.labels?.[0];
      if (label) { label.id ||= `${id}-label`; this.trigger.setAttribute('aria-labelledby', `${label.id} ${id}-value`); }
      else this.trigger.setAttribute('aria-label', this.select.getAttribute('aria-label') || this.select.name);
      this.valueLabel = document.createElement('span');
      this.valueLabel.id = `${id}-value`;
      this.trigger.append(this.valueLabel);
      this.menu = document.createElement('div');
      this.menu.className = 'form-select__menu';
      this.menu.hidden = true;
      this.list = document.createElement('div');
      this.list.id = id;
      this.list.className = 'form-select__list';
      this.list.setAttribute('role', 'listbox');
      if (label) this.list.setAttribute('aria-labelledby', label.id);
      this.menu.append(this.list);
      this.append(this.trigger, this.menu);
      this.select.classList.add('form-select__native');
      this.select.tabIndex = -1;
      this.select.setAttribute('aria-hidden', 'true');
      this.sync();
      this.trigger.addEventListener('click', () => this.toggle(!this.open), events);
      this.trigger.addEventListener('keydown', (event) => this.key(event), events);
      this.select.addEventListener('change', () => this.sync(), events);
      this.select.addEventListener('focus', () => this.trigger.focus(), events);
      this.select.addEventListener('invalid', (event) => { event.preventDefault(); this.trigger.setAttribute('aria-invalid', 'true'); this.trigger.focus(); }, events);
      this.select.form?.addEventListener('reset', () => queueMicrotask(() => { this.toggle(false); this.sync(); }), events);
      label?.addEventListener('click', (event) => { event.preventDefault(); this.trigger.focus(); }, events);
      document.addEventListener('pointerdown', (event) => { if (!this.contains(event.target)) this.toggle(false); }, events);
      this.addEventListener('focusout', (event) => { if (!this.contains(event.relatedTarget)) this.toggle(false); }, events);
      window.addEventListener('resize', () => this.toggle(false), events);
      this.observer = new MutationObserver(() => this.sync());
      this.observer.observe(this.select, { attributes: true, childList: true, subtree: true });
    }
    disconnectedCallback() {
      this.abort?.abort(); this.observer?.disconnect(); this.motion?.cancel();
      this.trigger?.remove(); this.menu?.remove(); this.trigger = null; this.open = false;
      this.select?.classList.remove('form-select__native');
      this.select?.removeAttribute('tabindex'); this.select?.removeAttribute('aria-hidden');
    }
    sync() {
      this.trigger.disabled = this.select.disabled;
      this.trigger.setAttribute('aria-required', String(this.select.required));
      for (const name of ['aria-describedby', 'aria-invalid']) {
        if (this.select.hasAttribute(name)) this.trigger.setAttribute(name, this.select.getAttribute(name));
        else this.trigger.removeAttribute(name);
      }
      this.valueLabel.textContent = this.select.selectedOptions[0]?.textContent || '';
      this.list.replaceChildren();
      this.options = [...this.select.options].map((option, index) => {
        const node = document.createElement('div');
        node.id = `${this.list.id}-${index}`;
        node.className = 'form-select__option';
        node.setAttribute('role', 'option');
        node.setAttribute('aria-selected', String(option.selected));
        node.setAttribute('aria-disabled', String(option.disabled));
        node.textContent = option.textContent;
        node.hidden = option.hidden;
        node.addEventListener('pointerdown', (event) => event.preventDefault());
        node.addEventListener('click', () => this.choose(index));
        this.list.append(node);
        return node;
      });
      this.active = this.select.selectedIndex;
      if (this.select.disabled) this.toggle(false);
      this.highlight();
    }
    highlight() {
      this.options.forEach((node, i) => node.toggleAttribute('data-active', i === this.active));
      if (this.open && this.options[this.active]) {
        this.trigger.setAttribute('aria-activedescendant', this.options[this.active].id);
        this.options[this.active].scrollIntoView({ block: 'nearest' });
      } else this.trigger.removeAttribute('aria-activedescendant');
    }
    toggle(open) {
      if (!this.trigger || (open && this.select.disabled) || this.open === open) return;
      const opacity = this.menu.hidden ? 0 : Number(getComputedStyle(this.menu).opacity);
      const transform = this.menu.hidden ? null : getComputedStyle(this.menu).transform;
      this.motion?.cancel();
      this.open = open;
      this.trigger.setAttribute('aria-expanded', String(open));
      this.toggleAttribute('data-open', open);
      this.menu.hidden = false;
      this.menu.inert = !open;
      if (open) {
        const rect = this.getBoundingClientRect();
        const below = innerHeight - rect.bottom - 20;
        const above = rect.top - 20;
        this.dataset.placement = below < 132 && above > below ? 'above' : 'below';
        const available = this.dataset.placement === 'above' ? above : below;
        this.list.style.setProperty('--form-menu-max-height', `${Math.max(88, Math.min(240, available))}px`);
        this.active = this.select.selectedIndex;
      }
      this.highlight();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this.menu.hidden = !open; return; }
      const style = getComputedStyle(this);
      const restingTransform = `translateY(${this.dataset.placement === 'above' ? 4 : -4}px)`;
      const animation = this.menu.animate([{ opacity, transform: transform || restingTransform }, { opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : restingTransform }], { duration: parseFloat(style.getPropertyValue('--motion-duration-fast')) || 200, easing: style.getPropertyValue('--motion-ease').trim() || 'ease' });
      this.motion = animation;
      animation.finished.then(() => { if (this.motion === animation) this.menu.hidden = !this.open; }).catch(() => {});
    }
    choose(index) {
      const option = this.select.options[index];
      if (!option || option.disabled || option.hidden) return;
      this.select.selectedIndex = index;
      this.select.dispatchEvent(new Event('input', { bubbles: true }));
      this.select.dispatchEvent(new Event('change', { bubbles: true }));
      this.toggle(false); this.trigger.focus();
    }
    key(event) {
      const available = [...this.select.options].map((option, i) => !option.disabled && !option.hidden ? i : -1).filter(i => i >= 0);
      if (event.key === 'Tab') { this.toggle(false); return; }
      if (event.key === 'Escape') { event.preventDefault(); this.toggle(false); return; }
      if (['Enter', ' '].includes(event.key)) { event.preventDefault(); if (this.open) this.choose(this.active); else this.toggle(true); return; }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault(); const wasOpen = this.open; this.toggle(true);
        const position = available.indexOf(this.active);
        if (event.key === 'Home') this.active = available[0];
        else if (event.key === 'End') this.active = available.at(-1);
        else if (wasOpen) this.active = available[Math.max(0, Math.min(available.length - 1, position + (event.key === 'ArrowDown' ? 1 : -1)))];
        else if (!available.includes(this.active)) this.active = available[0];
        this.highlight();
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        this.search = performance.now() - (this.searchedAt || 0) > 600 ? event.key : (this.search || '') + event.key;
        this.searchedAt = performance.now();
        const index = available.find(i => this.select.options[i].textContent.toLowerCase().startsWith(this.search.toLowerCase()));
        if (index !== undefined) { this.toggle(true); this.active = index; this.highlight(); }
      }
    }
  }
  if (!customElements.get('sparklys-select')) customElements.define('sparklys-select', SparklysSelect);
})();
