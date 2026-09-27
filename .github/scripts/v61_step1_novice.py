from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
marker = 'V6.1 — STEP 1 NOVICE GUIDANCE'
if marker in text:
    print('V6.1 already present')
    raise SystemExit(0)

css = '''

/* =========================================================
   V6.1 — STEP 1 NOVICE GUIDANCE
   Guidage explicite, feedback visible, contradiction facultatif/obligatoire supprimée.
   ========================================================= */
.step1-guide{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:8px;
  margin:10px 0 12px;
}
.step1-guide div{
  display:grid;
  grid-template-columns:28px 1fr;
  gap:8px;
  align-items:center;
  padding:9px 10px;
  border:1px solid #466f8b;
  border-radius:7px;
  background:#0a2a43;
  color:#dceaf3;
  font-size:.78rem;
}
.step1-guide b{
  width:28px;height:28px;display:grid;place-items:center;border-radius:50%;
  background:var(--gold);color:#132030;font-weight:950;
}
.step1-ready{
  margin:8px 0 2px;
  min-height:22px;
  color:#a9c2d2;
  font-size:.78rem;
}
.step1-ready.ok{color:#8ee5c5;font-weight:800}
html[data-theme="light"] .step1-guide div{background:#fff7e8;color:#173049;border-color:#bba171}
html[data-theme="light"] .step1-ready{color:#5f6f79}
html[data-theme="light"] .step1-ready.ok{color:#17634f}
@media(max-width:820px){
  .step1-guide{grid-template-columns:1fr;gap:6px}
  .step1-guide div{padding:8px 9px}
}
'''

html_anchor = '''      <div class="teacher"><strong>Guide PP — 5 min.</strong> Poser le contrat : aucun élève n’a à « avoir déjà trouvé ». Faire verbaliser qu’une orientation solide repose sur des hypothèses à tester, pas sur une certitude précoce.<div class="mapping"><span>Se découvrir</span><span>Se projeter</span><span>Expliciter une question</span></div></div>\n      <p class="clarity-label"><strong>Mon niveau de clarté aujourd’hui :</strong></p>'''
html_repl = '''      <div class="teacher"><strong>Guide PP — 5 min.</strong> Poser le contrat : aucun élève n’a à « avoir déjà trouvé ». Faire verbaliser qu’une orientation solide repose sur des hypothèses à tester, pas sur une certitude précoce.<div class="mapping"><span>Se découvrir</span><span>Se projeter</span><span>Expliciter une question</span></div></div>\n      <div class="step1-guide" aria-label="Les trois actions de cette étape">\n        <div><b>1</b><span>Choisis le nombre qui décrit le mieux où tu en es aujourd’hui.</span></div>\n        <div><b>2</b><span>Écris une phrase, même si ton projet est encore flou.</span></div>\n        <div><b>3</b><span>Ajoute une question seulement si tu en as déjà une.</span></div>\n      </div>\n      <p class="clarity-label"><strong>1. Mon niveau de clarté aujourd’hui :</strong></p>'''
if html_anchor not in text:
    raise SystemExit('ERROR: step1 guide anchor not found')
text = text.replace(html_anchor, html_repl, 1)

text = text.replace('<label for="startingPoint">Si je devais répondre en une phrase aujourd’hui…</label>', '<label for="startingPoint">2. Si je devais répondre en une phrase aujourd’hui…</label>', 1)
text = text.replace('<summary>+ Ma question d’orientation du moment <span>(facultatif)</span></summary>', '<summary>3. Ma question d’orientation du moment <span>(facultatif)</span></summary>', 1)

button_anchor = '''      <div class="step-one-footer"><p>« Mieux se connaître, c’est déjà avancer. »</p><span aria-hidden="true"></span></div>\n      <div class="validation" id="v1"></div><button class="complete next-v4" data-complete="1">Suivant →</button>'''
button_repl = '''      <div class="step1-ready" id="step1Ready" aria-live="polite">À faire : choisis un niveau puis écris une phrase.</div>\n      <div class="step-one-footer"><p>« Mieux se connaître, c’est déjà avancer. »</p><span aria-hidden="true"></span></div>\n      <div class="validation" id="v1"></div><button class="complete next-v4" data-complete="1">Étape 1 terminée →</button>'''
if button_anchor not in text:
    raise SystemExit('ERROR: step1 button anchor not found')
text = text.replace(button_anchor, button_repl, 1)

# Remove the false mandatory requirement on the explicitly optional question.
old_req = "if(n===1){if(!state.clarityStart)return 'Choisis ton niveau de clarté.';if(text('#startingPoint').length<8)return 'Écris une phrase sur ton point de départ.';if(text('#currentQuestion').length<5)return 'Formule au moins une question.'}"
new_req = "if(n===1){if(!state.clarityStart)return 'Commence par choisir ton niveau de clarté.';if(text('#startingPoint').length<8)return 'Écris au moins une courte phrase sur ton point de départ.';}"
if old_req not in text:
    raise SystemExit('ERROR: step1 validation anchor not found')
text = text.replace(old_req, new_req, 1)

# Live completion cue: the learner knows what remains before pressing the button.
js_anchor = "bindCounter('#startingPoint','#startingPointCount',500);\n"
js_add = '''bindCounter('#startingPoint','#startingPointCount',500);\nfunction updateStep1Ready(){\n  var out=$('#step1Ready');if(!out)return;\n  var hasLevel=!!state.clarityStart, hasText=text('#startingPoint').length>=8;\n  if(hasLevel&&hasText){out.textContent='Prêt : tu peux terminer cette étape. La question reste facultative.';out.classList.add('ok');}\n  else{var missing=[];if(!hasLevel)missing.push('choisis un niveau');if(!hasText)missing.push('écris une phrase');out.textContent='À faire : '+missing.join(' puis ')+'.';out.classList.remove('ok');}\n}\n$('#startingPoint').addEventListener('input',updateStep1Ready);\n$('#clarityStart').querySelectorAll('button').forEach(function(b){b.addEventListener('click',updateStep1Ready)});\n'''
if js_anchor not in text:
    raise SystemExit('ERROR: counter anchor not found')
text = text.replace(js_anchor, js_add, 1)

# updateStep1Ready depends on text(), declared a little later; call it after text() exists.
text_anchor = "function text(id){var e=$(id);return e?e.value.trim():''}\n"
text_repl = "function text(id){var e=$(id);return e?e.value.trim():''}\nupdateStep1Ready();\n"
if text_anchor not in text:
    raise SystemExit('ERROR: text helper anchor not found')
text = text.replace(text_anchor, text_repl, 1)

style_anchor = '\n</style>'
if style_anchor not in text:
    raise SystemExit('ERROR: style anchor not found')
text = text.replace(style_anchor, css + style_anchor, 1)
path.write_text(text, encoding='utf-8')
print('V6.1 step1 novice guidance integrated')
