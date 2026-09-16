// Run with agent-browser eval --stdin on the local desktop preview. DOM-only fixture.
(async () => {
  const nav = document.querySelector('header-navigation[data-presentation="desktop"]');
  const root = nav?.querySelector('[data-nav-root]');
  const categories = [...root.querySelectorAll('[data-nav-category]')];
  const panel = root.querySelector('.navigation-panel');
  const tall = categories[1].querySelector('.navigation-content');
  const previous = tall.style.minHeight;
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const finish = async () => {
    const animation = nav.heightEffects.get(panel);
    if (animation) { animation.finish(); await animation.finished; }
  };
  try {
    nav.dismiss(); nav.selectRoot(root);
    tall.style.minHeight = '650px';
    nav.selectCategory(categories[1]); await finish();
    const high = panel.getBoundingClientRect().height;
    nav.selectCategory(categories[0]);
    const shrink = nav.heightEffects.get(panel);
    assert(shrink, 'Unequal content heights must animate');
    shrink.pause(); shrink.currentTime = 90;
    const midway = panel.getBoundingClientRect().height;
    assert(midway < high && midway > nav.panelHeights.get(panel), 'Intermediate height must remain between endpoints');
    nav.easePanelHeight(panel, midway);
    assert(nav.heightEffects.get(panel) === shrink, 'Same intrinsic target must not restart animation');
    nav.selectCategory(categories[1]);
    const reverse = nav.heightEffects.get(panel);
    assert(Math.abs(parseFloat(reverse.effect.getKeyframes()[0].height) - midway) < 1, 'Reversal must start at painted height');
    await finish();
    assert(Math.abs(panel.getBoundingClientRect().height - high) < 1, 'Reversal must settle at intrinsic height');
    assert(categories[0].querySelector('.navigation-content').inert, 'Outgoing category must be inert');
    return { high, midway, final: panel.getBoundingClientRect().height, passed: true };
  } finally {
    tall.style.minHeight = previous;
    nav.dismiss();
  }
})();
