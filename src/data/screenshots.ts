export const screenshotVersion = '0.4.1';
export const screenshotCommit = 'e259bc3b84c86f01c935afd49b45b151d5a38600';
export function screenshotFile(kind: 'menu' | 'settings', locale: string, appearance: 'light' | 'dark') {
  return `${kind}-v${screenshotVersion}${locale === 'en' ? '-en' : ''}-${appearance}.png`;
}
