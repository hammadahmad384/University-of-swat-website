# Verification — 9–10 November 2026

Tested the completed static build in Chromium using Playwright and Lighthouse 13.6.0. The local test server supplied clean-page routes and the branded 404 response. Measurements below are local, simulated mobile lab results, not field Core Web Vitals or production network measurements.

## Mobile Lighthouse

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Homepage | 99 | 100 | 100 | 100 |
| Academics | 100 | 100 | 100 | 100 |

Homepage: largest contentful paint 1.7 s, cumulative layout shift 0, total blocking time 90 ms. The baseline homepage accessibility score was 97; the identified contrast failures were corrected. The homepage audit was repeated on 10 November after the final caption-overlay adjustment; Academics was audited on 9 November.

## Browser and content checks

- Checked all six content pages plus 404 at **360, 390, 768, 1024, 1280 and 1440 px**: all 42 page/width combinations passed without horizontal overflow.
- Ran axe WCAG A/AA checks on every page at 390 and 1440 px: 14 runs, zero reported violations. A separate solid-background text check used a strict 4.5:1 threshold, including large text, and found no remaining failures. Automated checks do not constitute complete accessibility certification.
- Sampled photographic backgrounds behind overlay text. Strengthened the existing campus-card gradient after detecting a contrast shortfall; its conservative minimum across all six tested widths is now 6.12:1. Campus valley-feature text is at least 7.05:1 across those widths. Checked the hero at mobile and desktop widths after image decoding; its image-overlay copy is at least 7.74:1.
- No JavaScript console exceptions, unexpected failed requests or broken image decodes on any page.
- Verified all internal links, fragment targets, asset paths, responsive image candidates, canonical URLs and share-image references resolve; checked IDs, labels, heading structure and image dimensions.
- Compared the original and updated catalogue: exactly **54 undergraduate and three postgraduate records** remain; every non-keyword record field is unchanged and every record has aliases. All 57 remain searchable, with complete static cards available when JavaScript is disabled.
- Verified initial six results, Show all, Show first 6 with scroll/focus, independent word matching in either order, aliases, 400 ms typed-count debounce, campus/degree filters, reset and URL-driven queries.
- Verified site-search Arrow Up/Down, Tab/Shift+Tab containment, Escape, focus restoration and background inertness; verified mobile menu Tab/Shift+Tab/Escape behaviour.
- Verified same-page, cross-page and initial-load hash focus, the skip link and generated search links on nested missing-page URLs.
- Verified no-JavaScript navigation and content on every page; reduced-motion mode leaves no running entrance/reveal animations.
- Enlarged hero text to 200% at 390 px: the hero grew to contain it without clipping or horizontal overflow.
- Compared readable CSS against its minified output on all 42 page/width combinations: visible layout and sampled computed styles matched.
- Compared preserved assets and content with the baseline: original photographs/logo unchanged, supplied VC paragraphs unchanged, statistics unchanged, and every original official destination retained.
- Confirmed Services & Notices naming, the 58-versus-54 explanation, distinct portal subtitles, consistent photograph attribution, 1200×630 share image, six-page sitemap, robots file and noindex 404.

## Delivery improvements

| Resource | Before | After |
| --- | ---: | ---: |
| Served CSS | 48,735 bytes across three files | 42,738 bytes in one file |
| Catalogue + main JavaScript | 31,680 bytes | 29,441 bytes, including new aliases/features |
| VC photograph | 158,000 bytes | 37,916 bytes |
| Entrance photograph | 91,574 bytes | 56,026 bytes |
| Hero image candidates | 39,946-byte original | 9,568 / 16,316 / 39,946 bytes |

The original JPEGs remain available for provenance. The entrance source is only 450×300, so its WebP preserves native resolution instead of introducing an artificial enlargement.

## Reproduction and evidence

Run `npm ci` and `npm run build` to regenerate optimized CSS/JavaScript. Serve `dist` over HTTP for browser checks. The recorded checks were performed in the original development workspace. Its temporary screenshots, browser-check scripts and full Lighthouse reports are historical evidence and are not part of this repository; the measured results and methodology are recorded above.

Published version 6 was verified with 21 unsigned public HTTP requests: the content pages and assets resolved, deployed static resources matched the tested build, and a nested missing URL returned the branded page with HTTP status 404. The Lighthouse scores above describe the tested local build.
