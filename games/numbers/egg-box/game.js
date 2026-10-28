// Egg Box: an egg carton of 5 or 10 (a five- or ten-frame) with some eggs in. "How many more
// eggs to fill the box?" The missing eggs then drop in one by one and the voice says the bond:
// "Seven and three make ten!" Builds number bonds to 5 and 10.
(() => {
  'use strict';

  // Each level: how the eggs already in the box are placed.
  //   full-row: in order, and for a box of 10 the top row is always full (6 to 9 eggs)
  //   in-order: in order, any amount
  //   anywhere: in any holes, so the gaps are scattered
  const LEVELS = [{ eggs: 'full-row' }, { eggs: 'in-order' }, { eggs: 'anywhere' }];

  const $ = (id) => document.getElementById(id);
  const { random, PALETTE } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);
  const nextFromDeck = createDeck({ recent: 2 });

  const state = {
    total: 5,
    level: 0,
    have: 0,
    misses: 0,
    busy: true,
    pendingAsk: null,
    firstRound: true,
  };

  // A speckled cream egg with a shine.
  const EGG = `<svg viewBox="0 0 60 70">
    <defs><radialGradient id="egg-shade" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#fffdf7"/><stop offset="0.7" stop-color="#f6ead2"/><stop offset="1" stop-color="#e3cfa8"/></radialGradient></defs>
    <path d="M30 4 C46 4 56 28 56 44 C56 60 44 68 30 68 C16 68 4 60 4 44 C4 28 14 4 30 4Z" fill="url(#egg-shade)"/>
    <circle cx="38" cy="40" r="1.6" fill="#d8c19a"/><circle cx="22" cy="50" r="1.3" fill="#d8c19a"/><circle cx="34" cy="56" r="1.1" fill="#d8c19a"/>
    <ellipse cx="22" cy="24" rx="5" ry="9" fill="#fff" opacity="0.7" transform="rotate(20 22 24)"/>
  </svg>`;

  const holes = () => [...document.querySelectorAll('#carton .hole')];

  function buildCarton(el, total, filled) {
    el.innerHTML = Array.from({ length: total }, (_, i) => `<div class="hole" data-index="${i}">${filled.includes(i) ? `<div class="egg">${EGG}</div>` : ''}</div>`).join('');
  }

  // Which holes the eggs go in, for this level.
  function eggSpots(have) {
    if (LEVELS[state.level].eggs === 'anywhere') return shuffle([...Array(state.total).keys()]).slice(0, have);
    return [...Array(have).keys()];
  }

  function haveFor() {
    const lowest = LEVELS[state.level].eggs === 'full-row' && state.total === 10 ? 5 : 0;
    const options = Array.from({ length: state.total - lowest }, (_, i) => ({ word: String(lowest + i) }));
    return Number(nextFromDeck(options, `${state.total}-${state.level}`).word);
  }

  // ---------- numbers ----------

  function showNumbers() {
    const answer = state.total - state.have;
    $('numbers').replaceChildren(...spacedChoices(answer, 1, state.total).map((n, i) => {
      const [color, shade] = PALETTE[(i + 2) % PALETTE.length];
      const tile = document.createElement('button');
      tile.className = 'tile';
      tile.textContent = n;
      tile.dataset.number = n;
      tile.style.setProperty('--color', color);
      tile.style.setProperty('--shade', shade);
      tile.addEventListener('pointerdown', onTapNumber);
      return tile;
    }));
    gsap.from('.numbers .tile', { y: 40, opacity: 0, duration: 0.45, ease: 'back.out(1.7)', stagger: 0.06 });
  }

  // Eggs drop into the empty holes, counted one by one ("one, two, three"), then `after` is said.
  // `ghost` eggs are see-through, to show the gaps without filling them.
  function fillGaps({ before = [], after = [], ghost = false, onDone } = {}) {
    const empty = holes().filter((h) => !h.querySelector('.egg'));
    Voice.sequence([...before, ...empty.map((_, i) => `num-${i + 1}`), ...after], {
      gap: 240,
      onEach: (i) => {
        const hole = empty[i - before.length];
        if (!hole) return;
        hole.insertAdjacentHTML('beforeend', `<div class="egg ${ghost ? 'ghost' : ''}">${EGG}</div><div class="count">${i - before.length + 1}</div>`);
        Sfx.pop();
        gsap.from(hole.querySelector('.egg'), { y: -120, opacity: 0, duration: 0.45, ease: 'bounce.out' });
        gsap.from(hole.querySelector('.count'), { scale: 0, duration: 0.3, ease: 'back.out(3)', delay: 0.2 });
      },
      onDone,
    });
  }

  function clearGhosts() {
    document.querySelectorAll('#carton .egg.ghost, #carton .count').forEach((el) => el.remove());
  }

  // ---------- rounds ----------

  const ask = () => Voice.say('eggs-how-many-more');

  function newRound() {
    state.have = haveFor();
    state.misses = 0;
    state.busy = false;
    buildCarton($('carton'), state.total, eggSpots(state.have));
    gsap.from('#carton', { y: -40, opacity: 0, duration: 0.5, ease: 'power2.out' });
    gsap.from('#carton .egg', { scale: 0, duration: 0.35, ease: 'back.out(2)', stagger: 0.05, delay: 0.2 });
    showNumbers();
    // The first question waits for the intro ("Let's fill the egg boxes!") to finish.
    state.pendingAsk = gsap.delayedCall(state.firstRound ? 2 : 0.8, ask);
    state.firstRound = false;
  }

  function onTapNumber(e) {
    const tile = e.currentTarget;
    e.preventDefault();
    if (state.busy || tile.disabled) return;
    state.pendingAsk?.kill();
    if (Number(tile.dataset.number) === state.total - state.have) right(tile);
    else wrong(tile);
  }

  function right(tile) {
    state.busy = true;
    tile.classList.add('right');
    Sfx.chime();
    Fx.burst(Fx.centerOf(tile), tile.style.getPropertyValue('--color'), tile.offsetWidth * 1.2);
    gsap.to('.numbers .tile:not(.right)', { opacity: 0.25, duration: 0.3 });
    clearGhosts();
    const bond = `bond-${state.have}-${state.total - state.have}`;
    fillGaps({
      after: [bond],
      onDone: () => {
        gsap.fromTo('#carton', { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
        if (Fx.addPoint(Fx.centerOf($('carton')))) gsap.delayedCall(1, earnStar);
        else gsap.delayedCall(1.2, nextRound);
      },
    });
  }

  function wrong(tile) {
    Sfx.buzzer();
    tile.disabled = true;
    gsap.timeline()
      .to(tile, { x: -10, duration: 0.06 })
      .to(tile, { x: 10, duration: 0.08 })
      .to(tile, { x: 0, duration: 0.1 });
    state.misses++;

    if (state.misses >= 2) {
      // Count the empty spaces with see-through eggs; then the right number glows.
      state.busy = true;
      fillGaps({
        before: ['count-empty'],
        ghost: true,
        onDone: () => {
          document.querySelector(`.numbers .tile[data-number="${state.total - state.have}"]`)?.classList.add('hint');
          state.busy = false;
        },
      });
      return;
    }
    Voice.wrong();
    state.pendingAsk = gsap.delayedCall(2.2, ask);
  }

  function nextRound() {
    gsap.to('#carton', { y: 60, opacity: 0, duration: 0.35, ease: 'power2.in' });
    gsap.to('.numbers .tile', { scale: 0, opacity: 0, duration: 0.3, stagger: 0.03, onComplete: () => {
      gsap.set('#carton', { y: 0, opacity: 1 });
      newRound();
    } });
  }

  function earnStar() {
    let message = 'You got a star!';
    let phrase = 'star';
    if (state.level < LEVELS.length - 1) {
      state.level++;
      message = 'Now a bit harder!';
      phrase = 'harder';
    }
    Fx.earnStar(message, phrase, nextRound);
  }

  // ---------- start screen ----------

  const art = document.createElement('div');
  art.className = 'carton';
  $('start-art').append(art);
  buildCarton(art, 5, [0, 1, 2]);
  gsap.from('.start-art .egg', { y: -40, opacity: 0, duration: 0.6, ease: 'bounce.out', stagger: 0.15, delay: 0.3 });
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.total = Number(document.querySelector('[name="total"]:checked').value);
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    Voice.say('start-eggs'); // playing inside the tap unlocks audio on iPad/iPhone
    gsap.to('#start', {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        $('start').classList.add('hidden');
        newRound();
      },
    });
  });

  document.querySelector('.replay').addEventListener('click', () => {
    if (state.busy) return;
    gsap.fromTo('.replay', { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    state.pendingAsk?.kill();
    ask();
  });
})();
