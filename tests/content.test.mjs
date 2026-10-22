import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { content, locales } from '../src/i18n/content.ts';
import { supportedAppLanguages } from '../src/data/languages.ts';

test('only simplified Chinese and English ship with matching content structure', () => {
  assert.deepEqual([...locales],['zh-CN','en']);
  assert.deepEqual(Object.keys(content['zh-CN']).sort(),Object.keys(content.en).sort());
  for (const locale of locales) {
    assert.equal(content[locale].modes.length,3);
    assert.equal(content[locale].faq.length,6);
    assert.equal(content[locale].features.length,4);
    assert.equal(content[locale].offsetLabels.length,2);
    for (const value of Object.values(content[locale])) assert.ok(value.length>0);
  }
});
test('download metadata supports a universal ZIP release without a DMG', async () => {
  const release=JSON.parse(await readFile(new URL('../src/data/release.json',import.meta.url),'utf8'));
  assert.match(release.tag,/^v\d+\.\d+\.\d+$/);
  for (const [field,suffix] of [['dmg','.dmg'],['zip','.zip'],['checksums','SHA256SUMS.txt']]) {
    if (field === 'dmg' && release.dmg === null) continue;
    const url=new URL(release[field]);
    assert.equal(url.hostname,'github.com');
    assert.ok(url.pathname.startsWith(`/frank-yf/auralim-mac/releases/download/${release.tag}/`));
    assert.ok(url.pathname.endsWith(suffix));
    if(field!=='checksums') assert.ok(url.pathname.includes('universal'));
  }
  assert.ok(release.size>0);
});

test('app language list contains all 12 supported locales in release order', () => {
  assert.deepEqual(supportedAppLanguages.map(language => language.locale), ['en','zh-Hans','ja','zh-Hant','de','fr','es','pt-BR','ko','it','ru','nl']);
  assert.equal(new Set(supportedAppLanguages.map(language => language.name)).size,12);
});
