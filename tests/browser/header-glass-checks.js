// Run through agent-browser eval --stdin on a desktop branded page.
(async () => {
  await document.fonts.ready;
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const header = document.querySelector('.site-header');
  const strip = header.querySelector('.site-header__switcher');
  const tab = header.querySelector('.site-header__brand-tab--active .site-header__brand-tab-surface');
  await Promise.all(tab.getAnimations().map(animation => animation.finished.catch(() => {})));
  const layer = header.querySelector('header-glass');
  const path = layer.querySelector('path');
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const rect = strip.getBoundingClientRect();
  const bounds = tab.getBoundingClientRect();
  assert(header.classList.contains('site-header--glass'), 'Shared glass is active');
  const shell = header.closest('.shopify-section-header');
  const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const blur = parseFloat(getComputedStyle(shell).backdropFilter.match(/blur\(([\d.]+)px\)/)?.[1]);
  assert(Math.abs(blur - rootSize * 1.5) < .01, 'Snapshot boundary owns the proportional blur');
  assert(getComputedStyle(header).backdropFilter === 'none', 'No blur trapped below the snapshot boundary');
  assert(getComputedStyle(header.querySelector('.site-header__main')).backdropFilter === 'none', 'No second blur on navigation');
  assert(getComputedStyle(tab).backgroundColor === 'rgba(0, 0, 0, 0)', 'Active tab has no white paint');
  assert(!path.isPointInFill(new DOMPoint(bounds.left - rect.left + bounds.width / 2, bounds.bottom - rect.top - 2)), 'Tab opens onto glass');
  assert(path.isPointInFill(new DOMPoint(rect.width - 1, 1)), 'Rest of strip stays black');
  // A filled region immediately below the notch caused the fractional bottom seam.
  // Keep raster screenshots at adjacent widths too; geometry alone is not visual QA.
  assert(!path.isPointInFill(new DOMPoint(bounds.left - rect.left + bounds.width / 2, rect.height + .25)), 'No overlapping black fill below the active tab');
  const original = path.getAttribute('d');
  tab.style.paddingInline = '2rem';
  await new Promise(resolve => setTimeout(resolve, 80));
  assert(path.getAttribute('d') !== original, 'Cutout follows changed tab width');
  tab.style.removeProperty('padding-inline');
  await new Promise(resolve => setTimeout(resolve, 80));
  assert(path.getAttribute('d') === original, 'Cutout restores without drift');
  const next = layer.nextSibling;
  layer.remove();
  assert(!header.classList.contains('site-header--glass'), 'Disconnect restores fallback');
  strip.insertBefore(layer, next);
  assert(header.classList.contains('site-header--glass'), 'Reconnect restores glass');
  assert(document.documentElement.scrollWidth === innerWidth, 'No page overflow');
  return 'Header glass geometry, single blur, resize and lifecycle checks passed';
})();
