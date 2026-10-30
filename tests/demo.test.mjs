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
test('both sliders move earlier to the left and later to the right', () => {
  assert.equal(offsetFromTrack(-120),-120);
  assert.equal(offsetFromTrack(45),45);
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
    assert.equal(offsetTrack(-120,'sunrise',dark).position,0);
    assert.equal(offsetTrack(120,'sunrise',dark).position,100);
    assert.equal(offsetTrack(120,'sunrise',dark).color,'rgb(255, 214, 133)');
    assert.equal(offsetTrack(-120,'sunset',dark).color,'rgb(255, 214, 133)');
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

test('desktop celestial disks and landing points stay inside the dense sky', async () => {
  const { celestialPosition, celestialRadius } = await import('../src/lib/transition.ts');
  for (const [width, height] of [[1382, 840], [374, 709], [810, 328], [307, 480]]) {
    const radius = celestialRadius(height);
    for (const rising of [true, false]) for (let step = 0; step <= 20; step++) {
      const center = celestialPosition(step / 20, rising, width, height);
      for (let edge = 0; edge < 24; edge++) {
        const angle = edge / 24 * Math.PI * 2;
        const x = center.x + radius * Math.cos(angle), y = center.y + radius * Math.sin(angle);
        const distance = Math.hypot((x - width * .5) / (width * .52), (y - height) / (height * .98));
        assert.ok(distance < .66, `Disk must stay inside the dense sky (${width}x${height}, ${distance})`);
        assert.ok(x >= width * .08 && x <= width * .92 && y >= height * .17 && y <= height * .83,
          'Bodies must avoid the final screen-edge fade');
      }
    }
  }
});

test('compact sun and moon enter and exit from the sides on a level path', async () => {
  const { compactCelestialPosition, compactCelestialRadius } = await import('../src/lib/transition.ts');
  for (const [width,height] of [[390,281],[320,190],[570,100]]) {
    const radius = compactCelestialRadius(width,height);
    assert.ok(radius <= height * .22 && radius <= width * .13);
    const entering = Array.from({length:21},(_,i)=>compactCelestialPosition(i/20,true,width,height));
    const leaving = Array.from({length:21},(_,i)=>compactCelestialPosition(i/20,false,width,height));
    assert.ok(entering[0].x + radius < 0 && leaving.at(-1).x - radius > width);
    assert.equal(entering.at(-1).x,width/2); assert.equal(leaving[0].x,width/2);
    for(const points of [entering,leaving])for(let i=0;i<points.length;i++) {
      assert.equal(points[i].y,height/2);
      if(i)assert.ok(points[i].x>points[i-1].x);
    }
  }
});


test('every signed offset keeps the same clock direction when round-tripped through the slider', async () => {
  const { offsetTrack } = await import('../src/lib/demo.ts');
  for (let minute = -120; minute <= 120; minute++) {
    assert.equal(offsetFromTrack(minute), minute);
    assert.ok(Math.abs(offsetTrack(minute, 'sunrise', false).position - (minute + 120) / 2.4) < 1e-10);
  }
});
