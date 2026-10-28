// Hungry Crocodile: two plates of food. "Which side has more?" (or "fewer?"). The child taps a
// plate; the crocodile turns, opens wide and gobbles it up, and the voice says "seven is more
// than four". Builds comparing amounts.
(() => {
  'use strict';

  // Each level: the smallest difference between the plates, and whether the food is scattered.
  const LEVELS = [
    { apart: 3, scatter: false },
    { apart: 2, scatter: false },
    { apart: 1, scatter: true },
  ];
  const FOODS = ['fish', 'apple', 'banana', 'cake', 'carrot', 'pear', 'plum', 'lemon', 'egg', 'nut', 'tomato', 'bun'];

  const $ = (id) => document.getElementById(id);
  const { pick, random } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);
  const recentPairs = [];

  const state = {
    range: 5,
    ask: 'more',
    level: 0,
    counts: { left: 0, right: 0 },
    question: 'more',
    food: 'fish',
    showNumbers: false,
    busy: true,
    pendingAsk: null,
    firstRound: true,
  };

  // ---------- the crocodile (facing right; the top jaw opens) ----------

  const tooth = (x, y, down) => `<path d="M${x} ${y} l4 ${down ? 7 : -7} l4 ${down ? -7 : 7}Z" fill="#fff"/>`;
  const CROC = `<svg viewBox="0 0 200 150">
    <path d="M0 112 C22 92 48 94 72 98 L72 132 C42 134 18 128 0 112Z" fill="#4f9a5e"/>
    <rect x="30" y="122" width="12" height="20" rx="5" fill="#4f9a5e"/><rect x="58" y="124" width="12" height="20" rx="5" fill="#4f9a5e"/>
    <path d="M60 104 L188 108 C198 110 198 122 188 124 L66 132 Z" fill="#5fae6c"/>
    <path d="M70 106 L184 109 L180 116 L72 118Z" fill="#c2393f"/>
    ${[90, 110, 130, 150, 170].map((x) => tooth(x, 109, false)).join('')}
    <g class="jaw">
      <path d="M52 104 C52 74 80 60 110 66 L186 82 C200 86 200 102 186 104 L58 108 Z" fill="#6cbf79"/>
      ${[86, 106, 126, 146, 166].map((x) => tooth(x, 104, true)).join('')}
      <circle cx="184" cy="84" r="3" fill="#3f7f4c"/>
      <path d="M60 80 q6 -8 12 0 M76 72 q6 -8 12 0" fill="none" stroke="#4f9a5e" stroke-width="3" stroke-linecap="round"/>
      <circle cx="96" cy="62" r="15" fill="#6cbf79"/>
      <circle cx="98" cy="60" r="9" fill="#fff"/>
      <circle class="pupil" cx="101" cy="60" r="4.5" fill="#22314d"/>
    </g>
  </svg>`;

  const jaw = () => $('croc').querySelector('.jaw');
  const face = (side) => gsap.to('#croc svg', { scaleX: side === 'left' ? -1 : 1, duration: 0.3, ease: 'power2.inOut' });
  const openJaw = (amount = -24) => gsap.to(jaw(), { rotation: amount, svgOrigin: '60 104', duration: 0.25, ease: 'power2.out' });
  const chomp = (times = 3) => gsap.to(jaw(), { rotation: 0, svgOrigin: '60 104', duration: 0.12, yoyo: true, repeat: times * 2 - 1, ease: 'power1.inOut', onRepeat: () => Sfx.pop() });

  // ---------- plates ----------

  // Food positions inside a round plate: tidy rows of five, or scattered.
  function layout(n, size, scatter) {
    const R = size / 2;
    if (scatter) {
      const item = R * (n > 5 ? 0.33 : 0.42);
      const spots = [];
      for (let tries = 0; spots.length < n && tries < 3000; tries++) {
        const a = random(0, Math.PI * 2);
        const d = Math.sqrt(Math.random()) * (R * 0.62 - item * 0.3);
        const spot = { x: R + Math.cos(a) * d, y: R + Math.sin(a) * d };
        if (spots.every((s) => Math.hypot(s.x - spot.x, s.y - spot.y) > item * 0.95)) spots.push(spot);
      }
      if (spots.length === n) return { item, spots };
    }
    const rows = n > 5 ? 2 : 1;
    const perRow = Math.min(n, 5);
    const item = Math.min(R * 1.45 / perRow, R * 0.5);
    const spots = Array.from({ length: n }, (_, i) => {
      const row = Math.floor(i / 5);
      const inRow = row === rows - 1 ? n - row * 5 : 5;
      return { x: R + (i % 5 - (inRow - 1) / 2) * item * 1.04, y: R + (row - (rows - 1) / 2) * item * 1.08 };
    });
    return { item, spots };
  }

  function fillPlate(side) {
    const plate = $(side);
    const n = state.counts[side];
    const { item, spots } = layout(n, plate.clientWidth, LEVELS[state.level].scatter);
    plate.innerHTML = spots.map((s) => `<div class="food" style="--size:${item}px;width:${item}px;height:${item}px;transform:translate(${s.x - item / 2}px, ${s.y - item / 2}px) rotate(${LEVELS[state.level].scatter ? random(-25, 25) : 0}deg)">${PICTURES[state.food]}<span class="badge"></span></div>`).join('')
      + (state.showNumbers ? `<span class="total">${n}</span>` : '');
    plate.disabled = false;
    plate.classList.remove('right', 'hint');
    plate.setAttribute('aria-label', `${n} ${state.food}`);
    gsap.from(plate.querySelectorAll('.food'), { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(2)', stagger: 0.04 });
  }

  // Two different amounts at least `apart` apart, not the same pair as recently.
  function pickCounts() {
    const { apart } = LEVELS[state.level];
    const pairs = [];
    for (let a = 1; a <= state.range; a++) {
      for (let b = 1; b <= state.range; b++) {
        const gap = Math.abs(a - b);
        if (gap >= apart && (apart > 1 || gap <= 2) && !recentPairs.includes(`${Math.min(a, b)}-${Math.max(a, b)}`)) pairs.push([a, b]);
      }
    }
    // Up to 5 with very different piles there are only three pairs, so "recent" can rule out all.
    if (!pairs.length) {
      recentPairs.length = 0;
      return pickCounts();
    }
    const [a, b] = pick(pairs);
    recentPairs.push(`${Math.min(a, b)}-${Math.max(a, b)}`);
    if (recentPairs.length > 3) recentPairs.shift();
    return { left: a, right: b };
  }

  // ---------- rounds ----------

  const ask = () => Voice.say(state.question === 'more' ? 'croc-more' : 'croc-fewer');
  const correctSide = () => {
    const leftBigger = state.counts.left > state.counts.right;
    return (state.question === 'more') === leftBigger ? 'left' : 'right';
  };

  function newRound() {
    state.counts = pickCounts();
    state.food = pick(FOODS.filter((f) => f !== state.food));
    state.question = state.ask === 'both' && state.level > 0 && Math.random() < 0.4 ? 'fewer' : 'more';
    state.busy = false;
    fillPlate('left');
    fillPlate('right');
    face(Math.random() < 0.5 ? 'left' : 'right');
    gsap.to(jaw(), { rotation: 0, svgOrigin: '60 104', duration: 0.2 });
    state.pendingAsk = gsap.delayedCall(state.firstRound ? 2.2 : 0.7, ask);
    state.firstRound = false;
  }

  function onTapPlate(e) {
    const plate = e.currentTarget;
    e.preventDefault();
    if (state.busy || plate.disabled) return;
    state.pendingAsk?.kill();
    if (plate.id === correctSide()) eat(plate);
    else wrong(plate);
  }

  // The crocodile turns to the plate, opens wide, and the food flies into its mouth.
  function eat(plate) {
    state.busy = true;
    const side = plate.id;
    const other = side === 'left' ? 'right' : 'left';
    plate.classList.add('right');
    Sfx.chime();
    face(side);
    openJaw();
    // "Seven is more than four." / "Four is fewer than seven." Then praise.
    Voice.sequence([`num-${state.counts[side]}`, state.question === 'more' ? 'more-than' : 'fewer-than', `num-${state.counts[other]}`, Voice.line('correct', CORRECT_LINES.length)], { gap: 120 });

    const mouth = $('croc').getBoundingClientRect();
    const target = { x: side === 'left' ? mouth.left + mouth.width * 0.15 : mouth.right - mouth.width * 0.15, y: mouth.top + mouth.height * 0.7 };
    const foods = [...plate.querySelectorAll('.food')];
    foods.forEach((food, i) => {
      const box = food.getBoundingClientRect();
      gsap.to(food, {
        x: `+=${target.x - (box.left + box.width / 2)}`,
        y: `+=${target.y - (box.top + box.height / 2)}`,
        scale: 0.3,
        opacity: 0,
        duration: 0.5,
        delay: 0.35 + i * 0.09,
        ease: 'power2.in',
      });
    });
    gsap.delayedCall(0.4 + foods.length * 0.09 + 0.3, () => {
      chomp(3);
      gsap.delayedCall(1.4, () => {
        if (Fx.addPoint(Fx.centerOf($('croc')))) gsap.delayedCall(1.2, earnStar);
        else gsap.delayedCall(1.4, newRound);
      });
    });
  }

  // A wrong plate: the crocodile shakes its head, then both plates are counted together.
  function wrong(plate) {
    state.busy = true;
    Sfx.buzzer();
    plate.disabled = true;
    gsap.fromTo('#croc', { rotation: -6 }, { rotation: 6, duration: 0.12, yoyo: true, repeat: 3, onComplete: () => gsap.set('#croc', { rotation: 0 }) });

    const left = [...$('left').querySelectorAll('.food')];
    const right = [...$('right').querySelectorAll('.food')];
    const steps = [...left.map((f, i) => ({ f, n: i + 1 })), ...right.map((f, i) => ({ f, n: i + 1 }))];
    const before = [Voice.line('wrong', WRONG_LINES.length), 'count-together'];
    Voice.sequence([...before, ...steps.map((s) => `num-${s.n}`)], {
      gap: 220,
      onEach: (i) => {
        const step = steps[i - before.length];
        if (!step) return;
        step.f.classList.add('counted');
        step.f.querySelector('.badge').textContent = step.n;
        Sfx.tick();
      },
      onDone: () => {
        $(correctSide()).classList.add('hint');
        plate.disabled = false;
        state.busy = false;
        ask();
      },
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
    Fx.earnStar(message, phrase, newRound);
  }

  // ---------- start screen ----------

  $('croc').innerHTML = CROC;
  $('start-art').innerHTML = CROC;
  gsap.to('.start-art .jaw', { rotation: -20, svgOrigin: '60 104', duration: 0.4, yoyo: true, repeat: -1, repeatDelay: 0.8, ease: 'power2.inOut' });
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
  ['left', 'right'].forEach((side) => $(side).addEventListener('pointerdown', onTapPlate));

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.range = Number(document.querySelector('[name="range"]:checked').value);
    state.ask = document.querySelector('[name="ask"]:checked').value;
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    state.showNumbers = $('show-numbers').checked;
    Voice.say('start-croc'); // playing inside the tap unlocks audio on iPad/iPhone
    gsap.killTweensOf('.start-art .jaw');
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
