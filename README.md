# Düsenjet-Spiel mit weltweiter Top 10

Diese Version enthält eine weltweite Rangliste, die über Netlify Functions und Netlify Blobs gespeichert wird.

## Veröffentlichung bei Netlify

1. Lade den gesamten Ordner in ein GitHub-Repository hoch.
2. Verbinde dieses Repository mit einem neuen Netlify-Projekt.
3. Stelle sicher, dass Netlify als Basisordner diesen Projektordner verwendet.
4. Nach dem Deploy öffne die veröffentlichte `netlify.app`-Adresse.

Für Netlify Blobs sind keine eigenen Environment-Variablen notwendig. Die Funktion liegt in `netlify/functions/top10.js` und ist online unter `/.netlify/functions/top10` verfügbar.

Lege zusätzlich `duesenjet.png`, `duesenjet_rot.png`, `duesenjet_gelb.png` und `Erde.png` neben `index.html` ab.
