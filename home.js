// Homepage: one card per game. Tapping a card says the game's name, then opens it.
(() => {
  'use strict';

  const tile = (x, letter, color) => `
    <rect x="${x}" y="34" width="28" height="32" rx="6" fill="${color}"/>
    <text x="${x + 14}" y="51" text-anchor="middle" dominant-baseline="central" font-family="Andika, sans-serif" font-weight="700" font-size="22" fill="#fff">${letter}</text>`;
  const balloon = (x, y, color) => `
    <path d="M${x} ${y + 26} C${x - 4} ${y + 34} ${x + 4} ${y + 38} ${x - 2} ${y + 46}" fill="none" stroke="#7c8aa5" stroke-width="1.4"/>
    <ellipse cx="${x}" cy="${y}" rx="15" ry="18" fill="${color}"/>
    <ellipse cx="${x - 6}" cy="${y - 7}" rx="3.5" ry="6" fill="#fff" opacity="0.35" transform="rotate(-25 ${x - 6} ${y - 7})"/>`;
  const svg = (body) => `<svg viewBox="0 0 100 100" aria-hidden="true">${body}</svg>`;

  const dots = (spots) => spots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#22314d"/>`).join('');

  // Games live in games/<group>/<id>/. `ready: false` shows the card as "Soon" until it's built.
  const GROUPS = [
    { id: 'words', name: 'Words' },
    { id: 'numbers', name: 'Numbers' },
  ];
  const GAMES = [
    { group: 'words', id: 'pop-a-sound', name: 'Pop-a-Sound', ready: true,
      icon: svg(balloon(28, 42, '#ef6f6c') + balloon(52, 30, '#f2b134') + balloon(76, 44, '#2a9d8f')) },
    { group: 'words', id: 'build-a-word', name: 'Build-a-Word', ready: true,
      icon: svg(tile(6, 'c', '#ef6f6c') + tile(36, 'a', '#5f63d0') + tile(66, 't', '#2a9d8f')) },
    { group: 'words', id: 'word-slots', name: 'Word Slots', ready: true,
      icon: svg(`<rect x="10" y="22" width="80" height="60" rx="10" fill="#c2569a"/>
        ${[18, 42, 66].map((x, i) => `<rect x="${x}" y="34" width="20" height="30" rx="3" fill="#fff"/><text x="${x + 10}" y="49" text-anchor="middle" dominant-baseline="central" font-family="Andika, sans-serif" font-weight="700" font-size="18" fill="#22314d">${'hat'[i]}</text>`).join('')}
        <rect x="88" y="30" width="6" height="26" rx="3" fill="#9aa3b2"/><circle cx="91" cy="28" r="6" fill="#ef6f6c"/>`) },
    { group: 'words', id: 'blend-robot', name: 'Blend Robot', ready: true, icon: PICTURES.robot },
    { group: 'words', id: 'word-fishing', name: 'Word Fishing', ready: true, icon: PICTURES.fish },

    { group: 'numbers', id: 'count-it', name: 'Count It', ready: true,
      icon: svg(`<g transform="translate(4 14) scale(0.46)">${PICTURES.apple.replace(/<\/?svg[^>]*>/g, '')}</g>
        <g transform="translate(50 14) scale(0.46)">${PICTURES.apple.replace(/<\/?svg[^>]*>/g, '')}</g>
        <g transform="translate(27 46) scale(0.46)">${PICTURES.apple.replace(/<\/?svg[^>]*>/g, '')}</g>
        <circle cx="82" cy="78" r="15" fill="#f2b134"/><text x="82" y="79" text-anchor="middle" dominant-baseline="central" font-family="Andika, sans-serif" font-weight="700" font-size="20" fill="#fff">3</text>`) },
    { group: 'numbers', id: 'quick-peek', name: 'Quick Peek', ready: true,
      icon: svg(`<rect x="18" y="18" width="64" height="64" rx="14" fill="#fff" stroke="#22314d" stroke-width="4"/>${dots([[36, 36], [50, 50], [64, 64], [64, 36], [36, 64]])}`) },
    { group: 'numbers', id: 'number-train', name: 'Number Train', ready: true,
      icon: svg(`${[6, 38, 70].map((x, i) => `<rect x="${x}" y="34" width="26" height="30" rx="5" fill="${['#ef6f6c', '#5f63d0', '#2a9d8f'][i]}"/><text x="${x + 13}" y="50" text-anchor="middle" dominant-baseline="central" font-family="Andika, sans-serif" font-weight="700" font-size="18" fill="#fff">${i + 1}</text><circle cx="${x + 7}" cy="68" r="5" fill="#22314d"/><circle cx="${x + 19}" cy="68" r="5" fill="#22314d"/>`).join('')}`) },
    { group: 'numbers', id: 'five-little-ducks', name: 'Five Little Ducks', ready: true, icon: PICTURES.duck },
    { group: 'numbers', id: 'egg-box', name: 'Egg Box', ready: true,
      icon: svg(`<rect x="6" y="30" width="88" height="44" rx="10" fill="#d9b48a"/>${[0, 1, 2, 3, 4].map((i) => `<circle cx="${17 + i * 16.5}" cy="52" r="7" fill="#b98d5f"/>${i < 3 ? `<ellipse cx="${17 + i * 16.5}" cy="48" rx="6" ry="8" fill="#fdf6e6"/>` : ''}`).join('')}`) },
    { group: 'numbers', id: 'rocket-launch', name: 'Rocket Launch', ready: true,
      icon: svg(`<path d="M40 86 C38 94 44 98 50 100 C56 98 62 94 60 86Z" fill="#f2b134"/><path d="M34 62 L24 84 L38 80Z M66 62 L76 84 L62 80Z" fill="#ef6f6c"/><path d="M50 6 C66 20 68 42 68 60 L68 82 L32 82 L32 60 C32 42 34 20 50 6Z" fill="#f4f6fb" stroke="#c9d2e3" stroke-width="2"/><path d="M50 6 C58 14 63 22 65 30 L35 30 C37 22 42 14 50 6Z" fill="#ef6f6c"/><circle cx="50" cy="46" r="7" fill="#bfe6f5" stroke="#7c8aa5" stroke-width="3"/>`) },
    { group: 'numbers', id: 'hungry-crocodile', name: 'Hungry Crocodile', ready: true,
      icon: svg(`<path d="M4 62 C14 52 26 54 36 56 L36 74 C22 76 12 72 4 62Z" fill="#4f9a5e"/><path d="M30 60 L94 62 C98 64 98 70 94 72 L34 76Z" fill="#5fae6c"/><path d="M28 60 C28 44 42 36 56 40 L92 48 C100 50 100 58 92 60 L32 62Z" fill="#6cbf79" transform="rotate(-14 32 62)"/><circle cx="50" cy="36" r="7" fill="#fff"/><circle cx="52" cy="36" r="3.5" fill="#22314d"/>`) },
    { group: 'numbers', id: 'number-race', name: 'Number Race', ready: true,
      icon: svg(`${[0, 1, 2, 3, 4].map((i) => `<rect x="${6 + i * 18}" y="44" width="16" height="16" rx="3" fill="${i % 2 ? '#f2b134' : '#2a9d8f'}"/>`).join('')}<circle cx="32" cy="34" r="8" fill="#ef6f6c"/><path d="M80 18 V44 M80 18 L94 24 L80 30" fill="#ef6f6c" stroke="#22314d" stroke-width="3" stroke-linejoin="round"/>`) },
  ];

  const card = (g) => `
    <a class="game-card glass ${g.ready ? '' : 'soon'}" ${g.ready ? `href="games/${g.group}/${g.id}/"` : 'aria-disabled="true"'} data-id="${g.id}">
      ${g.ready ? '' : '<span class="badge">Soon</span>'}
      <div class="icon">${g.icon}</div>
      <div class="name">${g.name}</div>
    </a>`;
  const nav = document.getElementById('games');
  nav.innerHTML = GROUPS.map((group) => `
    <section class="game-group" aria-label="${group.name}">
      <h2>${group.name}</h2>
      <div class="games">${GAMES.filter((g) => g.group === group.id).map(card).join('')}</div>
    </section>`).join('');

  nav.querySelectorAll('.game-card').forEach((card) => {
    if (!Scene.reduceMotion) gsap.to(card.querySelector('.icon'), { y: -6, duration: gsap.utils.random(1.6, 2.2), ease: 'sine.inOut', yoyo: true, repeat: -1 });
    card.addEventListener('click', (e) => {
      e.preventDefault();
      if (card.classList.contains('soon')) return;
      Sfx.unlock();
      Sfx.tick();
      Voice.say(`game-${card.dataset.id}`);
      gsap.timeline()
        .to(card, { scale: 1.06, duration: 0.15, ease: 'power2.out' })
        .to(card, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
      setTimeout(() => { window.location.href = card.getAttribute('href'); }, 1100);
    });
  });

  gsap.from('.home h1, .home .tagline', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 });
  gsap.from('.game-card', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.15 });
})();
