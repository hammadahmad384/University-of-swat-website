# Student journey review

Status: review draft. GitHub main and the public Vercel deployment have not been changed by this iteration.

## What changed

1. Save up to five programme listings in a personal shortlist, including separate campus listings. Remove individual choices or clear the shortlist. Progress is kept only in this browser, when storage is available.
2. Continue to an application plan on Admissions. The five preparation steps remember their state independently of the shortlist. Print a plan containing the selected programmes, official listing URLs and checklist status.
3. The first six general undergraduate listings include concise, sourced descriptions, published durations where verified and department/curriculum links. Economics explicitly leaves duration unverified. Published curricula are not presented as guaranteed current intake requirements.
4. Search has removable filter chips, useful recovery options when no listings match, saved-only filtering and a copyable search URL. Site search links through to all matching directory results. Personal saved selections are not included in shared links.
5. A direct programme-finder call to action and a three-step study journey connect discovery, a shortlist and preparation. Tighter mobile spacing exposes service links sooner while retaining the existing design and readable type.
6. A one-page case study and a short browser walkthrough accompany the review. They explain the work without adding competition material to the university navigation.

## Oxford references and adaptation

- [Undergraduate course listing](https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing): clear access to course discovery and guidance.
- [Computer Science course page](https://www.ox.ac.uk/admissions/undergraduate/courses/course-listing/computer-science): concise course facts, sectional detail and a clear application route.
- [Guide for applicants](https://www.ox.ac.uk/admissions/undergraduate/applying/guide-for-applicants): admissions guidance organized into understandable stages.
- [Admissions timeline](https://www.ox.ac.uk/admissions/undergraduate/applying/admissions-timeline): an overview supported by a downloadable reference.

This draft adapts those information-architecture patterns to Swat: discover → shortlist → prepare → official portal. The shortlist, browser persistence, filter chips and copy-search features are original proposals for this concept, not claims about Oxford's functionality. No Oxford branding, images, academic facts or deadlines were copied.

## Review on your phone

1. Open Academics; confirm the initial six listings and search for `coding cs`.
2. Save Computer Science and another programme. Open **My application plan**.
3. Tick a preparation step, reload, and confirm the choices remain.
4. Choose **Print or save as PDF** to open your browser's print controls.
5. Return to the directory, try a campus filter, remove its chip and copy the search link.

Storage belongs to the current browser and website origin. A draft shortlist will not automatically transfer to the Vercel domain. Private browsing or browser storage restrictions can prevent persistence; the interface explains that condition. No personal application data is collected or sent, and a saved plan is not an application submission.

## Scope and intentional limits

- All 54 UG and three postgraduate records remain, with the original source links and campus qualifications. Programme availability, eligibility and fees must still be confirmed through the university.
- Richer details are limited to the first six listings because those were researched for this iteration. No unverified details were filled in for the others.
- No new backend, accounts, analytics, chatbot, invented news or application deadlines were added.
- No GitHub push or Vercel production release is authorized until the user reviews this draft.
- Chromium checks and automated accessibility audits are documented in `REVIEW-QA.md`; an actual iPhone Safari review is still valuable before release.

## Presentation assets

- `dist/review/case-study.html`: readable and printable one-page case study.
- `dist/review/case-study.pdf`: generated A4 copy.
- `dist/review/walkthrough.mp4`: short captioned browser demonstration.
