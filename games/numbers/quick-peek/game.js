// Quick Peek: the curtains open on some dots for a moment, then close. The child taps how many
// they saw. The peek is too short to count one by one, so it builds subitising: seeing small
// amounts at a glance (dice, scattered dots), and bigger ones as parts (ten-frames, two dice).
(() => {
  'use strict';

  // Each level: how long the curtains stay open (seconds) and how tidy the dots are.
  const LEVELS = [
    { peek: 2.4, tidy: 1 },    // always dice / ten-frame patterns
    { peek: 1.7, tidy: 0.5 },  // half tidy, half scattered or dice pairs
    { peek: 1.2, tidy: 0.2 },  // mostly scattered
  ];
  const W = 200;
  const H = 120;

  const $ = (id) => document.getElementById(id);
  const { pick, random, PALETTE } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);
  const nextFromDeck = createDeck({ recent: 2 });

  const state = {
    range: 6,
    level: 0,
    count: 0,
    misses: 0,
    busy: true,
    pending: null,
    firstRound: true,
  };

  // ---------- dot patterns (in a 200 × 120 box) ----------

  // Pip spots on a 3 × 3 grid, as on a real die.
  const PIPS = {
    1: [[1, 1]],
    2: [[0, 0], [2, 2]],
    3: [[0, 0], [1, 1], [2, 2]],
    4: [[0, 0], [2, 0], [0, 2], [2, 2]],
    5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
    6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]],
  };

  function dieFace(n, x, y, size) {
    const step = size / 3.6;
    const pad = (size - step * 2) / 2;
    return {
      shapes: `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${size * 0.18}" fill="#fff" stroke="#22314d" stroke-width="3"/>`,
      spots: PIPS[n].map(([gx, gy]) => ({ x: x + pad + gx * step, y: y + pad + gy * step })),
      r: size * 0.1,
    };
  }

  function die(n) {
    return dieFace(n, (W - 96) / 2, (H - 96) / 2, 96);
  }

  // Two dice side by side (7 = 5 and 2), for numbers above 5.
  function twoDice(n) {
    const a = n > 6 ? pick([...Array(6).keys()].map((i) => i + 1).filter((i) => n - i >= 1 && n - i <= 6 && i >= n - i)) : n - 1;
    const left = dieFace(a, 10, 16, 86);
    const right = dieFace(n - a, 104, 16, 86);
    return { shapes: left.shapes + right.shapes, spots: [...left.spots, ...right.spots], r: left.r };
  }

  // Ten-frames: two rows of five, filled along the top row first. Above 10 they stack, so
  // 23 is two full frames and 3 more: seen as "ten, twenty, and three".
  function tenFrames(n) {
    const frames = Math.ceil(n / 10);
    const cell = { 1: 32, 2: 24, 3: 17 }[frames];
    const gap = cell * 0.5;
    const x = (W - cell * 5) / 2;
    const top = (H - (frames * cell * 2 + (frames - 1) * gap)) / 2;
    let shapes = '';
    const spots = [];
    for (let f = 0; f < frames; f++) {
      const y = top + f * (cell * 2 + gap);
      shapes += `<rect x="${x}" y="${y}" width="${cell * 5}" height="${cell * 2}" rx="5" fill="#fff" stroke="#22314d" stroke-width="2.5"/>`;
      for (let i = 1; i < 5; i++) shapes += `<line x1="${x + i * cell}" y1="${y}" x2="${x + i * cell}" y2="${y + cell * 2}" stroke="#22314d" stroke-width="1.6"/>`;
      shapes += `<line x1="${x}" y1="${y + cell}" x2="${x + cell * 5}" y2="${y + cell}" stroke="#22314d" stroke-width="1.6"/>`;
      for (let i = 0; i < Math.min(10, n - f * 10); i++) spots.push({ x: x + (i % 5 + 0.5) * cell, y: y + (Math.floor(i / 5) + 0.5) * cell });
    }
    return { shapes, spots, r: cell * 0.36 };
  }

  // Dots dropped anywhere, not touching.
  function scattered(n) {
    const r = n > 6 ? 10 : 12;
    const spots = [];
    for (let tries = 0; spots.length < n && tries < 3000; tries++) {
      const spot = { x: random(r + 14, W - r - 14), y: random(r + 6, H - r - 6) };
      if (spots.every((s) => Math.hypot(s.x - spot.x, s.y - spot.y) > r * 3)) spots.push(spot);
    }
    return { shapes: '', spots, r };
  }

  function patternFor(n) {
    const tidy = Math.random() < LEVELS[state.level].tidy;
    if (n <= 6) return tidy ? die(n) : scattered(n);
    // Over 10: always ten-frames, since nobody can see 23 scattered dots at a glance.
    if (n > 10) return tenFrames(n);
    // 7 to 10: a ten-frame is the tidy way; dice pairs or scattered dots are harder.
    if (tidy) return tenFrames(n);
    return Math.random() < 0.6 ? twoDice(n) : scattered(n);
  }

  function drawCard() {
    const { shapes, spots, r } = patternFor(state.count);
    const [color, shade] = pick(PALETTE);
    $('card').innerHTML = `<svg viewBox="0 0 ${W} ${H}">
      <defs><radialGradient id="counter" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#fff" stop-opacity="0.55"/><stop offset="0.35" stop-color="${color}"/><stop offset="1" stop-color="${shade}"/></radialGradient></defs>
      ${shapes}
      ${spots.map((s) => `<g class="spot"><circle cx="${s.x}" cy="${s.y}" r="${r}" fill="url(#counter)"/><text class="number" x="${s.x}" y="${s.y + 0.5}" text-anchor="middle" dominant-baseline="central" font-size="${r * 1.1}"></text></g>`).join('')}
    </svg>`;
  }

  // ---------- curtains ----------

  function openCurtains() {
    Sfx.swish();
    gsap.to('.board .curtain-left', { xPercent: -100, duration: 0.45, ease: 'power2.inOut' });
    gsap.to('.board .curtain-right', { xPercent: 100, duration: 0.45, ease: 'power2.inOut' });
  }
  function closeCurtains() {
    Sfx.swish();
    gsap.to('.board .curtain-left', { xPercent: 0, duration: 0.35, ease: 'power2.in' });
    gsap.to('.board .curtain-right', { xPercent: 0, duration: 0.35, ease: 'power2.in' });
  }

  // Open for the level's peek time, close, then ask.
  function peek() {
    state.busy = true;
    state.pending?.kill();
    $('numbers').classList.add('waiting');
    gsap.fromTo('#card .spot', { scale: 0.6, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(3)', stagger: 0.02 });
    openCurtains();
    state.pending = gsap.delayedCall(0.45 + LEVELS[state.level].peek, () => {
      closeCurtains();
      state.pending = gsap.delayedCall(0.35, () => {
        state.busy = false;
        $('numbers').classList.remove('waiting');
        Voice.say('how-many-dots');
      });
    });
  }

  // Show the dots again and count them, each getting its number. Over 10, full ten-frames are
  // counted as tens ("ten, twenty") and then the rest one by one ("twenty-one, twenty-two").
  function countDots({ before = [], after = [], onDone } = {}) {
    const spots = [...document.querySelectorAll('#card .spot')];
    spots.forEach((s) => s.classList.remove('counted'));
    const tens = spots.length > 10 ? Math.floor(spots.length / 10) : 0;
    // each step: the number said, and which dots light up with it
    const steps = [
      ...Array.from({ length: tens }, (_, t) => ({ n: (t + 1) * 10, dots: spots.slice(t * 10, t * 10 + 10) })),
      ...spots.slice(tens * 10).map((dot, i) => ({ n: tens * 10 + i + 1, dots: [dot] })),
    ];
    Voice.sequence([...before, ...steps.map((s) => `num-${s.n}`), ...after], {
      gap: 240,
      onEach: (i) => {
        const step = steps[i - before.length];
        if (!step) return;
        Sfx.tick();
        step.dots.forEach((dot, k) => {
          dot.classList.add('counted');
          const label = dot.querySelector('.number');
          label.textContent = step.dots.length > 1 ? (k === step.dots.length - 1 ? step.n : '') : step.n;
          // two digits need a smaller size to fit inside the dot
          label.setAttribute('font-size', dot.querySelector('circle').getAttribute('r') * (String(step.n).length > 1 ? 0.85 : 1.1));
          gsap.fromTo(dot, { scale: 1.35, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
        });
      },
      onDone,
    });
  }

  // ---------- numbers ----------

  const choicesFor = (answer) => spacedChoices(answer, 1, state.range);

  function showNumbers() {
    $('numbers').replaceChildren(...choicesFor(state.count).map((n, i) => {
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
    gsap.from('.numbers .tile', { y: 40, opacity: 0, duration: 0.45, ease: 'back.out(1.7)', stagger: 0.05 });
  }

  // ---------- rounds ----------

  function newRound() {
    const numbers = Array.from({ length: state.range }, (_, i) => ({ word: String(i + 1) }));
    state.count = Number(nextFromDeck(numbers, `${state.range}`).word);
    state.misses = 0;
    drawCard();
    showNumbers();
    // The first peek waits for the intro ("Watch closely…") to finish.
    state.pending = gsap.delayedCall(state.firstRound ? 2.8 : 0.8, peek);
    state.firstRound = false;
    state.busy = true;
  }

  function onTapNumber(e) {
    const tile = e.currentTarget;
    e.preventDefault();
    if (state.busy || tile.disabled) return;
    if (Number(tile.dataset.number) === state.count) right(tile);
    else wrong(tile);
  }

  function right(tile) {
    state.busy = true;
    tile.classList.add('right');
    Sfx.chime();
    Fx.burst(Fx.centerOf(tile), tile.style.getPropertyValue('--color'), tile.offsetWidth * 1.2);
    gsap.to('.numbers .tile:not(.right)', { opacity: 0.25, duration: 0.3 });
    // Open up so they can check, then praise: "Five! Great!"
    openCurtains();
    gsap.delayedCall(0.5, () => {
      gsap.fromTo('#card .spot', { scale: 1.25, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)', stagger: 0.03 });
      Voice.say(`num-${state.count}`, 250, Voice.line('correct', CORRECT_LINES.length));
    });
    gsap.delayedCall(1.6, () => {
      if (Fx.addPoint(Fx.centerOf(tile))) gsap.delayedCall(1.4, earnStar);
      else gsap.delayedCall(1.2, nextRound);
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
    state.busy = true;

    if (state.misses >= 2) {
      // Open up and count them together; then the right number glows.
      openCurtains();
      countDots({
        before: ['count-together'],
        onDone: () => {
          document.querySelector(`.numbers .tile[data-number="${state.count}"]`)?.classList.add('hint');
          state.busy = false;
        },
      });
      return;
    }
    // "Wrong… Try again." and another peek at the same dots
    Voice.wrong();
    state.pending = gsap.delayedCall(2.2, peek);
  }

  function nextRound() {
    closeCurtains();
    gsap.to('.numbers .tile', { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.in', stagger: 0.03 });
    gsap.delayedCall(0.5, newRound);
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

  // A small stage with its curtains drawn back, showing a die.
  $('start-art').innerHTML = `<div class="stage"><div class="valance"></div><div class="peek-card">
    <svg viewBox="0 0 ${W} ${H}">${(() => {
      const { shapes, spots, r } = die(5);
      return shapes + spots.map((s) => `<circle cx="${s.x}" cy="${s.y}" r="${r}" fill="#ef6f6c"/>`).join('');
    })()}</svg></div></div>`;
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
  gsap.from('.start-art svg', { scale: 0.6, opacity: 0, duration: 0.8, ease: 'back.out(2)', delay: 0.3 });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.range = Number(document.querySelector('[name="range"]:checked').value);
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    Voice.say('start-peek'); // playing inside the tap unlocks audio on iPad/iPhone
    gsap.to('#start', {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        $('start').classList.add('hidden');
        newRound();
      },
    });
  });

  // Another look at the same dots (only between peeks).
  document.querySelector('.replay').addEventListener('click', () => {
    if (state.busy || !state.count) return;
    gsap.fromTo('.replay', { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    peek();
  });
})();
