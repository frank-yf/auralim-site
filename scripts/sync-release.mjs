import { writeFile } from 'node:fs/promises';
const endpoint = 'https://api.github.com/repos/frank-yf/auralim-mac/releases/latest';
const response = await fetch(endpoint, {
  headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'auralim-site' },
  signal: AbortSignal.timeout(15_000),
});
if (!response.ok) throw new Error(`GitHub returned ${response.status}; saved release data was not changed.`);
const release = await response.json();
if (release.draft || release.prerelease) throw new Error('Expected a published stable release.');
const asset = (extension, required = true) => {
  const file = release.assets.find(item => item.name.endsWith(extension) && item.name.includes('universal'));
  if (!file && !required) return null;
  if (!file || !file.browser_download_url.startsWith(`https://github.com/frank-yf/auralim-mac/releases/download/${release.tag_name}/`)) throw new Error(`No verified universal ${extension} asset. Saved data was not changed.`);
  return file;
};
const dmg = asset('.dmg', false);
const zip = asset('.zip');
const sums = release.assets.find(item => item.name === 'SHA256SUMS.txt');
if (!sums || !sums.browser_download_url.startsWith(`https://github.com/frank-yf/auralim-mac/releases/download/${release.tag_name}/`)) throw new Error('No SHA256SUMS.txt; saved data was not changed.');
const data = { tag: release.tag_name, url: release.html_url, published: release.published_at, dmg: dmg?.browser_download_url ?? null, zip: zip.browser_download_url, checksums: sums.browser_download_url, size: (dmg ?? zip).size };
await writeFile(new URL('../src/data/release.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
console.log(`Saved ${data.tag} download metadata. Rebuild the site to use it.`);
