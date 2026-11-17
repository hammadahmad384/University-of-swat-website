# Homepage landscape refinement

This is a visual update to the first screen and its service links. It retains the same headline, description, destination links and university information. Other page layouts are unchanged, and the GitHub/Vercel release remains pending review.

## Direction

The main visual is Swat itself: the existing, licensed **Swat valley in Layers** photograph. Keep its natural gold light and blue mountain layers visible alongside a protected forest-green reading area. The picture represents the valley, not a university building.

- Palette: forest `#063b2c`, deep green `#032a20`, ivory `#fffaf0`, warm gold `#e2bd61`, pale gold `#f1d591`.
- Type: the existing Georgia display face and Arial body text; a deliberate three-line headline, narrower body copy, and readable sentence-case welcome.
- Desktop: headline and actions aligned left; open landscape to the right; the existing geographic label becomes a horizontal caption.
- Mobile: an uninterrupted panorama above the reading area; content-driven height; visible service-link subtitles.
- Restraint: keep the existing motion and loading behavior, with no new animation library, images or font downloads.

The initial plan was checked against the brief: the existing authentic photograph gives this composition a specific Swat identity, while the typography, colours and surrounding page structure remain familiar. The design change is concentrated in the hero rather than repeated throughout the site.

## Background picture ideas

1. **Golden-hour Swat panorama — used in this draft.** The licensed existing photo already fits the green/gold palette and carries a recognizable regional identity. Its original bytes, responsive derivatives and attribution remain intact.
2. **Real campus architecture with mountains behind it.** This would make the academic identity immediate. Use a genuine, licensed/authorized, sharp landscape photograph, ideally at least 2400 pixels wide, with room on the left for text. The existing 450×300 entrance photo is too small for a full-width hero.
3. **Students learning in a real UoS library, laboratory or courtyard.** An authorized photograph could make a future campaign more personal. Choose one clear subject and obtain permission to use the image; this draft does not introduce an unsourced student photograph.

A single strong photograph keeps the opening focused and lightweight. The present draft is ready without requiring new assets.

## Checks

- Six viewport widths, 360–1440 px: no horizontal overflow or hero-copy collision with the bottom strip.
- Homepage axe checks at 390 and 1440 px: zero reported WCAG A/AA/2.1AA violations.
- Sampled the rendered background behind each hero text range at all six widths: minimum contrast 6.92:1, above the requested 4.5:1.
- Large mobile headline (96 px) wraps within its container; content grows vertically. Reduced-motion mode has no running animations.
- No-JavaScript navigation, the full 54-record homepage directory, six-card enhanced view, search dialog and hero destinations retained; no page JavaScript errors during checks.

The existing walkthrough is refreshed to show the new opening. See `REVIEW-QA.md` for measured Lighthouse results and prior feature checks. Automated tests do not replace review on an actual iPhone.
