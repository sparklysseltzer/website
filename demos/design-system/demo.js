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

// Motion settings affect this study only; storefront defaults remain in base.css.
const motionForm = document.querySelector('#MotionTuner');
const motionPreview = document.querySelector('#MotionPreview');
const motionStatus = document.querySelector('#MotionStatus');
let replayTimer;
function stopReplay() { clearTimeout(replayTimer); motionPreview.removeAttribute('data-playing'); }
function updateMotion() {
  stopReplay();
  const fields = motionForm.elements;
  motionPreview.dataset.shape = fields.shape.value;
  motionPreview.toggleAttribute('data-reduced', fields.reduced.checked);
  for (const name of ['enter', 'exit', 'width']) {
    const unit = name === 'width' ? '%' : 'ms';
    motionPreview.style.setProperty(`--study-${name}`, fields[name].value + unit);
    document.querySelector(`#${name[0].toUpperCase() + name.slice(1)}Value`).value = fields[name].value + unit;
  }
  motionPreview.style.setProperty('--study-ease', fields.easing.value);
  fields.width.disabled = fields.shape.value === 'circle';
}
motionForm.addEventListener('input', updateMotion);
motionForm.addEventListener('submit', event => event.preventDefault());
motionForm.addEventListener('reset', () => queueMicrotask(() => { updateMotion(); motionStatus.textContent = 'Storefront baseline restored.'; }));
document.querySelector('#ReplayMotion').addEventListener('click', () => {
  stopReplay();
  requestAnimationFrame(() => requestAnimationFrame(() => {
    motionPreview.setAttribute('data-playing', '');
    replayTimer = setTimeout(stopReplay, Number(motionForm.elements.enter.value) + 700);
  }));
});
document.querySelector('#CopyMotion').addEventListener('click', async () => {
  const f = motionForm.elements;
  const text = `Shape: ${f.shape.value}\n.button {\n  --button-sweep-enter-duration: ${f.enter.value}ms;\n  --button-sweep-exit-duration: ${f.exit.value}ms;\n  --button-sweep-width: ${f.width.value}%;\n  --button-sweep-ease: ${f.easing.value};\n}\nWave/circle shapes are studio prototypes; the shape needs its corresponding CSS.`;
  try { await navigator.clipboard.writeText(text); motionStatus.textContent = 'Motion settings copied.'; }
  catch { motionStatus.textContent = text; }
});
updateMotion();
