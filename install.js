// Homepage panel for grown-ups: install the app, and download every voice clip so the games
// work with no internet. Clips also save themselves as they play; this gets them all at once.
(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const show = (id) => { $(id).classList.remove('hidden'); $('app-panel').classList.remove('hidden'); };
  const hide = (id) => $(id).classList.add('hidden');

  const installed = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  // iPadOS reports itself as a Mac, so also look for a touch screen.
  const apple = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // ---------- install ----------

  // Chrome, Edge and Android offer their own install prompt; we keep it for the button.
  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;
    show('install-row');
  });
  $('install').addEventListener('click', async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') hide('install-row');
    installPrompt = null;
  });
  window.addEventListener('appinstalled', () => hide('install-row'));

  // Safari has no prompt: show the Share → Add to Home Screen steps instead.
  if (apple && !installed) {
    $('share-icon').innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M6 11H5v10h14V11h-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    show('ios-row');
  }

  // ---------- offline voice clips ----------

  if (!('serviceWorker' in navigator) || !('caches' in window)) return;

  const audioBase = new URL('audio/', document.baseURI);
  const button = $('offline-button');
  const bar = $('offline-bar');
  let downloading = false;

  function status(title, detail) {
    $('offline-title').textContent = title;
    $('offline-detail').textContent = detail;
  }

  async function missingClips() {
    const list = await fetch(new URL('manifest.json', audioBase), { cache: 'no-cache' }).then((r) => r.json());
    const urls = Object.entries(list).map(([id, v]) => new URL(`${id}.m4a?v=${v}`, audioBase).href);
    const cache = await caches.open(OFFLINE.audioCache);
    const saved = new Set((await cache.keys()).map((r) => r.url));
    return { cache, total: urls.length, missing: urls.filter((url) => !saved.has(url)) };
  }

  function ready() {
    status('Ready to play without internet', 'All the voice clips are saved on this device');
    hide('offline-bar');
    hide('offline-button');
    $('offline-row').classList.add('done');
  }

  async function download() {
    if (downloading) return;
    downloading = true;
    navigator.storage?.persist?.(); // ask the browser not to clear the clips when space is low
    button.disabled = true;
    bar.classList.remove('hidden');
    try {
      const { cache, total, missing } = await missingClips();
      let done = total - missing.length;
      const fill = bar.querySelector('span');
      const update = () => {
        fill.style.width = `${(done / total) * 100}%`;
        status('Downloading voice clips…', `${done} of ${total}`);
      };
      update();
      // a few at a time, so the download is quick without swamping a slow connection
      const queue = [...missing];
      const worker = async () => {
        while (queue.length) {
          const url = queue.shift();
          const response = await fetch(url);
          if (!response.ok) throw new Error(url);
          await cache.put(url, response);
          done++;
          update();
        }
      };
      await Promise.all(Array.from({ length: 6 }, worker));
      ready();
    } catch {
      status("Couldn't finish downloading", 'Check the internet connection and try again');
      button.textContent = 'Try again';
      button.disabled = false;
    }
    downloading = false;
  }

  button.addEventListener('click', download);

  missingClips().then(({ missing }) => {
    show('offline-row');
    if (!missing.length) ready();
    else if (installed) download(); // the installed app gets everything without being asked
  }).catch(() => {});
})();
