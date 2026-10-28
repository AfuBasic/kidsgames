// Rocket Launch: ten numbered fuel tanks (10, 20 … 100, or in 5s, 2s, 1s). Tapping them in order
// fills the rocket's fuel gauge, the voice saying each number. When it's full: "ten, nine …
// one, Blast off!" Builds counting in steps, and counting backwards.
(() => {
  'use strict';

  // Each level: tanks in order (the next one glows), mixed up with a glow if stuck, or no glow.
  const LEVELS = [
    { mixed: false, hintAfter: 0 },
    { mixed: true, hintAfter: 5 },
    { mixed: true, hintAfter: null },
  ];
  const STEPS = { ones: 1, twos: 2, fives: 5, tens: 10 };
  const TANKS = 10;

  const $ = (id) => document.getElementById(id);
  const { random, PALETTE } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);

  const state = {
    steps: 'tens',
    level: 0,
    values: [],
    next: 0,
    busy: true,
    hint: null,
  };

  // ---------- the rocket ----------

  // Body with a ten-cell fuel gauge, nose cone, window and fins; flames hidden until launch.
  const ROCKET = `<svg viewBox="0 0 100 230">
    <g class="flame">
      <path d="M36 196 C34 214 44 226 50 230 C56 226 66 214 64 196Z" fill="#f2b134"/>
      <path d="M42 196 C41 208 47 216 50 220 C53 216 59 208 58 196Z" fill="#fff3c4"/>
    </g>
    <path d="M20 150 L6 196 L26 188Z" fill="#ef6f6c"/>
    <path d="M80 150 L94 196 L74 188Z" fill="#ef6f6c"/>
    <path d="M50 4 C76 30 80 70 80 110 L80 190 C80 196 76 200 70 200 L30 200 C24 200 20 196 20 190 L20 110 C20 70 24 30 50 4Z" fill="#f4f6fb" stroke="#c9d2e3" stroke-width="2"/>
    <path d="M50 4 C64 18 72 34 76 52 L24 52 C28 34 36 18 50 4Z" fill="#ef6f6c"/>
    <circle cx="50" cy="76" r="12" fill="#bfe6f5" stroke="#7c8aa5" stroke-width="4"/>
    <rect x="38" y="98" width="24" height="94" rx="6" fill="#22314d"/>
    ${Array.from({ length: TANKS }, (_, i) => `<rect class="gauge-cell" data-cell="${i}" x="41" y="${181 - i * 9}" width="18" height="7" rx="2" fill="#3a4a66"/>`).join('')}
    <path d="M44 196 L56 196 L58 202 L42 202Z" fill="#7c8aa5"/>
  </svg>`;

  function buildRocket() {
    $('rocket-area').innerHTML = `<div class="rocket">${ROCKET}</div><div class="pad"></div>`;
  }
  const rocket = () => document.querySelector('#rocket-area .rocket');
  const gaugeCell = (i) => rocket().querySelector(`[data-cell="${i}"]`);

  function puff(big = false) {
    const area = $('rocket-area');
    const p = document.createElement('div');
    const size = random(20, big ? 70 : 40);
    p.className = 'puff';
    Object.assign(p.style, { width: `${size}px`, height: `${size}px`, left: `${area.clientWidth / 2 - size / 2 + random(-20, 20)}px`, bottom: `${random(0, 20)}px` });
    area.append(p);
    gsap.to(p, { x: random(-90, 90), y: random(-10, 30), scale: random(1.5, 2.6), opacity: 0, duration: random(1, 1.8), ease: 'power1.out', onComplete: () => p.remove() });
  }

  // ---------- tanks ----------

  function buildTanks() {
    const order = LEVELS[state.level].mixed ? shuffle([...state.values]) : state.values;
    $('tanks').replaceChildren(...order.map((v) => {
      const [color, shade] = PALETTE[state.values.indexOf(v) % PALETTE.length];
      const tank = document.createElement('button');
      tank.className = 'tank';
      tank.textContent = v;
      tank.dataset.number = v;
      tank.style.setProperty('--color', color);
      tank.style.setProperty('--shade', shade);
      tank.addEventListener('pointerdown', onTapTank);
      return tank;
    }));
    gsap.from('.tank', { y: 30, opacity: 0, scale: 0.7, duration: 0.4, ease: 'back.out(2)', stagger: 0.04 });
  }

  const nextTank = () => document.querySelector(`.tank[data-number="${state.values[state.next]}"]`);

  // Level 1 always shows the next tank; level 2 shows it if the child seems stuck.
  function scheduleHint() {
    state.hint?.kill();
    document.querySelectorAll('.tank.next').forEach((t) => t.classList.remove('next'));
    const after = LEVELS[state.level].hintAfter;
    if (after === null || state.next >= TANKS) return;
    state.hint = gsap.delayedCall(after, () => nextTank()?.classList.add('next'));
  }

  // ---------- rounds ----------

  function newRound() {
    const step = STEPS[state.steps];
    state.values = Array.from({ length: TANKS }, (_, i) => (i + 1) * step);
    state.next = 0;
    state.misses = 0;
    buildRocket();
    buildTanks();
    gsap.from(rocket(), { y: -400, duration: 1, ease: 'bounce.out' });
    Voice.say(`rocket-${state.steps}`);
    state.busy = false;
    scheduleHint();
  }

  function onTapTank(e) {
    const tank = e.currentTarget;
    e.preventDefault();
    if (state.busy || tank.classList.contains('used')) return;
    if (Number(tank.dataset.number) === state.values[state.next]) fuel(tank);
    else wrong(tank);
  }

  // The tank flies into the rocket and the next gauge cell lights up.
  function fuel(tank) {
    const index = state.next++;
    Voice.say(`num-${tank.dataset.number}`);
    const from = tank.getBoundingClientRect();
    const to = gaugeCell(index).getBoundingClientRect();
    const flying = tank.cloneNode(true);
    flying.classList.add('flying');
    flying.classList.remove('next');
    Object.assign(flying.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
    document.body.append(flying);
    tank.classList.add('used');
    Sfx.pop();
    gsap.to(flying, {
      x: to.left + to.width / 2 - (from.left + from.width / 2),
      y: to.top + to.height / 2 - (from.top + from.height / 2),
      scale: 0.2,
      opacity: 0.4,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        flying.remove();
        gaugeCell(index).setAttribute('fill', PALETTE[index % PALETTE.length][0]);
        Sfx.tick();
        gsap.fromTo(rocket(), { rotation: -2 }, { rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
      },
    });
    // two tanks = one progress dot, so a full rocket is a star
    if (state.next % 2 === 0) Fx.addPoint(Fx.centerOf(rocket()));
    if (state.next === TANKS) gsap.delayedCall(1, countdown);
    else scheduleHint();
  }

  function wrong(tank) {
    Sfx.buzzer();
    gsap.timeline()
      .to(tank, { x: -8, duration: 0.06 })
      .to(tank, { x: 8, duration: 0.08 })
      .to(tank, { x: 0, duration: 0.1 });
    Voice.say('rocket-find');
    state.hint?.kill();
    nextTank()?.classList.add('next'); // after a wrong tap, always show the way
  }

  // "Ten, nine, … one, Blast off!" with the rocket shaking harder, then up it goes.
  function countdown() {
    state.busy = true;
    const ids = [...Array(10)].map((_, i) => `num-${10 - i}`);
    Voice.sequence([...ids, 'blast-off'], {
      gap: 260,
      onEach: (i) => {
        if (i < 10) {
          gsap.fromTo(rocket(), { x: -1 - i * 0.4 }, { x: 1 + i * 0.4, duration: 0.05, repeat: 7, yoyo: true, onComplete: () => gsap.set(rocket(), { x: 0 }) });
          if (i > 5) puff();
          return;
        }
        liftOff();
      },
    });
  }

  function liftOff() {
    const flame = rocket().querySelector('.flame');
    Sfx.fanfare();
    gsap.to(flame, { opacity: 1, duration: 0.15 });
    gsap.to(flame, { scaleY: 1.4, duration: 0.12, yoyo: true, repeat: -1 });
    for (let i = 0; i < 14; i++) gsap.delayedCall(i * 0.06, () => puff(true));
    gsap.to(rocket(), {
      y: -window.innerHeight * 1.2,
      duration: 2.2,
      ease: 'power2.in',
      delay: 0.3,
      onComplete: earnStar,
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

  $('start-art').innerHTML = ROCKET.replace('class="flame"', 'class="flame" style="opacity:1"');
  gsap.from('.start-art svg', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.steps = document.querySelector('[name="steps"]:checked').value;
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    Voice.say('start-rocket'); // playing inside the tap unlocks audio on iPad/iPhone
    gsap.to('#start', {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        $('start').classList.add('hidden');
        gsap.delayedCall(1.6, newRound);
      },
    });
  });

  // Say the numbers so far again, then which one is next.
  document.querySelector('.replay').addEventListener('click', () => {
    if (state.busy || !state.values.length) return;
    gsap.fromTo('.replay', { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    const done = state.values.slice(0, state.next).map((n) => `num-${n}`);
    Voice.sequence(done.length ? [...done, 'rocket-find'] : [`rocket-${state.steps}`]);
  });
})();
