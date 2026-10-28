// What the installed app keeps on the device. Used by sw.js (the service worker) and by the
// homepage's "download sounds" panel. Paths are relative to the site root.
//
// When you add a file, list it in OFFLINE.files. Regenerated voice clips need nothing: their
// addresses carry a fingerprint (cat.m4a?v=…), so devices fetch the new ones by themselves.
const OFFLINE = {
  appCache: 'word-games-app-v2', // bump when files move, so old addresses are dropped
  audioCache: 'word-games-audio-v3', // v3: clip addresses now carry fingerprints; drops the old copies
  // Libraries and fonts from other sites, saved the first time they load.
  libraryCache: 'word-games-libraries',
  files: [
    './',
    'home.css',
    'home.js',
    'install.js',
    'manifest.webmanifest',
    'icons/icon.svg',
    'icons/icon-192.png',
    'icons/icon-512.png',
    'icons/apple-touch-icon.png',
    'audio/manifest.json',
    ...['deck', 'effects', 'numbers', 'offline', 'phrases', 'pictures', 'pictures-2', 'pictures-3', 'pictures-4',
      'scene', 'sounds', 'voice', 'words'].map((name) => `shared/${name}.js`),
    'shared/theme.css',
    // Folder addresses rather than .../index.html, because Cloudflare redirects index.html to the folder.
    ...[
      'words/pop-a-sound', 'words/build-a-word', 'words/word-slots', 'words/blend-robot', 'words/word-fishing',
      'numbers/count-it', 'numbers/quick-peek', 'numbers/number-train', 'numbers/five-little-ducks',
      'numbers/egg-box', 'numbers/rocket-launch', 'numbers/hungry-crocodile', 'numbers/number-race',
    ].flatMap((game) => [`games/${game}/`, `games/${game}/game.js`, `games/${game}/style.css`]),
  ],
  libraries: [
    'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
    'https://fonts.googleapis.com/css2?family=Andika:wght@400;700&family=Outfit:wght@400;600;700&display=swap',
  ],
};
