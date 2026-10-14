import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/theme.js', import.meta.url), 'utf8');
const start = source.indexOf('class PosterMotion extends HTMLElement');
const end = source.indexOf("if (!customElements.get('poster-motion'))", start);
const Motion = vm.runInNewContext(`${source.slice(start, end)}; PosterMotion`, {
  HTMLElement: class {},
});

for (const count of [4, 24, 252]) {
  test(`${count} section reveals stay finite, finish, and reverse continuously`, () => {
    const motion = new Motion();
    motion.revealAnimations = Array.from({ length: count }, () => ({ currentTime: 0 }));
    const frames = [];
    for (let step = 0; step <= 100; step++) {
      motion.currentProgress = step / 100;
      motion.applyProgress();
      const times = motion.revealAnimations.map(animation => animation.currentTime);
      times.forEach((time, index) => {
        assert.ok(Number.isFinite(time) && time >= 0 && time <= 1000);
        if (step) assert.ok(time >= frames[step - 1][index]);
        if (step === 0) assert.equal(time, 0);
        if (step >= 90) assert.equal(time, 1000);
      });
      frames.push(times);
    }
    for (let step = 100; step >= 0; step--) {
      motion.currentProgress = step / 100;
      motion.applyProgress();
      assert.deepEqual(motion.revealAnimations.map(animation => animation.currentTime), frames[step]);
    }
  });
}
