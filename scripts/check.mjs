import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('dist');
const required = ['index.html', 'ar/index.html', 'styles.css', 'app.js', 'robots.txt', 'sitemap.xml', 'llms.txt', 'assets/logo-en-light.png', 'assets/logo-ar-light.png', 'assets/noto-sans-arabic.woff2', 'assets/hero-architecture.webp'];
for (const file of required) await access(resolve(root, file));

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const arabic = await readFile(resolve(root, 'ar/index.html'), 'utf8');
const checks = [
  ['single h1', (html.match(/<h1\b/g) || []).length === 1],
  ['page title', /<title>[^<]{20,}<\/title>/.test(html)],
  ['meta description', /name="description" content="[^\"]{80,}/.test(html)],
  ['structured data', /application\/ld\+json/.test(html)],
  ['skip link', /class="skip-link"/.test(html)],
  ['local hero', /assets\/hero-architecture\.webp/.test(html)],
  ['local logo', /assets\/logo-en-light\.png/.test(html)],
  ['Arabic page RTL', /<html lang="ar" dir="rtl">/.test(arabic)],
  ['Arabic local logo', /assets\/logo-ar-light\.png/.test(arabic)],
  ['language switch', /class="language-switch"/.test(html) && /class="language-switch"/.test(arabic)],
  ['hero style comparison', /data-hero-style="warm"/.test(html) && /data-hero-style="charcoal"/.test(html)],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [name, ok] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
if (failed.length) process.exit(1);
