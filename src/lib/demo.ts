export type Mode = 'light' | 'auto' | 'dark';
export type SolarEvent = 'sunrise' | 'sunset';
export const example = { sunrise: 6 * 60 + 12, sunset: 17 * 60 + 58 };
export function clampOffset(value: number) { return Number.isFinite(value) ? Math.max(-120, Math.min(120, Math.round(value))) : 0; }
export function offsetFromTrack(value: number) { return clampOffset(value); }
// Matches SolarOffset.parse: signed whole minutes, Unicode minus, trimming, clamping.
export function parseOffset(text: string): number | null {
  const normalized = text.trim().replaceAll('−', '-');
  if (!/^[+-]?\d+$/.test(normalized)) return null;
  const value = Number(normalized);
  return Number.isSafeInteger(value) ? clampOffset(value) : null;
}
export function offsetInputText(value: number) { return value > 0 ? `+${value}` : String(value); }
export function offsetTrack(minutes: number, event: SolarEvent, dark: boolean) {
  const position = 50 + clampOffset(minutes) / 2.4;
  const base = dark ? [64, 69, 82] : [222, 224, 230];
  const towardLight = event === 'sunrise' ? position > 50 : position < 50;
  const end = towardLight ? [255, 214, 133] : dark ? [112, 153, 224] : [87, 120, 186];
  const strength = Math.sqrt(Math.abs(position - 50) / 50);
  const color = `rgb(${base.map((value, i) => Math.round(value + (end[i] - value) * strength)).join(', ')})`;
  return { position, base: `rgb(${base.join(', ')})`, color };
}
export function formatTime(minutes: number) {
  const value = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`;
}
export function appearanceAt(time: number, sunriseOffset = 0, sunsetOffset = 0, mode: Mode = 'auto') {
  if (mode !== 'auto') return mode;
  return time >= example.sunrise + clampOffset(sunriseOffset) && time < example.sunset + clampOffset(sunsetOffset) ? 'light' : 'dark';
}
