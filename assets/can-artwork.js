/* Fit uploaded transparent artwork to its visible bounds, not its padded canvas. */
class CanArtwork extends HTMLElement {
  connectedCallback() {
    if (!this.hasAttribute('data-auto-fit')) return;
    this.image = this.querySelector('img');
    if (!this.image) return;
    this.onLoad = () => this.fit();
    this.image.addEventListener('load', this.onLoad);
    if (this.image.complete && this.image.naturalWidth) this.fit();
  }

  disconnectedCallback() {
    this.image?.removeEventListener('load', this.onLoad);
  }

  fit() {
    const image = this.image;
    try {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 256 / Math.max(image.naturalWidth, image.naturalHeight));
      const width = canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0, width, height);
      const pixels = context.getImageData(0, 0, width, height).data;
      let left = width, top = height, right = -1, bottom = -1;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Ignore nearly transparent antialiasing and baked diffuse shadows.
          if (pixels[(y * width + x) * 4 + 3] < 128) continue;
          left = Math.min(left, x); right = Math.max(right, x);
          top = Math.min(top, y); bottom = Math.max(bottom, y);
        }
      }
      if (right < left || bottom < top) return;
      // Full-frame photography retains its own lighting and original containment.
      if (left === 0 && top === 0 && right === width - 1 && bottom === height - 1) return;
      const boundsWidth = right - left + 1;
      const boundsHeight = bottom - top + 1;
      this.style.setProperty('--can-aspect', boundsWidth / boundsHeight);
      this.style.setProperty('--can-image-width', `${width / boundsWidth * 100}%`);
      this.style.setProperty('--can-image-height', `${height / boundsHeight * 100}%`);
      this.style.setProperty('--can-image-left', `${-left / boundsWidth * 100}%`);
      this.style.setProperty('--can-image-top', `${-top / boundsHeight * 100}%`);
      this.dataset.fitted = '';
    } catch {
      // CORS/decoding failures keep the complete image and omit invented lighting.
    }
  }
}
if (!customElements.get('can-artwork')) customElements.define('can-artwork', CanArtwork);
