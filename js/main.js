/* ============================================================
   Pramod Mohan Bhat — Personal Website
   js/main.js
   ============================================================ */

// ---------- Mobile navigation ----------
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('navLinks');

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});

// ---------- Sticky nav shadow ----------
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// ---------- Scroll progress bar ----------
const bar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  bar.style.width = (scrolled * 100) + '%';
}, { passive: true });

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Animated counters ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = +el.dataset.target;
  if (reduceMotion) { el.textContent = target; return; }
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target);
      countIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count').forEach(el => countIO.observe(el));

// ---------- Single-page navigation ----------
// Only one "page" (the hero, or one section) is ever visible at a time.
// Sections are hidden by default via CSS; clicking a nav link shows exactly
// one and hides the rest — there is no continuous scroll between pages.
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const allSections = document.querySelectorAll('section[id]');

function showPage(id, opts = {}) {
  const target = id && id !== 'top' ? document.getElementById(id) : null;
  const isSection = target && target.tagName === 'SECTION';

  allSections.forEach(el => el.classList.remove('page-active'));

  if (isSection) {
    document.body.classList.add('showing-section');
    target.classList.add('page-active');
  } else {
    document.body.classList.remove('showing-section');
  }

  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + (isSection ? id : 'top'));
  });

  if (!opts.skipScroll) {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
  if (!opts.skipHistory) {
    try { history.pushState(null, '', isSection ? '#' + id : '#top'); }
    catch (err) { /* ignore — some local file:// contexts restrict history API */ }
  }

  links.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  const id = a.getAttribute('href').slice(1);
  if (id === 'top' || document.getElementById(id)) {
    a.addEventListener('click', e => {
      e.preventDefault();
      showPage(id);
    });
  }
});

window.addEventListener('popstate', () => {
  showPage(location.hash ? location.hash.slice(1) : 'top', { skipHistory: true });
});

// Initial load: honor a deep link (e.g. shared #experience URL), default to hero
showPage(location.hash ? location.hash.slice(1) : 'top', { skipScroll: true, skipHistory: true });

// ---------- Back to top ----------
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
}, { passive: true });

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

