// Build-a-Word: see a picture, hear "Spell cat.", tap letter tiles into the slots in order.
(() => {
  'use strict';

  // How much is done for the child at each level, and how many extra letters are mixed in.
  const LEVELS = [
    { given: (word) => word.length - 1, extras: 1 }, // add the last letter
    { given: () => 1, extras: 1 },                    // first letter given
    { given: () => 0, extras: 2 },                    // spell it all
    { given: () => 0, extras: 3, vowels: true },      // spell it all, extra vowels to tell apart
  ];
  const VOWELS = 'aeiou';
  const COMMON = 'satpinmdgocklrhbfeu';

  const $ = (id) => document.getElementById(id);
  const { PALETTE, random } = Fx;
  const soundOf = (letter) => SOUND_OF[letter] || letter;
  const nextFromDeck = createDeck();

  const state = {
    length: '3',
    level: 0,
    word: null,
    filled: 0,
    misses: 0,
    busy: true,
    pendingAsk: null,
  };

  const ask = () => Voice.say(`spell-${state.word}`);

  // ---------- building a round ----------

  function makeTile(letter, i) {
    const [color, shade] = PALETTE[i % PALETTE.length];
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.textContent = letter;
    tile.dataset.letter = letter;
    tile.style.setProperty('--color', color);
    tile.style.setProperty('--shade', shade);
    return tile;
  }

  // Letters that aren't in the word and don't sound like any letter in it.
  function extraLetters(word, count, preferVowels) {
    const sounds = new Set([...word].map(soundOf));
    const pool = [...COMMON].filter((l) => !sounds.has(soundOf(l)));
    const vowels = gsap.utils.shuffle(pool.filter((l) => VOWELS.includes(l)));
    const others = gsap.utils.shuffle(pool.filter((l) => !VOWELS.includes(l)));
    const ordered = preferVowels ? [...vowels, ...others] : gsap.utils.shuffle([...pool]);
    return ordered.slice(0, count);
  }

  function newRound() {
    const words = SPELL_WORDS.filter((w) => state.length === 'all' || w.length === 3);
    const word = nextFromDeck(words.map((w) => ({ word: w })), state.length).word;
    const level = LEVELS[state.level];
    const given = level.given(word);

    state.word = word;
    state.filled = given;
    state.misses = 0;
    state.busy = false;

    // Slots, with the given letters already in place
    $('slots').replaceChildren(...[...word].map((letter, i) => {
      const slot = document.createElement('div');
      slot.className = 'slot';
      if (i < given) {
        const tile = makeTile(letter, i);
        tile.classList.add('given');
        tile.disabled = true;
        slot.append(tile);
      }
      return slot;
    }));
    markNextSlot();

    // Tray: the letters still needed, plus extras, shuffled
    const needed = [...word.slice(given)];
    const letters = gsap.utils.shuffle([...needed, ...extraLetters(word, level.extras, level.vowels)]);
    $('tray').replaceChildren(...letters.map((letter, i) => {
      const tile = makeTile(letter, i + 1);
      tile.addEventListener('pointerdown', onTap);
      return tile;
    }));

    $('picture').innerHTML = PICTURES[word];
    gsap.fromTo('#picture', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' });
    gsap.from('.slot', { y: 20, opacity: 0, duration: 0.4, stagger: 0.06, delay: 0.2 });
    gsap.from('#tray .tile', { y: 80, opacity: 0, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.07, delay: 0.3 });
    state.pendingAsk = gsap.delayedCall(0.7, ask);
  }

  function markNextSlot() {
    document.querySelectorAll('.slot').forEach((slot, i) => slot.classList.toggle('next', i === state.filled));
  }

  // ---------- tapping tiles ----------

  function onTap(e) {
    const tile = e.currentTarget;
    e.preventDefault();
    if (state.busy || tile.disabled) return;
    state.pendingAsk.kill();
    const slot = document.querySelectorAll('.slot')[state.filled];
    if (tile.dataset.letter === state.word[state.filled]) place(tile, slot);
    else reject(tile, slot);
  }

  // Move the tile into the slot, animating from where it was (FLIP).
  function place(tile, slot) {
    const from = tile.getBoundingClientRect();
    tile.disabled = true;
    tile.classList.remove('hint');
    slot.append(tile);
    const to = tile.getBoundingClientRect();
    gsap.fromTo(tile, { x: from.left - to.left, y: from.top - to.top }, { x: 0, y: 0, duration: 0.35, ease: 'power3.out' });
    gsap.fromTo(tile, { scale: 1.15 }, { scale: 1, duration: 0.3, delay: 0.3, ease: 'back.out(3)' });
    Sfx.tick();

    state.filled++;
    state.misses = 0;
    markNextSlot();
    if (state.filled === state.word.length) complete();
  }

  // Fly toward the slot, shake, and fly back.
  function reject(tile, slot) {
    const from = tile.getBoundingClientRect();
    const to = slot.getBoundingClientRect();
    gsap.timeline()
      .to(tile, { x: (to.left - from.left) * 0.75, y: (to.top - from.top) * 0.75, duration: 0.25, ease: 'power2.out' })
      .to(tile, { rotation: -12, duration: 0.07 })
      .to(tile, { rotation: 10, duration: 0.08 })
      .to(tile, { rotation: 0, duration: 0.08 })
      .to(tile, { x: 0, y: 0, duration: 0.35, ease: 'power2.inOut' });
    Sfx.buzzer();
    gsap.delayedCall(0.4, () => Voice.wrong());

    state.misses++;
    if (state.misses >= 2) {
      const answer = [...document.querySelectorAll('#tray .tile')]
        .find((t) => !t.disabled && t.dataset.letter === state.word[state.filled]);
      answer?.classList.add('hint');
    }
  }

  function complete() {
    state.busy = true;
    const tiles = document.querySelectorAll('.slot .tile');
    gsap.timeline({ delay: 0.35 })
      .to(tiles, { y: -18, duration: 0.18, ease: 'power2.out', stagger: 0.12 })
      .to(tiles, { y: 0, duration: 0.3, ease: 'bounce.out', stagger: 0.12 }, 0.18);
    gsap.timeline({ delay: 0.5 })
      .to('#picture svg', { scale: 1.12, rotation: -6, duration: 0.2 })
      .to('#picture svg', { rotation: 6, duration: 0.2 })
      .to('#picture svg', { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    gsap.to('#tray .tile:not(:disabled)', { y: 60, opacity: 0, duration: 0.4, stagger: 0.05 });

    const center = Fx.centerOf($('picture'));
    gsap.delayedCall(0.4, () => {
      Fx.burst(center, PALETTE[random(0, PALETTE.length - 1, 1)][0], $('picture').offsetWidth * 0.6);
      Voice.correct(250, `word-${state.word}`);
    });
    const starEarned = Fx.addPoint(center);
    if (starEarned) gsap.delayedCall(2.6, earnStar);
    else gsap.delayedCall(3, newRound);
  }

  function earnStar() {
    let message = 'You got a star!';
    let phrase = 'star';
    if (state.level < LEVELS.length - 1) {
      state.level++;
      message = 'Now a bit harder!';
      phrase = 'harder';
    }
    Fx.earnStar(message, phrase, newRound);
  }

  // ---------- start screen ----------

  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
  gsap.from('.start-tiles .tile', { y: -60, opacity: 0, duration: 0.8, ease: 'bounce.out', stagger: 0.15, delay: 0.3 });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.length = document.querySelector('[name="length"]:checked').value;
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    Voice.say('start-build'); // playing inside the tap unlocks audio on iPad/iPhone
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
    if (!state.word) return;
    gsap.fromTo('.replay', { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    ask();
  });
})();
