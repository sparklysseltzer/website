/* Product controls enhance Shopify's native variant and purchase forms. */
(() => {
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timing = node => ({ duration: parseFloat(getComputedStyle(node).getPropertyValue('--motion-duration-base')) || 260, easing: getComputedStyle(node).getPropertyValue('--motion-ease').trim() || 'ease' });
  const crossfade = (node, text) => {
    if (!node || node.textContent === text) return;
    node.getAnimations().forEach(animation => animation.cancel());
    node.textContent = text;
    if (!reduced()) node.animate([{ opacity: .35 }, { opacity: 1 }], timing(node));
  };
  class ProductDetail extends HTMLElement {
    connectedCallback() {
      if (this.abort) return;
      this.abort = new AbortController();
      const events = { signal: this.abort.signal };
      this.data = JSON.parse(this.querySelector('[data-product-data]').textContent);
      this.variantSelect = this.querySelector('[data-variant-select]');
      this.planSelect = this.querySelector('[data-plan-select]');
      this.quantity = this.querySelector('[name="quantity"]');
      this.buyForm = this.querySelector('product-form form');
      this.track = this.querySelector('.pdp-gallery__track');
      this.slides = [...this.querySelectorAll('.pdp-gallery__slide')];
      this.querySelectorAll('[data-enhanced-only]').forEach(node => node.hidden = false);
      this.querySelectorAll('[data-native-only]').forEach(node => node.hidden = true);
      this.querySelector('.pdp-variant-form').addEventListener('submit', event => event.preventDefault(), events);
      this.variantSelect.addEventListener('change', () => this.syncVariant(true), events);
      this.planSelect.addEventListener('change', () => {
        this.querySelector(`[name="purchase_type"][value="${this.planSelect.value ? 'subscription' : 'once'}"]`).checked = true;
        if (this.planSelect.value) this.lastPlan = this.planSelect.value;
        this.syncPrice(true);
      }, events);
      this.querySelectorAll('[name="purchase_type"]').forEach(radio => radio.addEventListener('change', () => {
        this.planSelect.value = radio.value === 'once' ? '' : String(this.variant.allocations.find(plan => String(plan.id) === this.lastPlan)?.id || this.variant.allocations[0]?.id || '');
        this.planSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }, events));
      this.quantity.addEventListener('input', () => this.syncPrice(false), events);
      this.quantity.addEventListener('change', () => { this.normalizeQuantity(); this.syncPrice(false); }, events);
      this.querySelectorAll('[data-quantity-step]').forEach(button => button.addEventListener('click', () => {
        this.quantity.value = Number(this.quantity.value) + Number(button.dataset.quantityStep) * this.variant.step;
        this.normalizeQuantity(); this.syncPrice(false);
      }, events));
      this.querySelectorAll('[data-gallery-step]').forEach(button => button.addEventListener('click', () => this.showSlide(this.slideIndex() + Number(button.dataset.galleryStep)), events));
      this.track.addEventListener('keydown', event => {
        if (event.target !== this.track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault(); this.showSlide(this.slideIndex() + (event.key === 'ArrowLeft' ? -1 : 1));
      }, events);
      this.track.addEventListener('scroll', () => {
        cancelAnimationFrame(this.scrollFrame);
        this.scrollFrame = requestAnimationFrame(() => {
          const index = this.slideIndex();
          const counter = this.querySelector('[data-gallery-counter]');
          if (counter) counter.textContent = `${index + 1} / ${this.slides.length}`;
          this.slides.forEach((slide, i) => { if (i !== index) slide.querySelectorAll('video').forEach(video => video.pause()); });
        });
      }, { ...events, passive: true });
      if (!this.querySelector('.pdp-badge')) this.querySelector('[data-badge-toggle]')?.setAttribute('hidden', '');
      this.querySelector('[data-badge-toggle]')?.addEventListener('click', event => {
        this.badgePaused = !this.badgePaused;
        event.currentTarget.setAttribute('aria-pressed', String(this.badgePaused)); this.syncBadge();
      }, events);
      this.observer = new IntersectionObserver(entries => { this.inView = entries[0].isIntersecting; this.syncBadge(); });
      this.observer.observe(this.querySelector('.pdp-gallery'));
      document.addEventListener('visibilitychange', () => this.syncBadge(), events);
      window.addEventListener('popstate', () => {
        const params = new URL(location.href).searchParams;
        this.variantSelect.value = params.get('variant') || this.data.variants[0].id;
        this.syncVariant(false);
        this.variantSelect.closest('sparklys-select')?.sync?.();
        this.planSelect.value = params.get('selling_plan') || '';
        this.planSelect.closest('sparklys-select')?.sync?.();
        this.syncPrice(false);
      }, events);
      this.syncVariant(false);
    }
    disconnectedCallback() { this.abort?.abort(); this.abort = null; this.observer?.disconnect(); this.planAnimation?.cancel(); cancelAnimationFrame(this.scrollFrame); }
    syncBadge() { this.toggleAttribute('data-badge-running', Boolean(this.inView && !this.badgePaused && !document.hidden)); }
    money(amount) { return new Intl.NumberFormat(this.dataset.locale, { style: 'currency', currency: this.dataset.currency, currencyDisplay: 'code' }).format(amount / 100); }
    syncVariant(updateUrl) {
      this.variant = this.data.variants.find(variant => String(variant.id) === this.variantSelect.value);
      if (!this.variant) return;
      const previous = this.planSelect.value;
      this.buyForm.elements.id.value = this.variant.id;
      this.planSelect.replaceChildren();
      if (!this.data.requiresPlan) this.planSelect.add(new Option(this.querySelector('[data-once-card] strong').textContent, ''));
      this.variant.allocations.forEach(plan => this.planSelect.add(new Option(`${plan.name} — ${this.money(plan.price)}`, String(plan.id))));
      this.planSelect.value = this.variant.allocations.some(plan => String(plan.id) === previous) ? previous : (previous || this.data.requiresPlan) ? String(this.variant.allocations[0]?.id || '') : '';
      this.querySelector('[data-purchase-options]').hidden = !this.variant.allocations.length;
      this.planSelect.disabled = !this.variant.allocations.length;
      this.quantity.min = this.variant.min; this.quantity.step = this.variant.step;
      if (this.variant.max !== null) this.quantity.max = this.variant.max; else this.quantity.removeAttribute('max');
      this.normalizeQuantity();
      crossfade(this.querySelector('[data-once-price]'), this.money(this.variant.price));
      this.planSelect.closest('sparklys-select')?.sync?.();
      this.syncPrice(updateUrl);
      if (this.variant.media && (updateUrl || new URL(location.href).searchParams.has('variant'))) this.showSlide(this.slides.findIndex(slide => Number(slide.dataset.mediaId) === this.variant.media), !updateUrl);
    }
    normalizeQuantity() {
      const { min, max, step } = this.variant;
      const value = Number(this.quantity.value);
      const ceiling = max == null ? Infinity : min + Math.floor((max - min) / step) * step;
      this.quantity.value = Math.min(ceiling, Math.max(min, min + Math.round(((Number.isFinite(value) ? value : min) - min) / step) * step));
    }
    syncPrice(updateUrl) {
      const plan = this.variant.allocations.find(item => String(item.id) === this.planSelect.value);
      const price = plan?.price ?? this.variant.price;
      const compare = plan ? this.variant.price : this.variant.compare;
      const firstPlan = plan || this.variant.allocations[0];
      crossfade(this.querySelector('[data-subscription-price]'), firstPlan ? this.money(firstPlan.price) : '');
      crossfade(this.querySelector('[data-price]'), this.money(price));
      const compareNode = this.querySelector('[data-compare]');
      compareNode.hidden = !(compare > price); crossfade(compareNode, this.money(compare));
      const percent = compare > price ? Math.round((compare - price) / compare * 100) : 0;
      crossfade(this.querySelector('[data-savings]'), percent ? this.dataset.savingsLabel.replace('[percent]', percent) : '');
      const available = this.variant.available && (!this.data.requiresPlan || Boolean(plan));
      this.querySelector('.pdp-add').disabled = !available;
      crossfade(this.querySelector('[data-add-text]'), available ? this.dataset.addLabel : this.dataset.soldLabel);
      crossfade(this.querySelector('[data-add-total]'), ` · ${this.money(price * Math.max(this.variant.min, Number(this.quantity.value) || this.variant.min))}`);
      this.querySelector('[data-quantity-step="-1"]').disabled = Number(this.quantity.value) <= this.variant.min;
      this.querySelector('[data-quantity-step="1"]').disabled = this.variant.max !== null && Number(this.quantity.value) + this.variant.step > this.variant.max;
            this.querySelectorAll('[name="purchase_type"]').forEach(radio => radio.checked = radio.value === (plan ? 'subscription' : 'once'));
      // Shopify plan names and allocation adjustment prices are authoritative.
      const terms = plan ? [...plan.adjustments.slice(1).map(item => this.money(item.price)), ...(plan.remaining > 0 ? [this.dataset.chargeLabel.replace('[amount]', this.money(plan.checkoutCharge)), this.dataset.balanceLabel.replace('[amount]', this.money(plan.remaining))] : [])].join(' · ') : '';
      crossfade(this.querySelector('[data-plan-terms]'), terms);
      this.togglePlanField(Boolean(plan || this.data.requiresPlan));
      if (updateUrl) {
        const url = new URL(location.href); url.searchParams.set('variant', this.variant.id);
        if (plan) url.searchParams.set('selling_plan', plan.id); else url.searchParams.delete('selling_plan');
        history.replaceState({}, '', url);
      }
    }
    togglePlanField(open) {
      const field = this.querySelector('[data-plan-field]');
      if (this.planFieldOpen === open) return;
      const first = this.planFieldOpen === undefined;
      const height = field.hidden ? 0 : field.getBoundingClientRect().height;
      const opacity = field.hidden ? 0 : Number(getComputedStyle(field).opacity);
      const margin = field.hidden ? 0 : parseFloat(getComputedStyle(field).marginTop);
      this.planAnimation?.cancel();
      this.planFieldOpen = open;
      field.hidden = false;
      field.inert = !open;
      if (first || reduced()) { field.hidden = !open; field.inert = false; return; }
      field.style.overflow = 'hidden';
      const targetMargin = open ? getComputedStyle(field).marginTop : '0px';
      this.planAnimation = field.animate([
        { height: `${height}px`, opacity, marginTop: `${margin}px` },
        { height: `${open ? field.scrollHeight : 0}px`, opacity: open ? 1 : 0, marginTop: targetMargin }
      ], timing(this));
      this.planAnimation.finished.then(() => { field.hidden = !open; field.inert = false; field.style.overflow = ''; }).catch(() => {});
    }
    slideIndex() { return Math.max(0, Math.min(this.slides.length - 1, Math.round(this.track.scrollLeft / this.track.clientWidth))); }
    showSlide(index, instant = false) {
      if (!this.slides.length) return;
      const next = (index + this.slides.length) % this.slides.length;
      if (index < 0 && instant) return;
      this.track.scrollTo({ left: next * this.track.clientWidth, behavior: instant || reduced() ? 'instant' : 'smooth' });
    }
  }
  class PdpDisclosure extends HTMLElement {
    connectedCallback() {
      this.details = this.querySelector('details'); this.content = this.querySelector('.pdp-disclosure__content');
      this.click = event => {
        if (!event.target.closest('summary')) return;
        event.preventDefault(); this.targetOpen = this.targetOpen === undefined ? !this.details.open : !this.targetOpen;
        const height = this.details.open ? this.content.getBoundingClientRect().height : 0;
        const opacity = this.details.open ? Number(getComputedStyle(this.content).opacity) : 0;
        this.animation?.cancel(); this.details.open = true;
        if (reduced()) { this.details.open = this.targetOpen; this.content.inert = false; return; }
        this.content.inert = !this.targetOpen;
        this.animation = this.content.animate([{ height: `${height}px`, opacity }, { height: `${this.targetOpen ? this.content.scrollHeight : 0}px`, opacity: this.targetOpen ? 1 : 0 }], timing(this));
        this.animation.finished.then(() => { this.details.open = this.targetOpen; this.content.inert = false; }).catch(() => {});
      };
      this.addEventListener('click', this.click);
    }
    disconnectedCallback() { this.removeEventListener('click', this.click); this.animation?.cancel(); }
  }
  class PdpDescription extends HTMLElement {
    connectedCallback() {
      this.button = this.querySelector('button'); this.content = this.querySelector('.rte');
      if (this.content.scrollHeight <= 110) return;
      this.button.hidden = false; this.setAttribute('data-collapsed', '');
      this.click = () => {
        const start = this.content.getBoundingClientRect().height;
        this.animation?.cancel();
        const expanded = this.hasAttribute('data-collapsed');
        this.toggleAttribute('data-collapsed', !expanded); this.button.setAttribute('aria-expanded', expanded);
        this.button.textContent = expanded ? this.button.dataset.less : this.button.dataset.more;
        if (!reduced()) this.animation = this.content.animate([{ maxHeight: `${start}px` }, { maxHeight: `${expanded ? this.content.scrollHeight : this.content.getBoundingClientRect().height}px` }], timing(this));
      };
      this.button.addEventListener('click', this.click);
    }
    disconnectedCallback() { this.button?.removeEventListener('click', this.click); this.animation?.cancel(); }
  }
  for (const [name, element] of [['product-detail', ProductDetail], ['pdp-disclosure', PdpDisclosure], ['pdp-description', PdpDescription]]) if (!customElements.get(name)) customElements.define(name, element);
})();
