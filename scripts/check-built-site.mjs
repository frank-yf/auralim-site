import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
const base = `/${(process.argv[2] || '').replace(/^\/+|\/+$/g, '')}`.replace(/\/?$/, '/');
const site = new URL(base, 'https://frank-yf.github.io');
const resources = new Set();
const release = JSON.parse(await readFile('src/data/release.json', 'utf8'));
const { supportedAppLanguages } = await import('../src/data/languages.ts');
const { screenshotFile } = await import('../src/data/screenshots.ts');
for (const [path, language] of [['', 'zh-CN'], ['en/', 'en']]) {
  const html = await readFile(resolve(root, path, 'index.html'), 'utf8');
  assert.match(html, new RegExp(`<html[^>]*lang="${language}"`));
  const page = new URL(path, site);
  const download = release.dmg ?? release.zip;
  assert.ok(html.includes(release.tag), 'Missing current release version');
  assert.ok(html.split(`href="${download}"`).length - 1 >= 2, 'Hero and footer must use the current downloadable package');
  assert.equal((html.match(/data-app-locale=/g) ?? []).length, 12);
  for (const language of supportedAppLanguages) assert.ok(html.includes(`data-app-locale="${language.locale}"`));

  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  assert.equal(canonical?.[1], page.href, `Incorrect canonical URL for ${language}`);
  for (const [id, kind] of [['menu-screenshot', 'menu'], ['app-screenshot', 'settings']]) {
    const image = html.match(new RegExp(`<img[^>]*id="${id}"[^>]*>`))?.[0];
    assert.ok(image, `Missing ${kind} capture for ${language}`);
    for (const [attribute, appearance] of [['src', 'light'], ['data-light-src', 'light'], ['data-dark-src', 'dark']]) {
      const value = image.match(new RegExp(`(?:^|\\s)${attribute}="([^"]+)"`))?.[1];
      const name = screenshotFile(kind, language, appearance);
      assert.equal(value, new URL(`images/${name}`, site).pathname, `Wrong screenshot language/path: ${language} ${attribute}`);
    }
  }
  const urls = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
  for (const value of urls) {
    if (value.startsWith('#') || value.startsWith('data:')) continue;
    const url = new URL(value, page);
    if (url.origin !== site.origin) continue;
    assert.ok(url.pathname.startsWith(base), `Missing project prefix: ${url.href}`);
    const relative = decodeURIComponent(url.pathname.slice(base.length));
    const file = resolve(root, relative, url.pathname.endsWith('/') ? 'index.html' : '');
    assert.ok(file.startsWith(root + sep), `Resource escaped build output: ${value}`);
    assert.ok((await stat(file)).isFile(), `Missing built resource: ${value}`);
    resources.add(url.pathname);
  }
  const shareImage = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
  assert.equal(shareImage?.[1], new URL('images/social-card.png', site).href);
  console.log(`PASS ${language}: ${page.pathname}`);
}
console.log(`PASS ${resources.size} unique local routes/assets under ${base}`);
