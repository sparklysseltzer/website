// Copy review is localhost-only; store-wide consent wording remains Shopify-owned.
(() => {
  if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;
  const copy = document.getElementById('cookie-banner-preview-copy');
  if (!copy) return;
  const apply = () => {
    const title = document.getElementById('shopify-pc__banner__body-title');
    const link = document.getElementById('shopify-pc__banner__body-policy-link');
    const paragraph = link?.closest('p');
    if (!title || !paragraph) return false;
    title.textContent = copy.dataset.title;
    link.textContent = copy.dataset.policy;
    paragraph.replaceChildren(document.createTextNode(`${copy.dataset.body} `), link, document.createTextNode('.'));
    return true;
  };
  if (apply()) return;
  const observer = new MutationObserver(() => {
    if (apply()) observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  window.setTimeout(() => observer.disconnect(), 30000);
})();
