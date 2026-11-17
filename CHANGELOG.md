# Student journey review — pending approval

## Cleaned information panels

- `dist/index.html`: removed the programme source panel and both explanatory notes beneath the university statistics; the reported numbers and programme listings remain.
- `dist/academics.html`: removed the repeated programme source panel; official links remain on the individual listings.
- `dist/*.html` content pages: removed the repeated photo attribution strip from the footer. The Credits page still carries the photograph author, source and CC BY-SA 4.0 licence.
- `dist/site.min.css`: regenerated from the existing source; no visual theme changes.

## Latest homepage refinement

- `dist/index.html`: opt into the landscape hero treatment; change only the casing of the welcome/location labels. Copy, links, images and data remain unchanged.
- `src/site.css`, `dist/site.min.css`: reveal more of the real valley photograph, strengthen headline hierarchy, use a horizontal geographic caption, improve mobile service links and preserve large-text wrapping and visible focus.
- `dist/review/walkthrough.mp4`: refresh the opening shot in the existing demonstration.
- `LANDING-REVIEW.md`: visual rationale, three background-photo ideas and targeted accessibility/layout results; `REVIEW-QA.md`: latest mobile Lighthouse measurement.

## Student journey features

- `src/catalogue.js`, `dist/catalogue.js`: stable IDs for all 57 records; sourced summaries, duration where verified, department and curriculum references for six general listings. All original fields retained.
- `src/script.js`, `dist/script.js`: up-to-five shortlist, defensive browser storage, cross-tab synchronization, persistent preparation checklist, print action, active filter chips, useful empty-state actions, saved-only filter, copy-search fallback and full-directory results from global search. Existing keyboard/search behaviour retained.
- `src/site.css`, `dist/site.min.css`: targeted styles for the added controls and saved plan, tighter mobile spacing, print-only plan layout and focus-outline cleanup. Existing colours, screen focus cues and reduced motion retained.
- `dist/index.html`: direct finder CTA, three-step journey, programme save controls and six researched details.
- `dist/academics.html`: journey, source-backed programme details, save controls, filter tools and recovery/status elements.
- `dist/admissions.html`: application-plan panel, independent checklist reset, saved progress messaging and print controls.
- `dist/index.html`, `dist/academics.html`, `dist/admissions.html`, `dist/campus.html`, `dist/leadership.html`, `dist/credits.html`, `dist/404.html`: added the application-plan footer destination; original links/content retained.
- `SOURCES.md`: evidence for programme descriptions and published durations.
- `README.md`: review workflow and presentation assets; `DESIGN-REVIEW.md`: Oxford references, rationale and phone review steps; `REVIEW-QA.md`: current checks and Lighthouse results.
- `dist/review/case-study.html`, `dist/review/case-study.pdf`, `dist/review/walkthrough.mp4`: concise competition presentation materials, separate from university navigation.

Intentional limits: no production push, no backend or accounts, no invented official facts, no enriched facts for programmes not researched in this iteration. Economics duration remains unverified. Personal saved data is browser-local and is excluded from shareable search links. The private Sites mirror uses separate hosting metadata and noindex directives; production source metadata remains unchanged.

---

# Targeted refinement — 10 November 2026

The existing forest green, gold and ivory design and page structure are retained. These changes improve clarity, search, accessibility and delivery without replacing the site.

## Vercel deployment configuration

- `vercel.json`: explicitly build and publish `dist` to correct Vercel's missing `public` output-directory error; serve clean page URLs with the existing branded 404.
- `dist/*.html`, `dist/robots.txt`, `dist/sitemap.xml`: use the verified production domain `https://university-of-swat-website.vercel.app` for canonical URLs, share metadata and discovery.
- `README.md`: link to the Vercel website and document deployments from GitHub. Site layout, source content, programme records and image licences are preserved.

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
