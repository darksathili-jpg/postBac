import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const fail = (msg) => { throw new Error(msg); };
const ok = (msg) => console.log('✓ ' + msg);

if (!html.startsWith('<!doctype html>')) fail('DOCTYPE manquant');
if (!html.includes('lang="fr"')) fail('lang=fr manquant');
ok('document HTML français');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
const dup = ids.filter((x,i,a) => a.indexOf(x) !== i);
if (dup.length) fail('IDs dupliqués: ' + [...new Set(dup)].join(', '));
ok(ids.length + ' IDs uniques');

const idSet = new Set(ids);
for (const m of html.matchAll(/<label[^>]*\sfor="([^"]+)"/g)) {
  if (!idSet.has(m[1])) fail('label for sans cible: ' + m[1]);
}
ok('labels reliés aux champs');

for (const m of html.matchAll(/data-target="([^"]+)"/g)) {
  if (!idSet.has(m[1])) fail('navigation sans cible: ' + m[1]);
}
ok('navigation interne cohérente');

const steps = [...html.matchAll(/<section class="[^"]*\bstep\b[^"]*" id="step(\d)" data-step="\1"/g)].map(m => Number(m[1]));
if (steps.join(',') !== '1,2,3,4,5,6,7') fail('les 7 étapes ne sont pas présentes dans l’ordre');
ok('7 étapes pédagogiques présentes');

const complete = [...html.matchAll(/data-complete="(\d)"/g)].map(m => Number(m[1]));
if (complete.join(',') !== '1,2,3,4,5,6,7') fail('boutons de validation incomplets');
ok('7 validations présentes');

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) fail('script principal absent');
for (const s of scripts) new Function(s);
ok('JavaScript syntaxiquement valide');

if (/<script[^>]+src=/i.test(html)) fail('JavaScript externe détecté');
if (/<link[^>]+rel=["']stylesheet/i.test(html)) fail('CSS externe détecté');
ok('aucune dépendance front-end externe');

const required = [
  'https://www.education.gouv.fr/bo/2025/Hebdo27/MENE2519127N',
  'https://www.onisep.fr/',
  'https://www.parcoursup.gouv.fr/',
  'https://eduscol.education.gouv.fr/'
];
for (const url of required) if (!html.includes(url)) fail('source institutionnelle absente: ' + url);
ok('sources institutionnelles présentes');

if (!html.includes('prefers-reduced-motion')) fail('gestion reduced-motion absente');
if (!html.includes(':focus-visible')) fail('focus visible absent');
if (!html.includes('@media print')) fail('mode impression absent');
ok('garde-fous accessibilité / impression présents');

if (!html.includes('sessionStorage')) fail('sessionStorage absent');
if (!html.includes('Rien n’est envoyé à un serveur')) fail('information confidentialité absente');
ok('confidentialité locale explicitée');

console.log('\nAudit statique terminé sans erreur.');
