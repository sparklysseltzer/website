const preview = document.querySelector('#FormPreview');
const controls = { TuneHeight: '--form-control-height', TuneBorder: '--form-control-border-width', TunePadding: '--form-control-padding-inline', TuneChoice: '--form-choice-size' };
const update = () => Object.entries(controls).forEach(([id, token]) => preview.style.setProperty(token, `${document.getElementById(id).value}px`));
Object.keys(controls).forEach(id => document.getElementById(id).addEventListener('change', update));
document.querySelector('#ResetTokens').addEventListener('click', () => { Object.keys(controls).forEach(id => document.getElementById(id).selectedIndex = [...document.getElementById(id).options].findIndex(option => option.defaultSelected)); update(); document.querySelector('#TuneStatus').textContent = 'Baseline restored.'; });
document.querySelector('#CopyTokens').addEventListener('click', async () => {
  const text = ':root {\n' + Object.entries(controls).map(([id, token]) => `  ${token}: ${document.getElementById(id).value}px;`).join('\n') + '\n}';
  try { await navigator.clipboard.writeText(text); document.querySelector('#TuneStatus').textContent = 'Tokens copied.'; }
  catch { document.querySelector('#TuneStatus').textContent = text; }
});
document.querySelector('#MixedChoice').indeterminate = true;
const form = document.querySelector('#ExampleForm');
const email = document.querySelector('#Email');
const error = document.querySelector('#EmailError');
form.addEventListener('submit', event => {
  event.preventDefault();
  const valid = email.validity.valid;
  email.setAttribute('aria-invalid', String(!valid));
  error.hidden = valid;
  document.querySelector('#FormStatus').textContent = valid ? 'Looks good. This is a local preview; nothing was sent.' : '';
  if (!valid) { email.focus(); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) error.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 }); }
});
form.addEventListener('reset', () => { email.removeAttribute('aria-invalid'); error.hidden = true; document.querySelector('#FormStatus').textContent = ''; });
