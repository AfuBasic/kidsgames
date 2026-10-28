// Word Slots: a slot machine shows "? a t". Hear "Can you make hat?", tap a letter, and the
// lever spins the first reel to it. Stays on one rhyming family until all its words are made.
(() => {
  'use strict';

  const CHOICES_PER_LEVEL = [2, 3, 4];
  const FILLERS = 'bcdfghjlmnprstvwz'; // extra first letters when a family is small
  const BULBS = 9;

  const $ = (id) => document.getElementById(id);
  const { PALETTE, pick } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);
  const soundOf = (letter) => SOUND_OF[letter] || letter;
  const nextFamily = createDeck({ recent: 6 });
  let reels = [];

  const state = {
    length: '3',
    level: 0,
    family: null,
    queue: [],
    word: null,
    misses: 0,
    busy: true,
    pendingAsk: null,
  };

  const ask = () => Voice.say(`make-${state.word}`);

  // ---------- reels, lever and lights ----------

  // Spin a reel through random letters and stop on `final`.
  function spinReel(reel, final, { turns = 10, duration = 1.1 } = {}) {
    const strip = reel.querySelector('.strip');
    const current = strip.lastElementChild.textContent;
    const letters = [current, ...Array.from({ length: turns }, () => pick([...FILLERS, 'a', 'e', 'i', 'o', 'u'])), final];
    strip.innerHTML = letters.map((l) => `<span>${l}</span>`).join('');
    const height = reel.clientHeight;
    let shown = 0;
    return gsap.fromTo(strip, { y: 0 }, {
      y: -height * (letters.length - 1),
      duration,
      ease: 'power3.out',
      onUpdate() {
        const index = Math.round(-gsap.getProperty(strip, 'y') / height);
        if (index !== shown) {
          shown = index;
          Sfx.tick();
        }
      },
    });
  }

  function setReel(reel, letter) {
    const strip = reel.querySelector('.strip');
    strip.innerHTML = `<span>${letter}</span>`;
    gsap.set(strip, { y: 0 });
  }

  function pullLever() {
    gsap.timeline()
      .to('.lever .stick', { scaleY: -0.8, duration: 0.22, ease: 'power2.in' })
      .to('.lever .stick', { scaleY: 1, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
  }

  const bulbs = Array.from({ length: BULBS }, () => {
    const b = document.createElement('span');
    b.className = 'bulb';
    return b;
  });
  document.querySelector('.marquee').append(...bulbs);
  let chase = null;

  function idleLights() {
    chase?.kill();
    chase = gsap.fromTo(bulbs, { opacity: 0.35 }, {
      opacity: 1, duration: 0.5, ease: 'sine.inOut', stagger: { each: 0.12, repeat: -1, yoyo: true },
    });
  }

  function flashLights() {
    chase?.kill();
    chase = gsap.fromTo(bulbs, { opacity: 0.2 }, { opacity: 1, duration: 0.12, repeat: 9, yoyo: true, onComplete: idleLights });
  }

  // ---------- families and words ----------

  const familiesFor = (length) => {
    const families = WORD_FAMILIES.filter((f) => length === 'both' || f.ending.length + 1 === Number(length));
    return families.length ? families : WORD_FAMILIES;
  };

  // One reel per letter: the first one spins to the child's choice, the rest show the ending.
  function buildReels(count) {
    if (reels.length === count) return;
    const keep = reels.map((reel) => reel.querySelector('.strip').lastElementChild.textContent);
    $('window').replaceChildren(...Array.from({ length: count }, (_, i) => {
      const reel = document.createElement('div');
      reel.className = i === 0 ? 'reel first' : 'reel';
      reel.innerHTML = `<div class="strip"><span>${keep[i] || (i === 0 ? '?' : '')}</span></div>`;
      return reel;
    }));
    reels = [...document.querySelectorAll('.reel')];
    $('window').classList.toggle('four', count === 4);
  }

  function startFamily() {
    const families = familiesFor(state.length);
    state.family = nextFamily(families.map((f) => ({ ...f, word: f.ending })), state.length);
    state.queue = shuffle([...state.family.words]);
    $('made').replaceChildren();
    buildReels(state.family.ending.length + 1);
    Sfx.chime();
    pullLever();
    spinReel(reels[0], '?', { turns: 8, duration: 1 });
    [...state.family.ending].forEach((letter, i) => spinReel(reels[i + 1], letter, { turns: 12 + i * 4, duration: 1.3 + i * 0.3 }));
    gsap.delayedCall(1.4 + state.family.ending.length * 0.3, nextWord);
  }

  function nextWord() {
    if (!state.queue.length) {
      startFamily();
      return;
    }
    state.word = state.queue.pop();
    state.misses = 0;
    state.busy = false;
    setReel(reels[0], '?');

    $('picture').innerHTML = PICTURES[state.word];
    gsap.fromTo('#picture', { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' });

    // The right first letter, other first letters from the same family, then fillers.
    const target = state.word[0];
    const count = CHOICES_PER_LEVEL[state.level];
    const clash = (l) => soundOf(l) === soundOf(target);
    const family = shuffle(state.family.words.map((w) => w[0]).filter((l) => !clash(l)));
    const fillers = shuffle([...FILLERS].filter((l) => !clash(l) && !family.includes(l)));
    const letters = shuffle([target, ...[...family, ...fillers].slice(0, count - 1)]);

    $('choices').replaceChildren(...letters.map((letter, i) => {
      const [color, shade] = PALETTE[(i * 2 + 1) % PALETTE.length];
      const tile = document.createElement('button');
      tile.className = 'tile';
      tile.textContent = letter;
      tile.dataset.letter = letter;
      tile.style.setProperty('--color', color);
      tile.style.setProperty('--shade', shade);
      tile.addEventListener('pointerdown', onTap);
      return tile;
    }));
    gsap.from('#choices .tile', { y: 60, opacity: 0, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.08 });
    state.pendingAsk = gsap.delayedCall(0.6, ask);
  }

  // ---------- playing ----------

  function onTap(e) {
    const tile = e.currentTarget;
    e.preventDefault();
    if (state.busy) return;
    state.busy = true;
    state.pendingAsk.kill();
    Voice.stop();
    gsap.fromTo(tile, { scale: 0.88 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });

    const letter = tile.dataset.letter;
    pullLever();
    spinReel(reels[0], letter).then(() => (letter === state.word[0] ? win() : miss(tile)));
  }

  function win() {
    const reelWindow = $('window');
    reelWindow.classList.add('win');
    flashLights();
    const center = Fx.centerOf(reelWindow);
    Fx.burst(center, '#ffd66e', reelWindow.offsetWidth * 0.7);
    Voice.say(`word-${state.word}`);
    gsap.timeline()
      .to('#picture svg', { scale: 1.12, rotation: -6, duration: 0.2 })
      .to('#picture svg', { rotation: 6, duration: 0.2 })
      .to('#picture svg', { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    gsap.to('#choices .tile', { y: 50, opacity: 0, duration: 0.4, stagger: 0.05, delay: 0.3 });

    // Collect the word under the machine, its shared ending in plain letters
    const chip = document.createElement('span');
    chip.className = 'chip glass';
    chip.innerHTML = `<b>${state.word[0]}</b>${state.word.slice(1)}`;
    $('made').append(chip);
    gsap.from(chip, { scale: 0, duration: 0.5, ease: 'back.out(2.5)', delay: 0.4 });

    gsap.delayedCall(2.4, () => reelWindow.classList.remove('win'));
    if (Fx.addPoint(center)) gsap.delayedCall(2.4, earnStar);
    else gsap.delayedCall(2.6, nextWord);
  }

  function miss(tile) {
    Sfx.buzzer();
    gsap.timeline()
      .to('.machine', { x: -8, duration: 0.06 })
      .to('.machine', { x: 8, duration: 0.08 })
      .to('.machine', { x: -4, duration: 0.08 })
      .to('.machine', { x: 0, duration: 0.1 });
    gsap.to(tile, { opacity: 0.35, duration: 0.3 });
    tile.disabled = true;
    gsap.delayedCall(0.3, () => Voice.wrong());

    state.misses++;
    if (state.misses >= 2) {
      document.querySelector(`#choices .tile[data-letter="${state.word[0]}"]`)?.classList.add('hint');
    }
    gsap.delayedCall(1.1, () => {
      spinReel(reels[0], '?', { turns: 4, duration: 0.4 });
      state.busy = false;
    });
  }

  function earnStar() {
    let message = 'You got a star!';
    let phrase = 'star';
    if (state.level < CHOICES_PER_LEVEL.length - 1) {
      state.level++;
      message = 'Now a bit harder!';
      phrase = 'harder';
    }
    Fx.earnStar(message, phrase, nextWord);
  }

  // ---------- start screen ----------

  idleLights();
  buildReels(3);
  const count = (length) => {
    const families = familiesFor(length);
    return `${families.length} families, ${families.reduce((n, f) => n + f.words.length, 0)} words`;
  };
  $('family-note').textContent = `3-letter: ${count('3')}. 4-letter: ${count('4')}. The game stays on one `
    + 'rhyming family until every word in it is made, then spins to a new one. Every 5 words earns a star, '
    + 'and each star adds a letter to choose from.';
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
  gsap.from('.start-tiles .tile', { y: -60, opacity: 0, duration: 0.8, ease: 'bounce.out', stagger: 0.15, delay: 0.3 });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    state.length = document.querySelector('[name="length"]:checked').value;
    Voice.say('start-slots'); // playing inside the tap unlocks audio on iPad/iPhone
    gsap.to('#start', {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        $('start').classList.add('hidden');
        startFamily();
      },
    });
  });

  document.querySelector('.replay').addEventListener('click', () => {
    if (!state.word) return;
    gsap.fromTo('.replay', { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    ask();
  });
})();
