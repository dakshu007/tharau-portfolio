import Lenis from 'lenis';

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const desktop = matchMedia('(min-width: 1024px)');

const $ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) => ctx.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) =>
  Array.from(ctx.querySelectorAll<T>(sel));
const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
function whenIdle(fn: () => void) {
  if ('requestIdleCallback' in window) window.requestIdleCallback(fn, { timeout: 2000 });
  else setTimeout(fn, 200);
}

/* ------------------------------------------------------------------ */
/* Smooth scrolling                                                    */
/* ------------------------------------------------------------------ */
// Lenis only smooths wheel scrolling; touch devices keep their native momentum
// (and skip a per-frame rAF loop entirely).
let lenis: Lenis | null = null;
if (!reduceMotion && finePointer) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
  root.style.scrollBehavior = 'auto';
  const raf = (t: number) => {
    lenis!.raf(t);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
}

function scrollToTarget(target: HTMLElement) {
  if (lenis) lenis.scrollTo(target, { offset: target.id === 'top' ? 0 : -24, duration: 1.4 });
  else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  // Move keyboard focus with the scroll so assistive tech follows along.
  if (target.id !== 'top') target.focus({ preventScroll: true });
}

document.addEventListener('click', (e) => {
  const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href')!.slice(1);
  const target = id ? document.getElementById(id) : null;
  if (!target) return;
  e.preventDefault();
  scrollToTarget(target);
  history.replaceState(null, '', id === 'top' || id === 'main' ? location.pathname : `#${id}`);
});

/* ------------------------------------------------------------------ */
/* Scroll-linked effects (one rAF-batched handler)                     */
/* ------------------------------------------------------------------ */
const progress = $('[data-progress]');
const nav = $('[data-nav]');
const dock = $('[data-dock]');
const growth = $('[data-growth]');
const work = $('[data-work]');
const workTrack = $('[data-work-track]');
const portrait = $('.portrait');
const statement = $('[data-words]');
const words = statement ? $$('.w', statement) : [];

let lastY = window.scrollY;
let ticking = false;
let workDistance = 0;

function layoutWork() {
  if (!work || !workTrack) return;
  const horizontal = desktop.matches && !reduceMotion;
  work.classList.toggle('is-horizontal', horizontal);
  if (!horizontal) {
    work.style.height = '';
    workTrack.style.removeProperty('--x');
    workDistance = 0;
    return;
  }
  workDistance = Math.max(0, workTrack.scrollWidth - window.innerWidth);
  work.style.height = `${window.innerHeight + workDistance}px`;
}

function onScroll() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;

  progress?.style.setProperty('--p', String(max > 0 ? y / max : 0));

  // Nav: glass once scrolled, tuck away while reading downwards.
  const goingDown = y > lastY + 2;
  const goingUp = y < lastY - 2;
  nav?.classList.toggle('is-scrolled', y > 24);
  if (goingDown && y > vh * 0.6) {
    nav?.classList.add('is-hidden');
    dock?.classList.add('is-hidden');
  } else if (goingUp || y < vh * 0.6) {
    nav?.classList.remove('is-hidden');
    dock?.classList.remove('is-hidden');
  }
  lastY = y;

  // Hero portrait parallax.
  if (portrait && y < vh * 1.2) portrait.style.setProperty('--py', `${y * 0.06}px`);

  // About statement lights up word by word.
  if (statement && words.length) {
    const r = statement.getBoundingClientRect();
    const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
    const lit = Math.round(p * words.length);
    for (let i = 0; i < words.length; i++) words[i].classList.toggle('is-on', i < lit);
  }

  // Growth curve draws itself.
  if (growth) {
    const r = growth.getBoundingClientRect();
    growth.style.setProperty('--g', String(clamp((vh - r.top) / (vh * 0.9 + r.height * 0.4))));
  }

  // Pinned horizontal case studies.
  if (work && workTrack && workDistance > 0) {
    const r = work.getBoundingClientRect();
    const p = clamp(-r.top / workDistance);
    workTrack.style.setProperty('--x', `${-p * workDistance}px`);
    work.style.setProperty('--wp', String(p));
  }
}

const requestScroll = () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(onScroll);
  }
};

if (lenis) lenis.on('scroll', requestScroll);
else window.addEventListener('scroll', requestScroll, { passive: true });

let resizeTimer = 0;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    layoutWork();
    onScroll();
  }, 120);
});
desktop.addEventListener('change', () => {
  layoutWork();
  onScroll();
});
layoutWork();
// At the very top nothing scroll-linked needs measuring yet; skip the forced layout.
if (window.scrollY > 0) onScroll();
if (reduceMotion) statement?.classList.add('is-static');

/* ------------------------------------------------------------------ */
/* Reveal-on-scroll, counters, active section                          */
/* ------------------------------------------------------------------ */
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      revealIO.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
);
$$('[data-reveal]').forEach((el) => revealIO.observe(el));

