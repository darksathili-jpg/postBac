from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
marker = 'V5.9 — GLOBAL VISUAL BALANCE'

if marker in text:
    print('V5.9 already present')
    raise SystemExit(0)

css = '''

/* =========================================================
   V5.9 — GLOBAL VISUAL BALANCE
   Hors hero et mark Watteau : rythme global + restauration
   stricte de la hiérarchie visuelle en mode clair.
   ========================================================= */
.layout{gap:18px}
.step{margin-bottom:18px}
.step:not(.step-one){padding:27px 28px}
.card,.quiz,.mission,.callout,details.refs{
  box-shadow:inset 0 1px 0 rgba(255,255,255,.03),0 7px 18px rgba(0,0,0,.10);
}

/* Les surcharges V4/V5 tardives ne doivent jamais annuler le thème clair. */
html[data-theme="light"] .step:not(.step-one){
  background:linear-gradient(180deg,#fffaf0 0%,#fff6e7 100%);
  color:#142c41;
  border-color:#c6a257;
  box-shadow:0 12px 28px rgba(83,57,18,.10);
}
html[data-theme="light"] .card,
html[data-theme="light"] .quiz,
html[data-theme="light"] details.refs{
  background:#fffdf8;
  color:#173049;
  border-color:#c8ad7b;
  box-shadow:0 5px 14px rgba(83,57,18,.07);
}
html[data-theme="light"] .mission{
  background:linear-gradient(115deg,#fffaf0,#fff3dc);
  color:#173049;
  border-color:#c2a76f;
  border-left-color:var(--red);
}
html[data-theme="light"] .callout{
  background:#edf5f7;
  color:#183148;
  border-color:#8fa9b8;
}
html[data-theme="light"] .teacher{
  background:#fff1bf;
  color:#4e3d18;
  border-color:#c89818;
}
html[data-theme="light"] .pill{
  background:#fffaf1;
  color:#173049;
  border-color:#c5ab7b;
}
html[data-theme="light"] .pill[aria-pressed="true"]{
  background:linear-gradient(180deg,#ffe98a,#ffd95b);
  color:#5b3d00;
  border-color:#b67e0a;
  box-shadow:0 0 0 1px rgba(182,126,10,.10);
}
html[data-theme="light"] .quizactions button{
  background:#fff;
  color:#173049;
  border-color:#baa57e;
}
html[data-theme="light"] .sources a{
  background:#fff;
  color:#174469;
  border-color:#aa956d;
}

@media(max-width:820px){
  .layout{gap:0}
  .step{margin-bottom:12px}
  .step:not(.step-one){padding:20px 16px}
  .card,.quiz,.mission,.callout,details.refs{box-shadow:none}
}
'''

anchor = '\n</style>'
if anchor not in text:
    raise SystemExit('ERROR: </style> anchor not found')

text = text.replace(anchor, css + anchor, 1)
path.write_text(text, encoding='utf-8')
print('V5.9 global visual balance integrated')
