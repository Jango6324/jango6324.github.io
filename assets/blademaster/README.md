# BladeMaster project page

The Jekyll page is `_pages/blademaster/index.html`, with permalink `/blademaster/` and `layout: none`, following the other project pages. Both publication data files link to this permalink.

## Assets

- `css/style.css`: the approved results-first design, with Instrument Sans at weight 450 for the paper subtitle.
- `js/page.js`: synchronized video players, scene/view switches, timed comparison explanations, and citation copying. Media URLs are resolved relative to the script location, so a Jekyll `baseurl` is supported.
- `js/data.js`: the ten scene groups and 22 active video windows. Only runtime fields are included.
- `videos/` and `posters/`: the reviewed crops and clean preview images. All 22 videos are exact copies of the approved exports, with their original dimensions, frame timing, opening holds, and release/launch alignment. Total video size is approximately 386.5 MB; the largest file is approximately 71.9 MB.
- `images/`: the vector wordmark and header teaser.
- `fonts/`: self-hosted WOFF2 assets and their original licenses. Instrument Sans is used for the subtitle, authors, and headings; Source Sans 3 for reading text, controls, and measurements; Source Code Pro for BibTeX. No local system-font lookup or third-party font service is used. The first two families are preloaded.

Font upstreams: [Instrument Sans](https://github.com/Instrument/instrument-sans), [Source Sans 3](https://github.com/adobe-fonts/source-sans), [Source Code Pro](https://github.com/adobe-fonts/source-code-pro).

The public preprint is https://arxiv.org/abs/2609.27342. The citation download is `/files/Yang26BladeMaster.bib`. The existing project-page BibTeX matches this file.

Local design trials, alternate fonts, extraction boundaries, source metadata, the obsolete local PDF, and unused figures are not required by this page.
