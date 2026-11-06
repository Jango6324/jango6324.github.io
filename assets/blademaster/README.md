# BladeMaster project page

The Jekyll page is `_pages/blademaster/index.html`, with permalink `/blademaster/` and `layout: none`, following the other project pages. Both publication data files link to this permalink.

## Assets

- `css/style.css`: the approved results-first design, with Instrument Sans at weight 450 for the paper subtitle.
- `js/page.js`: synchronized video players, scene/view switches, timed comparison explanations, and citation copying. A buffering pane pauses its group until playback can resume together. Small timing offsets use gentle playback-rate adjustments, with hard corrections reserved for larger offsets and limited to once per two seconds. Media URLs are resolved relative to the script location, so a Jekyll `baseurl` is supported.
- `js/data.js`: the twelve scene groups and their 27 video windows, including the alternate Soul Franka view.
- `js/demos.js`: the Soul Franka switch in Sequential Slicing and the two paired players under Additional Demonstrations. The switch matches the current knife stroke and reserves the experiment's original space on desktop and mobile.
- `videos/` and `posters/`: reviewed H.264 clips at 30 fps, with MP4 metadata at the front for progressive playback. Each poster comes from the opening frame. The three-pane robot experiments use 720-pixel height, the original two-pane results use 1280-pixel width, and the additional paired demos use 960 × 540 per view. The 1476 × 720 Soul Franka video is framed responsively. Audio is omitted because these clips play muted.
- `images/`: the vector wordmark and header teaser.
- `fonts/`: self-hosted WOFF2 assets and their original licenses. Instrument Sans is used for the subtitle, authors, and headings; Source Sans 3 for reading text, controls, and measurements; Source Code Pro for BibTeX. No local system-font lookup or third-party font service is used. The first two families are preloaded.

Font upstreams: [Instrument Sans](https://github.com/Instrument/instrument-sans), [Source Sans 3](https://github.com/adobe-fonts/source-sans), [Source Code Pro](https://github.com/adobe-fonts/source-code-pro).

The public preprint is https://arxiv.org/abs/2609.27342. The citation download is `/files/Yang26BladeMaster.bib`. The existing project-page BibTeX matches this file.

Local design trials, alternate fonts, extraction boundaries, source metadata, the obsolete local PDF, and unused figures are not required by this page.

The reviewed 60 fps originals remain in the ignored `local/blademaster-clips/windows/clips/` directory. Local export and verification scripts, timing checks, and a visual comparison are in `local/blademaster-video-review/`, with conversion reports in `web-30fps/`. The conversion keeps source frames 0, 2, 4, and so on, without interpolation. An odd source frame count can add at most 1/60 second at the end of a clip.
