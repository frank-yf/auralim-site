import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseMetadata } from '../scripts/release-assets.mjs';
const tag = 'v0.5.1', prefix = `https://github.com/frank-yf/auralim-mac/releases/download/${tag}/`;
const asset = name => ({name,browser_download_url:prefix+name,size:123456});
const fixture = () => ({tag_name:tag,draft:false,prerelease:false,html_url:`https://github.com/frank-yf/auralim-mac/releases/tag/${tag}`,
  published_at:'2026-10-29T12:00:00Z',assets:[asset('Auralim-0.5.1-debug-macos-universal.zip'),asset('SHA256SUMS-debug.txt'),
    asset('Auralim-0.5.1-macos-universal.zip'),asset('Auralim-0.5.1-macos-universal.dmg'),asset('SHA256SUMS.txt')]});
test('public downloads select standard packages even when the debug ZIP is first',()=>{
  const result=releaseMetadata(fixture());
  assert.equal(result.zip,prefix+'Auralim-0.5.1-macos-universal.zip');
  assert.equal(result.dmg,prefix+'Auralim-0.5.1-macos-universal.dmg');
  assert.equal(result.checksums,prefix+'SHA256SUMS.txt');
});
test('debug ZIP never substitutes for a missing standard ZIP',()=>{
  const release=fixture();release.assets=release.assets.filter(a=>a.name!=='Auralim-0.5.1-macos-universal.zip');
  assert.throws(()=>releaseMetadata(release),/No verified standard/);
});
test('optional DMG fallback stays standard and refuses cross-release asset paths',()=>{
  const release=fixture();release.assets=release.assets.filter(a=>!a.name.endsWith('.dmg'));
  assert.equal(releaseMetadata(release).dmg,null);
  release.assets.find(a=>a.name==='Auralim-0.5.1-macos-universal.zip').browser_download_url=prefix.replace(tag,'v0.4.1')+'Auralim-0.5.1-macos-universal.zip';
  assert.throws(()=>releaseMetadata(release),/No verified standard/);
});
