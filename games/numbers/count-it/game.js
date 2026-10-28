// Count It: a group of pictures (5 apples) and a few numbers. Tapping a picture counts it:
// it gets a number badge and the voice says the number. The child then taps how many there are.
// After each answer the voice counts them all aloud as each one lights up.
(() => {
  'use strict';

  // Each level: how many numbers to choose from, whether they're next to the answer (4 vs 5),
  // and whether the pictures are scattered instead of in tidy rows of five.
  const LEVELS = [
    { choices: 2, near: false, scatter: false },
    { choices: 3, near: false, scatter: false },
    { choices: 4, near: true, scatter: true },
  ];
  const COUNT_GAP = 260; // ms between counted numbers, slow enough to follow with a finger

  const $ = (id) => document.getElementById(id);
  const { pick, random, PALETTE } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);
  const nextFromDeck = createDeck({ recent: 2 });
  const recentThings = [];

  const state = {
    range: 5,
    level: 0,
    count: 0,
    thing: null,
    counted: 0,
    misses: 0,
    countAloud: true,
    busy: true,
    pendingAsk: null,
    firstRound: true,
  };

  // ---------- the pictures ----------

  function makeThing(name) {
    const thing = document.createElement('button');
    thing.className = 'thing';
    thing.innerHTML = `${PICTURES[name]}<span class="badge"></span>`;
    return thing;
  }

  // Tidy: rows of five, like a ten-frame, so amounts are easy to see. Scattered: random spots
  // with no overlaps. Returns centre points and a size, all in pixels inside the mat.
  function layout(n, width, height, scatter) {
    if (scatter) {
      const size = Math.min(130, Math.sqrt((width * height) / (n * 2.6)));
      const spots = [];
      for (let tries = 0; spots.length < n && tries < 4000; tries++) {
        const spot = { x: random(size * 0.7, width - size * 0.7), y: random(size * 0.7, height - size * 0.7) };
        if (spots.every((s) => Math.hypot(s.x - spot.x, s.y - spot.y) > size * 1.15)) spots.push(spot);
      }
      // reading order, so counting aloud goes left to right, top to bottom
      if (spots.length === n) return { size, spots: spots.sort((a, b) => (Math.abs(a.y - b.y) < size * 0.6 ? a.x - b.x : a.y - b.y)) };
    }
    const cols = Math.min(n, 5);
    const rows = Math.ceil(n / 5);
    const cell = Math.min(width / (cols + 0.4), height / (rows + 0.3), 150);
    const size = cell * 0.78;
    const left = (width - cols * cell) / 2 + cell / 2;
    const top = (height - rows * cell) / 2 + cell / 2;
    return { size, spots: Array.from({ length: n }, (_, i) => ({ x: left + (i % 5) * cell, y: top + Math.floor(i / 5) * cell })) };
  }

  function showThings() {
    const mat = $('mat');
    const { size, spots } = layout(state.count, mat.clientWidth - 24, mat.clientHeight - 24, LEVELS[state.level].scatter);
    mat.replaceChildren(...spots.map((spot, i) => {
      const thing = makeThing(state.thing);
      thing.dataset.index = i;
      thing.setAttribute('aria-label', COUNTABLES[state.thing]);
      thing.style.setProperty('--size', `${size}px`);
      Object.assign(thing.style, { width: `${size}px`, height: `${size}px` });
      gsap.set(thing, { x: 12 + spot.x - size / 2, y: 12 + spot.y - size / 2, rotation: LEVELS[state.level].scatter ? random(-12, 12) : 0 });
      thing.addEventListener('pointerdown', onTapThing);
      return thing;
    }));
    gsap.from('#mat .thing', { scale: 0, duration: 0.45, ease: 'back.out(2)', stagger: 0.05 });
  }

  // Tapping a picture counts it (once). The badge shows how far the child has got.
  function onTapThing(e) {
    const thing = e.currentTarget;
    e.preventDefault();
    if (state.busy) return;
    if (thing.classList.contains('counted')) {
      gsap.fromTo(thing, { rotation: -8 }, { rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
      return;
    }
    state.pendingAsk?.kill();
    state.counted++;
    mark(thing, state.counted);
    Voice.say(`num-${state.counted}`);
  }

  function mark(thing, number) {
    thing.classList.add('counted');
    thing.querySelector('.badge').textContent = number;
    Sfx.tick();
    gsap.timeline()
      .to(thing, { scale: 1.18, duration: 0.14, ease: 'power2.out' })
      .to(thing, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    gsap.fromTo(thing.querySelector('.badge'), { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' });
  }

  function clearMarks() {
    document.querySelectorAll('#mat .thing').forEach((t) => t.classList.remove('counted', 'last'));
    state.counted = 0;
  }

  // The voice counts every picture, lighting each one as its number is said.
  // `before` and `after` are phrases said first and last ("Let's count them together.", "Great!").
  function countAll({ before = [], after = [], onDone } = {}) {
    clearMarks();
    const things = [...document.querySelectorAll('#mat .thing')];
    const numbers = things.map((_, i) => `num-${i + 1}`);
    Voice.sequence([...before, ...numbers, ...after], {
      gap: COUNT_GAP,
      onEach: (i) => {
        const n = i - before.length;
        if (n < 0 || n >= things.length) return;
        mark(things[n], n + 1);
        if (n === things.length - 1) things[n].classList.add('last'); // the last number is how many
      },
      onDone,
    });
  }

  // ---------- numbers to choose from ----------

  function choicesFor(answer) {
    const { choices, near } = LEVELS[state.level];
    const all = Array.from({ length: Math.max(state.range, choices) }, (_, i) => i + 1).filter((n) => n !== answer);
    let others;
    if (near) {
      others = all.sort((a, b) => Math.abs(a - answer) - Math.abs(b - answer) || Math.random() - 0.5).slice(0, choices - 1);
    } else {
      // clearly different amounts first (at least 2 apart), so early levels are about counting, not guessing
      const far = shuffle(all.filter((n) => Math.abs(n - answer) >= 2));
      others = [...far, ...shuffle(all.filter((n) => Math.abs(n - answer) < 2))].slice(0, choices - 1);
    }
    return [answer, ...others].sort((a, b) => a - b); // in order, like a number line
  }

  function showNumbers() {
    const numbers = $('numbers');
    numbers.replaceChildren(...choicesFor(state.count).map((n, i) => {
      const [color, shade] = PALETTE[i % PALETTE.length];
      const tile = document.createElement('button');
      tile.className = 'tile';
      tile.textContent = n;
      tile.dataset.number = n;
      tile.style.setProperty('--color', color);
      tile.style.setProperty('--shade', shade);
      tile.addEventListener('pointerdown', onTapNumber);
      return tile;
    }));
    gsap.from('.numbers .tile', { y: 40, opacity: 0, duration: 0.45, ease: 'back.out(1.7)', stagger: 0.06, delay: 0.2 });
  }

  // ---------- rounds ----------

  const ask = () => Voice.say(`how-many-${COUNTABLES[state.thing]}`);

  function newRound() {
    const numbers = Array.from({ length: state.range }, (_, i) => ({ word: String(i + 1) }));
    state.count = Number(nextFromDeck(numbers, `${state.range}`).word);
    state.thing = pick(Object.keys(COUNTABLES).filter((t) => !recentThings.includes(t)));
    recentThings.push(state.thing);
    if (recentThings.length > 8) recentThings.shift();
    state.counted = 0;
    state.misses = 0;
    state.busy = false;

    showThings();
    showNumbers();
    // The first question waits for the intro ("Let's do some counting!") to finish.
    state.pendingAsk = gsap.delayedCall(state.firstRound ? 1.8 : 0.7, ask);
    state.firstRound = false;
  }

  function onTapNumber(e) {
    const tile = e.currentTarget;
    e.preventDefault();
    if (state.busy || tile.disabled) return;
    state.pendingAsk?.kill();
    if (Number(tile.dataset.number) === state.count) right(tile);
    else wrong(tile);
  }

  function right(tile) {
    state.busy = true;
    tile.classList.add('right');
    Sfx.chime();
    Fx.burst(Fx.centerOf(tile), tile.style.getPropertyValue('--color'), tile.offsetWidth * 1.2);
    gsap.timeline()
      .to(tile, { scale: 1.15, duration: 0.2, ease: 'power2.out' })
      .to(tile, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    gsap.to('.numbers .tile:not(.right)', { opacity: 0.25, duration: 0.3 });

    const finish = () => {
      if (Fx.addPoint(Fx.centerOf(tile))) gsap.delayedCall(1.4, earnStar);
      else gsap.delayedCall(1.4, nextRound);
    };
    const praise = Voice.line('correct', CORRECT_LINES.length);
    if (state.countAloud) {
      countAll({ after: [praise], onDone: finish });
    } else {
      Voice.say(praise);
      gsap.delayedCall(0.8, finish);
    }
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
      // Count them together, then the right number glows.
      state.busy = true;
      countAll({
        before: ['count-together'],
        onDone: () => {
          document.querySelector(`.numbers .tile[data-number="${state.count}"]`)?.classList.add('hint');
          state.busy = false;
        },
      });
      return;
    }
    Voice.wrong();
    state.pendingAsk = gsap.delayedCall(2.2, ask);
  }

  function nextRound() {
    gsap.to('#mat .thing, .numbers .tile', {
      scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in', stagger: 0.02, onComplete: newRound,
    });
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

  // The pictures are placed in pixels, so lay them out again if the screen turns.
  window.addEventListener('resize', () => {
    if (!state.thing || state.busy) return;
    const counted = state.counted;
    showThings();
    [...document.querySelectorAll('#mat .thing')].slice(0, counted).forEach((t, i) => {
      t.classList.add('counted');
      t.querySelector('.badge').textContent = i + 1;
    });
  });

  // ---------- start screen ----------

  $('start-art').replaceChildren(...[1, 2, 3].map((n) => {
    const thing = makeThing('apple');
    thing.classList.add('counted');
    thing.querySelector('.badge').textContent = n;
    thing.tabIndex = -1;
    return thing;
  }));
  gsap.from('.start-art .thing', { y: -40, opacity: 0, duration: 0.7, ease: 'bounce.out', stagger: 0.15, delay: 0.2 });
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.range = Number(document.querySelector('[name="range"]:checked').value);
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    state.countAloud = $('count-aloud').checked;
    Voice.say('start-count'); // playing inside the tap unlocks audio on iPad/iPhone
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
    if (!state.thing || state.busy) return;
    gsap.fromTo('.replay', { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    state.pendingAsk?.kill();
    ask();
  });
})();
