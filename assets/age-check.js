(() => {
  const validation = window.SparklysAgeValidation;
  if (!validation || !window.HTMLDialogElement) return;
  const storageKey = 'sparklys:local-age-check:v1';
  class AgeCheck extends HTMLElement {
    connectedCallback() {
      this.dialog = this.querySelector('dialog');
      if (!this.dialog?.showModal) return;
      this.form = this.querySelector('[data-age-form]');
      this.status = this.querySelector('[data-age-status]');
      this.success = this.querySelector('[data-age-success]');
      this.fields = new Map([...this.querySelectorAll('[data-age-field]')].map((node) => [node.dataset.ageField, node]));
      this.copy = JSON.parse(this.querySelector('[data-age-translations]').textContent);
      const decode = (object) => Object.keys(object).forEach((key) => {
        if (typeof object[key] === 'object') decode(object[key]);
        else { const text = document.createElement('textarea'); text.innerHTML = object[key]; object[key] = text.value; }
      });
      decode(this.copy);
      this.abort = new AbortController();
      const options = { signal: this.abort.signal };
      this.querySelector('[data-age-help-toggle]').addEventListener('click', () => this.setHelp(!this.helpOpen), options);
      document.addEventListener('submit', (event) => {
        if (!event.target.matches('[data-cart-form]') || event.submitter?.name !== 'checkout') return;
        const policy = this.parse(event.target.closest('[data-cart-content]'));
        if (!policy?.enabled) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        if (this.checking || this.dialog.open || document.querySelector('cart-drawer')?.busy) return;
        this.origin = event.target.closest('[data-cart-surface]')?.dataset.cartSurface;
        this.opener = event.submitter;
        this.open();
      }, { ...options, capture: true });
      this.form.addEventListener('submit', (event) => { event.preventDefault(); this.check(); }, options);
      this.form.addEventListener('change', (event) => {
        if (event.target.name === 'profile') this.profile();
        if (event.target.name === 'version') this.profile(true);

      }, options);
      this.form.addEventListener('input', (event) => {
        const input = event.target;
        if (input.matches('[data-age-field] input')) {
          const position = input.selectionStart;
          const clean = (value) => input.inputMode === 'numeric' ? value.replace(/[^0-9]/g, '') : value.toUpperCase().replace(/[^A-Z0-9<]/g, '');
          const value = clean(input.value).slice(0, input.maxLength);
          if (value !== input.value) {
            const caret = clean(input.value.slice(0, position)).length;
            input.value = value;
            input.setSelectionRange(caret, caret);
          }
        }
        if (input.name === 'birth') this.hideBirthYear();
      }, options);
      this.querySelectorAll('[data-age-close]').forEach((button) => button.addEventListener('click', () => this.close(), options));
      this.querySelector('[data-age-continue]').addEventListener('click', () => this.continue(), options);
      this.dialog.addEventListener('cancel', (event) => { event.preventDefault(); this.close(); }, options);
      this.dialog.addEventListener('close', () => this.cleanup(), options);
      this.dialog.addEventListener('click', (event) => {
        if (event.target !== this.dialog) return;
        const bounds = this.dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) this.close();
      }, options);
      this.observer = new MutationObserver(() => this.ready());
      this.observer.observe(document.body, { childList: true, subtree: true });
      this.ready();
      this.profile();
      this.fillerObserver = new ResizeObserver(() => this.fitDocumentFillers());
      this.fillerObserver.observe(this.querySelector('[data-age-document]'));
      window.addEventListener('pagehide', () => { this.request?.abort(); if (this.checking) this.checkoutBusy(false); this.form.reset(); this.record = null; }, options);
      window.addEventListener('pageshow', () => { if (this.dialog.open) this.close(); this.ready(); }, options);
    }
    disconnectedCallback() { this.abort?.abort(); this.observer?.disconnect(); this.fillerObserver?.disconnect(); this.cleanup(); }
    parse(root) {
      const node = root?.querySelector('[data-age-policy]');
      if (!node) return null;
      return { enabled: node.dataset.enabled === 'true', age: Number(node.dataset.age), unknown: node.dataset.unknown === 'true', context: node.dataset.context, version: node.dataset.version };
    }
    ready() {
      document.querySelectorAll('[data-age-checkout]').forEach((button) => {
        if (!document.querySelector('cart-drawer')?.busy) button.disabled = false;
      });
      document.documentElement.classList.add('age-check-ready');
    }
    remember(policy) {
      const created = Date.now();
      this.record = { threshold: policy.age, context: policy.context, version: policy.version, created, expires: created + 12 * 60 * 60 * 1000 };
      try { sessionStorage.setItem(storageKey, JSON.stringify(this.record)); } catch { /* Page memory is sufficient when storage is unavailable. */ }
    }
    readRecord(policy) {
      let record = this.record;
      try { record = JSON.parse(sessionStorage.getItem(storageKey)) || record; } catch { /* Use page memory. */ }
      if (validation.reusable(record, policy)) return record;
      this.record = null;
      try { sessionStorage.removeItem(storageKey); } catch { /* No persistent storage. */ }
      return null;
    }
    async fresh() {
      const cart = document.querySelector('cart-drawer');
      if (!cart?.dataset.sectionId) throw new Error('Missing cart section');
      if (cart.busy) throw new Error('Cart update pending');
      const url = new URL(this.dataset.cartUrl, location.origin);
      url.searchParams.set('sections', cart.dataset.sectionId);
      const response = await fetch(url, { credentials: 'same-origin', cache: 'no-store', signal: this.request.signal });
      if (!response.ok) throw new Error('Cart unavailable');
      const sections = await response.json();
      const html = sections[cart.dataset.sectionId];
      if (typeof html !== 'string') throw new Error('Missing cart policy');
      const policy = this.parse(new DOMParser().parseFromString(html, 'text/html'));
      if (!policy || !Number.isInteger(policy.age) || policy.age < 0 || policy.age > 120) throw new Error('Invalid cart policy');
      return policy;
    }
    checkoutBusy(busy) {
      this.checking = busy;
      if (!this.opener) return;
      if (busy) {
        this.opener.setAttribute('aria-busy', 'true');
        this.opener.setAttribute('aria-disabled', 'true');
        this.checkoutLabel = this.opener.getAttribute('aria-label');
        this.opener.setAttribute('aria-label', this.copy.loading);
      } else {
        this.opener.removeAttribute('aria-busy');
        this.opener.removeAttribute('aria-disabled');
        if (this.checkoutLabel === null) this.opener.removeAttribute('aria-label');
        else if (this.checkoutLabel !== undefined) this.opener.setAttribute('aria-label', this.checkoutLabel);
      }
    }
    async open() {
      if (this.checking) return;
      this.request = new AbortController();
      const request = this.request;
      const content = this.opener?.closest('[data-cart-content]');
      const cart = document.querySelector('cart-drawer');
      this.checkoutBusy(true);
      window.SparklysNotifications?.dismiss('age-checkout');
      try {
        const policy = await this.fresh();
        if (request.signal.aborted || !this.isConnected) return;
        // Do not act on a response for a cart that changed while the check was pending.
        if (!content?.isConnected || cart?.busy) throw new Error('Cart changed');
        if (this.origin === 'drawer' && !cart?.dialog.open) return;
        if (policy.enabled && policy.unknown) {
          window.SparklysNotifications?.show(this.copy.unknown, { type: 'error', key: 'age-checkout' });
          return;
        }
        this.policy = policy;
        if (!policy.enabled || !policy.age || this.readRecord(policy)) {
          this.handoff();
          return;
        }
        this.profile();
        this.form.hidden = false;
        this.success.hidden = true;
        this.status.textContent = '';
        this.background = document.querySelector('cart-drawer dialog[open]');
        if (this.background) this.background.inert = true;
        this.dialog.showModal();
        this.fitDocumentFillers();
        this.form.elements.profile.focus();
        this.animate(this.dialog, [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }]);
      } catch (error) {
        if (error.name !== 'AbortError') window.SparklysNotifications?.show(this.copy.error, { type: 'error', key: 'age-checkout' });
      } finally {
        this.checkoutBusy(false);
      }
    }
    animate(node, frames) {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches || !node.animate) return Promise.resolve();
      const style = getComputedStyle(this);
      return node.animate(frames, { duration: 260, easing: style.getPropertyValue('--motion-ease').trim() || 'ease' }).finished.catch(() => {});
    }
    profile(preserveValues = false) {
      if (this.policy) this.querySelector('[data-age-intro]').textContent = this.copy.intro.replaceAll('__AGE__', this.policy.age);
      this.setHelp(false, false);
      const values = preserveValues ? Object.fromEntries(new FormData(this.form)) : null;
      const version = this.form.elements.version.value;
      const selected = this.form.elements.profile.value;
      this.form.reset();
      this.form.elements.profile.value = selected;
      this.form.elements.version.value = version;
      this.form.elements.optional.readOnly = false;
      this.clearErrors();
      const id = validation.profiles[selected].format === 'TD1';
      const swiss = selected === 'ch-id';
      this.querySelector('[data-age-swiss-help]').hidden = !swiss;
      this.querySelector('[data-age-other-help]').hidden = swiss;
      this.querySelector('[data-age-location]').textContent = this.copy[id ? 'idLocation' : 'passportLocation'];
      this.querySelector('[data-age-country]').textContent = this.copy[selected === 'international-passport' ? 'passportTitle' : selected.startsWith('ch-') ? 'country_ch' : 'country_li'];
      this.querySelector('[data-age-version]').hidden = selected !== 'li-id';
      this.querySelector('[data-age-field="optional"]').hidden = swiss;
      this.form.elements.optional.disabled = swiss;
      this.fields.get('optionalDigit').hidden = id;
      this.form.elements.optionalDigit.disabled = id;
      this.fields.get('optional').querySelector('label').textContent = this.copy[id ? 'optionalLabel' : 'passportOptionalLabel'];
      const helps = { number: id ? 'numberHelpId' : 'numberHelpPassport', numberDigit: 'digitHelp', birth: id ? 'birthHelpId' : 'birthHelpPassport', expiry: id ? 'expiryHelpId' : 'expiryHelpPassport', optional: id ? 'optionalHelp' : 'passportOptionalHelp', optionalDigit: 'optionalDigitHelp', tail: id ? 'tailHelpId' : 'tailHelpPassport', birthYear: 'yearHelp' };
      Object.entries(helps).forEach(([field, key]) => { this.querySelector(`[data-age-help="${field}"]`).textContent = this.copy[key]; });
      const lengths = { number: swiss ? 8 : 9, numberDigit: 1, birth: 7, expiry: 7, optional: id ? 15 : 14, optionalDigit: 1, tail: swiss || !id ? 1 : 12, birthYear: 4 };
      Object.entries(lengths).forEach(([field, length]) => { this.form.elements[field].maxLength = length; });
      this.form.elements.tail.inputMode = swiss || !id ? 'numeric' : 'text';
      this.fields.get('tail').querySelector('label').textContent = swiss || !id ? this.copy.finalDigit : this.copy.tailLabel;
      this.querySelector('[data-age-help="tail"]').textContent = swiss ? this.copy.finalDigitHelp : this.copy[id ? 'tailHelpId' : 'tailHelpPassport'];
      // Move the actual controls into the document, retaining a single input per value.
      const pool = this.querySelector('[data-age-field-pool]');
      this.fields.forEach((node) => pool.append(node));
      const documentGuide = this.querySelector('[data-age-document]');
      documentGuide.dataset.profile = selected;
      documentGuide.dataset.version = version;
      documentGuide.dataset.format = id ? 'TD1' : 'TD3';
      this.querySelector('[data-age-side]').textContent = selected === 'li-id' ? this.copy[version === 'previous' ? 'id_previous' : 'id_current'] : this.copy[id ? 'id_side' : 'passport_side'];
      this.querySelector('[data-age-year-location]').textContent = this.copy[id ? 'year_front' : 'year_photo'];
      this.querySelector('[data-age-year]').append(this.fields.get('birthYear'));
      this.hideBirthYear();
      const guide = this.querySelector('[data-age-guide]');
      guide.replaceChildren();
      const row = (name, label) => {
        const element = document.createElement('div');
        element.className = `age-document__row age-document__row--${name}`;
        element.setAttribute('role', 'group');
        element.setAttribute('aria-label', label);
        guide.append(element);
        return element;
      };
      const text = (parent, value, className = '') => {
        const element = document.createElement('span');
        element.className = `age-document__fixed ${className}`;
        element.setAttribute('aria-hidden', 'true');
        element.textContent = value;
        parent.append(element);
        return element;
      };
      const field = (parent, name) => parent.append(this.fields.get(name));
      const country = validation.profiles[selected].country || 'XXX';
      for (const key of ['numberDigit', 'birth', 'expiry']) this.form.elements[key].inputMode = id ? 'numeric' : 'text';
      if (swiss) {
        const first = row('swiss-first', this.copy.line_one);
        const identity = document.createElement('div'); identity.className = 'age-document__identity'; first.append(identity);
        text(identity, 'IDCHE'); field(identity, 'number'); text(identity, '<'); field(identity, 'numberDigit');
        text(first, '', 'age-document__fillers').dataset.ageFill = '';
        const second = row('swiss-second', this.copy.line_two);
        const dates = document.createElement('div'); dates.className = 'age-document__dates'; second.append(dates);
        field(dates, 'birth'); text(dates, 'M/F'); field(dates, 'expiry');
        const ending = document.createElement('div'); ending.className = 'age-document__ending'; second.append(ending);
        text(ending, 'CHE'); text(ending, '', 'age-document__fillers').dataset.ageFill = ''; field(ending, 'tail');
        const names = row('names', this.copy.names_omitted); text(names, this.copy.nameExample).dataset.ageFill = this.copy.nameExample;
      } else if (id) {
        const first = row('first', this.copy.line_one);
        text(first, `ID${country}`, 'age-document__prefix');
        field(first, 'number'); field(first, 'numberDigit');
        if (swiss) text(first, '<'.repeat(15), 'age-document__fillers');
        else field(first, 'optional');
        const second = row('second', this.copy.line_two);
        field(second, 'birth'); text(second, '·'); field(second, 'expiry'); text(second, country);
        if (swiss) text(second, '<'.repeat(11), 'age-document__fillers');
        field(second, 'tail');
        const names = row('names', this.copy.names_omitted);
        text(names, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
      } else {
        const names = row('names', this.copy.names_omitted);
        const prefix = `${country === 'LIE' ? 'PP' : 'P<'}${country}`;
        text(names, prefix + this.copy.nameExample).dataset.ageFill = prefix + this.copy.nameExample;
        const number = row('passport-number', this.copy.line_two);
        field(number, 'number'); field(number, 'numberDigit'); text(number, 'XXX');
        const dates = row('passport-dates', this.copy.line_two);
        field(dates, 'birth'); text(dates, 'M/F/<'); field(dates, 'expiry');
        const ending = row('passport-ending', this.copy.line_two);
        field(ending, 'optional');
        const checks = document.createElement('div'); checks.className = 'age-document__passport-checks'; ending.append(checks);
        field(checks, 'optionalDigit'); field(checks, 'tail');
      }
      this.form.elements.numberDigit.placeholder = '0';
      this.form.elements.optional.placeholder = '<'.repeat(id ? 15 : 14);
      this.form.elements.optionalDigit.placeholder = '0';
      this.form.elements.tail.placeholder = swiss || !id ? '0' : '<'.repeat(11) + '0';
      this.form.elements.birthYear.placeholder = '— — — —';
      if (values) Object.entries(values).forEach(([key, value]) => {
        if (this.form.elements[key]) this.form.elements[key].value = value;
      });
      this.fitDocumentFillers();
      this.animate(documentGuide, [{ opacity: .4 }, { opacity: 1 }]);
    }

    fitDocumentFillers() {
      const context = document.createElement('canvas').getContext('2d');
      if (!context) return;
      this.querySelectorAll('[data-age-fill]').forEach((node) => {
        const width = node.getBoundingClientRect().width;
        if (!width) return;
        const style = getComputedStyle(node);
        context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        const tracking = parseFloat(style.letterSpacing) || 0;
        const measure = (text) => context.measureText(text).width + text.length * tracking;
        let prefix = node.dataset.ageFill;
        if (measure(prefix) > width) prefix = prefix.replace('<<', '<<\n');
        const lastLine = prefix.split('\n').at(-1);
        const count = Math.max(0, Math.floor((width - measure(lastLine) - 1) / measure('<')));
        const value = prefix + '<'.repeat(count);
        if (node.textContent !== value) node.textContent = value;
      });
    }

    setHelp(open, animate = true) {
      const stage = this.querySelector('[data-age-stage]');
      const entry = this.querySelector('[data-age-entry]');
      const help = this.querySelector('[data-age-help-panel]');
      const button = this.querySelector('[data-age-help-toggle]');
      const panels = [entry, help];
      if (this.dialog.open && !this.dialog.style.marginTop) {
        this.dialog.style.marginTop = `${this.dialog.getBoundingClientRect().top}px`;
        this.dialog.style.marginBottom = '0px';
        this.dialog.style.maxHeight = `calc(100dvh - ${parseFloat(this.dialog.style.marginTop) + 16}px)`;
      }
      const height = stage.getBoundingClientRect().height;
      const opacity = panels.map((panel) => panel.hidden ? 0 : Number(getComputedStyle(panel).opacity));
      this.helpAnimations?.forEach((animation) => animation.cancel());
      const revision = this.helpRevision = (this.helpRevision || 0) + 1;
      this.helpOpen = open;
      button.setAttribute('aria-expanded', String(open));
      this.querySelector('[data-age-help-label]').textContent = this.copy[open ? 'helpBack' : 'help'];
      const active = open ? help : entry;
      const inactive = open ? entry : help;
      if (inactive.contains(document.activeElement)) button.focus({ preventScroll: true });
      panels.forEach((panel) => { panel.style.position = ''; panel.style.width = ''; });
      active.hidden = false;
      active.inert = false;
      inactive.inert = true;
      inactive.hidden = true;
      if (!open) this.fitDocumentFillers();
      const finish = () => {
        if (this.helpRevision !== revision) return;
        inactive.hidden = true;
        stage.style.overflow = '';
        panels.forEach((panel) => { panel.style.position = ''; panel.style.width = ''; });
        this.helpAnimations = [];
      };
      if (!animate || !this.dialog.open || matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
      const targetHeight = stage.getBoundingClientRect().height;
      // Opacity-only panels need no clipping; clipping cuts off the card shadow.
      inactive.style.position = 'absolute';
      inactive.style.width = '100%';
      inactive.hidden = false;
      const style = getComputedStyle(this);
      const timing = { duration: parseFloat(style.getPropertyValue('--motion-duration-base')) || 260, easing: style.getPropertyValue('--motion-ease').trim() || 'ease' };
      this.helpAnimations = [
        stage.animate([{ height: `${height}px` }, { height: `${targetHeight}px` }], timing),
        ...panels.map((panel, index) => panel.animate([{ opacity: opacity[index] }, { opacity: panel === active ? 1 : 0 }], timing)),
      ];
      Promise.all(this.helpAnimations.map((animation) => animation.finished.catch(() => {}))).then(finish);
    }

    hideBirthYear() {
      this.querySelector('[data-age-year]').hidden = true;
      this.form.elements.birthYear.disabled = true;
      this.form.elements.birthYear.value = '';
      this.form.elements.birthYear.removeAttribute('aria-invalid');
      this.querySelector('[data-age-error="birthYear"]').textContent = '';
    }
    clearErrors() {
      this.querySelectorAll('[data-age-error]').forEach((node) => { node.textContent = ''; });
      this.form.querySelectorAll('[aria-invalid]').forEach((node) => node.removeAttribute('aria-invalid'));
    }
    check() {
      if (this.continuing || this.closing) return;
      this.setHelp(false, false);
      this.clearErrors();
      const input = Object.fromEntries(new FormData(this.form));
      if (input.profile === 'ch-id') {
        input.optional = '<'.repeat(15);
        input.tail = '<'.repeat(11) + input.tail;
      }
      const result = validation.validate(input, this.policy.age);
      if (!result.ok) {
        if (result.field === 'birthYear') {
          const year = this.querySelector('[data-age-year]');
          year.hidden = false;
          this.form.elements.birthYear.disabled = false;
          this.animate(year, [{ opacity: 0 }, { opacity: 1 }]);
        }
        const field = this.form.elements[result.field];
        const error = this.querySelector(`[data-age-error="${result.field}"]`);
        if (error) {
          error.textContent = this.copy.errors[result.error].replaceAll('__AGE__', this.policy.age);
          this.animate(error, [{ opacity: 0 }, { opacity: 1 }]);
        }
        else this.status.textContent = this.copy.errors[result.error];
        field?.setAttribute('aria-invalid', 'true');
        field?.focus();
        return;
      }
      this.remember(this.policy);
      this.form.reset();
      this.showSuccess();
    }
    showSuccess() {
      this.form.hidden = true;
      this.success.hidden = false;
      this.status.textContent = this.copy.success;
      this.status.classList.add('is-success');
      this.status.focus();
      this.animate(this.success, [{ opacity: 0 }, { opacity: 1 }]);
      this.continue();
    }
    async continue() {
      if (this.continuing || this.closing || !this.dialog.open) return;
      this.continuing = true;
      const button = this.querySelector('[data-age-continue]');
      button.disabled = true;
      button.hidden = true;
      try {
        const policy = await this.fresh();
        if (!this.dialog.open || this.closing) return;
        if (policy.enabled && (policy.unknown || (policy.age && !this.readRecord(policy)))) {
          this.policy = policy;
          this.form.reset();
          this.profile();
          this.success.hidden = true;
          this.status.classList.remove('is-success');
          this.form.hidden = policy.unknown;
          this.status.textContent = this.copy[policy.unknown ? 'unknown' : 'changed'];
          this.status.focus();
          return;
        }
        this.handoff();
      } catch (error) {
        if (error.name !== 'AbortError' && this.dialog.open && !this.closing) {
          this.status.classList.remove('is-success');
          this.status.textContent = this.copy.error;
          button.hidden = false;
        }
      }
      finally { this.continuing = false; button.disabled = false; }
    }
    handoff() {
        const surface = [...document.querySelectorAll('[data-cart-surface]')].find((node) => node.dataset.cartSurface === this.origin);
        const form = surface?.querySelector('[data-cart-form]');
        const checkout = form?.querySelector('[name="checkout"]');
        if (!form || !checkout || document.querySelector('cart-drawer')?.busy) throw new Error('Cart changed');
        // Submit only the checkout action and current draft note, never stale quantity fields.
        const note = document.querySelector('[data-cart-note]');
        const submission = document.createElement('form');
        submission.method = 'post'; submission.action = form.action;
        const add = (name, value) => { const field = document.createElement('input'); field.type = 'hidden'; field.name = name; field.value = value; submission.append(field); };
        add('checkout', '');
        if (note) add('note', note.value);
        document.body.append(submission);
        this.dialog.close();
        HTMLFormElement.prototype.submit.call(submission);
        submission.remove();
    }
    async close() {
      if (!this.dialog.open || this.closing) return;
      this.closing = true;
      this.request?.abort();
      this.form.reset();
      await this.animate(this.dialog, [{ opacity: 1 }, { opacity: 0 }]);
      this.dialog.close();
      this.closing = false;
    }
    cleanup() {
      if (this.copy) this.setHelp(false, false);
      this.request?.abort();
      if (this.checking) this.checkoutBusy(false);
      this.form?.reset();
      this.status?.classList.remove('is-success');
      if (this.background) this.background.inert = false;
      this.background = null;
      this.dialog?.style.removeProperty('margin-top');
      this.dialog?.style.removeProperty('margin-bottom');
      this.dialog?.style.removeProperty('max-height');
      if (this.opener?.isConnected) this.opener.focus({ preventScroll: true });
    }
  }
  customElements.define('age-check', AgeCheck);
})();
