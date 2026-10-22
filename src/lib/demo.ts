export type Mode = 'light' | 'auto' | 'dark';
export const example = { sunrise: 6 * 60 + 12, sunset: 17 * 60 + 58 };
export function clampOffset(value: number) { return Math.max(-120, Math.min(120, Math.round(value))); }
export function offsetFromTrack(value: number) { return -clampOffset(value); }
export function formatTime(minutes: number) {
  const value = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`;
}
export function appearanceAt(time: number, sunriseOffset = 0, sunsetOffset = 0, mode: Mode = 'auto') {
  if (mode !== 'auto') return mode;
  return time >= example.sunrise + clampOffset(sunriseOffset) && time < example.sunset + clampOffset(sunsetOffset) ? 'light' : 'dark';
}
