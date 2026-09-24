# BladeMaster project page

The Jekyll page is `_pages/blademaster/index.html`, with permalink `/blademaster/` and `layout: none`, following the other project pages. Both publication data files link to this permalink.

## Assets

- `css/style.css`: the approved results-first design, with Instrument Sans at weight 450 for the paper subtitle.
- `js/page.js`: synchronized video players, scene/view switches, timed comparison explanations, and citation copying. A buffering pane pauses its group until playback can resume together. Small timing offsets use gentle playback-rate adjustments, with hard corrections reserved for larger offsets and limited to once per two seconds. Media URLs are resolved relative to the script location, so a Jekyll `baseurl` is supported.
- `js/data.js`: the ten scene groups and 22 active video windows. Only runtime fields are included.
- `videos/` and `posters/`: the reviewed crops and clean preview images. Each poster is extracted from frame 0 of its published video, so starting playback does not jump from a later result back to the opening scene. The 22 web videos are H.264 at 30 fps, using 720-pixel height for the three-pane robot experiments and 1280-pixel width for the two-pane results. They retain the original crops, playback speed, opening holds, and release/launch alignment. Total video size is approximately 51.5 MB, down from 386.5 MB; the largest file is approximately 6.7 MB. Audio is omitted because these clips play muted. MP4 metadata is placed at the front for progressive playback.
- `images/`: the vector wordmark and header teaser.
- `fonts/`: self-hosted WOFF2 assets and their original licenses. Instrument Sans is used for the subtitle, authors, and headings; Source Sans 3 for reading text, controls, and measurements; Source Code Pro for BibTeX. No local system-font lookup or third-party font service is used. The first two families are preloaded.

Font upstreams: [Instrument Sans](https://github.com/Instrument/instrument-sans), [Source Sans 3](https://github.com/adobe-fonts/source-sans), [Source Code Pro](https://github.com/adobe-fonts/source-code-pro).

The public preprint is https://arxiv.org/abs/2609.27342. The citation download is `/files/Yang26BladeMaster.bib`. The existing project-page BibTeX matches this file.

Local design trials, alternate fonts, extraction boundaries, source metadata, the obsolete local PDF, and unused figures are not required by this page.

The reviewed 60 fps originals remain in the ignored `local/blademaster-clips/windows/clips/` directory. Local export and verification scripts, timing checks, and a visual comparison are in `local/blademaster-video-review/`, with conversion reports in `web-30fps/`. The conversion keeps source frames 0, 2, 4, and so on, without interpolation. An odd source frame count can add at most 1/60 second at the end of a clip.
