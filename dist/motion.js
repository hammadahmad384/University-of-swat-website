// Motion is progressive: content stays visible when scripts or animation are unavailable.
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const cancel = () => running.forEach(animation => animation.cancel());
  function animate(element, frames, options = {}) {
    if (!element || preference.matches || !element.animate || element.contains(document.activeElement)) return;
    const animation = element.animate(frames, {
      duration: 650, easing: 'cubic-bezier(.22,1,.36,1)', ...options
    });
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  }
  preference.addEventListener('change', () => { if (preference.matches) cancel(); });
  document.addEventListener('focusin', cancel);
  const rise = [{ opacity: 0, transform: 'translateY(18px)' },
    { opacity: 1, transform: 'translateY(0)' }];
  animate(document.querySelector('.hero-image'),
    [{ transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 2800 });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const index = [...entry.target.parentElement.children].indexOf(entry.target);
        animate(entry.target, rise, { delay: Math.min(index, 3) * 60, fill: 'backwards' });
      });
    }, { threshold: 0.08 });
    const watch = root => root.querySelectorAll('.reveal, .quick-link, .program-card, .notice-card, .campus-art, .admissions-inner').forEach(el => observer.observe(el));
    watch(document);
    ['program-grid', 'notice-grid'].forEach(id => {
      const grid = document.getElementById(id);
      if (!grid) return;
      new MutationObserver(records => {
        records.forEach(record => record.removedNodes.forEach(node => {
          if (node.nodeType === 1) observer.unobserve(node);
        }));
        watch(grid);
      }).observe(grid, { childList: true });
    });
  }
  const header = document.querySelector('.site-header');
  if (!header) return;
  let queued = false;
  function updateNavigation() {
    queued = false;
    header.classList.toggle('is-scrolled', scrollY > 80);
  }
  addEventListener('scroll', () => {
    if (!queued) { queued = true; requestAnimationFrame(updateNavigation); }
  }, { passive: true });
  addEventListener('resize', updateNavigation);
  updateNavigation();
})();
