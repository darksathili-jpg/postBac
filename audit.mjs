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
if (/\$\('\.site-nav a'\)\.forEach/.test(html)) fail('sélecteur JS incorrect sur la navigation');
const navAll = html.match(/all\('\.site-nav a'\)\.forEach/g) || [];
if (navAll.length !== 2) fail('navigation V5: helper all() attendu 2 fois, trouvé ' + navAll.length);
if (html.includes("assets/hero-watteau.webp")) fail('ancien hero V4 encore référencé');
ok('assets V5 présents, référencés et navigation JS cohérente');

/* Asset identity / cache-busting gate */
if (html.includes('assets/hero-desktop.png') || html.includes('assets/hero-mobile.png')) fail('anciens noms de hero non versionnés encore référencés');
if ((html.match(/DES CHOIX/g) || []).length !== 1) fail('le slogan DES CHOIX doit exister une seule fois dans le DOM');
if (html.includes('hero-slogan-clean')) fail('ancienne rustine hero-slogan-clean encore présente');
if (!/\.hero-slogan-desktop\{display:none\}/.test(html)) fail('le slogan doit être masqué par défaut, donc absent sur mobile');
if (!/@media\(min-width:821px\)[\s\S]*?\.hero-slogan-desktop\{[\s\S]*?display:block/.test(html)) fail('le slogan desktop doit être activé uniquement à partir de 821 px');
ok('cache-busting hero, unicité du slogan et garde mobile vérifiés');

if (!html.includes('id="exportProgressBtn"') || !html.includes('id="importProgressBtn"') || !html.includes('id="progressFileInput"')) fail('commandes sauvegarde/reprise JSON absentes');
if (!html.includes("application:'cap-post-bac'") || !html.includes('formatVersion:EXPORT_VERSION')) fail('enveloppe JSON versionnée absente');
if (!html.includes('cleanImportedState') || !html.includes('512*1024')) fail('validation défensive de l’import JSON absente');
if (!html.includes("accept=\".json,application/json\"")) fail('sélecteur de fichier JSON non contraint');
if (/if\(text\('#currentQuestion'\)\.length/.test(html)) fail('la question facultative bloque encore la validation');
if (!html.includes('sessionStorage.setItem(RESUME') || !html.includes('firstIncomplete(restored)')) fail('reprise automatique à la première étape incomplète absente');
ok('sauvegarde JSON portable, import validé et reprise automatique présents');

if (!html.includes('id="configToggle"') || !html.includes('id="configDialog"') || !html.includes('id="configClass"')) fail('interface de configuration classe/PP absente');
for (const tg of ['TG1','TG2','TG3','TG4','TG5','TG6','TG7','TG8']) if (!html.includes('<option>'+tg+'</option>')) fail('classe absente du sélecteur: '+tg);
if (!html.includes("CONFIG='postbac_config_v1'") || !html.includes("function cleanConfig(raw)")) fail('persistance/validation de la configuration absente');
if (!html.includes("searchParams.set('classe'") || !html.includes("searchParams.set('pp'")) fail('lien partagé configurable absent');
if (!html.includes("function sessionKey(c)") || !html.includes("'postbac_orientation_v1_'")) fail('sessions non isolées par classe');
if (!html.includes("application:'cap-post-bac'") || !html.includes('context:config')) fail('export JSON non généralisé avec contexte');
if (!html.includes("payload.application!=='cap-post-bac'&&payload.application!=='cap-post-bac-tg1'")) fail('compatibilité import JSON ancien/nouveau absente');
if (!html.includes("document.title='Cap Post-Bac · '+config.className")) fail('titre dynamique absent');
if (!html.includes("a.download=config.className+'_orientation_seance1_bilan.txt'")) fail('nom de bilan non dynamique');
ok('configuration TG1–TG8, professeur, groupe, lien partagé et sessions isolées vérifiés');


const selectorOne = "function $(s){return document.querySelector(s)}";
const selectorAll = "function all(s){return Array.prototype.slice.call(document.querySelectorAll(s))}";
if (!html.includes(selectorOne) || !html.includes(selectorAll)) fail('helpers DOM $ / all incorrects');
if ((html.match(/function \$\(s\)/g) || []).length !== 1) fail('helper $ défini plusieurs fois');
if ((html.match(/function all\(s\)/g) || []).length !== 1) fail('helper all défini un nombre incorrect de fois');
if (/\$\([^\n;]+\)\.(?:forEach|map)\(/.test(html)) fail('querySelector simple utilisé avec forEach/map');
if (!html.includes("var interestAllowed=all('#interests .pill').map(")) fail('sélecteur multiple intérêts incorrect');
if (!html.includes("var conditionAllowed=all('#conditions .pill').map(")) fail('sélecteur multiple conditions incorrect');
if (!html.includes("all('[data-save]').forEach(function(el)")) fail('réhydratation des champs non basée sur all()');
ok('helpers DOM $ / all et sélecteurs multiples vérifiés');

console.log('\nAudit statique terminé sans erreur.');
