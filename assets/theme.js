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

class FaqSectionMotion extends PosterMotion {
  setupMotion() {
    super.setupMotion();

    if (!this.section || !Number.isFinite(this.targetProgress) || this.targetProgress <= 0) return;

    const initialTarget = this.targetProgress;
    this.currentProgress = 0;
    this.applyProgress();
    this.targetProgress = initialTarget;
    this.lastFrameTime = null;
    this.frameRequest = window.requestAnimationFrame(this.renderFrame);
  }
}

if (!customElements.get('faq-section-motion')) {
  customElements.define('faq-section-motion', FaqSectionMotion);
}

class EditorialSectionMotion extends FaqSectionMotion {}

if (!customElements.get('editorial-section-motion')) {
  customElements.define('editorial-section-motion', EditorialSectionMotion);
}

class FaqAccordion extends HTMLElement {
  connectedCallback() {
    this.items = [...this.querySelectorAll(':scope > details')];
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.animations = new Map();
    this.handleClick = this.handleClick.bind(this);
    this.handleMotionPreference = this.handleMotionPreference.bind(this);

    this.addEventListener('click', this.handleClick);
    this.motionPreference.addEventListener('change', this.handleMotionPreference);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
    this.motionPreference?.removeEventListener('change', this.handleMotionPreference);
    this.animations?.forEach((animation) => animation.cancel());
    this.animations?.clear();
  }

  handleClick(event) {
    const summary = event.target.closest('summary');
    if (!summary || !this.contains(summary)) return;

    const item = summary.parentElement;
    if (!this.items.includes(item)) return;

    event.preventDefault();
    const shouldOpen = !item.open;

    if (shouldOpen) {
      this.items.forEach((otherItem) => {
        if (otherItem !== item && otherItem.open) this.setItemOpen(otherItem, false);
      });
    }

    this.setItemOpen(item, shouldOpen);
  }

  handleMotionPreference() {
    this.animations.forEach((animation, item) => {
      animation.cancel();
      this.resetAnswer(item);
    });
    this.animations.clear();
  }

  setItemOpen(item, shouldOpen) {
    const answer = item.querySelector('.faq-item__answer');
    if (!answer || this.motionPreference.matches) {
      item.toggleAttribute('open', shouldOpen);
      return;
    }

    this.animations.get(item)?.cancel();
    if (shouldOpen) item.setAttribute('open', '');

    const startHeight = shouldOpen ? 0 : answer.getBoundingClientRect().height;
    const endHeight = shouldOpen ? answer.scrollHeight : 0;
    const animation = answer.animate(
      [
        {
          height: `${startHeight}px`,
          opacity: shouldOpen ? 0 : 1,
          transform: shouldOpen ? 'translate3d(0, -0.5rem, 0)' : 'translate3d(0, 0, 0)',
        },
        {
          height: `${endHeight}px`,
          opacity: shouldOpen ? 1 : 0,
          transform: shouldOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, -0.35rem, 0)',
        },
      ],
      {
        duration: shouldOpen ? 380 : 280,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    );

    this.animations.set(item, animation);
    animation.onfinish = () => {
      if (!shouldOpen) item.removeAttribute('open');
      this.resetAnswer(item);
      this.animations.delete(item);
    };
    animation.oncancel = () => this.resetAnswer(item);
  }

  resetAnswer(item) {
    const answer = item.querySelector('.faq-item__answer');
    answer?.style.removeProperty('height');
    answer?.style.removeProperty('opacity');
    answer?.style.removeProperty('transform');
  }
}

if (!customElements.get('faq-accordion')) {
  customElements.define('faq-accordion', FaqAccordion);
}

class FaqDirectory extends HTMLElement {
  connectedCallback() {
    this.results = this.querySelector('[data-faq-list]');
    this.resultAnimation = null;
    this.resultRevision = (this.resultRevision || 0) + 1;
    this.searchTimer = null;
    this.motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.searchInput = this.querySelector('[data-faq-search]');
    this.filterButtons = [...this.querySelectorAll('[data-faq-filter]')];
    this.items = [...this.querySelectorAll('[data-faq-entry]')];
    this.status = this.querySelector('[data-faq-status]');
    this.emptyState = this.querySelector('[data-faq-empty]');
    this.activeCategory = 'all';

    if (!this.searchInput || this.items.length === 0) return;

    this.handleSearch = this.handleSearch.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
    this.handleMotionPreference = () => this.update(false, false);

    this.searchInput.addEventListener('input', this.handleSearch);
    this.searchInput.addEventListener('compositionend', this.handleSearch);
    this.filterButtons.forEach((button) => button.addEventListener('click', this.handleFilter));
    window.addEventListener('popstate', this.handlePopState);
    this.motionPreference.addEventListener('change', this.handleMotionPreference);

    this.restoreFromUrl();
    this.update(false, false);
  }

