// Static HTML remains available without JavaScript; controls progressively enhance it.
(() => {
  const byId = id => document.getElementById(id);
  const normalize = value => String(value ?? '').normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const matchesWords = (text, query) => {
    const haystack = normalize(text);
    return normalize(query).split(/\s+/).filter(Boolean)
      .every(word => haystack.includes(word));
  };
  const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollToElement = element => {
    const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
    window.scrollTo({
      top: Math.max(0, window.scrollY + element.getBoundingClientRect().top - headerHeight - 16),
      behavior: reducedMotion() ? 'instant' : 'smooth'
    });
  };
  const programs = Array.isArray(window.UOS_PROGRAMS) ? window.UOS_PROGRAMS : [];
  const programQuery = byId('program-query');
  const programCategory = byId('program-category');
  const programGrid = byId('program-grid');

  if (programQuery && programCategory && programGrid) {
    const cards = [...programGrid.querySelectorAll('.program-card')];
    const level = byId('program-level'), campus = byId('program-campus');
    const toggle = byId('toggle-programs'), count = byId('program-count');
    const fields = { q: programQuery, category: programCategory, level, campus };
    const previewSize = 6;
    let expanded = false, announcementTimer;
    // Use the source catalogue as well as HTML so aliases cannot become stale.
    const searchableText = new Map(cards.map(card => {
      const title = card.querySelector('h3')?.textContent.trim();
      const record = programs.find(program => program.title === title &&
        program.level === card.dataset.level && program.campus === card.dataset.campus);
      return [card, [card.dataset.search || card.textContent, record?.keywords || ''].join(' ')];
    }));
    const params = new URLSearchParams(location.search);
    if (!level && params.has('level')) {
      const url = new URL(location.href);
      url.searchParams.delete('level');
      history.replaceState(history.state, '', url);
    }
    Object.entries(fields).forEach(([key, input]) => {
      if (!input) return;
      const value = params.get(key);
      if (value !== null && (input.tagName !== 'SELECT' ||
        [...input.options].some(option => option.value === value))) input.value = value;
    });

    function renderPrograms({ updateUrl = true, debounce = false } = {}) {
      const matches = cards.filter(card => matchesWords(searchableText.get(card), programQuery.value) &&
        [programCategory, level, campus].every((input, index) => !input || input.value === 'all' ||
          card.dataset[['category', 'level', 'campus'][index]] === input.value));
      const visible = new Set(expanded ? matches : matches.slice(0, previewSize));
      cards.forEach(card => { card.hidden = !visible.has(card); });
      clearTimeout(announcementTimer);
      const announcement = `Showing ${visible.size} of ${matches.length} matching program listings`;
      const announce = () => { if (count) count.textContent = announcement; };
      if (debounce) announcementTimer = setTimeout(announce, 400);
      else announce();
      const empty = byId('empty-programs');
      if (empty) empty.hidden = matches.length > 0;
      if (toggle) {
        toggle.hidden = matches.length <= previewSize;
        toggle.textContent = expanded ? 'Show first 6' : `Show all ${matches.length} listings`;
        toggle.setAttribute('aria-expanded', String(expanded));
      }
      if (updateUrl) {
        const url = new URL(location.href);
        Object.entries(fields).forEach(([key, input]) => {
          if (!input) return;
          const value = input.value.trim();
          if (!value || value === 'all') url.searchParams.delete(key);
          else url.searchParams.set(key, value);
        });
        history.replaceState(history.state, '', url);
      }
    }

    programQuery.addEventListener('input', () => {
      expanded = false;
      renderPrograms({ debounce: true });
    });
    [programCategory, level, campus].filter(Boolean).forEach(input => {
      input.addEventListener('change', () => { expanded = false; renderPrograms(); });
    });
    byId('program-form')?.addEventListener('submit', event => {
      event.preventDefault(); expanded = false; renderPrograms();
    });
    byId('clear-program-filters')?.addEventListener('click', () => {
      expanded = false;
      Object.values(fields).filter(Boolean).forEach(input => {
        input.value = input === programQuery ? '' : 'all';
      });
      renderPrograms();
      programQuery.focus();
    });
    toggle?.addEventListener('click', () => {
      expanded = !expanded;
      renderPrograms({ updateUrl: false });
      if (!expanded) {
        const destination = count || programGrid;
        destination.setAttribute('tabindex', '-1');
        destination.focus({ preventScroll: true });
        // Keep the count and beginning of the grid visible below the sticky header.
        scrollToElement(destination);
      }
    });
    renderPrograms({ updateUrl: false });
  }

  const noticeCards = [...document.querySelectorAll('.notice-card')];
  document.querySelectorAll('.notice-filter').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.notice-filter').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    noticeCards.forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) count++;
    });
    if (byId('notice-count')) byId('notice-count').textContent = `${count} university service links shown`;
  }));

  const mobileButton = byId('mobile-menu-button'), mobileNav = byId('mobile-nav');
  function closeMobileNav() {
    if (!mobileNav || !mobileButton) return;
    mobileNav.hidden = true;
    mobileButton.setAttribute('aria-expanded', 'false');
    mobileButton.setAttribute('aria-label', 'Open navigation menu');
  }
  mobileButton?.addEventListener('click', () => {
    if (!mobileNav) return;
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    mobileButton.setAttribute('aria-expanded', String(open));
    mobileButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  });
  window.addEventListener('resize', () => { if (innerWidth > 1200) closeMobileNav(); });

  const searchModal = byId('search-modal'), searchInput = byId('site-search-input');
  const searchResults = byId('site-search-results'), searchOpener = byId('open-search');
  const searchCloser = byId('close-search');
  const hasSearch = searchModal && searchInput && searchResults && searchOpener && searchCloser;
  const siteItems = [
    { title: 'Sources & Credits', detail: 'Official sources and Swat photography attribution', url: 'credits.html', keywords: 'sources credits photograph photo image licence license' },
    { title: 'Home', detail: 'University overview', url: 'index.html', keywords: 'home university' },
    { title: 'About the University', detail: 'History and HEC recognition', url: 'index.html#about', keywords: 'about history established 2010 public' },
    { title: 'University in numbers', detail: 'University-reported campuses, programs, faculty and students', url: 'index.html#university-figures', keywords: 'statistics facts numbers campuses faculty students 9230 9,230 58 19 13 152' },
    { title: 'Academic Programs', detail: 'Programs with official sources, degree and campus filters', url: 'academics.html', keywords: 'academic department computer science software engineering program education business economics' },
    { title: 'Vice Chancellor’s Message', detail: 'Prof. Dr. Husnul Amin — portrait and official message excerpt', url: 'leadership.html', keywords: 'vc vice chancellor leadership husnul amin message' },
    { title: 'Admissions guide', detail: 'Prepare, apply and follow your progress', url: 'admissions.html', keywords: 'admissions application register documents payment' },
    { title: 'Applicant questions', detail: 'Names, merit status, hostel help and program information', url: 'admissions.html#applicant-questions', keywords: 'faq help questions cn ic matric hostel eligibility' },
    { title: 'Admissions portal', detail: 'Official application and registration services', url: 'https://cms1.uswat.edu.pk/', keywords: 'admission apply portal' },
    { title: 'Student Portal', detail: 'Official University of Swat CMS', url: 'https://cms1.uswat.edu.pk/', keywords: 'cms student login result fee scholarship' },
    { title: 'Library & research', detail: 'Library resources, ORIC and financial aid links', url: 'campus.html', keywords: 'library research oric campus life financial aid' },
    { title: 'Services & Notices', detail: 'Official service shortcuts and university information', url: 'index.html#notices', keywords: 'services service notices notice merit hostel alumni information' }
  ];
  const programSearchItems = programs.map(program => ({
    title: program.title, detail: program.levelLabel + ' · ' + program.campusLabel,
    keywords: program.keywords,
    url: 'academics.html?' + new URLSearchParams({ q: program.title, level: program.level, campus: program.campus }).toString()
  }));
  function renderSearch() {
    if (!hasSearch) return;
    const query = searchInput.value.trim();
    const matched = [...siteItems, ...(query ? programSearchItems : [])]
      .filter(item => matchesWords(`${item.title} ${item.detail} ${item.keywords}`, query));
    const items = matched.slice(0, 20);
    searchResults.replaceChildren();
    items.forEach(item => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = document.body.dataset.page === 'not-found' && !/^(?:https?:|#|\/)/.test(item.url) ? '/' + item.url : item.url;
      link.textContent = item.title;
      if (item.url.startsWith('https://')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      const detail = document.createElement('small');
      detail.textContent = item.detail; link.append(detail); searchResults.append(link);
    });
    if (!items.length) {
      const message = document.createElement('p');
      message.className = 'search-none';
      message.textContent = 'No matching pages or programs found. Try another keyword.';
      searchResults.append(message);
    }
    if (byId('site-search-count')) byId('site-search-count').textContent = `${matched.length} results. ${items.length} shown.`;
  }
  const inertState = new Map();
  function openSearch() {
    if (!hasSearch) return;
    if (!searchModal.hidden) { searchInput.focus(); return; }
    closeMobileNav();
    [...document.body.children]
      .filter(element => element !== searchModal && !['SCRIPT', 'STYLE'].includes(element.tagName))
      .forEach(element => { inertState.set(element, element.inert); element.inert = true; });
    searchModal.hidden = false;
    document.body.classList.add('modal-open');
    searchInput.value = ''; renderSearch(); searchInput.focus();
  }
  function closeSearch(restoreFocus = true) {
    if (!searchModal) return;
    inertState.forEach((value, element) => { element.inert = value; });
    inertState.clear(); searchModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (restoreFocus) searchOpener?.focus();
  }
  if (hasSearch) {
    searchOpener.addEventListener('click', openSearch);
    searchCloser.addEventListener('click', () => closeSearch());
    byId('search-backdrop')?.addEventListener('click', () => closeSearch());
    searchInput.addEventListener('input', renderSearch);
    searchModal.addEventListener('keydown', event => {
      if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') &&
        !event.ctrlKey && !event.metaKey && !event.altKey) {
        const links = [...searchResults.querySelectorAll('a.search-result')];
        const current = links.indexOf(document.activeElement);
        if (links.length && (document.activeElement === searchInput || current !== -1)) {
          event.preventDefault();
          const next = current === -1
            ? (event.key === 'ArrowDown' ? 0 : links.length - 1)
            : (current + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
          links[next].focus();
        }
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [...searchModal.querySelectorAll('button,input,a[href]')]
        .filter(item => !item.disabled && !item.hidden);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (searchModal && !searchModal.hidden) { event.preventDefault(); closeSearch(); }
    else if (mobileNav && !mobileNav.hidden) {
      event.preventDefault(); closeMobileNav(); mobileButton?.focus();
    }
  });

  // Focus anchors consistently both after a page load and within the current page.
  function focusHash(hash, { instant = false } = {}) {
    let id;
    try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch (_) { return false; }
    const target = id ? byId(id) : null;
    if (!target) return false;
    if (searchModal && !searchModal.hidden) closeSearch(false);
    closeMobileNav();
    const focusTarget = id === 'top'
      ? byId('hero-heading') || byId('page-heading') || target
      : target.matches('h1,h2') ? target : target.querySelector('h1,h2') || target;
    focusTarget.setAttribute('tabindex', '-1');
    focusTarget.focus({ preventScroll: true });
    const behavior = instant || reducedMotion() ? 'instant' : 'smooth';
    if (id === 'top') window.scrollTo({ top: 0, behavior });
    else target.scrollIntoView({ block: 'start', behavior });
    return true;
  }
  const normalizedPath = path => {
    let normalized = path;
    if (normalized.endsWith('/index.html')) normalized = normalized.slice(0, -10);
    if (normalized.endsWith('.html')) normalized = normalized.slice(0, -5);
    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
  };
  document.addEventListener('click', event => {
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
      event.button !== 0 || link.hasAttribute('download')) return;
    let url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (searchModal && !searchModal.hidden) closeSearch(link.target === '_blank');
    closeMobileNav();
    if (url.origin !== location.origin || normalizedPath(url.pathname) !== normalizedPath(location.pathname) ||
      url.search !== location.search || (link.target && link.target !== '_self')) return;
    const hash = url.hash || (document.body.dataset.page === 'home' ? '#top' : '');
    if (!focusHash(hash)) return;
    event.preventDefault();
    if (hash !== location.hash) history.pushState(history.state, '', hash);
  });
  const focusInitialHash = () => {
    if (location.hash) requestAnimationFrame(() => focusHash(location.hash, { instant: true }));
  };
  if (document.readyState === 'complete') focusInitialHash();
  else window.addEventListener('load', focusInitialHash, { once: true });
  window.addEventListener('hashchange', () => focusHash(location.hash, { instant: true }));

  const preparation = [...document.querySelectorAll('[data-preparation]')];
  const preparationCount = byId('preparation-count');
  if (preparationCount) {
    const update = () => { preparationCount.textContent = `${preparation.filter(input => input.checked).length} of ${preparation.length} preparation steps complete`; };
    preparation.forEach(input => input.addEventListener('change', update)); update();
  }
  if (byId('year')) byId('year').textContent = new Date().getFullYear();
  document.querySelectorAll('[data-enhanced]').forEach(element => { element.hidden = false; });
})();