let formatter: Intl.NumberFormat | null = null;
const countIO = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      countIO.unobserve(entry.target);
      const el = entry.target as HTMLElement;
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? '';
      if (reduceMotion) continue;
      formatter ??= new Intl.NumberFormat('en-IN');
      const start = performance.now();
      const dur = 1600;
      const step = (now: number) => {
        const t = clamp((now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = formatter!.format(Math.round(end * eased)) + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  },
  { threshold: 0.6 },
);
$$('[data-count]').forEach((el) => countIO.observe(el));

const spyLinks = $$<HTMLAnchorElement>('[data-spy]');
const pill = $('[data-nav-pill]');
const pillHost = $('[data-nav-list]');

function movePill(link: HTMLElement | null) {
  if (!pill || !pillHost) return;
  if (!link || !pillHost.contains(link)) {
    pill.style.opacity = '0';
    return;
  }
  const host = pillHost.getBoundingClientRect();
  const r = link.getBoundingClientRect();
  pill.style.opacity = '1';
  pill.style.width = `${r.width}px`;
  pill.style.transform = `translateX(${r.left - host.left}px)`;
}

const sections = $$('main section[id], #contact');
const spyIO = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = entry.target.id;
      let desktopActive: HTMLElement | null = null;
      for (const link of spyLinks) {
        const on = link.dataset.spy === id;
        if (on) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
        if (on && pillHost?.contains(link)) desktopActive = link;
      }
      movePill(desktopActive);
    }
  },
  { rootMargin: '-45% 0px -50% 0px' },
);
sections.forEach((s) => spyIO.observe(s));

/* ------------------------------------------------------------------ */
/* Pointer niceties: cursor, magnetic buttons, spotlight, tilt         */
/* ------------------------------------------------------------------ */
if (finePointer && !reduceMotion) {
  const dot = $('.cursor');
  const ring = $('.cursor-ring');
  let mx = -100;
  let my = -100;
  let rx = -100;
  let ry = -100;
  let started = false;

  const loop = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (dot) dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    if (ring) ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };

  window.addEventListener(
    'pointermove',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!started) {
        started = true;
        rx = mx;
        ry = my;
        root.classList.add('has-cursor');
        requestAnimationFrame(loop);
      }
    },
    { passive: true },
  );
  document.addEventListener('pointerover', (e) => {
    const hit = (e.target as Element).closest('a, button, summary, [data-spotlight]');
    ring?.classList.toggle('is-hover', !!hit);
  });
  document.addEventListener('pointerdown', () => ring?.classList.add('is-down'));
  document.addEventListener('pointerup', () => ring?.classList.remove('is-down'));
  document.addEventListener('pointerleave', () => root.classList.remove('has-cursor'));
  document.addEventListener('pointerenter', () => started && root.classList.add('has-cursor'));

  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.28;
      const y = (e.clientY - r.top - r.height / 2) * 0.4;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });

  const tilt = $('[data-tilt]');
  const card = tilt ? $('.portrait', tilt) : null;
  if (tilt && card) {
    tilt.addEventListener('pointermove', (e) => {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--ry', `${px * 8}deg`);
      card.style.setProperty('--rx', `${-py * 8}deg`);
    });
    tilt.addEventListener('pointerleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
    });
  }
}

$$('[data-spotlight]').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
});

/* ------------------------------------------------------------------ */
/* Marquee follows scroll direction                                    */
/* ------------------------------------------------------------------ */
const marquee = $('[data-marquee]');
if (marquee && lenis) {
  lenis.on('scroll', ({ direction }: { direction: number }) => {
    if (direction) marquee.style.setProperty('--dir', direction > 0 ? 'normal' : 'reverse');
  });
}

/* ------------------------------------------------------------------ */
/* Copy email + local clock                                            */
/* ------------------------------------------------------------------ */
const status = $('[data-copy-status]');
$$<HTMLButtonElement>('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy!);
      btn.classList.add('is-copied');
      btn.setAttribute('aria-label', 'Email address copied');
      if (status) status.textContent = 'Email address copied to clipboard';
      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.setAttribute('aria-label', 'Copy email address');
      }, 2200);
    } catch {
      location.href = `mailto:${btn.dataset.copy}`;
    }
  });
});

// Intl time-zone data is slow to initialise, so the clock starts when the footer nears view.
const clock = $('[data-clock]');
if (clock) {
  const clockIO = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    clockIO.disconnect();
    startClock();
  }, { rootMargin: '600px 0px' });
  clockIO.observe(clock);
}
function startClock() {
  if (!clock) return;
  const fmt = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const tick = () => (clock.textContent = `${fmt.format(new Date())} IST`);
  tick();
  setInterval(tick, 30_000);
}

/* ------------------------------------------------------------------ */
/* Deferred extras: WebGL hero + agent tools                           */
/* ------------------------------------------------------------------ */

const canvas = $<HTMLCanvasElement>('[data-shader]');
if (canvas && !reduceMotion) {
  let booted = false;
  const boot = () => {
    if (booted) return;
    booted = true;
    removeEventListener('pointermove', boot);
    removeEventListener('touchstart', boot);
    removeEventListener('scroll', boot);
    removeEventListener('keydown', boot);
    whenIdle(() => import('./shader').then((m) => m.startShader(canvas)));
  };
  addEventListener('pointermove', boot, { passive: true, once: true });
  addEventListener('touchstart', boot, { passive: true, once: true });
  addEventListener('scroll', boot, { passive: true, once: true });
  addEventListener('keydown', boot, { once: true });
  addEventListener('load', () => setTimeout(boot, 6000));
}

addEventListener('load', () =>
  whenIdle(() => {
    if ('modelContext' in navigator) import('./agent').then((m) => m.registerAgentTools({ scrollTo: scrollToTarget }));
  }),
);

// Start decorative loops only after load, and only while they are on screen.
const animIO = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    entry.target.classList.toggle('in-view', entry.isIntersecting);
    entry.target.querySelectorAll('svg').forEach((svg) => {
      if (entry.isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });
  }
});
addEventListener('load', () => whenIdle(() => $$('[data-anim]').forEach((el) => animIO.observe(el))));
