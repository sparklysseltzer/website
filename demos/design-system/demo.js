const preview = document.querySelector('#FormPreview');
const controls = { TuneHeight: '--form-control-height', TuneBorder: '--form-control-border-width', TunePadding: '--form-control-padding-inline', TuneChoice: '--form-choice-size' };
const update = () => Object.entries(controls).forEach(([id, token]) => preview.style.setProperty(token, `${document.getElementById(id).value}px`));
Object.keys(controls).forEach(id => document.getElementById(id).addEventListener('change', update));
const formStyle = document.querySelector('#FormStyle');
function resetFormStyle() {
  const inquiry = formStyle.value === 'inquiry';
  preview.classList.toggle('form--inquiry', inquiry);
  const defaults = inquiry ? [48, 2, 16, 24] : [48, 3, 20, 30];
  Object.keys(controls).forEach((id, index) => { document.getElementById(id).value = String(defaults[index]); });
  update();
  document.querySelector('#TuneStatus').textContent = inquiry ? 'Enquiry style restored.' : 'Commerce style restored.';
}
formStyle.addEventListener('change', resetFormStyle);
document.querySelector('#ResetTokens').addEventListener('click', resetFormStyle);
document.querySelector('#CopyTokens').addEventListener('click', async () => {
  const text = (formStyle.value === 'inquiry' ? '.form--inquiry' : '.commerce-form-preview') + ' {\n' + Object.entries(controls).map(([id, token]) => `  ${token}: ${document.getElementById(id).value}px;`).join('\n') + '\n}';
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

// Run the actual storefront component; only the preview's settings are changed.
const ambientForm = document.querySelector('#AmbientTuner');
const ambientPreview = document.querySelector('#AmbientPreview');
const ambientIntensity = document.querySelector('#AmbientIntensity');
const ambientEnabled = document.querySelector('#AmbientEnabled');
const ambientMedia = document.querySelector('#AmbientMedia');
const ambientStatus = document.querySelector('#AmbientStatus');
function updateAmbient() {
  ambientPreview.dataset.headingAlignment = document.querySelector("#HeroAlignment").value;
  ambientPreview.dataset.headingSize = document.querySelector('#HeroSize').value;
  for (const width of ['narrow', 'editorial', 'page']) ambientPreview.classList.toggle(`hero-slider--${width}`, document.querySelector('#HeroWidth').value === width);
  for (const [id, variable] of [['HeroGap', '--hero-heading-gap']]) {
    const input = document.getElementById(id);
    document.getElementById(`${id}Value`).value = `${input.value}px`;
    document.querySelector('.studio-ambient__preview').style.setProperty(variable, `${input.value}px`);
  }
  for (const [id, variable] of [['AmbientSpread', '--hero-ambient-spread'], ['AmbientBlur', '--hero-ambient-blur']]) {
    const input = document.getElementById(id);
    input.disabled = !ambientEnabled.checked;
    document.getElementById(`${id}Value`).value = `${input.value}px`;
    ambientPreview.style.setProperty(variable, `${input.value}px`);
  }
  ambientIntensity.disabled = !ambientEnabled.checked;
  document.querySelector('#AmbientValue').value = `${ambientIntensity.value}%`;
  ambientPreview.style.setProperty('--hero-ambient-opacity', Number(ambientIntensity.value) / 100);
  ambientPreview.dataset.ambient = String(ambientEnabled.checked && Number(ambientIntensity.value) > 0);
  ambientPreview.show(Number(ambientMedia.value));
  ambientPreview.sync();
  ambientPreview.layout();
}
ambientForm.addEventListener('input', event => {
  if (event.target.matches("input[type=range]")) updateAmbient();
});
ambientForm.addEventListener('change', updateAmbient);
ambientForm.addEventListener('submit', event => event.preventDefault());
ambientForm.addEventListener('reset', () => setTimeout(() => {
  updateAmbient(); ambientStatus.textContent = 'Layout and 40% glow restored.';
}));
ambientPreview.addEventListener('click', () => { ambientMedia.value = String(ambientPreview.index); });
document.querySelector('#CopyAmbient').addEventListener('click', async () => {
  const settings = JSON.stringify({ ambient_light: ambientEnabled.checked && Number(ambientIntensity.value) > 0, ambient_intensity: Number(ambientIntensity.value), ambient_spread: Number(document.querySelector("#AmbientSpread").value), ambient_blur: Number(document.querySelector("#AmbientBlur").value), content_width: document.querySelector("#HeroWidth").value, heading_size: ambientPreview.dataset.headingSize, heading_alignment: ambientPreview.dataset.headingAlignment, heading_gap: Number(document.querySelector("#HeroGap").value) }, null, 2);
  try { await navigator.clipboard.writeText(settings); ambientStatus.textContent = 'Ambient settings copied.'; }
  catch { ambientStatus.textContent = settings; }
});
customElements.whenDefined('hero-slider').then(updateAmbient);

// Preview the same width variant on both Content Slider layouts.
document.querySelector('#ContentSliderWidth')?.addEventListener('change', event => {
  document.querySelectorAll('#ContentSlider content-slider').forEach(slider => {
    slider.cancelSnap();
    slider.dataset.widthMode = event.target.value;
    slider.layoutViewport();
    slider.track.scrollTo({ left: 0, behavior: 'instant' });
    slider.update();
  });
});

// Studio navigation: two levels, hash-addressable previews, persistent side panels.
(() => {
  const pages = [...document.querySelectorAll('[data-studio-page]')];
  const links = [...document.querySelectorAll('.studio-nav-link')];
  const sidebar = document.querySelector('#StudioSidebar');
  const inspector = document.querySelector('#StudioInspector');
  const workspace = document.querySelector('.studio-workspace');
  const backdrop = document.querySelector('#StudioBackdrop');
  const navToggle = document.querySelector('#StudioNavToggle');
  const inspectorToggle = document.querySelector('#StudioInspectorToggle');
  const mobile = matchMedia('(max-width: 1000px)');
  const inspectorControls = document.querySelector('#InspectorControls');
  const configurations = new Map();
  for (const page of pages) {
    const tuners = [...page.querySelectorAll('.studio-tuner')];
    if (!tuners.length) continue;
    const group = document.createElement('div');
    group.hidden = true;
    tuners.forEach(tuner => group.append(tuner));
    inspectorControls.append(group);
    configurations.set(page, group);
  }
  function readPreference(key) { try { return localStorage.getItem(key) !== 'false'; } catch { return true; } }
  function savePreference(key, value) { try { localStorage.setItem(key, String(value)); } catch { /* Storage can be unavailable in private previews. */ } }
  let navOpen = !mobile.matches && readPreference('sparklys-studio-nav');
  let inspectorOpen = !mobile.matches && readPreference('sparklys-studio-inspector');
  function paintPanels() {
    document.body.dataset.navOpen = String(navOpen);
    document.body.dataset.inspectorOpen = String(inspectorOpen);
    navToggle.setAttribute('aria-expanded', String(navOpen));
    inspectorToggle.setAttribute('aria-expanded', String(inspectorOpen));
    sidebar.inert = !navOpen;
    inspector.inert = !inspectorOpen;
    const overlay = mobile.matches && (navOpen || inspectorOpen);
    backdrop.hidden = !overlay;
    workspace.inert = overlay;
    document.body.style.overflowY = overlay ? 'hidden' : '';
    for (const [panel, open] of [[sidebar, navOpen], [inspector, inspectorOpen]]) {
      if (mobile.matches && open) { panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); }
      else { panel.removeAttribute('role'); panel.removeAttribute('aria-modal'); }
    }
  }
  function togglePanel(kind, open, focus = true) {
    if (kind === 'nav') {
      navOpen = open;
      if (mobile.matches && open) inspectorOpen = false;
      if (!mobile.matches) savePreference('sparklys-studio-nav', open);
    } else {
      inspectorOpen = open;
      if (mobile.matches && open) navOpen = false;
      if (!mobile.matches) savePreference('sparklys-studio-inspector', open);
    }
    paintPanels();
    if (focus) {
      if (open && mobile.matches) (kind === 'nav' ? document.querySelector('#StudioSearch') : inspector.querySelector('button')).focus();
      if (!open) (kind === 'nav' ? navToggle : inspectorToggle).focus();
    }
  }
  navToggle.addEventListener('click', () => togglePanel('nav', !navOpen));
  inspectorToggle.addEventListener('click', () => togglePanel('inspector', !inspectorOpen));
  document.querySelector('#StudioNavClose').addEventListener('click', () => togglePanel('nav', false));
  document.querySelector('#StudioInspectorClose').addEventListener('click', () => togglePanel('inspector', false));
  backdrop.addEventListener('click', () => togglePanel(navOpen ? 'nav' : 'inspector', false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (mobile.matches && (navOpen || inspectorOpen)) { event.preventDefault(); togglePanel(navOpen ? 'nav' : 'inspector', false); }
      return;
    }
    if (event.key !== 'Tab' || !mobile.matches || !(navOpen || inspectorOpen)) return;
    const panel = navOpen ? sidebar : inspector;
    const focusable = [...panel.querySelectorAll('a,button,input,select,summary,[tabindex="0"]')].filter(node => !node.disabled && node.getClientRects().length);
    const first = focusable[0], last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
  });
  mobile.addEventListener('change', () => {
    navOpen = !mobile.matches && readPreference('sparklys-studio-nav');
    inspectorOpen = !mobile.matches && readPreference('sparklys-studio-inspector');
    paintPanels();
  });
  const search = document.querySelector('#StudioSearch');
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    links.forEach(link => {
      const chapter = link.closest('details')?.querySelector('summary').textContent || '';
      link.hidden = !`${chapter} ${link.textContent}`.toLowerCase().includes(query);
      if (!link.hidden) count++;
    });
    sidebar.querySelectorAll('details').forEach(group => {
      group.hidden = ![...group.querySelectorAll('a')].some(link => !link.hidden);
      if (query && !group.hidden) group.open = true;
    });
    document.querySelector('#StudioSearchEmpty').hidden = count > 0;
  });
  function showPage(focus = false) {
    const route = decodeURIComponent(location.hash.slice(1)) || 'Overview';
    const page = pages.find(page => (page.dataset.route || page.id) === route || page.querySelector(`[id="${CSS.escape(route)}"]`)) || pages[0];
    pages.forEach(candidate => { candidate.hidden = candidate !== page; });
    configurations.forEach((group, candidate) => { group.hidden = candidate !== page; });
    document.querySelector('#InspectorEmpty').hidden = configurations.has(page);
    document.querySelector('#InspectorTitle').textContent = page.dataset.title;
    document.querySelector('#InspectorChapter').textContent = page.dataset.chapter;
    document.querySelector('#StudioBreadcrumb').textContent = `Design system / ${page.dataset.chapter}`;
    document.querySelector('#StudioPageTitle').textContent = page.dataset.title === 'Overview' ? 'The Sparklys system.' : page.dataset.title;
    document.title = `${page.dataset.title} — Sparklys Design Studio`;
    const id = page.dataset.route || page.id;
    links.forEach(link => {
      const active = link.hash === `#${id}`;
      if (active) { link.setAttribute('aria-current', 'page'); const group = link.closest('details'); if (group) group.open = true; }
      else link.removeAttribute('aria-current');
    });
    if (mobile.matches) { navOpen = false; inspectorOpen = false; paintPanels(); }
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      page.querySelectorAll('content-slider').forEach(slider => { slider.layoutViewport?.(); slider.update?.(); });
      page.querySelectorAll('hero-slider').forEach(slider => slider.layout?.());
      if (focus) document.querySelector('#StudioMain').focus({ preventScroll: true });
    });
  }
  window.addEventListener('hashchange', () => showPage(true));
  window.addEventListener('load', () => showPage(), { once: true });
  paintPanels();
  showPage();
})();

// Shared width roles are independent of the slider's bleed behavior.
for (const [control, selector] of [['ContainerWidth', '#ContainerWidthPreview'], ['ContentSliderContainer', '#ContentSlider content-slider']]) {
  document.getElementById(control)?.addEventListener('change', event => {
    const value = `var(--content-width-${event.target.value})`;
    document.querySelectorAll(selector).forEach(preview => {
      if (control === 'ContainerWidth') preview.style.setProperty('--studio-content-width', value);
      else { preview.style.maxWidth = value; preview.layoutViewport?.(); preview.update?.(); }
    });
  });
}
