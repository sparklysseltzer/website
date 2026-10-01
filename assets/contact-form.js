/* Shopify owns enquiry submission. Only an explicit newsletter choice reaches Klaviyo. */
class SparklysContact extends HTMLElement {
  connectedCallback() {
    if (this.connected) return;
    this.connected = true;
    this.form = this.querySelector('form');
    this.checkbox = this.querySelector('[data-newsletter-opt-in]');
    this.storageKey = `sparklys:contact-newsletter:${location.pathname}:${this.form.id}`;
    this.onSubmit = this.rememberChoice.bind(this);
    this.onRetry = () => this.subscribe();
    this.retry = this.querySelector('[data-newsletter-retry]');
    this.retry?.addEventListener('click', this.onRetry);
    if (!/^[a-zA-Z0-9]{6}$/.test(this.dataset.siteId) || !/^[a-zA-Z0-9]{6}$/.test(this.dataset.listId)) return;
    try {
      const probe = `${this.storageKey}:probe`;
      sessionStorage.setItem(probe, '1');
      sessionStorage.removeItem(probe);
      this.pending = JSON.parse(sessionStorage.getItem(this.storageKey) || 'null');
      if (this.pending && (Date.now() - this.pending.createdAt > 15 * 60 * 1000 || this.pending.siteId !== this.dataset.siteId || this.pending.listId !== this.dataset.listId)) {
        sessionStorage.removeItem(this.storageKey);
        this.pending = null;
      }
    } catch {
      return; // Contact delivery remains native when storage is unavailable.
    }
    if (this.checkbox) {
      this.checkbox.disabled = false;
      this.querySelector('[data-newsletter-unavailable]').hidden = true;
      this.form.addEventListener('submit', this.onSubmit, true);
    }
    if (this.querySelector('[data-contact-success]') && this.pending) this.subscribe();
  }

  disconnectedCallback() {
    this.form?.removeEventListener('submit', this.onSubmit, true);
    this.retry?.removeEventListener('click', this.onRetry);
    this.connected = false;
  }

  rememberChoice() {
    try {
      sessionStorage.removeItem(this.storageKey);
      if (!this.checkbox.checked || !this.form.checkValidity()) return;
      const data = new FormData(this.form);
      const attributes = {
        email: data.get('contact[email]').trim(),
        first_name: data.get('contact[first_name]').trim(),
        last_name: data.get('contact[last_name]').trim(),
        subscriptions: { email: { marketing: { consent: 'SUBSCRIBED' } } },
      };
      // Preserve freely formatted contact numbers without inferring country or SMS consent.
      const phone = data.get('contact[contact_phone_number]')?.trim();
      if (phone) attributes.properties = { contact_phone: phone };
      sessionStorage.setItem(this.storageKey, JSON.stringify({
        createdAt: Date.now(), siteId: this.dataset.siteId, listId: this.dataset.listId, attributes,
      }));
    } catch {
      // Do not intercept or retry an enquiry because its separate newsletter choice failed.
      window.SparklysNotifications?.show(this.dataset.newsletterError, { type: 'error', key: 'contact-newsletter' });
    }
  }

  async subscribe() {
    if (this.busy || !this.pending) return;
    this.busy = true;
    const result = this.querySelector('[data-newsletter-result]');
    const status = this.querySelector('[data-newsletter-status]');
    result.hidden = false;
    this.retry.disabled = true;
    await this.setStatus(status, this.dataset.newsletterPending);
    try {
      const response = await fetch(`https://a.klaviyo.com/client/subscriptions?company_id=${encodeURIComponent(this.dataset.siteId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/vnd.api+json', revision: '2026-07-15' },
        credentials: 'omit',
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({ data: {
          type: 'subscription',
          attributes: { custom_source: 'Sparklys contact page newsletter checkbox', profile: { data: { type: 'profile', attributes: this.pending.attributes } } },
          relationships: { list: { data: { type: 'list', id: this.dataset.listId } } },
        } }),
      });
      if (response.status !== 202) throw new Error('Subscription was not accepted.');
      this.pending = null;
      try { sessionStorage.removeItem(this.storageKey); } catch { /* No persistent storage is used. */ }
      await this.setStatus(status, this.dataset.newsletterSuccess);
      // Preserve keyboard focus on the retry control until the new state is announced.
      if (document.activeElement === this.retry) status.focus({ preventScroll: true });
      this.retry.hidden = true;
    } catch {
      await this.setStatus(status, this.dataset.newsletterError);
      this.retry.hidden = false;
    } finally {
      this.busy = false;
      this.retry.disabled = false;
    }
  }

  async setStatus(element, message) {
    element.tabIndex = -1;
    if (element.textContent === message) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !element.animate) {
      element.textContent = message;
      return;
    }
    const style = getComputedStyle(this);
    const duration = parseFloat(style.getPropertyValue('--motion-duration-fast')) || 180;
    const options = { duration, easing: style.getPropertyValue('--motion-ease').trim() || 'ease' };
    if (element.textContent && !reduced) await element.animate([{ opacity: 1 }, { opacity: 0 }], options).finished;
    const previousHeight = element.getBoundingClientRect().height;
    element.textContent = message;
    if (!reduced) {
      const nextHeight = element.getBoundingClientRect().height;
      await element.animate([{ opacity: 0, height: `${previousHeight}px` }, { opacity: 1, height: `${nextHeight}px` }], options).finished;
    }
  }
}
if (!customElements.get('sparklys-contact')) customElements.define('sparklys-contact', SparklysContact);
