# University of Swat — student website concept

A static, independent competition website built with HTML5, CSS3 and vanilla JavaScript. It is clearly identified as a student concept, not an official university service.

[Open the live website](https://university-of-swat-website.vercel.app/) · [GitHub repository](https://github.com/hammadahmad384/University-of-swat-website)

## Pages and content

- `dist/index.html`: university background, attributed statistics, undergraduate finder, leadership introduction and Services & Notices.
- `dist/academics.html`: all 57 sourced programme records, degree/campus/subject filters and source links.
- `dist/admissions.html`: sourced guidance, preparation checklist and applicant questions.
- `dist/campus.html`: university research, learning and student-service destinations.
- `dist/leadership.html`: official portrait and the three supplied Vice Chancellor paragraphs.
- `dist/credits.html`: source and image acknowledgements.
- `dist/404.html`: branded missing-page response.

The homepage includes 54 undergraduate campus listings from the Fall 2026 poster; the Academics directory also includes three department-verified postgraduate records. Both initially show six results, with filters covering every record and a Show all control. The screenshot-sourced university total of 58 undergraduate programmes is explained separately. No current intake, deadline, statistic or announcement is invented.

## Edit and build

### Student journey review draft

This local review adds a programme shortlist, a persistent preparation checklist, printable plans, six sourced programme summaries and clearer search controls. Read [DESIGN-REVIEW.md](DESIGN-REVIEW.md) for the scope, Oxford references, phone walkthrough and limitations; [REVIEW-QA.md](REVIEW-QA.md) records checks for this iteration. The historical QA report below describes the previous release.

This branch is awaiting user review. Do not push it to `main` or deploy to Vercel before approval. Presentation assets are under `dist/review/` and are separate from the university navigation.

The published website needs no server-side application or runtime dependencies. Node is used only to prepare optimized static files. Use Node 24.15 or a newer 24.x release with npm for the pinned build tools; Python 3 is needed only for the optional local preview command.

1. Install the development tools with `npm ci`.
2. Edit `src/site.css`, `src/script.js`, `src/catalogue.js` or `src/motion.js`.
3. Edit page content directly in `dist/*.html`; preserve the sourced text and attribution.
4. Run `npm run build` to produce `dist/site.min.css`, minified `dist/script.js` / `dist/catalogue.js`, and `dist/motion.js`.
5. For local viewing, run `python3 -m http.server 8000 --directory dist` and open `http://localhost:8000`.

When changing programme records, keep the static cards and their search text in both HTML directories synchronized. Runtime search also reads aliases from the catalogue as a safeguard. Keywords are generic search terms, not additional programme claims.

## Preserved behaviour

Navigation, university portal destinations, dialog focus containment, keyboard controls, skip links, reduced motion, no-JavaScript content and the admissions checklist are retained. Programme counts debounce while typing; other actions announce immediately. Search-dialog results support Arrow Up/Down, and hash destinations receive heading focus.

The hero uses responsive copies of an authentic licensed Swat photograph. The portrait and entrance image use WebP derivatives; original JPGs remain in assets. All image provenance and licence information is in `SOURCES.md` and the Credits page.

## Verification and hosting

See [QA-REPORT.md](QA-REPORT.md) for browser checks and measured mobile Lighthouse scores, and [CHANGELOG.md](CHANGELOG.md) for changes by file and intentional limitations.

The complete website is in `dist/`; editable styling and JavaScript are in `src/`. This repository contains the published version 6 project, transferred from source commit `26483c423ccb83763237dc1f4308cc7706efa095`. Vercel uses the committed `vercel.json` configuration to install dependencies, run the build and publish `dist/`. Pushes to `main` automatically trigger production deployments through the connected GitHub repository.

For another static host, publish `dist/` and configure missing URLs to return `404.html` with HTTP status 404. Update canonical URLs, share-image URLs, `robots.txt` and `sitemap.xml` if the public domain changes. A project-path host also needs base-path adjustments for the root-relative 404 links. The original host-specific `.openai/hosting.json` binding is intentionally excluded; it is not needed to build or run the website.
