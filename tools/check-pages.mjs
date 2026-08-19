#!/usr/bin/env node
/* Read-only parity linter for the 7 hand-authored case pages.
   Generates nothing — it only verifies, so the "no build step" claim stays true.
   Run manually before each deploy:  node tools/check-pages.mjs                */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'projects');
const SLUGS = ['suaraku', 'kastanews', 'pentest', 'distributed', 'oop', 'algo', 'mikrotik'];

const MUST_CONTAIN = [
  ['<html lang="en">', 'lang attribute'],
  ["localStorage.getItem('theme')", 'pre-paint theme script'],
  ["sessionStorage.setItem('bg", 'loader-skip flag'],
  ['<link rel="canonical" href="https://brilliantgibranportofolio.my.id/projects/', 'canonical'],
  ['application/ld+json', 'JSON-LD'],
  ['/shared/case.css', 'case stylesheet'],
  ['/shared/anatomy.css', 'anatomy stylesheet'],
  ['/shared/anatomy.js', 'anatomy script'],
  ['view-transition-name: p-', 'VT morph name'],
  ['id="main"', 'main landmark'],
  ['<h1', 'h1'],
  ['id="evidence"', 'evidence section'],
  ['mailto:brilliantgibran16@gmail.com', 'artifact request CTA'],
];

let fail = 0;
const files = readdirSync(DIR).filter(f => f.endsWith('.html'));
for (const slug of SLUGS) {
  if (!files.includes(slug + '.html')) {
    console.warn(`⚠ missing page: projects/${slug}.html`);
    continue; /* pages ship incrementally — missing is a warning, not a failure */
  }
  const html = readFileSync(join(DIR, slug + '.html'), 'utf8');
  for (const [needle, label] of MUST_CONTAIN) {
    if (!html.includes(needle)) { console.error(`✗ ${slug}: missing ${label}`); fail++; }
  }
  if (!html.includes(`p-${slug}`)) { console.error(`✗ ${slug}: VT name does not match slug`); fail++; }
  const h1s = html.split('<h1').length - 1;
  if (h1s !== 1) { console.error(`✗ ${slug}: expected exactly 1 h1, found ${h1s}`); fail++; }
  if (/href="[^"]*\.html"/.test(html)) { console.error(`✗ ${slug}: .html link found — use extensionless (cleanUrls)`); fail++; }
}
console.log(fail === 0 ? `✓ ${files.length} page(s) checked, parity clean` : `${fail} problem(s) found`);
process.exit(fail === 0 ? 0 : 1);
