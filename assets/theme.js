class ProductForm extends HTMLElement {
  connectedCallback() {
    this.form = this.querySelector('form');
    this.status = this.querySelector('[data-product-status]');

    if (!this.form || !this.status) return;

    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  async handleSubmit(event) {
    event.preventDefault();

    const submitButton = this.form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    this.status.textContent = '';

    try {
      const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(this.form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.description || 'Das Produkt konnte nicht hinzugefügt werden.');
      }

      const cartResponse = await fetch(`${window.Shopify.routes.root}cart.js`);
      const cart = await cartResponse.json();
      document.querySelectorAll('[data-cart-count]').forEach((element) => {
        element.textContent = cart.item_count;
      });

      this.status.textContent = this.dataset.successMessage;
    } catch (error) {
      this.status.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  }
}

if (!customElements.get('product-form')) {
  customElements.define('product-form', ProductForm);
}

class HeaderScrollIntent {
  constructor(section) {
    this.section = section;
    this.desktopQuery = window.matchMedia('(min-width: 64rem)');
    this.lastScrollY = window.scrollY;
    this.upwardDistance = 0;
    this.downwardDistance = 0;
    this.ticking = false;

    this.handleScroll = this.handleScroll.bind(this);
    this.handleViewportChange = this.handleViewportChange.bind(this);

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    this.desktopQuery.addEventListener('change', this.handleViewportChange);
  }

  handleScroll() {
    if (this.ticking) return;

    this.ticking = true;
    window.requestAnimationFrame(() => {
      this.update();
      this.ticking = false;
    });
  }

  handleViewportChange() {
    this.section.classList.remove('is-switcher-visible');
    this.lastScrollY = window.scrollY;
    this.upwardDistance = 0;
    this.downwardDistance = 0;
  }

  update() {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - this.lastScrollY;

    if (!this.desktopQuery.matches) {
      this.handleViewportChange();
      return;
    }

    if (currentScrollY === 0) {
      this.section.classList.remove('is-switcher-visible');
      this.upwardDistance = 0;
      this.downwardDistance = 0;
    } else if (delta < 0) {
      this.upwardDistance += Math.abs(delta);
      this.downwardDistance = 0;

      if (this.upwardDistance >= 120) {
        this.section.classList.add('is-switcher-visible');
      }
    } else if (delta > 0) {
      this.downwardDistance += delta;
      this.upwardDistance = 0;

      if (this.downwardDistance >= 12) {
        this.section.classList.remove('is-switcher-visible');
      }
    }

    this.lastScrollY = currentScrollY;
  }
}

class HeaderCorporateMenu extends HTMLElement {
  connectedCallback() {
    this.details = this.querySelector('[data-corporate-menu]');
    this.summary = this.details?.querySelector(':scope > summary');

    if (!this.details || !this.summary) return;

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleDocumentClick(event) {
    if (!this.contains(event.target)) this.details.removeAttribute('open');
  }

  handleKeydown(event) {
    if (event.key !== 'Escape' || !this.details.open) return;

    this.details.removeAttribute('open');
    this.summary.focus();
  }

  handleScroll() {
    this.details.removeAttribute('open');
  }
}

if (!customElements.get('header-corporate-menu')) {
  customElements.define('header-corporate-menu', HeaderCorporateMenu);
}

const headerSection = document.querySelector('.shopify-section-header');

if (headerSection) {
  new HeaderScrollIntent(headerSection);
}
