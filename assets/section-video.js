if (!customElements.get('section-video')) customElements.define('section-video', class extends HTMLElement {
  connectedCallback() {
    this.video = this.querySelector('video');
    this.toggle = this.querySelector('.video-section__toggle');
    if (!this.video || !this.toggle) return;
    this.abort = new AbortController();
    const options = { signal: this.abort.signal };
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.started = false;
    this.video.controls = false;
    this.video.disablePictureInPicture = true;
    this.toggle.hidden = false;
    const updateLabel = () => {
      this.toggle.setAttribute('aria-label', this.video.paused ? this.toggle.dataset.playLabel : this.toggle.dataset.pauseLabel);
    };
    this.toggle.addEventListener('click', () => {
      this.started = true;
      if (this.video.paused) this.video.play().catch(updateLabel);
      else this.video.pause();
    }, options);
    this.video.addEventListener('play', updateLabel, options);
    this.video.addEventListener('pause', updateLabel, options);
    this.video.addEventListener('ended', updateLabel, options);
    updateLabel();
    this.motion.addEventListener('change', () => { if (this.motion.matches) this.video.pause(); }, options);
    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.started && !this.motion.matches && this.hasAttribute('data-autoplay')) {
        this.started = true;
        this.video.play().catch(updateLabel);
      } else if (!entries[0].isIntersecting) this.video.pause();
    }, { threshold: .25 });
    this.observer.observe(this);
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.video.pause(); }, options);
  }
  disconnectedCallback() {
    this.abort?.abort();
    this.observer?.disconnect();
    this.video?.pause();
    if (this.toggle) this.toggle.hidden = true;
  }
});
