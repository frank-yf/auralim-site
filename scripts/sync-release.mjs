import { writeFile } from 'node:fs/promises';
import { releaseMetadata } from './release-assets.mjs';
const endpoint = 'https://api.github.com/repos/frank-yf/auralim-mac/releases/latest';
const response = await fetch(endpoint, {
  headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'auralim-site' },
  signal: AbortSignal.timeout(15_000),
});
if (!response.ok) throw new Error(`GitHub returned ${response.status}; saved release data was not changed.`);
const release = await response.json();
const data = releaseMetadata(release);
await writeFile(new URL('../src/data/release.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
console.log(`Saved ${data.tag} download metadata. Rebuild the site to use it.`);
