export const screenshotVersion = '0.5.3';
export const screenshotCommit = '4c855f26440e887696b217056bcd2f9d5523b691';
export function screenshotFile(kind: 'menu' | 'settings', locale: string, appearance: 'light' | 'dark') {
  return `${kind}-v${screenshotVersion}${locale === 'en' ? '-en' : ''}-${appearance}.png`;
}
