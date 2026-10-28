// Shared page furniture: the sky scenery, and the home button with its "Go home?" check.
// A page that should have a home button sets data-home="<path to the homepage>" on <body>.
const Scene = (() => {
  const CLOUD = '<path d="M30 70 C10 70 6 48 24 42 C22 22 48 14 62 28 C70 8 104 6 114 28 C132 16 160 24 158 44 C182 42 192 70 168 70Z"/>';
  const HOME_ICON = `<svg viewBox="0 0 100 100" aria-hidden="true">
    <path d="M14 50 L50 16 L86 50 M26 40 V84 H74 V40" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M42 84 V62 H58 V84" fill="currentColor"/></svg>`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const siteRoot = new URL('../', document.currentScript.src);

  // The service worker (sw.js) makes the installed app work offline.
  function registerOffline() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(new URL('sw.js', siteRoot), { scope: siteRoot.href }).catch(() => {});
    });
  }

  function scenery() {
    const el = document.createElement('div');
    el.id = 'scenery';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `
      <div class="sun-glow"></div>
      <svg class="cloud" style="top: 9vh; width: 220px" viewBox="0 0 200 80">${CLOUD}</svg>
      <svg class="cloud" style="top: 30vh; width: 150px; opacity: 0.7" viewBox="0 0 200 80">${CLOUD}</svg>
      <svg class="cloud" style="top: 52vh; width: 260px; opacity: 0.55" viewBox="0 0 200 80">${CLOUD}</svg>
      <svg class="hills" viewBox="0 0 1000 200" preserveAspectRatio="none">
        <path d="M0 120 C160 60 320 70 480 110 C640 150 800 70 1000 90 V200 H0Z" fill="#b9d8c2"/>
        <path d="M0 160 C200 110 380 130 560 150 C740 170 860 120 1000 140 V200 H0Z" fill="#9cc8ac"/>
      </svg>`;
    document.body.prepend(el);
    if (reduceMotion) return;
    el.querySelectorAll('.cloud').forEach((cloud, i) => {
      gsap.fromTo(cloud, { x: -cloud.getBoundingClientRect().width }, {
        x: window.innerWidth, duration: 70 + i * 30, ease: 'none', repeat: -1,
      }).progress(gsap.utils.random(0, 1));
    });
  }

  function homeButton(homeUrl) {
    const button = document.createElement('button');
    button.className = 'home-button glass';
    button.setAttribute('aria-label', 'Go home');
    button.innerHTML = HOME_ICON;
    document.body.append(button);

    const ask = document.createElement('section');
    ask.className = 'overlay confirm hidden';
    ask.innerHTML = `
      <div class="card glass">
        <h2>Go home?</h2>
        <div class="confirm-buttons">
          <button class="confirm-yes" aria-label="Yes, go home">✓</button>
          <button class="confirm-no" aria-label="No, keep playing">✕</button>
        </div>
      </div>`;
    document.body.append(ask);

    button.addEventListener('click', () => {
      Sfx.unlock();
      ask.classList.remove('hidden');
      gsap.fromTo(ask.querySelector('.card'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' });
      Voice.say('go-home');
    });
    ask.querySelector('.confirm-no').addEventListener('click', () => ask.classList.add('hidden'));
    ask.querySelector('.confirm-yes').addEventListener('click', () => {
      Voice.stop();
      window.location.href = homeUrl;
    });
  }

  // Settings panels slide their groups in when opened.
  function animateSettings() {
    document.querySelectorAll('details.settings').forEach((details) => {
      details.addEventListener('toggle', () => {
        if (!details.open || reduceMotion) return;
        gsap.fromTo(details.querySelectorAll('fieldset, .note'), { y: 14, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.06,
        });
        gsap.fromTo(details.querySelectorAll('label'), { scale: 0.94 }, {
          scale: 1, duration: 0.4, ease: 'back.out(2)', stagger: 0.02, clearProps: 'transform', // keeps the tap press effect
        });
      });
    });
  }

  scenery();
  registerOffline();
  if (document.body.dataset.home) homeButton(document.body.dataset.home);
  document.addEventListener('DOMContentLoaded', animateSettings);
  return { reduceMotion };
})();
