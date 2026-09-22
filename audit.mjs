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

const visualAssets = [
  ['assets/hero-desktop.4b21e409.png', 1000000],
  ['assets/hero-mobile.7474f557.png', 1000000],
  ['assets/logo-watteau.png', 200000],
  ['assets/parcours-sticker.png', 200000]
];
for (const [path, minSize] of visualAssets) {
  if (!fs.existsSync(path)) fail('asset visuel absent: ' + path);
  if (fs.statSync(path).size < minSize) fail('asset visuel anormalement petit: ' + path);
  if (!html.includes(path)) fail('asset visuel non référencé dans index.html: ' + path);
}
if (/(?<!\$)\$\('\.site-nav a'\)\.forEach/.test(html)) fail('sélecteur JS incorrect sur la navigation');
const navAll = html.match(/\$\$\('\.site-nav a'\)\.forEach/g) || [];
if (navAll.length !== 2) fail('navigation V5: querySelectorAll attendu 2 fois, trouvé ' + navAll.length);
if (html.includes("assets/hero-watteau.webp")) fail('ancien hero V4 encore référencé');
ok('assets V5 présents, référencés et navigation JS cohérente');

/* Asset identity / cache-busting gate */
if (html.includes('assets/hero-desktop.png') || html.includes('assets/hero-mobile.png')) fail('anciens noms de hero non versionnés encore référencés');
if ((html.match(/DES CHOIX/g) || []).length !== 1) fail('le slogan DES CHOIX doit exister une seule fois dans le DOM');
if (html.includes('hero-slogan-clean')) fail('ancienne rustine hero-slogan-clean encore présente');
if (!/\.hero-slogan-desktop\{display:none\}/.test(html)) fail('le slogan doit être masqué par défaut, donc absent sur mobile');
if (!/@media\(min-width:821px\)[\s\S]*?\.hero-slogan-desktop\{[\s\S]*?display:block/.test(html)) fail('le slogan desktop doit être activé uniquement à partir de 821 px');
ok('cache-busting hero, unicité du slogan et garde mobile vérifiés');

console.log('\nAudit statique terminé sans erreur.');
