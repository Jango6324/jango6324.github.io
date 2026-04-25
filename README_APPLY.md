# Homepage layout/CSS patch

Copy these files into the root of your Jekyll/academicpages repository, preserving the folder structure.

Changed/added files:

- `index.md` — sets the root homepage to use `layout: home-custom`.
- `_layouts/home-custom.html` — custom one-page homepage layout.
- `_sass/_custom_home.scss` — scoped CSS/SCSS for the new homepage.
- `_data/home_publications.yml` — homepage publication cards.
- `_data/home_awards.yml` — award strip content.
- `_data/home_news.yml` — news strip content.
- `assets/css/main.scss` — imports `_custom_home.scss` and Font Awesome regular icons.
- `images/mascot/*` — mascot assets used by the homepage.

Run locally with:

```bash
bundle install
bundle exec jekyll serve
```

I could not build in the sandbox because `bundle`/`jekyll` are not installed here.
