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