  disconnectedCallback() {
    this.resultRevision += 1;
    window.clearTimeout(this.searchTimer);
    this.resultAnimation?.cancel();
    this.motionPreference?.removeEventListener('change', this.handleMotionPreference);
    this.searchInput?.removeEventListener('input', this.handleSearch);
    this.searchInput?.removeEventListener('compositionend', this.handleSearch);
    this.filterButtons?.forEach((button) => button.removeEventListener('click', this.handleFilter));
    window.removeEventListener('popstate', this.handlePopState);
  }

  normalize(value) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase(document.documentElement.lang);
  }

  restoreFromUrl() {
    const parameters = new URLSearchParams(window.location.search);
    const requestedCategory = parameters.get('faq-category') || 'all';
    const categoryExists = this.filterButtons.some(
      (button) => button.dataset.faqFilter === requestedCategory,
    );

    this.activeCategory = categoryExists ? requestedCategory : 'all';
    this.searchInput.value = parameters.get('faq-query') || '';
  }

  handleSearch(event) {
    window.clearTimeout(this.searchTimer);
    // Invalidate in-flight result swaps as soon as the query changes, not after debounce.
    this.resultRevision += 1;
    this.resultAnimation?.cancel();
    this.resultAnimation = null;
    if (event?.isComposing) return;

    if (this.searchInput.value.trim().length < 3) {
      this.update();
      return;
    }

    this.searchTimer = window.setTimeout(() => {
      this.searchTimer = null;
      this.update();
    }, 200);
  }

  handleFilter(event) {
    window.clearTimeout(this.searchTimer);
    this.activeCategory = event.currentTarget.dataset.faqFilter;
    this.update();
  }

  handlePopState() {
    window.clearTimeout(this.searchTimer);
    this.restoreFromUrl();
    this.update(false);
  }

  async update(writeUrl = true, animate = true) {
    const search = this.searchInput.value.trim();
    const query = search.length >= 3 ? this.normalize(search) : '';
    const matches = this.items.map((item) => {
      const categories = item.dataset.faqCategories.split('|').filter(Boolean);
      return (this.activeCategory === 'all' || categories.includes(this.activeCategory)) &&
        (query === '' || this.normalize(item.textContent).includes(query));
    });
    const signature = matches.map(Number).join('');
    const revision = ++this.resultRevision;
    const opacity = this.results ? getComputedStyle(this.results).opacity : '1';
    this.resultAnimation?.cancel();
    this.resultAnimation = null;

    this.filterButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.faqFilter === this.activeCategory));
    });

    if (writeUrl) this.updateUrl();
    const shouldAnimate = animate && !this.motionPreference.matches && this.results?.animate &&
      signature !== this.resultSignature;
    const styles = getComputedStyle(this);
    const duration = parseFloat(styles.getPropertyValue('--motion-duration-base')) || 260;
    const easing = styles.getPropertyValue('--motion-ease').trim() || 'ease-out';

    if (shouldAnimate && this.items.some((item) => !item.hidden)) {
      this.resultAnimation = this.results.animate(
        [{ opacity }, { opacity: 0, transform: 'translateY(-6px)' }],
        { duration: duration * .4, easing, fill: 'forwards' },
      );
      await this.resultAnimation.finished.catch(() => {});
      if (revision !== this.resultRevision || !this.isConnected) return;
      this.resultAnimation.cancel();
    }

    const visibleCount = matches.filter(Boolean).length;
    this.items.forEach((item, index) => {
      const isVisible = matches[index];

      item.hidden = !isVisible;
      if (!isVisible) {
        const accordion = item.closest('faq-accordion');
        accordion?.animations?.get(item)?.cancel();
        accordion?.animations?.delete(item);
        item.removeAttribute('open');
      }
    });

    if (this.status) {
      this.status.textContent =
        visibleCount === 1
          ? this.dataset.resultSingular
          : this.dataset.resultsTemplate.replace('{count}', visibleCount);
    }

    if (this.emptyState) this.emptyState.hidden = visibleCount !== 0;
    this.resultSignature = signature;
    if (shouldAnimate) {
      const target = visibleCount ? this.results : this.emptyState;
      if (!target) return;
      const animation = target.animate(
        [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration, easing },
      );
      this.resultAnimation = animation;
      animation.onfinish = () => {
        if (this.resultAnimation === animation) this.resultAnimation = null;
      };
    }
  }

  updateUrl() {
    const url = new URL(window.location.href);
    const query = this.searchInput.value.trim();

    if (this.activeCategory === 'all') url.searchParams.delete('faq-category');
    else url.searchParams.set('faq-category', this.activeCategory);

    if (query === '') url.searchParams.delete('faq-query');
    else url.searchParams.set('faq-query', query);

    window.history.replaceState({}, '', url);
  }
}

if (!customElements.get('faq-directory')) {
  customElements.define('faq-directory', FaqDirectory);
}

const headerSection = document.querySelector('.shopify-section-header');

if (headerSection) {
  new HeaderScrollIntent(headerSection);
}
