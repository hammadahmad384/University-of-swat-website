# Targeted refinement — 10 November 2026

The existing forest green, gold and ivory design and page structure are retained. These changes improve clarity, search, accessibility and delivery without replacing the site.

## Pages and sources

- `dist/index.html`: renamed Services & Notices while preserving `#notices`; added the exact 58-versus-54 explanation; differentiated the two portal subtitles; added programme aliases, the responsive hero image and optimized portrait/entrance references.
- `dist/academics.html`: synchronized aliases for all 54 undergraduate and three postgraduate records; retained the compact six-result view and complete static directory.
- `dist/admissions.html`: updated shared navigation, concept text, metadata, footer headings and stylesheet reference.
- `dist/campus.html`: updated shared elements and optimized entrance image reference, keeping its alt text and source attribution.
- `dist/leadership.html`: updated shared elements and optimized portrait reference; preserved the three supplied Vice Chancellor paragraphs verbatim.
- `dist/credits.html`: updated shared elements and acknowledged responsive/social derivatives of the real CC BY-SA photograph.
- All six pages now use existing titles/descriptions for Open Graph and Twitter metadata, canonical URLs, one stylesheet, accessible footer `h2` headings and readable compact mobile concept text.
- `dist/404.html` (new): branded missing-page response with a home link, root-relative assets/navigation, search and `noindex` metadata.
- `SOURCES.md`: corrected obsolete generated-valley and nine-word-only VC descriptions; documented the actual photograph, supplied paragraphs, programme sources and derivatives.
- `dist/assets/swat-valley-LICENSE.txt`: retained CC BY-SA 4.0 attribution and documented the new image derivatives.

## Behaviour and styling

- `src/catalogue.js` (new editable source), `dist/catalogue.js`: added generic aliases to every record, preserving all other record fields; minified the published file.
- `src/script.js` (new editable source), `dist/script.js`: match every query word independently; debounce typed result announcements by 400 ms; focus and scroll after collapsing results; support Arrow Up/Down within site-search results; focus same-page and cross-page hash headings; retain existing dialog/menu keyboard controls and no-JavaScript fallbacks. Published JavaScript is minified.
- `src/motion.js` (new editable source), `dist/motion.js`: removed the JavaScript hero-text entrance, retaining scroll reveals and reduced-motion handling.
- `src/site.css` (new editable source), `dist/site.min.css` (new output): consolidated and safely minified the three stylesheets; removed dead/overridden rules and the missing background image reference; raised specified small text to 11–12 px; switched the hero to minimum heights and positioned responsive imagery; moved hero-text animation to reduced-motion-aware CSS; preserved footer appearance and corrected text contrast, including a slightly stronger existing gradient behind the campus photograph's caption.
- `dist/styles.css`, `dist/enhancements.css`, `dist/pages.css` (removed): replaced by the single generated stylesheet.

## Images and discovery

- `dist/assets/swat-valley-800.webp`, `dist/assets/swat-valley-1200.webp` (new): 800×413 and 1200×619 responsive derivatives; the unchanged 1800×929 original WebP completes the hero `srcset`.
- `dist/assets/swat-social.webp` (new): attributed 1200×630 share-image crop.
- `dist/assets/vice-chancellor.webp` (new): 880×858 portrait, approximately 76% smaller than its JPEG.
- `dist/assets/campus-entrance.webp` (new): 450×300 entrance image, approximately 39% smaller than its JPEG.
- `dist/robots.txt`, `dist/sitemap.xml` (new): crawler instructions and the six canonical content URLs.

## Maintenance and verification

- `scripts/build.mjs`, `package.json`, `package-lock.json`, `.gitignore` (new): reproducible development-only CSS/JS optimization; the delivered site remains static HTML/CSS/vanilla JavaScript.
- `README.md`: current editing, build, local-viewing and content-preservation instructions.
- `TECHNOLOGY.md`: documented development-only optimization tools.
- `CHANGELOG.md`, `QA-REPORT.md` (new): this file-by-file record and measured test results.

## Intentional limitation

The official entrance photograph available in the existing source is only 450×300. It was converted at native resolution rather than enlarged to 900×600, which would not add detail. Both original JPEGs remain untouched for provenance. Necessary responsive CSS overrides remain because removing them would change the layout.
