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
