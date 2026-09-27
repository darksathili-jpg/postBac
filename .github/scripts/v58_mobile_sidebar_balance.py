from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
marker = 'V5.8 — MOBILE SIDEBAR MARK BALANCE'

if marker in text:
    print('V5.8 already present')
    raise SystemExit(0)

css = '''

/* =========================================================
   V5.8 — MOBILE SIDEBAR MARK BALANCE
   Le mark partage l’en-tête de progression sur petit écran
   afin de préserver la compacité de la sidebar.
   ========================================================= */
@media(max-width:820px){
  .sidebar-brand-mark{
    position:absolute;
    top:8px;
    right:10px;
    left:auto;
    z-index:5;
    justify-content:flex-end;
    margin:0;
    padding:0;
    border-bottom:0;
  }
  .sidebar-brand-mark img{width:64px;height:48px}
  .progress-title{
    min-height:48px;
    padding-right:76px;
    align-items:center;
  }
}
@media(max-width:560px){
  .sidebar-brand-mark{top:8px;right:9px}
  .sidebar-brand-mark img{width:48px;height:36px}
  .progress-title{
    min-height:36px;
    padding-right:58px;
  }
}
'''

anchor = '\n</style>'
if anchor not in text:
    raise SystemExit('ERROR: </style> anchor not found')

text = text.replace(anchor, css + anchor, 1)
path.write_text(text, encoding='utf-8')
print('V5.8 mobile sidebar balance integrated')
