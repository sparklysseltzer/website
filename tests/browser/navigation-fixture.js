// Run in an isolated local-preview browser with agent-browser eval --stdin.
// It changes only that browser's DOM, never Shopify navigation or theme content.
(async () => {
  const html = await (await fetch('/collections/all')).text();
  const page = new DOMParser().parseFromString(html, 'text/html');
  const sample = [...page.querySelectorAll('.catalog-card')].slice(0, 4);
  await Promise.all(sample.map(async card => {
    card.classList.add('navigation-card', 'navigation-card--product');
    card.querySelector('.catalog-card__logo')?.remove();
    card.querySelector('.catalog-card__meta')?.remove();
    const product = await (await fetch(`${card.querySelector('a').getAttribute('href')}.js`)).json();
    const media = card.querySelector('.catalog-card__media');
    media.classList.remove('catalog-card__media--pair');
    const image = document.createElement('img'); image.src = product.featured_image; image.alt = '';
    media.replaceChildren(image);
    card.querySelector('.catalog-card__title').textContent = product.title;
  }));
  const cards = sample.map(card => card.outerHTML).join('');
  const content = (id, label, textOnly = false) => `<div class="navigation-content" id="${id}"><div class="navigation-content__heading"><p class="navigation-content__title">${label}</p><div class="navigation-controls" hidden><button data-scroll="-1" aria-label="Previous cards">←</button><button data-scroll="1" aria-label="Next cards">→</button></div></div><div class="navigation-cards" tabindex="0" role="region" aria-label="${label}">${textOnly ? '<article class="catalog-card navigation-card navigation-card--text"><a class="catalog-card__link" href="/pages/ueber-uns"><div class="catalog-card__content"><span class="catalog-card__title">Our story — text fallback</span></div></a></article>' : cards}</div><a class="navigation-category-destination" href="/collections/all">${label}</a></div>`;
  for (const nav of [...document.querySelectorAll('header-navigation')]) {
    const parent = nav.parentNode, next = nav.nextSibling;
    nav.remove();
    const mode = nav.dataset.presentation;
    const root = (name, index) => `<li class="navigation-root"><details data-nav-root><summary class="site-header__nav-item navigation-trigger" aria-controls="fixture-${mode}-${index}"><span>${name}</span></summary><div class="navigation-panel" id="fixture-${mode}-${index}"><div class="navigation-categories" style="--navigation-rows:4">${['Soda','Hard Seltzer','Long category label for keyboard and wrapping'].map((label,i)=>`<details data-nav-category style="--navigation-row:${i+1}"><summary aria-controls="fixture-${mode}-${index}-${i}"><span>${label}</span></summary>${content(`fixture-${mode}-${index}-${i}`,label,index===2)}</details>`).join('')}<a style="--navigation-row:4" class="navigation-category-link" href="/collections/clothing">Clothing</a><a class="button navigation-root-destination" href="/collections/all">Explore ${name}</a></div></div></details></li>`;
    nav.querySelector('.navigation-roots').innerHTML = root('Shop',1)+root('Learn',2)+'<li class="navigation-root"><a class="site-header__nav-item navigation-trigger" href="/pages/abo"><span>Subscribe</span></a></li><li class="navigation-pill" aria-hidden="true" hidden><span></span></li>';
    parent.insertBefore(nav,next);
  }
  return 'Isolated nested-menu fixture installed';
})();
