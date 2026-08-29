# B∀D H〇∀ D∀Y — Official Site

Original gothic / horror / dark fantasy project official website.

## Structure

```
assets/   images, GIFs, audio
css/      stylesheets
data/     JSON content for the dynamic pages
js/       page scripts
*.html    every page (top level)
```

- `index.html` — TOP page
- `about.html` — ABOUT page
- `character.html` — CHARACTER list page
- `character-zowhome.html` — CHARACTER DATA FILE (example: ZOWHOME)
- `store.html` — STORE page
- `entrance.html` — Entrance / cushion page
- `type.html` — TYPE (GOTH race classification) page

Shared stylesheets: `css/reset.css`, `css/variables.css`, `css/layout.css`,
`css/components.css`. Each page also has its own page-specific stylesheet
(e.g. `css/store.css`).

Character/type data used by the dynamic pages is stored as JSON in `data/`
(`characters.json`, `type-data.json`, `store-products.json`, etc.) so content
can be updated without touching the HTML/JS.

## Local preview

Since some pages `fetch()` local JSON files, opening them directly via
`file://` may be blocked by the browser's CORS policy for local files. Serving
the folder with a simple local HTTP server is recommended, e.g.:

```
npx serve .
# or
python3 -m http.server
```

Each page also includes a fallback dataset in its JS file for the case where
`fetch()` isn't available, so most pages will still render reasonably when
opened directly as well.
