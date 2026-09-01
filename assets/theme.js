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

class NewsletterForm extends HTMLElement {
  connectedCallback() {
    this.connectForm();
  }

  connectForm() {
    this.form = this.querySelector('form');

    if (!this.form) return;

    this.form.addEventListener('submit', this.handleSubmit.bind(this), { once: true });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = form.querySelector('[type="submit"]');
    const submitButtonLabel = submitButton?.querySelector('.button__label');
    const originalButtonLabel = submitButtonLabel?.textContent;

    form.setAttribute('aria-busy', 'true');

    if (submitButton) {
      submitButton.disabled = true;
    }

    if (submitButtonLabel) {
      submitButtonLabel.textContent = this.dataset.submittingLabel;
    }

    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: { Accept: 'text/html' },
        body: new FormData(form),
      });

      if (!response.ok) throw new Error(`Newsletter request failed with status ${response.status}`);

      const responseDocument = new DOMParser().parseFromString(await response.text(), 'text/html');
      const responseForm = responseDocument.getElementById(form.id);

      if (!responseForm) {
        window.location.assign(response.url);
        return;
      }

      form.replaceWith(responseForm);
      this.connectForm();
      this.querySelector('[role="status"], [role="alert"]')?.focus({ preventScroll: true });
    } catch (error) {
      form.removeAttribute('aria-busy');

      if (submitButton) {
        submitButton.disabled = false;
      }

      if (submitButtonLabel) {
        submitButtonLabel.textContent = originalButtonLabel;
      }

      this.connectForm();
      form.submit();
    }
  }
}

if (!customElements.get('newsletter-form')) {
  customElements.define('newsletter-form', NewsletterForm);
}

class OfferCardsMotion extends HTMLElement {
  connectedCallback() {
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.handleMotionPreference = this.handleMotionPreference.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.renderFrame = this.renderFrame.bind(this);

    this.motionPreference.addEventListener('change', this.handleMotionPreference);
    this.handleMotionPreference();
  }

  disconnectedCallback() {
    this.motionPreference?.removeEventListener('change', this.handleMotionPreference);
    this.teardownMotion();
  }

  handleMotionPreference() {
    this.teardownMotion();

    if (!this.motionPreference.matches) this.setupMotion();
  }

  setupMotion() {
    this.section = this.querySelector('[data-card-motion-section], .offer-cards');
    this.header = this.querySelector('[data-card-motion-header], .offer-cards__header');
    this.cards = [
      ...this.querySelectorAll('[data-card-motion-card], .offer-card'),
    ];

    if (!this.section || this.cards.length === 0) return;

    const revealTargets = [this.header, ...this.cards].filter(Boolean);

    this.revealAnimations = revealTargets.map((target) => {
      const animation = target.animate(
        [
          { opacity: 0, transform: 'translate3d(0, 3rem, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        {
          duration: 1000,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        },
      );
      animation.pause();
      return animation;
    });

    this.parallaxAnimations = this.cards.map((card) => {
      const media = card.querySelector('[data-card-motion-media], .offer-card__media');
      const animation = media.animate(
        [
          { transform: 'translate3d(0, -4%, 0)' },
          { transform: 'translate3d(0, 4%, 0)' },
        ],
        { duration: 1000, easing: 'linear', fill: 'both' },
      );
      animation.pause();
      return animation;
    });

    this.currentHeaderProgress = null;
    this.currentCardProgresses = null;
    this.currentParallaxProgresses = null;
    this.targetHeaderProgress = 0;
    this.targetCardProgresses = [];
    this.targetParallaxProgresses = [];
    this.lastFrameTime = null;
    this.frameRequest = null;
    this.isNearViewport = false;

    this.viewportObserver = new IntersectionObserver(
      ([entry]) => {
        this.isNearViewport = entry.isIntersecting;
        this.updateTargetProgress();
      },
      { rootMargin: '100% 0px' },
    );
    this.viewportObserver.observe(this.section);

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize);
    this.updateTargetProgress(true);
  }

  teardownMotion() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    this.viewportObserver?.disconnect();

    if (this.frameRequest) window.cancelAnimationFrame(this.frameRequest);

