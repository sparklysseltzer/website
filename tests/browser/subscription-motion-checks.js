// Run on an enhanced subscription PDP with normal motion via agent-browser eval --stdin.
// Checks intermediate geometry and interruption, not just settled states.
(async () => {
 const p=document.querySelector('product-detail'),field=p.querySelector('[data-plan-field]'), content=p.querySelector('[data-plan-content]');
 const once=p.querySelector('[value="once"]'), subscription=p.querySelector('[value="subscription"]');
 const settle=()=>new Promise(r=>setTimeout(r,250));
 once.click(); await settle();
 const samples=[]; subscription.click(); const start=performance.now();
 while(performance.now()-start<260){
 const f=field.getBoundingClientRect(),button=field.querySelector('button').getBoundingClientRect(),li=field.querySelector('li').getBoundingClientRect();
 samples.push({t:performance.now()-start,h:f.height,button:button.y-f.y,tick:li.y-f.y});await new Promise(requestAnimationFrame);
 }
 const spread=k=>Math.max(...samples.map(x=>x[k]))-Math.min(...samples.map(x=>x[k]));
 if(spread('button')>.02||spread('tick')>.02)throw Error('Content moved inside expanding group');
 once.click(); await new Promise(r=>setTimeout(r,75)); const before=field.getBoundingClientRect().height;subscription.click();const after=field.getBoundingClientRect().height;
 if(Math.abs(before-after)>.02)throw Error('Reversal jumped');await settle();
 const trigger=field.querySelector('button');trigger.focus();trigger.click();const menu=field.querySelector('[role="listbox"]');
 const result={width:innerWidth,buttonDrift:spread('button'),tickDrift:spread('tick'),reversalJump:after-before,height:field.getBoundingClientRect().height,overflow:getComputedStyle(field).overflow,menuVisible:!!menu&&!menu.hidden,selectedPlan:p.planSelect.value,pageOverflow:document.documentElement.scrollWidth>innerWidth};
 trigger.click();return result;
})()
