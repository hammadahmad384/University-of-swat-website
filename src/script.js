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
  const programText = program => [program.title, program.keywords, program.levelLabel, program.campusLabel].join(' ');
  const localHref = path => document.body.dataset.page === 'not-found' && !/^(?:https?:|#|\/)/.test(path) ? '/' + path : path;
  const directoryHref = values => localHref('academics.html?' + new URLSearchParams(values).toString() + '#academics');
  const programById = new Map(programs.filter(program => typeof program.id === 'string').map(program => [program.id, program]));
  const storageKey = 'uos.student-plan.v1';
  const shortlistLimit = 5;
  let storageAvailable = true, storageIssue = '', refreshPrograms = () => {}, focusProgramResults = () => {};
  const emptyPlan = () => ({ version: 1, saved: [], preparation: [] });
  const uniqueStrings = values => Array.isArray(values) ? [...new Set(values.filter(value => typeof value === 'string'))] : [];
  const sanitizePlan = value => ({
    version: 1,
    saved: uniqueStrings(value?.saved).filter(id => programById.has(id)).slice(0, shortlistLimit),
    preparation: uniqueStrings(value?.preparation).filter(id => /^[a-z0-9-]{1,80}$/.test(id)).slice(0, 20)
  });
  function readPlan() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return emptyPlan();
      const value = JSON.parse(raw);
      if (!value || value.version !== 1 || !Array.isArray(value.saved) || !Array.isArray(value.preparation)) {
        storageIssue = 'Your saved plan could not be read. You can start a new plan.';
        return emptyPlan();
      }
      return sanitizePlan(value);
    } catch (error) {
      if (error instanceof SyntaxError) storageIssue = 'Your saved plan could not be read. You can start a new plan.';
      else {
        storageAvailable = false;
        storageIssue = 'Your browser cannot save this plan. Changes will last only while this page stays open.';
      }
      return emptyPlan();
    }
  }
  let plan = readPlan();
  const preparation = [...document.querySelectorAll('[data-preparation]')];
  const preparationId = (input, index) => input.dataset.preparation || input.value || 'preparation-' + index;
  const preparationCount = byId('preparation-count');
  function announcePlan(message) {
    const text = message + (!storageAvailable ? ' Changes cannot be kept after leaving this page.' : '');
    document.querySelectorAll('[data-plan-notice]').forEach(node => { node.textContent = text; });
    if (byId('plan-status')) byId('plan-status').textContent = text;
  }
  function updateStorageNote() {
    const note = byId('preparation-storage-note');
    if (note) note.textContent = storageAvailable
      ? 'Your shortlist and checklist are saved only in this browser on this device. No application is submitted.'
      : 'Saving is unavailable in this browser. Your choices last only while this page stays open; print your plan to keep a copy.';
  }
  function renderPreparation() {
    preparation.forEach((input, index) => { input.checked = plan.preparation.includes(preparationId(input, index)); });
    if (preparationCount) preparationCount.textContent = preparation.filter(input => input.checked).length + ' of ' + preparation.length + ' preparation steps complete';
    const reset = byId('reset-preparation');
    if (reset) reset.disabled = !preparation.some(input => input.checked);
  }
  function renderSavedPrograms() {
    const selected = new Set(plan.saved);
    document.querySelectorAll('[data-saved-count]').forEach(node => { node.textContent = String(selected.size); });
    document.querySelectorAll('[data-save-program]').forEach(button => {
      const id = button.dataset.saveProgram, program = programById.get(id), saved = selected.has(id);
      button.disabled = !program;
      button.setAttribute('aria-pressed', String(saved));
      button.textContent = saved ? 'Saved ✓' : 'Save programme';
      if (program) button.setAttribute('aria-label', (saved ? 'Remove ' : 'Save ') + program.title + ', ' + program.campusLabel + (saved ? ' from your shortlist' : ' to your shortlist'));
    });
    const list = byId('saved-program-list');
    if (list) {
      const focused = document.activeElement;
      const focusedId = list.contains(focused) ? focused.closest('[data-plan-program]')?.dataset.planProgram : '';
      const focusedAction = focusedId ? focused.dataset.planAction : '';
      const fragment = document.createDocumentFragment();
      plan.saved.forEach(id => {
        const program = programById.get(id);
        if (!program) return;
        const item = document.createElement('li');
        item.className = 'saved-program-item'; item.dataset.planProgram = id;
        const title = document.createElement('h3'); title.textContent = program.title;
        const detail = document.createElement('p'); detail.className = 'saved-program-meta';
        detail.textContent = program.levelLabel + ' · ' + program.campusLabel + (program.duration ? ' · ' + program.duration : '');
        const links = document.createElement('div'); links.className = 'saved-program-links';
        const view = document.createElement('a');
        view.href = directoryHref({ q: program.title, level: program.level, campus: program.campus });
        view.textContent = 'View programme'; view.dataset.planAction = 'view';
        const source = document.createElement('a');
        source.href = program.source; source.target = '_blank'; source.rel = 'noopener noreferrer';
        source.textContent = 'Official listing ↗'; source.dataset.planAction = 'source';
        const remove = document.createElement('button');
        remove.type = 'button'; remove.className = 'saved-program-remove remove-saved'; remove.dataset.removeProgram = id;
        remove.dataset.planAction = 'remove'; remove.textContent = 'Remove';
        remove.setAttribute('aria-label', 'Remove ' + program.title + ', ' + program.campusLabel + ' from your shortlist');
        links.append(view, source); item.append(title, detail, links, remove); fragment.append(item);
      });
      list.replaceChildren(fragment);
      if (focusedId) {
        const replacement = [...list.querySelectorAll('[data-plan-program]')].find(item => item.dataset.planProgram === focusedId);
        replacement?.querySelector('[data-plan-action="' + focusedAction + '"]')?.focus({ preventScroll: true });
      }
    }
    if (byId('saved-program-empty')) byId('saved-program-empty').hidden = selected.size > 0;
    if (byId('clear-saved-programs')) byId('clear-saved-programs').disabled = !selected.size;
    renderPreparation(); updateStorageNote();
  }
  function changePlan(change) {
    // Re-read before a write so another tab's checklist or shortlist is not overwritten.
    if (storageAvailable) plan = readPlan();
    change(plan);
    plan = sanitizePlan(plan);
    if (storageAvailable) {
      try { localStorage.setItem(storageKey, JSON.stringify(plan)); storageIssue = ''; }
      catch (_) {
        storageAvailable = false;
        storageIssue = 'Your browser cannot save this plan. Changes will last only while this page stays open.';
      }
    }
    renderSavedPrograms(); refreshPrograms();
  }
  function focusPlanHeading() {
    const heading = byId('my-plan')?.querySelector('h2') || byId('saved-program-empty');
    if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
  }
  document.addEventListener('click', event => {
    const button = event.target instanceof Element ? event.target.closest('[data-save-program],[data-remove-program]') : null;
    if (!button) return;
    const id = button.dataset.saveProgram || button.dataset.removeProgram, program = programById.get(id);
    if (!program) return;
    const itemButtons = [...(byId('saved-program-list')?.querySelectorAll('[data-remove-program]') || [])];
    const removeIndex = itemButtons.indexOf(button);
    let removed = false, limited = false;
    changePlan(current => {
      removed = current.saved.includes(id);
      if (removed) current.saved = current.saved.filter(saved => saved !== id);
      else if (current.saved.length < shortlistLimit) current.saved.push(id);
      else limited = true;
    });
    announcePlan(limited ? 'Your shortlist holds up to five programmes. Remove one before adding another.' : program.title + (removed ? ' removed from your shortlist.' : ' saved to your shortlist.'));
    if (removeIndex !== -1) {
      const remaining = [...(byId('saved-program-list')?.querySelectorAll('[data-remove-program]') || [])];
      if (remaining.length) remaining[Math.min(removeIndex, remaining.length - 1)].focus({ preventScroll: true });
      else focusPlanHeading();
    } else if (button.closest('[hidden]')) focusProgramResults();
  });
  byId('clear-saved-programs')?.addEventListener('click', () => {
    changePlan(current => { current.saved = []; });
    announcePlan('Your shortlist is cleared. Your preparation checklist has been kept.');
    focusPlanHeading();
  });
  byId('print-application-plan')?.addEventListener('click', () => window.print());
  preparation.forEach((input, index) => input.addEventListener('change', () => {
    const id = preparationId(input, index), checked = input.checked;
    changePlan(current => {
      current.preparation = checked ? [...current.preparation, id] : current.preparation.filter(saved => saved !== id);
    });
    if (!storageAvailable) announcePlan('Checklist updated for this page.');
  }));
  byId('reset-preparation')?.addEventListener('click', () => {
    changePlan(current => { current.preparation = []; });
    announcePlan('Your preparation checklist is reset. Your saved programmes have been kept.');
    preparation[0]?.focus({ preventScroll: true });
  });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    plan = readPlan(); renderSavedPrograms(); refreshPrograms();
    announcePlan('Your plan was updated in another tab.');
  });
  renderSavedPrograms();
  if (storageIssue) announcePlan(storageIssue);
  const programQuery = byId('program-query');
  const programCategory = byId('program-category');
  const programGrid = byId('program-grid');

  if (programQuery && programCategory && programGrid) {
    const cards = [...programGrid.querySelectorAll('.program-card')];
    const level = byId('program-level'), campus = byId('program-campus');
    const toggle = byId('toggle-programs'), count = byId('program-count');
    const fields = { q: programQuery, category: programCategory, level, campus };
    const previewSize = 6;
    let expanded = false, announcementTimer, savedOnly = false, shareRequest = 0;
    const savedToggle = byId('toggle-saved-programs');
    const filterChips = byId('active-program-filters');
    const shareStatus = byId('program-share-status'), shareFallback = byId('program-share-fallback');
    // Use the source catalogue as well as HTML so aliases cannot become stale.
    const searchableText = new Map(cards.map(card => {
      const title = card.querySelector('h3')?.textContent.trim();
      const record = programs.find(program => program.title === title &&
        program.level === card.dataset.level && program.campus === card.dataset.campus);
      return [card, record ? programText(record) : card.dataset.search || card.querySelector('h3')?.textContent || ''];
    }));
    const params = new URLSearchParams(location.search);
    savedOnly = params.get('saved') === '1';
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

    const activeFilters = () => [
      ...Object.entries(fields).filter(([, input]) => input && input.value.trim() && input.value !== 'all')
        .map(([key, input]) => ({
          key,
          label: key === 'q' ? 'Search: ' + input.value.trim() : input.selectedOptions[0].textContent
        })),
      ...(savedOnly ? [{ key: 'saved', label: 'Saved only' }] : [])
    ];
    function matchesCard(card, ignored = '') {
      return (ignored === 'q' || matchesWords(searchableText.get(card), programQuery.value)) &&
        ['category', 'level', 'campus'].every(key => !fields[key] || ignored === key ||
          fields[key].value === 'all' || card.dataset[key] === fields[key].value) &&
        (ignored === 'saved' || !savedOnly || plan.saved.includes(card.dataset.programId));
    }
    focusProgramResults = () => {
      const target = count || programGrid;
      target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
      scrollToElement(target);
    };
    function removeFilter(key) {
      if (key === 'saved') savedOnly = false;
      else if (fields[key]) fields[key].value = key === 'q' ? '' : 'all';
      expanded = false; renderPrograms();
    }
    function clearFilters() {
      expanded = false; savedOnly = false;
      Object.values(fields).filter(Boolean).forEach(input => { input.value = input === programQuery ? '' : 'all'; });
      renderPrograms();
    }
    function renderFilterChips() {
      if (!filterChips) return;
      const fragment = document.createDocumentFragment();
      activeFilters().forEach(({ key, label }, index) => {
        const chip = document.createElement('button');
        chip.type = 'button'; chip.className = 'filter-chip'; chip.dataset.filterKey = key;
        chip.textContent = label + ' ×'; chip.setAttribute('aria-label', 'Remove filter: ' + label);
        chip.addEventListener('click', () => {
          removeFilter(key);
          const chips = [...filterChips.querySelectorAll('button')];
          if (chips.length) chips[Math.min(index, chips.length - 1)].focus({ preventScroll: true });
          else programQuery.focus({ preventScroll: true });
        });
        fragment.append(chip);
      });
      filterChips.replaceChildren(fragment);
    }
    function renderEmptyState() {
      const message = byId('empty-program-message'), actions = byId('empty-program-actions');
      if (message) message.textContent = savedOnly && !plan.saved.length
        ? 'Your shortlist is empty. Save a programme from the directory to start your plan.'
        : 'No listings match these filters. Try one of the options below.';
      if (!actions) return;
      actions.replaceChildren();
      activeFilters().forEach(({ key, label }) => {
        const recovered = cards.filter(card => matchesCard(card, key)).length;
        if (!recovered) return;
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'empty-recovery';
        button.textContent = 'Remove ' + label + ' · ' + recovered + ' listings';
        button.addEventListener('click', () => { removeFilter(key); focusProgramResults(); });
        actions.append(button);
      });
      if (savedOnly && plan.saved.length && !level) {
        const full = document.createElement('a');
        full.className = 'empty-recovery'; full.href = directoryHref({ saved: '1' });
        full.textContent = 'View your shortlist in the full directory'; actions.append(full);
      }
      if (activeFilters().length) {
        const reset = document.createElement('button');
        reset.type = 'button'; reset.className = 'empty-recovery';
        reset.textContent = 'Clear all filters';
        reset.addEventListener('click', () => { clearFilters(); focusProgramResults(); });
        actions.append(reset);
      }
    }
    function renderPrograms({ updateUrl = true, debounce = false } = {}) {
      const matches = cards.filter(card => matchesCard(card));
      const visible = new Set(expanded ? matches : matches.slice(0, previewSize));
      cards.forEach(card => { card.hidden = !visible.has(card); });
      clearTimeout(announcementTimer);
      const announcement = `Showing ${visible.size} of ${matches.length} matching program listings`;
      const announce = () => { if (count) count.textContent = announcement; };
      if (debounce) announcementTimer = setTimeout(announce, 400);
      else announce();
      const empty = byId('empty-programs');
      if (empty) empty.hidden = matches.length > 0;
      if (!matches.length) renderEmptyState();
      renderFilterChips();
      if (savedToggle) {
        savedToggle.setAttribute('aria-pressed', String(savedOnly));
        savedToggle.textContent = 'Saved only (' + plan.saved.length + ')';
      }
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
        if (savedOnly) url.searchParams.set('saved', '1');
        else url.searchParams.delete('saved');
        try { history.replaceState(history.state, '', url); } catch (_) { /* File previews still filter normally. */ }
      }
      shareRequest++;
      if (shareStatus) shareStatus.textContent = '';
      if (shareFallback) shareFallback.hidden = true;
    }
    refreshPrograms = () => {
      const focusedChip = filterChips?.contains(document.activeElement) ? document.activeElement.dataset.filterKey : '';
      renderPrograms({ updateUrl: false });
      if (focusedChip) {
        const replacement = [...filterChips.querySelectorAll('button')].find(chip => chip.dataset.filterKey === focusedChip);
        (replacement || programQuery).focus({ preventScroll: true });
      }
    };

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
      clearFilters();
      programQuery.focus();
    });
    savedToggle?.addEventListener('click', () => {
      savedOnly = !savedOnly; expanded = false; renderPrograms();
    });
    byId('copy-program-search')?.addEventListener('click', async () => {
      const url = new URL(location.href); url.hash = 'academics';
      url.searchParams.delete('saved');
      const value = url.href, request = ++shareRequest;
      if (shareFallback) shareFallback.hidden = true;
      if (shareStatus) shareStatus.textContent = 'Copying search link…';
      try {
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard is unavailable');
        await navigator.clipboard.writeText(value);
        if (request !== shareRequest) return;
        if (shareStatus) shareStatus.textContent = 'Search link copied. Your personal saved-only filter is not included.';
      } catch (_) {
        if (request !== shareRequest) return;
        if (shareFallback) {
          shareFallback.value = value; shareFallback.hidden = false;
          shareFallback.focus({ preventScroll: true }); shareFallback.select();
        }
        if (shareStatus) shareStatus.textContent = 'Automatic copying is unavailable. Select and copy the link shown below. Your personal saved-only filter is not included.';
      }
    });
    toggle?.addEventListener('click', () => {
      expanded = !expanded;
      renderPrograms({ updateUrl: false });
      if (!expanded) {
        // Keep the count and beginning of the grid visible below the sticky header.
        focusProgramResults();
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
    { title: 'My application plan', detail: 'Your saved programmes and preparation checklist', url: 'admissions.html#my-plan', keywords: 'shortlist saved plan preparation checklist print pdf' },
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
    const programmeMatches = query ? programs.filter(program => matchesWords(programText(program), query)) : [];
    if (programmeMatches.length) {
      const all = document.createElement('a');
      all.className = 'search-result search-directory-link';
      all.href = directoryHref({ q: query });
      all.textContent = 'View all ' + programmeMatches.length + ' matching programmes →';
      const detail = document.createElement('small');
      detail.textContent = 'Open the full directory with this search';
      all.append(detail); searchResults.append(all);
    }
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

  if (byId('year')) byId('year').textContent = new Date().getFullYear();
  document.querySelectorAll('[data-enhanced]').forEach(element => { element.hidden = false; });
})();