    this.revealAnimations?.forEach((animation) => animation.cancel());
    this.parallaxAnimations?.forEach((animation) => animation.cancel());
    this.revealAnimations = [];
    this.parallaxAnimations = [];
    this.frameRequest = null;
  }

  handleScroll() {
    if (this.isNearViewport) this.updateTargetProgress();
  }

  handleResize() {
    this.updateTargetProgress(true);
  }

  updateTargetProgress(renderImmediately = false) {
    if (!this.section) return;

    const bounds = this.section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const revealStart = viewportHeight * 0.84;
    const revealDistance = viewportHeight * 0.78;
    const sectionProgress = this.clamp((revealStart - bounds.top) / revealDistance);
    const grid = this.querySelector('[data-card-motion-grid], .offer-cards__grid');
    const columnCount = grid
      ? getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length
      : 1;

    this.targetHeaderProgress = this.rangeProgress(sectionProgress, 0, 0.4);
    this.targetCardProgresses = this.cards.map((card, cardIndex) => {
      const cardBounds = card.getBoundingClientRect();
      const cardProgress = this.clamp((revealStart - cardBounds.top) / revealDistance);
      const columnIndex = cardIndex % columnCount;
      const stagger = columnIndex * 0.06;

      return this.rangeProgress(cardProgress, stagger, 0.78 + stagger);
    });
    this.targetParallaxProgresses = this.cards.map((card) => {
      const cardBounds = card.getBoundingClientRect();
      return this.clamp(
        (viewportHeight - cardBounds.top) / (viewportHeight + cardBounds.height),
      );
    });

    if (renderImmediately || this.currentHeaderProgress === null) {
      this.currentHeaderProgress = this.targetHeaderProgress;
      this.currentCardProgresses = [...this.targetCardProgresses];
      this.currentParallaxProgresses = [...this.targetParallaxProgresses];
      this.applyProgress();
      return;
    }

    if (!this.frameRequest) {
      this.lastFrameTime = null;
      this.frameRequest = window.requestAnimationFrame(this.renderFrame);
    }
  }

  renderFrame(timestamp) {
    const elapsed = this.lastFrameTime === null ? 16 : Math.min(timestamp - this.lastFrameTime, 64);
    const smoothing = 1 - Math.exp(-elapsed / 110);

    this.lastFrameTime = timestamp;
    this.currentHeaderProgress +=
      (this.targetHeaderProgress - this.currentHeaderProgress) * smoothing;
    this.currentCardProgresses = this.currentCardProgresses.map(
      (progress, index) =>
        progress + (this.targetCardProgresses[index] - progress) * smoothing,
    );
    this.currentParallaxProgresses = this.currentParallaxProgresses.map(
      (progress, index) =>
        progress + (this.targetParallaxProgresses[index] - progress) * smoothing,
    );
    this.applyProgress();

    const headerDelta = Math.abs(this.targetHeaderProgress - this.currentHeaderProgress);
    const cardDelta = Math.max(
      ...this.currentCardProgresses.map((progress, index) =>
        Math.abs(this.targetCardProgresses[index] - progress),
      ),
    );
    const parallaxDelta = Math.max(
      ...this.currentParallaxProgresses.map((progress, index) =>
        Math.abs(this.targetParallaxProgresses[index] - progress),
      ),
    );

    if (headerDelta > 0.0005 || cardDelta > 0.0005 || parallaxDelta > 0.0005) {
      this.frameRequest = window.requestAnimationFrame(this.renderFrame);
    } else {
      this.currentHeaderProgress = this.targetHeaderProgress;
      this.currentCardProgresses = [...this.targetCardProgresses];
      this.currentParallaxProgresses = [...this.targetParallaxProgresses];
      this.applyProgress();
      this.frameRequest = null;
    }
  }

  applyProgress() {
    let animationIndex = 0;

    if (this.header) {
      this.setAnimationProgress(
        this.revealAnimations[animationIndex],
        this.currentHeaderProgress,
      );
      animationIndex += 1;
    }

    this.cards.forEach((card, cardIndex) => {
      this.setAnimationProgress(
        this.revealAnimations[animationIndex + cardIndex],
        this.currentCardProgresses[cardIndex],
      );
      this.setAnimationProgress(
        this.parallaxAnimations[cardIndex],
        this.currentParallaxProgresses[cardIndex],
      );
    });
  }

  setAnimationProgress(animation, progress) {
    if (animation) animation.currentTime = progress * 1000;
  }

  rangeProgress(progress, start, end) {
    return this.clamp((progress - start) / (end - start));
  }

  clamp(value) {
    return Math.min(1, Math.max(0, value));
  }
}

if (!customElements.get('offer-cards-motion')) {
  customElements.define('offer-cards-motion', OfferCardsMotion);
}

class ProductOverviewMotion extends OfferCardsMotion {}

if (!customElements.get('product-overview-motion')) {
  customElements.define('product-overview-motion', ProductOverviewMotion);
}

class PosterMotion extends HTMLElement {
  connectedCallback() {
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.handleMotionPreference = this.handleMotionPreference.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.renderFrame = this.renderFrame.bind(this);

    this.motionPreference.addEventListener('change', this.handleMotionPreference);
    this.handleMotionPreference();
  }

  disconnectedCallback() {
    this.motionPreference?.removeEventListener('change', this.handleMotionPreference);
    this.teardownMotion();
  }

  handleMotionPreference() {
    this.teardownMotion();

    if (!this.motionPreference.matches) this.setupMotion();
  }

