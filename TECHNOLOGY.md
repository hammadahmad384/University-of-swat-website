# University of Swat website technology

The website is built with HTML5, CSS3 and vanilla JavaScript. It uses a static multi-page architecture, responsive CSS, accessible native HTML controls, progressive enhancement and the Web Animations API. No application backend or database is required.

Competition description: “Designed and developed a responsive University of Swat website concept using HTML5, CSS3 and JavaScript, featuring a sourced academic program directory, admissions guidance, accessible navigation and reduced-motion support.”

University applications, accounts and payments remain on the official university portals. This independent competition concept does not collect university credentials.

Development-only optimization uses PostCSS, cssnano and Terser through `npm run build`. These tools are not loaded by visitors and do not add a backend or browser framework. Editable sources are kept in `src/`; optimized website assets are served from `dist/`.
