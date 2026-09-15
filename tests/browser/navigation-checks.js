// Run after navigation-fixture.js in the same isolated browser. Reject on failure.
(async () => {
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const desktop = matchMedia('(min-width: 64rem)').matches;
  const nav = document.querySelector(`header-navigation[data-presentation=${desktop ? 'desktop' : 'mobile'}]`);
  nav.dismiss();
  if (!desktop) { nav.opener.click(); await wait(400); }
  const [shop, learn] = nav.roots;
  const activate = node => node.querySelector('summary').click();
  if (desktop) activate(shop);
  await wait(450);
  assert(nav.root === shop && shop.selectedCategory === shop.querySelector('[data-nav-category]'), 'First root/category not selected');
  const rootHeight = getComputedStyle(document.documentElement).getPropertyValue('--sticky-header-height');
  const second = shop.querySelectorAll('[data-nav-category]')[1];
  activate(second);
  await wait(70);
  const intermediate = getComputedStyle(second.querySelector('.navigation-content')).opacity;
  assert(Number(intermediate) > 0 && Number(intermediate) < 1, 'Missing intermediate category fade');
  activate(shop.querySelector('[data-nav-category]')); activate(second); activate(learn); activate(shop);
  await wait(550);
  assert(nav.root === shop && !learn.open, 'Rapid root reversal lost latest state');
  assert(shop.querySelectorAll('[data-nav-category][open]').length === 1, 'Multiple selected categories after settling');
  assert(!shop.querySelector('.navigation-content').inert, 'Selected content inert');
  assert([...shop.querySelectorAll('[data-nav-category]')].slice(1).every(d=>d.querySelector('.navigation-content').inert), 'Inactive content focusable');
  const selected = shop.selectedCategory;
  activate(selected); await wait(400);
  assert(desktop ? selected.open : !selected.open, 'Selected category toggle contract');
  if (!desktop) activate(selected);
  if (desktop) {
    const leaf = nav.querySelector('a.navigation-trigger');
    leaf.dispatchEvent(new PointerEvent('pointerover', {bubbles:true})); await wait(100);
    assert(nav.root===shop, 'Hover changed root');
    assert(getComputedStyle(document.documentElement).getPropertyValue('--sticky-header-height')===rootHeight, 'Menu inflated sticky height');
    nav.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); await wait(400);
    assert(!shop.open && document.activeElement===shop.querySelector('summary'), 'Escape did not restore root focus');
    activate(shop); document.body.click(); await wait(400);
    assert(!shop.open,'Outside click did not close');
  } else {
    assert(nav.dialog.scrollWidth<=nav.dialog.clientWidth+1,'Mobile sheet horizontal overflow');
    const close=nav.querySelector('[data-mobile-close]');close.focus();
    close.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));
    assert(document.activeElement!==close,'Focus did not wrap in modal');
    nav.closeMobile();await wait(400);
    assert(!nav.dialog.open && document.activeElement===nav.opener,'Mobile close/focus restore failed');
    assert(getComputedStyle(document.documentElement).overflow!=='hidden','Scroll lock leaked');
  }
  return {mode:desktop?'desktop':'mobile', intermediateOpacity:intermediate,passed:true};
})();