  setupMotion() {
    this.section = this.querySelector('[data-scroll-motion-section], .poster-section');
    this.surface = this.querySelector('[data-scroll-motion-surface], [data-poster-surface]');
    this.media = this.querySelector(
      '[data-scroll-motion-media], [data-poster-media] .poster__media-inner',
    );
    this.revealTargets = [
      ...this.querySelectorAll('[data-scroll-motion-reveal], [data-poster-reveal]'),
    ];

    if (!this.section || !this.surface) return;

    this.surfaceAnimation = this.surface.animate(
      [
        { opacity: 0, transform: 'translate3d(0, 3rem, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' },
      ],
      {
        duration: 1000,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'both',
      },
    );
    this.surfaceAnimation.pause();

    this.revealAnimations = this.revealTargets.map((target) => {
      const animation = target.animate(
        [
          { opacity: 0, transform: 'translate3d(0, 1.75rem, 0)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        ],
        {
          duration: 1000,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both',
        },
      );
      animation.pause();
      return animation;
    });

    if (this.media) {
      this.parallaxAnimation = this.media.animate(
        [
          { transform: 'translate3d(0, -3%, 0) scale(1.08)' },
          { transform: 'translate3d(0, 3%, 0) scale(1.08)' },
        ],
        { duration: 1000, easing: 'linear', fill: 'both' },
      );
      this.parallaxAnimation.pause();
    }

    this.currentProgress = null;
    this.targetProgress = 0;
    this.lastFrameTime = null;
    this.frameRequest = null;
    this.isNearViewport = false;

    this.viewportObserver = new IntersectionObserver(
      ([entry]) => {
        this.isNearViewport = entry.isIntersecting;
        this.updateTargetProgress();
      },
      { rootMargin: '100% 0px' },
    );
    this.viewportObserver.observe(this.section);

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleResize);
    this.updateTargetProgress(true);
  }

  teardownMotion() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    this.viewportObserver?.disconnect();

    if (this.frameRequest) window.cancelAnimationFrame(this.frameRequest);

    this.surfaceAnimation?.cancel();
    this.revealAnimations?.forEach((animation) => animation.cancel());
    this.parallaxAnimation?.cancel();
    this.revealAnimations = [];
    this.frameRequest = null;
  }

  handleScroll() {
    if (this.isNearViewport) this.updateTargetProgress();
  }

  handleResize() {
    this.updateTargetProgress(true);
  }

  updateTargetProgress(renderImmediately = false) {
    if (!this.section) return;

    const bounds = this.section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const revealStart = viewportHeight * 0.86;
    const revealDistance = viewportHeight * 0.8;

    this.targetProgress = this.clamp((revealStart - bounds.top) / revealDistance);

    if (renderImmediately || this.currentProgress === null) {
      this.currentProgress = this.targetProgress;
      this.applyProgress();
      return;
    }

    if (!this.frameRequest) {
      this.lastFrameTime = null;
      this.frameRequest = window.requestAnimationFrame(this.renderFrame);
    }
  }

  renderFrame(timestamp) {
    const elapsed = this.lastFrameTime === null ? 16 : Math.min(timestamp - this.lastFrameTime, 64);
    const smoothing = 1 - Math.exp(-elapsed / 110);

    this.lastFrameTime = timestamp;
    this.currentProgress += (this.targetProgress - this.currentProgress) * smoothing;
    this.applyProgress();

    if (Math.abs(this.targetProgress - this.currentProgress) > 0.0005) {
      this.frameRequest = window.requestAnimationFrame(this.renderFrame);
    } else {
      this.currentProgress = this.targetProgress;
      this.applyProgress();
      this.frameRequest = null;
    }
  }

  applyProgress() {
    this.setAnimationProgress(
      this.surfaceAnimation,
      this.rangeProgress(this.currentProgress, 0, 0.78),
    );

    this.revealAnimations.forEach((animation, index) => {
      const start = 0.12 + index * 0.055;
      this.setAnimationProgress(animation, this.rangeProgress(this.currentProgress, start, 0.9));
    });

    this.setAnimationProgress(this.parallaxAnimation, this.currentProgress);
  }

  setAnimationProgress(animation, progress) {
    if (animation) animation.currentTime = progress * 1000;
  }

  rangeProgress(progress, start, end) {
    return this.clamp((progress - start) / (end - start));
  }

  clamp(value) {
    return Math.min(1, Math.max(0, value));
  }
}

if (!customElements.get('poster-motion')) {
  customElements.define('poster-motion', PosterMotion);
}

class UspSectionMotion extends PosterMotion {}

if (!customElements.get('usp-section-motion')) {
  customElements.define('usp-section-motion', UspSectionMotion);
}

const headerSection = document.querySelector('.shopify-section-header');

if (headerSection) {
  new HeaderScrollIntent(headerSection);
}
