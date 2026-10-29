/** Select only standard assets; debug archives share the same GitHub Release. */
export function releaseMetadata(release) {
  if (release.draft || release.prerelease || !/^v\d+\.\d+\.\d+$/.test(release.tag_name)) {
    throw new Error('Expected a published stable versioned release.');
  }
  const version = release.tag_name.slice(1);
  const prefix = `https://github.com/frank-yf/auralim-mac/releases/download/${release.tag_name}/`;
  const asset = (name, required = true) => {
    const file = release.assets.find(item => item.name === name);
    if (!file && !required) return null;
    if (!file || file.browser_download_url !== prefix + name) throw new Error(`No verified standard ${name} asset.`);
    return file;
  };
  const dmg = asset(`Auralim-${version}-macos-universal.dmg`, false);
  const zip = asset(`Auralim-${version}-macos-universal.zip`);
  const sums = asset('SHA256SUMS.txt');
  return { tag: release.tag_name, url: release.html_url, published: release.published_at,
    dmg: dmg?.browser_download_url ?? null, zip: zip.browser_download_url, checksums: sums.browser_download_url, size: (dmg ?? zip).size };
}
