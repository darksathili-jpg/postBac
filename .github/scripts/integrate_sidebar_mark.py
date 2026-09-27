from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
marker = 'V5.7 — MARK WATTEAU SIDEBAR'

if marker in text:
    print('V5.7 already present')
    raise SystemExit(0)

css = '''

/* =========================================================
   V5.7 — MARK WATTEAU SIDEBAR
   Source institutionnelle inchangée, tailles adaptées au viewport.
   ========================================================= */
.sidebar-brand-mark{
  position:relative;
  z-index:4;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:-2px 3px 9px;
  padding:5px 4px 9px;
  border-bottom:1px solid rgba(255,212,59,.34);
}
.sidebar-brand-mark picture{display:block;line-height:0}
.sidebar-brand-mark img{
  display:block;
  width:80px;
  height:60px;
  object-fit:contain;
  filter:drop-shadow(0 3px 8px rgba(0,0,0,.28));
}
html[data-theme="light"] .sidebar-brand-mark{border-bottom-color:rgba(139,23,48,.18)}
html[data-theme="light"] .sidebar-brand-mark img{filter:drop-shadow(0 2px 5px rgba(66,43,14,.14))}
@media(max-width:820px){
  .sidebar-brand-mark{justify-content:flex-start;margin:0 3px 7px;padding:1px 2px 7px}
  .sidebar-brand-mark img{width:64px;height:48px}
}
@media(max-width:560px){.sidebar-brand-mark img{width:48px;height:36px}}
'''

html = '''    <div class="sidebar-brand-mark" aria-label="Lycée Watteau Valenciennes">
      <picture>
        <source media="(max-width:560px)" srcset="assets/logo-watteau-mark-48.svg">
        <source media="(max-width:820px)" srcset="assets/logo-watteau-mark-64.svg">
        <img src="assets/logo-watteau-mark-80.svg" width="80" height="60" alt="Lycée Watteau Valenciennes" decoding="async">
      </picture>
    </div>
'''

style_anchor = '\n</style>'
sidebar_anchor = '  <aside class="sidebar" aria-label="Progression">\n'

if style_anchor not in text:
    raise SystemExit('ERROR: </style> anchor not found')
if sidebar_anchor not in text:
    raise SystemExit('ERROR: sidebar anchor not found')

text = text.replace(style_anchor, css + style_anchor, 1)
text = text.replace(sidebar_anchor, sidebar_anchor + html, 1)
path.write_text(text, encoding='utf-8')
print('V5.7 integrated')
