# Publications page patch

This patch implements the full publication-list page based on the current 404-page structure.

## Files

- `publications.html` — standalone Jekyll page at `/publications/`
- `assets/css/publications.scss` — page-specific styles for the publication list
- `_data/publications_full.yml` — publication metadata grouped by year
- `images/mascot/publications-reading.png` — small mascot image used in the page hero

## Notes

- The left sidebar markup is kept the same as the uploaded 404 page template.
- The page loads `assets/css/404.css` first to preserve the shared sidebar/shell styling, then loads `assets/css/publications.css` for the right-side publication layout.
- Publication thumbnails use the same paths as the homepage data:
  - `/assets/images/papers/woodstock.jpg`
  - `/assets/images/papers/arenite.jpg`
  - `/assets/images/papers/unerosion.jpg`

## Local preview

```bash
bundle exec jekyll serve
```

Open:

```text
http://localhost:4000/publications/
```
