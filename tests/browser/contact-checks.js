// Run through agent-browser eval --stdin on the development Kontakt page.
// Browser-only fixtures: never submits an enquiry or calls the real Klaviyo API.
(async () => {
  const checks = [];
  const assert = (condition, name) => { if (!condition) throw new Error(name); checks.push(name); };
  const contact = document.querySelector('sparklys-contact');
  assert(!!contact, 'Contact component rendered');
  assert(document.querySelectorAll('h1').length === 1, 'One H1');
  assert(getComputedStyle(document.querySelector('h1')).textTransform === 'none', 'Erode preserves authored casing');
  assert(document.documentElement.scrollWidth <= innerWidth, 'No page overflow');
  assert(contact.querySelector('form').method === 'post', 'Native POST form');
  const form = contact.querySelector('form');
  assert(form.querySelectorAll('[required]').length === 4, 'Four required fields; telephone optional');
  const nodes = [...document.querySelectorAll('script[type="application/ld+json"]')].map(e => JSON.parse(e.textContent));
  assert(nodes.filter(d => d['@type'] === 'ContactPage').length === 1, 'One ContactPage entity');
  const originalMarkup = contact.innerHTML;
  const originalDataset = { ...contact.dataset };
  const originalFetch = window.fetch;
  const requests = [];
  let responseStatus = 429;
  window.fetch = async (url, options) => {
    if (!String(url).startsWith('https://a.klaviyo.com/client/subscriptions')) return originalFetch(url, options);
    requests.push(JSON.parse(options.body));
    return new Response(null, { status: responseStatus });
  };
  try {
    contact.disconnectedCallback();
    contact.dataset.siteId = 'PUBLIC'; contact.dataset.listId = 'LISTID';
    // Add the configured opt-in markup without saving fake list IDs in Shopify.
    form.querySelector('.contact-section__actions').insertAdjacentHTML('beforebegin', '<div class="contact-section__newsletter"><label class="form-choice"><input type="checkbox" data-newsletter-opt-in disabled><span class="form-choice__indicator" aria-hidden="true"></span><span>Ja, ich möchte Sparklys News und Angebote per E-Mail erhalten. Ich kann mich jederzeit abmelden.</span></label><p data-newsletter-unavailable>Unavailable</p></div>');
    contact.connectedCallback();
    const checkbox = contact.querySelector('[data-newsletter-opt-in]');
    assert(!checkbox.checked && !checkbox.disabled, 'Configured newsletter checkbox enabled and unchecked');
    for (const [key,value] of Object.entries({ first_name:'Bob', last_name:'Ross', email:'bob@example.com', contact_phone_number:'044 123 45 67', body:'PRIVATE ENQUIRY — do not send' })) form.elements.namedItem(`contact[${key}]`).value = value;
    contact.rememberChoice();
    assert(sessionStorage.getItem(contact.storageKey) === null, 'Unchecked form queues no newsletter request');
    checkbox.checked = true;
    contact.rememberChoice();
    const pending = JSON.parse(sessionStorage.getItem(contact.storageKey));
    assert(pending.attributes.first_name === 'Bob' && !JSON.stringify(pending).includes('PRIVATE ENQUIRY'), 'Opt-in stores identity, excludes message');
    assert(requests.length === 0, 'No subscription before native contact success');
    contact.disconnectedCallback();
    form.innerHTML = '<div data-contact-success><div data-newsletter-result hidden><p role="status" data-newsletter-status></p><button class="button" type="button" data-newsletter-retry hidden>Retry newsletter signup</button></div></div>';
    contact.connectedCallback();
    const settled = async () => { while (contact.busy) await new Promise(resolve => setTimeout(resolve, 25)); };
    await settled();
    assert(requests.length === 1 && !contact.retry.hidden, 'Provider rejection offers separate retry');
    assert(Object.keys(requests[0].data.attributes.profile.data.attributes.subscriptions).join() === 'email', 'Email consent only');
    responseStatus = 202;
    await contact.subscribe();
    assert(requests.length === 2 && contact.retry.hidden && !sessionStorage.getItem(contact.storageKey), 'Accepted retry clears pending identity');
    const status = contact.querySelector('[data-newsletter-status]');
    const previous = status.textContent;
    const transition = contact.setStatus(status, 'A different, shorter status');
    await new Promise(resolve => requestAnimationFrame(resolve));
    const active = status.getAnimations();
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      assert(active.length > 0, 'Semantic feedback has an intermediate animation');
      for (const animation of active) animation.currentTime = animation.effect.getTiming().duration / 2;
      assert(Number(getComputedStyle(status).opacity) < 1, 'Intermediate feedback is crossfading');
    }
    await transition;
    assert(status.textContent !== previous, 'Feedback settles to new state');
    await contact.setStatus(status, status.textContent);
    assert(status.getAnimations().length === 0, 'Unchanged status does not replay motion');
  } finally {
    contact.disconnectedCallback();
    sessionStorage.removeItem(contact.storageKey);
    window.fetch = originalFetch;
    contact.innerHTML = originalMarkup;
    Object.assign(contact.dataset, originalDataset);
    contact.connectedCallback();
  }
  return { viewport: innerWidth, checks };
})()
