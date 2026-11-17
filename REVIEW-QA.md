# Verification — student journey draft

## Latest landscape homepage pass

The homepage opening and service-link styling were subsequently refined; details are in `LANDING-REVIEW.md`. The exact homepage content is preserved apart from label casing, with all IDs, image sources and destinations unchanged.

- Six widths (360, 390, 768, 1024, 1280, 1440): no overflow or collision between hero copy and the bottom strip.
- Homepage axe at 390 and 1440 px: zero reported violations; sampled hero text/background contrast is at least 6.92:1.
- A 96px mobile headline wraps without clipping. No running animations under reduced motion. No-JavaScript navigation/full directory and the enhanced search/six-card view pass targeted checks.
- Updated isolated mobile Lighthouse: **97 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**. LCP 2.0 s, CLS 0, total blocking time 180 ms. This is a local lab result.
- The larger mobile photograph intentionally gives the valley more space; the prior iteration's 568px hero-height measurement below no longer describes this opening. Its content-driven hero is approximately 680px at 390px width.

## Earlier student journey checks

These checks apply to the unpublished student-journey iteration. The historical `QA-REPORT.md` describes the earlier release. Tests used Chromium with Playwright, axe-core and Lighthouse 13.6.0 against the locally served static build.

## Mobile Lighthouse (homepage)

| Performance | Accessibility | Best Practices | SEO |
| ---: | ---: | ---: | ---: |
| 97 | 100 | 100 | 100 |

Isolated simulated-mobile run: largest contentful paint 2.0 seconds, cumulative layout shift 0, total blocking time 140 ms. An initial run overlapped with browser screenshot work and scored 76/100/100/100; it was repeated without competing browser work to resolve that performance discrepancy. These are local lab measurements, not production or field Core Web Vitals.

## Browser verification

- All seven existing pages at 360, 390, 768, 1024, 1280 and 1440 pixels: 42 combinations without horizontal overflow or page JavaScript errors.
- Home, Academics and Admissions at 390 and 1440 pixels: six axe WCAG A/AA/2.1AA checks, zero reported violations. This is not a complete accessibility certification or an iPhone Safari test.
- Shortlist: save/remove, maximum five, reload, cross-page use, multi-tab synchronization, separate shortlist/checklist reset scopes, blocked storage and malformed storage recovery.
- Search: all-word alias queries, removable chips, recovery from empty results, saved-only filter, copy success and clipboard fallback. Shared links exclude the local saved-only filter. Global search offers all matching directory results; keyboard arrows and Escape/return focus work.
- Existing initial six results and complete 57-record directory retained. JavaScript-disabled mode shows complete static programme cards and a usable preparation checklist; JS-only save controls remain hidden.
- Print output includes saved listings, official source URLs and checklist completion labels. Print-only focus-outline cleanup leaves interactive screen focus styles intact.
- Existing skip link, menu/dialog focus handling, reduced-motion code and official navigation destinations retained.

## Preservation against production baseline

Compared with commit `3c9696fdf419caca89db1ce01a2f0d1ca3dd068d`:

- Exactly 54 undergraduate + three postgraduate records; all 461 original catalogue fields retained. New stable IDs and researched details are additive. Built catalogue matches readable source.
- Eleven original assets are byte-identical. Three supplied Vice Chancellor paragraphs, six statistic values and the credits content are retained.
- 267 local references across the seven existing pages resolve, including 87 fragment links. New presentation links are checked separately after generation.

## Visual review and limits

Reviewed the mobile hero, filter toolbar, saved-plan panel and printed plan. At 390 pixels the hero is approximately 568 pixels high (previously 665); service links begin about 97 pixels sooner. The added planning toolbar means the directory's first card is not claimed to be higher on the page. Direct finder links bypass introductory content.

The richer details cover six researched general listings. Economics duration remains unspecified; its broken official PDF link is not introduced. No university data or image provenance is removed.

GitHub and Vercel production are outside this draft's release scope. User approval is required before publishing there. Browser-local saved plans do not migrate between the draft and production origins.
