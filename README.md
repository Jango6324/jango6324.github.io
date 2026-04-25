# Zhanyu Yang Personal Site

A streamlined Jekyll site centered on three custom pages:

- Home: `/`  
- Custom 404: `/404.html`  
- Publications: `/publications-custom.html`

## Current Architecture

Core page entries:

- `index.md` -> `layout: home-custom`
- `404.html` -> `layout: 404-custom`
- `publications-custom.html` -> `layout: publications-custom`

Core layouts:

- `_layouts/home-custom.html`
- `_layouts/404-custom.html`
- `_layouts/publications-custom.html`
- `_layouts/compress.html`

Core styles:

- `assets/css/main.scss` (imports home styles)
- `assets/css/404.scss`
- `assets/css/publications.scss`
- `_sass/_custom_home.scss`
- `_sass/_custom_404.scss`

Core data files:

- `_data/home_publications.yml`
- `_data/home_news.yml`
- `_data/home_awards.yml`
- `_data/publications_full.yml`

## Is This Still Dependent on Academic Pages?

This site no longer depends on the original Academic Pages page/layout set.

What remains from the initial scaffold is shared Jekyll infrastructure (for example some includes, Sass/vendor assets, and config conventions) already copied into this repository. In other words:

- No runtime dependency on the upstream academicpages repository
- Site builds from this repo alone
- Architecture is now custom-page driven

## Local Development

1. Install Ruby + Bundler.
2. Install dependencies:

```bash
bundle install
```

3. Start local server:

```bash
bundle exec jekyll serve -l -H localhost
```

4. Open: `http://localhost:4000`

## Content Editing Guide

### Home page

- Layout/content structure: `_layouts/home-custom.html`
- Home-specific styles: `_sass/_custom_home.scss`
- Dynamic content:
  - `_data/home_publications.yml`
  - `_data/home_news.yml`
  - `_data/home_awards.yml`

### 404 page

- Layout/content: `_layouts/404-custom.html`
- Styles: `_sass/_custom_404.scss`

### Publications page

- Layout/content: `_layouts/publications-custom.html`
- Styles: `assets/css/publications.scss`
- Data: `_data/publications_full.yml`

## Deployment

This repository is configured for GitHub Pages-style Jekyll deployment.
Pushing to the default branch updates the published site URL.
