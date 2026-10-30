export const screenshotVersion = '0.5.2';
export const screenshotCommit = '02544664d3dfaec97eee6f782f3e2420433fe0f0';
export function screenshotFile(kind: 'menu' | 'settings', locale: string, appearance: 'light' | 'dark') {
  return `${kind}-v${screenshotVersion}${locale === 'en' ? '-en' : ''}-${appearance}.png`;
}
