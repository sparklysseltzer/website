// Run in the isolated development preview on a product with multiple selling plans.
(async () => {
  const p = document.querySelector('product-detail');
  const once = p.querySelector('[name="purchase_type"][value="once"]');
  const subscription = p.querySelector('[name="purchase_type"][value="subscription"]');
  const select = p.querySelector('[data-plan-select]');
  const label = select.closest('sparklys-select').querySelector('.form-select__trigger span');
  const submittedPlan = () => new FormData(p.buyForm).get('selling_plan');
  const settle = () => new Promise(resolve => setTimeout(resolve, 240));
  if ([...select.options].some(option => !option.value)) throw Error('Enhanced frequency list contains one-time purchase');
  subscription.click(); await settle();
  select.value = select.options[select.options.length - 1].value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
  const plan = select.value, text = label.textContent;
  if (submittedPlan() !== plan) throw Error('Subscription form does not submit selected plan');
  once.click();
  if (submittedPlan() !== null || new URL(location.href).searchParams.has('selling_plan')) throw Error('One-time purchase retains selling plan');
  let frames = 0; const start = performance.now();
  while (performance.now() - start < 250) {
    if (label.textContent !== text) throw Error('Frequency label changed while closing');
    frames++; await new Promise(requestAnimationFrame);
  }
  subscription.click(); await settle();
  if (select.value !== plan || submittedPlan() !== plan) throw Error('Selected frequency was not retained');
  if (new URL(location.href).searchParams.get('selling_plan') !== plan) throw Error('Subscription URL disagrees with form');
  const alternate = [...p.variantSelect.options].find(option => option.value !== p.variantSelect.value);
  if (alternate) {
    p.variantSelect.value = alternate.value;
    p.variantSelect.dispatchEvent(new Event('change', { bubbles: true }));
    if (p.variant.allocations.length && !p.variant.allocations.some(item => String(item.id) === submittedPlan())) throw Error('Variant has incompatible plan');
  }
  once.click(); await settle();
  if (submittedPlan() !== null || !p.querySelector('[data-plan-field]').hidden) throw Error('One-time state did not settle');
  return { width: innerWidth, checkedFrames: frames, retainedPlan: plan, oneTimeHasNoPlan: true, options: select.options.length };
})()
