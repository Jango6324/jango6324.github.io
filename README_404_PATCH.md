# 404 Page Patch

This patch adds a custom 404 / under-construction page that matches the custom homepage visual style.

## Files

- `404.html` — GitHub Pages 404 entry point.
- `_layouts/404-custom.html` — Custom 404 layout with the same sidebar style as the homepage.
- `_sass/_custom_404.scss` — Scoped 404 page styles.
- `assets/css/404.scss` — Jekyll entry file that compiles to `assets/css/404.css`.
- `assets/images/mascot/404-stop.png` — Main 404 mascot illustration.
- `assets/images/decor/404-background-white.png` — Pale 404/construction background silhouette.

## Usage

Copy these files into the root of your Jekyll repository, then run:

```bash
bundle exec jekyll serve
```

Preview locally at:

```text
http://127.0.0.1:4000/404.html
```

GitHub Pages will automatically use `404.html` for missing pages after deployment.
