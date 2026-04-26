# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Ce que c'est

Page unique autonome : **The Manifesto for AI-Driven Development** (`index.html`, ~1900 lignes).
CSS et JS sont **inlinés dans le même fichier** — pas de `package.json`, pas de bundler, pas de build.

Cousin de `../website/` (Astro, ai-driven-dev.fr) mais **totalement indépendant** : ne partage aucun
asset ni config. Ne pas importer depuis `../website`.

## Prévisualiser

```bash
open index.html                      # ouverture directe (fichiers locaux)
python3 -m http.server 8000          # préférable — fonts Google + fetch relatifs
```

Pas de tests, pas de lint configurés. Les polices (Fraunces, Inter Tight, JetBrains Mono, Caveat)
sont chargées depuis Google Fonts — prévoir un fallback si offline.

## Architecture du fichier unique

Tout vit dans `index.html`. Le fichier suit cet ordre :

1. **`<style>` (lignes ~10–1161)** — variables CSS dans `:root` (paper/ink/accent en `oklch`),
   puis sections dans l'ordre du DOM : `.cover`, `.preamble`, `.values`, `.principles`, `.signature`,
   `.focus`, `#tweaks`.
2. **`<body>` (lignes ~1163–1459)** — 5 sections sémantiques + overlay `.focus` + panneau `#tweaks`.
3. **`<script>` (lignes ~1460–1885)** — données + handlers.

### Contenu éditorial = données JS

Le texte et la structure du manifeste vivent dans des tableaux JS, **pas dans le HTML** :

- `PRINCIPLES` — les 12 principes (`n`, `r`, `hue`, `lead`, `sub`, `foot?`, `essay[]`).
  Rendus par `pGrid` ; l'overlay `.focus` lit `essay[]` au clic.
- `TERMS` — animations terminal par principe (un bloc par entrée).
- `SEEDS` — signatures par défaut affichées dans le mur.
- `DATA` (bloc VALUE ART) — contenu ASCII des 4 valeurs (`v1..v4`) : `trace`, `drift`, `models`,
  `commits`, `frozen`, `stairs`, `flat`. Populé dans les spans `.va-trace`, `.va-drift`, etc.

**Pour ajouter / modifier un principe ou une valeur** : éditer le tableau JS, pas le HTML.

**Manifeste monolingue** : anglais uniquement. Pas d'I18N ; si une version FR/ES devient nécessaire,
dupliquer le fichier plutôt que réintroduire un switch.

### Persistance & intégrations

- **Signatures utilisateur** → `localStorage['aidd-signatures-v2']` (pas de backend).
- **Edit mode parent iframe** → bloc sentinelle `/*EDITMODE-BEGIN*/ … /*EDITMODE-END*/` (ligne ~1786).
  Ne pas renommer ces marqueurs : un outil parent peut réécrire ce bloc via `postMessage`
  (`__activate_edit_mode`, `__edit_mode_set_keys`).
- **Thème runtime** : `#tweaks` écrit `--accent`, `--paper`, `--rule`, etc. sur `documentElement`.
  Respecter cette indirection — ne pas hard-coder des couleurs dans les sélecteurs.

### Animations / observers

- `IntersectionObserver` sur `.reveal` et `.plate-row` → ajoute `.seen` une fois visible.
- Second observer sur `.term` rejoue les animations de lignes à chaque re-entrée.
- Parallax souris sur `.cover-seal` via `mousemove` (lignes ~1879).

## Conventions

- Respecter la palette `oklch()` et les variables CSS — pas de hex, pas de HSL.
- Garder le fichier **single-file** (pas de split JS/CSS sans accord explicite) : c'est un artefact
  portable destiné à être forké, imprimé, hébergé n'importe où.
- Contenu éditorial : ne pas enrichir sans demande — c'est de la doctrine, pas de la copie marketing.
