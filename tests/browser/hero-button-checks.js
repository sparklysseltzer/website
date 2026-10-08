// Run through agent-browser eval --stdin on the homepage at phone/desktop widths.
// This intentionally attempts internal scrolling: an oversized animated fill must
// never turn a button into a scrollable viewport or move its label/paint surface.
(async () => {
  const hero = document.querySelector('hero-slider[data-caption-layout="split"][data-intro-complete]');
  if (!hero) throw new Error('Load the homepage and wait for the hero entrance.');
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const autoplay = hero.autoplay;
  const index = hero.index;
  const samples = [];
  hero.autoplay = false;
  hero.sync();
  try {
    for (let pass = 0; pass < 2; pass += 1) {
      for (let i = 0; i < hero.slides.length; i += 1) {
        hero.show(i, true, pass ? -1 : 1);
        const button = hero.slides[i].querySelector('.hero-slider__action .button');
        if (!button) continue;
        for (const delay of [80, 320, 800]) {
          await wait(delay);
          const label = button.querySelector('.button__label');
          const before = label.getBoundingClientRect();
          button.scrollTo(24, 24);
          const after = label.getBoundingClientRect();
          assert(button.scrollTop === 0 && button.scrollLeft === 0, `Slide ${i}: fill must not create a scrollable button`);
          assert(Math.abs(before.x - after.x) < .01 && Math.abs(before.y - after.y) < .01, `Slide ${i}: label moved inside button`);
          const bounds = button.getBoundingClientRect();
          assert(after.left >= bounds.left && after.right <= bounds.right, `Slide ${i}: label exceeds button`);
          samples.push({ slide: i, delay, width: bounds.width, height: bounds.height });
        }
      }
    }
    hero.show((hero.index + 1) % hero.slides.length, true, 1);
    await wait(80);
    hero.show((hero.index + hero.slides.length - 1) % hero.slides.length, true, -1);
    await wait(1200);
    assert(hero.querySelectorAll('.is-active').length === 1, 'One active slide after interrupted navigation');
    assert(!hero.querySelector('.is-leaving'), 'Interrupted sweep cleans up outgoing slide');
    assert(document.documentElement.scrollWidth <= innerWidth, 'No page overflow');
    return { viewport: [innerWidth, innerHeight], samples: samples.length, result: 'passed' };
  } finally {
    hero.show(index, false);
    hero.autoplay = autoplay;
    hero.sync();
  }
})();
