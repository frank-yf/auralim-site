export const screenshotVersion = '0.3.1';
export const screenshotCommit = '1c6d1358ef125d20d70be046dbd990a4947ec017';
export function screenshotFile(kind: 'menu' | 'settings', locale: string, appearance: 'light' | 'dark') {
  return `${kind}-v${screenshotVersion}${locale === 'en' ? '-en' : ''}-${appearance}.png`;
}
