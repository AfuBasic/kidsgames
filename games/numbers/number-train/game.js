// Number Train: a train pulls in with numbered carriages in order (3, 4, 5, ?, 7), counting in
// 1s, 10s, 5s or 2s. The voice counts along and stops at the gap; the child taps the missing
// number, it flies into place, and the train toots off. Builds number order and counting in steps.
(() => {
  'use strict';

  // Each level: how many numbers to choose from, and where the gaps are.
  const LEVELS = [
    { choices: 2, gaps: 'end' },    // what comes next?
    { choices: 3, gaps: 'middle' }, // what's missing?
    { choices: 4, gaps: 'two' },    // two missing
  ];
  const CARS = 5;

  const $ = (id) => document.getElementById(id);
  const { pick, random, PALETTE } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);
  const nextFromDeck = createDeck({ recent: 3 });

  const state = {
    steps: 'ones-10',
    level: 0,
    values: [],
    gaps: [],
    filled: [],
    misses: 0,
    busy: true,
    firstRound: true,
  };

  // ---------- drawing ----------

  const wheel = (x, y, r) => `<g class="wheel"><circle cx="${x}" cy="${y}" r="${r}" fill="#22314d"/><circle cx="${x}" cy="${y}" r="${r * 0.45}" fill="#9aa3b2"/><line x1="${x - r * 0.8}" y1="${y}" x2="${x + r * 0.8}" y2="${y}" stroke="#9aa3b2" stroke-width="2.5"/></g>`;

  // The engine faces left, the way the train travels.
  const ENGINE = `<svg viewBox="0 0 140 90">
    <rect x="26" y="4" width="24" height="8" rx="3" fill="#22314d"/>
    <rect x="30" y="10" width="16" height="22" rx="3" fill="#22314d"/>
    <rect x="16" y="30" width="72" height="38" rx="12" fill="#2a9d8f"/>
    <rect x="16" y="30" width="72" height="12" rx="6" fill="#fff" opacity="0.18"/>
    <circle cx="60" cy="30" r="8" fill="#f2b134"/>
    <rect x="82" y="8" width="52" height="60" rx="8" fill="#ef6f6c"/>
    <rect x="78" y="4" width="60" height="9" rx="4" fill="#b03f45"/>
    <rect x="92" y="18" width="30" height="22" rx="5" fill="#bfe6f5"/>
    <circle cx="13" cy="46" r="7" fill="#ffd66e" stroke="#c07a14" stroke-width="2"/>
    <rect x="8" y="64" width="128" height="8" rx="3" fill="#22314d"/>
    <path d="M2 80 L12 62 L18 62 L18 80 Z" fill="#22314d"/>
    ${wheel(40, 78, 10)}${wheel(64, 78, 10)}${wheel(106, 76, 13)}
  </svg>`;

  function carSVG([color, shade]) {
    return `<svg viewBox="0 0 100 90">
      <rect x="-8" y="60" width="12" height="5" rx="2" fill="#22314d"/>
      <rect x="4" y="14" width="92" height="54" rx="10" fill="${color}"/>
      <rect x="0" y="6" width="100" height="12" rx="6" fill="${shade}"/>
      <rect x="14" y="20" width="72" height="42" rx="8" fill="#fff"/>
      <rect x="6" y="64" width="88" height="8" rx="3" fill="#22314d"/>
      ${wheel(26, 78, 10)}${wheel(74, 78, 10)}
    </svg>`;
  }

  function buildTrain(el, values, gaps = []) {
    el.innerHTML = `<div class="engine">${ENGINE}</div>${values.map((v, i) => `
      <div class="car ${gaps.includes(i) ? 'gap' : ''}" data-index="${i}">
        ${carSVG(PALETTE[(i + 1) % PALETTE.length])}
        <span class="num ${v >= 100 ? 'long' : ''}">${gaps.includes(i) ? '?' : v}</span>
      </div>`).join('')}`;
  }

  // Puffs of smoke rise from the chimney.
  let smokeTimer = null;
  function puff() {
    const engine = document.querySelector('#train .engine');
    if (!engine || Scene.reduceMotion) return;
    const train = $('train');
    const box = engine.getBoundingClientRect();
    const trainBox = train.getBoundingClientRect();
    const smoke = document.createElement('div');
    smoke.className = 'smoke';
    smoke.style.left = `${box.left - trainBox.left + box.width * 0.27}px`;
    smoke.style.top = `${box.top - trainBox.top - box.height * 0.05}px`;
    train.append(smoke);
    gsap.fromTo(smoke, { scale: 0.4, opacity: 0.9 }, {
      scale: random(1.6, 2.4), opacity: 0, x: random(10, 40), y: -random(40, 70), duration: 1.6, ease: 'power1.out',
      onComplete: () => smoke.remove(),
    });
  }
  function smoking(rate) {
    smokeTimer?.kill();
    smokeTimer = gsap.delayedCall(rate, function again() {
      puff();
      smokeTimer = gsap.delayedCall(rate, again);
    });
  }

  // ---------- voice ----------

  const say = (n) => `num-${n}`;
  const cars = () => [...document.querySelectorAll('#train .car')];
  const nextGap = () => state.gaps.find((g) => !state.filled.includes(g));

  function bounce(car) {
    Sfx.tick();
    gsap.fromTo(car, { y: 0 }, { y: -12, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
  }

  // Count along the carriages up to the next gap, then ask. Taps still work while it talks:
  // a child who already knows can answer, which cuts the counting short.
  function countAlong(before = []) {
    state.busy = false;
    const gap = nextGap();
    const known = state.values.slice(0, gap).map(say);
    const question = gap === CARS - 1 && state.gaps.length === 1 ? 'what-next' : 'which-missing';
    document.querySelectorAll('#train .car').forEach((c) => c.classList.toggle('next', Number(c.dataset.index) === gap));
    Voice.sequence([...before, ...known, question], {
      gap: 220,
      onEach: (i) => {
        const n = i - before.length;
        if (n >= 0 && n < known.length) bounce(cars()[n]);
        if (n === known.length) gsap.fromTo(cars()[gap], { scale: 1 }, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1 });
      },
    });
  }

  // ---------- rounds ----------

  function sequenceNumbers() {
    const { step, from, to } = COUNT_STEPS[state.steps];
    return Array.from({ length: (to - from) / step + 1 }, (_, i) => from + i * step);
  }

  function pickGaps() {
    const mode = LEVELS[state.level].gaps;
    if (mode === 'end') return [CARS - 1];
    if (mode === 'middle') return [Math.floor(random(1, CARS - 1))];
    return shuffle([1, 2, 3, 4]).slice(0, 2).sort((a, b) => a - b);
  }

  // The answers plus nearby numbers from the same count (so the choice is about order, not
  // size), picked at random from up to 3 steps either side so the answer isn't always the
  // middle one. Shown smallest first.
  function choicesFor() {
    const { step } = COUNT_STEPS[state.steps];
    const answers = state.gaps.map((g) => state.values[g]);
    const target = state.values[nextGap()];
    const needed = Math.max(LEVELS[state.level].choices - answers.length, 1);
    const nearby = (reach) => shuffle(sequenceNumbers().filter((n) => !answers.includes(n) && Math.abs(n - target) <= reach * step));
    let others = nearby(3);
    if (others.length < needed) others = nearby(Infinity);
    return [...answers, ...others.slice(0, needed)].sort((a, b) => a - b);
  }

  function showNumbers() {
    $('numbers').replaceChildren(...choicesFor().map((n, i) => {
      const [color, shade] = PALETTE[(i + 3) % PALETTE.length];
      const tile = document.createElement('button');
      tile.className = `tile ${n >= 100 ? 'long' : ''}`;
      tile.textContent = n;
      tile.dataset.number = n;
      tile.style.setProperty('--color', color);
      tile.style.setProperty('--shade', shade);
      tile.addEventListener('pointerdown', onTapNumber);
      return tile;
    }));
    gsap.from('.numbers .tile', { y: 40, opacity: 0, duration: 0.45, ease: 'back.out(1.7)', stagger: 0.06 });
  }

  function newRound() {
    const all = sequenceNumbers();
    const starts = all.slice(0, all.length - CARS + 1).map((n) => ({ word: String(n) }));
    const start = Number(nextFromDeck(starts, state.steps).word);
    const step = COUNT_STEPS[state.steps].step;
    state.values = Array.from({ length: CARS }, (_, i) => start + i * step);
    state.gaps = pickGaps();
    state.filled = [];
    state.misses = 0;
    state.busy = true;

    const train = $('train');
    buildTrain(train, state.values, state.gaps);
    $('numbers').replaceChildren();
    // Pull in from the right, wheels turning, then slow to a stop.
    train.classList.add('moving');
    smoking(0.25);
    gsap.fromTo(train, { x: window.innerWidth }, {
      x: 0,
      duration: 1.6,
      ease: 'power2.out',
      onComplete: () => {
        train.classList.remove('moving');
        smoking(1.1);
        showNumbers();
        // The first train waits for "All aboard…" to finish.
        gsap.delayedCall(state.firstRound ? 0.6 : 0.2, () => countAlong());
        state.firstRound = false;
      },
    });
  }

  function onTapNumber(e) {
    const tile = e.currentTarget;
    e.preventDefault();
    if (state.busy || tile.disabled) return;
    state.pendingCount?.kill();
    if (Number(tile.dataset.number) === state.values[nextGap()]) fill(tile);
    else wrong(tile);
  }

  // The number flies from its tile into the carriage window.
  function fill(tile) {
    state.busy = true;
    Voice.stop(); // stop any counting along that's still going
    const gap = nextGap();
    const car = cars()[gap];
    const slot = car.querySelector('.num');
    const from = tile.getBoundingClientRect();
    const to = slot.getBoundingClientRect();
    const flying = tile.cloneNode(true);
    flying.classList.add('flying');
    Object.assign(flying.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
    document.body.append(flying);
    tile.style.visibility = 'hidden';
    Sfx.pop();
    gsap.timeline({ onComplete: () => {
      flying.remove();
      state.filled.push(gap);
      car.classList.remove('gap', 'next');
      car.classList.add('filled');
      slot.textContent = state.values[gap];
      Sfx.chime();
      Fx.burst(Fx.centerOf(slot), '#2a9d8f', 90);
      bounce(car);
      if (nextGap() === undefined) gsap.delayedCall(0.3, allAboard);
      else {
        state.misses = 0;
        gsap.delayedCall(0.6, () => countAlong());
      }
    } })
      .to(flying, {
        x: to.left + to.width / 2 - (from.left + from.width / 2),
        y: to.top + to.height / 2 - (from.top + from.height / 2),
        scale: Math.min(to.height / from.height, 1),
        duration: 0.55,
        ease: 'power2.inOut',
      })
      .to(flying, { opacity: 0, duration: 0.1 });
  }

  // Every carriage counted, a cheer, then toot-toot and away.
  function allAboard() {
    gsap.to('.numbers .tile', { opacity: 0, scale: 0.6, duration: 0.3, stagger: 0.03 });
    const praise = Voice.line('correct', CORRECT_LINES.length);
    Voice.sequence([...state.values.map(say), praise], {
      gap: 200,
      onEach: (i) => { if (i < CARS) bounce(cars()[i]); },
      onDone: () => {
        const point = Fx.addPoint(Fx.centerOf(document.querySelector('#train .engine')));
        depart(point ? earnStar : newRound);
      },
    });
  }

  function depart(then) {
    const train = $('train');
    Sfx.toot();
    train.classList.add('moving');
    smoking(0.15);
    gsap.to(train, {
      x: -window.innerWidth * 1.3,
      duration: 1.8,
      delay: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        smokeTimer?.kill();
        train.querySelectorAll('.smoke').forEach((s) => s.remove());
        then();
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
    state.busy = true;
    const target = state.values[nextGap()];

    if (state.misses >= 2) {
      // Count together up to the gap and say the missing number; then its tile glows.
      const gap = nextGap();
      Voice.sequence(['count-together', ...state.values.slice(0, gap + 1).map(say)], {
        gap: 220,
        onEach: (i) => {
          if (i >= 1 && i <= gap) bounce(cars()[i - 1]);
          if (i === gap + 1) gsap.fromTo(cars()[gap], { scale: 1 }, { scale: 1.1, duration: 0.25, yoyo: true, repeat: 1 });
        },
        onDone: () => {
          document.querySelector(`.numbers .tile[data-number="${target}"]`)?.classList.add('hint');
          state.busy = false;
        },
      });
      return;
    }
    // "Wrong… Try again." gets a moment to be heard, then taps work again and the voice counts along.
    Voice.wrong();
    gsap.delayedCall(1.2, () => { state.busy = false; });
    state.pendingCount = gsap.delayedCall(2.2, () => countAlong());
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

  const art = document.createElement('div');
  art.className = 'train';
  $('start-art').append(art);
  buildTrain(art, [1, 2, 3]);
  gsap.from(art, { x: 300, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 });
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.steps = document.querySelector('[name="steps"]:checked').value;
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    Voice.say('start-train'); // playing inside the tap unlocks audio on iPad/iPhone
    Sfx.toot();
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
    if (state.busy || !state.values.length) return;
    gsap.fromTo('.replay', { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    countAlong();
  });
})();
