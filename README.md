# Cap Post-Bac · TG1

Outil interactif d’**éducation à l’orientation** conçu pour la première séance d’orientation de la classe de **TG1** du **Lycée Watteau de Valenciennes**.

**Conception pédagogique : SAUTIERE Thierry — professeur principal, groupe NSI.**

## Objectif

La séance dure 60 minutes. Elle ne cherche pas à obtenir un « choix définitif », mais à entraîner une méthode réutilisable :

**se connaître → vérifier → comparer → agir → conserver une trace.**

Le parcours comprend 7 étapes :

1. Point de départ ;
2. Ma boussole ;
3. Idées reçues ;
4. Mission Parcoursup ;
5. Comparer ;
6. Prochain pas ;
7. Bilan & synthèse.

## Références institutionnelles

La structure pédagogique s’appuie sur :

- le **Plan Avenir** et la note de service publiée au BO du 3 juillet 2025 ;
- le **Référentiel des compétences à s’orienter au lycée** de l’Onisep ;
- les ressources **Avenir(s)** ;
- les informations et fiches de formation **Parcoursup** ;
- les ressources **Éduscol** consacrées à la transition lycée–enseignement supérieur.

Les dates de la session Parcoursup 2027 ne sont pas figées dans la ressource : elles doivent être vérifiées sur la source officielle lorsqu’elles sont publiées.

## Fonctionnalités

- chronomètre de 60 minutes ;
- mode **Guide PP** ;
- mode **Projection** ;
- thème sombre / papier clair ;
- progression en 7 étapes ;
- quiz avec rétroactions ;
- enquête guidée sur une vraie fiche Parcoursup ;
- comparaison de deux pistes ;
- génération d’une feuille de route ;
- téléchargement du bilan en TXT ;
- impression / PDF ;
- responsive desktop, tablette et mobile ;
- prise en compte de prefers-reduced-motion ;
- navigation clavier et focus visible ;
- aucune dépendance JavaScript ou CSS externe.

## Vie privée

Les réponses des élèves restent dans sessionStorage : elles survivent à une actualisation mais sont supprimées à la fermeture de la session du navigateur. Aucun serveur de collecte n’est utilisé.

Les préférences d’interface (thème, guide professeur, projection) peuvent être mémorisées localement.

## Contrôle qualité

Le dépôt contient audit.mjs, exécuté par GitHub Actions à chaque modification. Il vérifie notamment :

- la syntaxe JavaScript ;
- l’unicité des identifiants HTML ;
- les liens entre labels et champs ;
- la présence des 7 étapes ;
- la cohérence de la navigation ;
- l’absence de dépendances front-end externes ;
- la présence des sources institutionnelles ;
- plusieurs garde-fous d’accessibilité et de confidentialité.

## Déploiement

Le site est un fichier statique autonome (index.html) et peut être publié directement par **GitHub Pages** depuis la branche main, à la racine du dépôt.

---
Lycée Watteau · Valenciennes · TG1 · Orientation 2026–2027
