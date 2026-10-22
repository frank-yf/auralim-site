import test from 'node:test';
import assert from 'node:assert/strict';
import { appearanceAt, clampOffset, example, formatTime, offsetFromTrack } from '../src/lib/demo.ts';

test('auto changes at sunrise and sunset, including their boundaries', () => {
  assert.equal(appearanceAt(example.sunrise - 1), 'dark');
  assert.equal(appearanceAt(example.sunrise), 'light');
  assert.equal(appearanceAt(example.sunset - 1), 'light');
  assert.equal(appearanceAt(example.sunset), 'dark');
  assert.equal(appearanceAt(0), 'dark');
  assert.equal(appearanceAt(1439), 'dark');
});
test('manual appearance overrides the example time and offsets', () => {
  assert.equal(appearanceAt(0,120,-120,'light'), 'light');
  assert.equal(appearanceAt(720,-120,120,'dark'), 'dark');
});
test('both sliders move later to the left and earlier to the right', () => {
  assert.equal(offsetFromTrack(-120),120);
  assert.equal(offsetFromTrack(45),-45);
  assert.equal(appearanceAt(example.sunrise,60,0), 'dark');
  assert.equal(appearanceAt(example.sunrise-60,-60,0), 'light');
  assert.equal(appearanceAt(example.sunset,0,60), 'light');
  assert.equal(appearanceAt(example.sunset-60,0,-60), 'dark');
});
test('offset input is bounded and times stay in the 24-hour range', () => {
  assert.equal(clampOffset(999),120);
  assert.equal(clampOffset(-999),-120);
  assert.equal(clampOffset(1.7),2);
  assert.equal(formatTime(-1),'23:59');
  assert.equal(formatTime(1440),'00:00');
  assert.equal(formatTime(example.sunrise+120),'08:12');
  assert.equal(formatTime(example.sunset-120),'15:58');
});

test('native offset fields accept signed whole minutes and reject incomplete or fractional input', async () => {
  const { parseOffset, offsetInputText } = await import('../src/lib/demo.ts');
  for (const [text, value] of [['0',0],[' +37 ',37],['−10',-10],['999',120],['-999',-120]]) assert.equal(parseOffset(text),value);
  for (const text of ['', ' ', '-', '+', '1.5', '1e2', '12 min', 'NaN']) assert.equal(parseOffset(text),null);
  assert.equal(offsetInputText(37),'+37'); assert.equal(offsetInputText(-10),'-10');
});
test('native slider gradients start neutral and reverse warmth for sunrise and sunset', async () => {
  const { offsetTrack } = await import('../src/lib/demo.ts');
  for (const dark of [false,true]) {
    assert.equal(offsetTrack(0,'sunrise',dark).color,offsetTrack(0,'sunrise',dark).base);
    assert.equal(offsetTrack(-120,'sunrise',dark).position,100);
    assert.equal(offsetTrack(120,'sunrise',dark).position,0);
    assert.equal(offsetTrack(-120,'sunrise',dark).color,'rgb(255, 214, 133)');
    assert.equal(offsetTrack(120,'sunset',dark).color,'rgb(255, 214, 133)');
    assert.equal(offsetTrack(10,'sunrise',dark).color,offsetTrack(-10,'sunset',dark).color);
    assert.notEqual(offsetTrack(5,'sunrise',dark).color,offsetTrack(0,'sunrise',dark).color);
  }
});
test('sun and moon follow the native east-to-west rising and setting arcs', async () => {
  const { celestialPosition, transitionDuration } = await import('../src/lib/transition.ts');
  assert.equal(transitionDuration,3200);
  for (const rising of [true,false]) {
    const points=Array.from({length:11},(_,i)=>celestialPosition(i/10,rising,1000,600));
    for(let i=1;i<points.length;i++) assert.ok(points[i].x>points[i-1].x);
    if(rising) assert.ok(points.at(-1).y<points[0].y); else assert.ok(points.at(-1).y>points[0].y);
  }
  assert.ok(Math.abs(celestialPosition(1,true,1000,600).x-500)<0.001);
  assert.ok(Math.abs(celestialPosition(0,false,1000,600).x-500)<0.001);
});
