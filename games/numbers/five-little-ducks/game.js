// Five Little Ducks, after the counting song. Ducks swim on a pond in rows of five. Some swim
// "over the hill and far away" (taking away); in "Away and back", Mother Duck quacks and some
// come back (adding). Each time the child says how many ducks are on the pond now.
(() => {
  'use strict';

  // Each level: the most ducks that leave or come back at once.
  const LEVELS = [{ most: 1 }, { most: 2 }, { most: 3 }];

  const $ = (id) => document.getElementById(id);
  const { random, PALETTE } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);

  const state = {
    total: 5,
    story: 'away',
    level: 0,
    onPond: 0,     // ducks on the pond fill slots 0 … onPond-1, so they stay in tidy rows
    answer: 0,
    misses: 0,
    busy: true,
    pendingAsk: null,
  };

  // ---------- drawing ----------

  // A duck facing right (towards the hill), with a ripple under it.
  const DUCK = `<svg viewBox="0 0 100 90">
    <ellipse cx="50" cy="80" rx="40" ry="6" fill="#fff" opacity="0.35"/>
    <path d="M10 54 C10 40 26 38 40 42 L68 42 C84 42 90 52 86 64 C82 76 68 80 48 80 C26 80 10 70 10 54Z" fill="#f6c945"/>
    <circle cx="66" cy="28" r="17" fill="#f6c945"/>
    <path d="M80 27 L95 32 L80 37Z" fill="#f2893b"/>
    <circle cx="70" cy="24" r="3" fill="#22314d"/>
    <path d="M26 52 C36 46 52 50 56 58 C46 66 32 64 26 52Z" fill="#e0ad2c"/>
  </svg>`;

  // Mother Duck: bigger, white, with a blue bonnet ribbon.
  const MOTHER = `<svg viewBox="0 0 100 90">
    <path d="M8 56 C8 40 26 36 40 40 L66 40 C84 40 92 52 88 64 C84 78 68 84 46 84 C22 84 8 72 8 56Z" fill="#fdfaf2" stroke="#e8dcc0" stroke-width="2"/>
    <circle cx="64" cy="26" r="18" fill="#fdfaf2" stroke="#e8dcc0" stroke-width="2"/>
    <path class="beak" d="M79 24 L97 30 L79 36Z" fill="#f2893b"/>
    <circle cx="68" cy="22" r="3" fill="#22314d"/>
    <path d="M48 16 C56 4 74 4 80 14 L70 12 Z" fill="#3d8bd4"/>
    <circle cx="50" cy="16" r="5" fill="#3d8bd4"/>
    <path d="M26 54 C36 48 52 52 56 60 C46 68 32 66 26 54Z" fill="#efe6cf"/>
  </svg>`;

  const HILL = `<svg viewBox="0 0 200 160" preserveAspectRatio="none">
    <defs><linearGradient id="hill-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cc79d"/><stop offset="1" stop-color="#5fa577"/></linearGradient></defs>
    <path d="M0 160 C20 40 170 20 200 160 Z" fill="url(#hill-grass)"/>
    <path d="M40 70 q4 -10 8 0 M120 52 q4 -10 8 0 M150 80 q4 -10 8 0" fill="none" stroke="#4f8f63" stroke-width="3" stroke-linecap="round"/>
    <rect x="96" y="30" width="6" height="24" fill="#8a5a3b"/><circle cx="99" cy="26" r="16" fill="#4f8f63"/>
  </svg>`;

  // Rows of five on the pond. Returns slot centres and a duck size, in pixels inside the scene.
  function slots() {
    const scene = $('scene');
    const W = scene.clientWidth;
    const H = scene.clientHeight;
    const pond = { x: W * 0.06, y: H * 0.48, w: W * 0.62, h: H * 0.44 };
    const rows = state.total > 5 ? 2 : 1;
    const size = Math.min(pond.w / 5.6, pond.h / (rows + 0.3), 120);
    const spots = Array.from({ length: state.total }, (_, i) => ({
      x: pond.x + (i % 5 + 0.5) * (pond.w / 5),
      y: pond.y + (Math.floor(i / 5) + 0.5) * (pond.h / rows),
    }));
    return { size, spots, hill: { x: W * 0.84, y: H * 0.62 } };
  }

  const ducks = () => [...document.querySelectorAll('#ducks .duck')];
  const pondDucks = () => ducks().filter((d) => d.dataset.where === 'pond').sort((a, b) => a.dataset.slot - b.dataset.slot);
  const awayDucks = () => ducks().filter((d) => d.dataset.where === 'away');

  function place(duck, spot, size) {
    gsap.set(duck, { x: spot.x - size / 2, y: spot.y - size * 0.6 });
  }

  function makeDucks() {
    const { size, spots } = slots();
    $('ducks').replaceChildren(...spots.map((spot, i) => {
      const duck = document.createElement('div');
      duck.className = 'duck';
      duck.dataset.slot = i;
      duck.dataset.where = 'pond';
      duck.style.setProperty('--size', `${size}px`);
      Object.assign(duck.style, { width: `${size}px`, height: `${size * 0.9}px` });
      duck.innerHTML = `${DUCK}<span class="badge"></span>`;
      place(duck, spot, size);
      if (!Scene.reduceMotion) {
        gsap.to(duck.querySelector('svg'), { y: -4, rotation: random(-3, 3), duration: random(1, 1.5), yoyo: true, repeat: -1, ease: 'sine.inOut', delay: random(0, 1) });
      }
      return duck;
    }));
    state.onPond = state.total;
    gsap.from('#ducks .duck', { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.08 });
  }

  // ---------- the story ----------

  // The last ducks in the rows paddle right and disappear behind the hill.
  function swimAway(count, onDone) {
    const { hill } = slots();
    const leaving = pondDucks().slice(-count);
    Voice.say('ducks-away');
    leaving.forEach((duck, i) => {
      duck.dataset.where = 'away';
      gsap.timeline({ delay: 0.3 + i * 0.45 })
        .to(duck, { x: hill.x - duck.offsetWidth / 2, y: hill.y - duck.offsetHeight * 0.6, duration: 1.6, ease: 'sine.inOut' })
        .to(duck, { x: '+=40', y: '-=10', opacity: 0, duration: 0.5, ease: 'power1.in' });
    });
    gsap.delayedCall(0.3 + (count - 1) * 0.45 + 2.2, () => {
      state.onPond -= count;
      onDone();
    });
  }

  // Mother Duck quacks; ducks come out from behind the hill and fill the next slots.
  function comeBack(count, onDone, line = 'ducks-mother') {
    const { size, spots, hill } = slots();
    const mother = $('mother').querySelector('svg');
    if (line) Voice.say(line);
    [0.35, 0.75, 1.1, 1.45].forEach((t, i) => {
      gsap.delayedCall(t + 0.4, () => {
        Sfx.quack();
        gsap.fromTo(mother, { rotation: 0, transformOrigin: '50% 90%' }, { rotation: i % 2 ? 6 : -6, duration: 0.12, yoyo: true, repeat: 1 });
      });
    });
    const returning = awayDucks().slice(0, count);
    returning.forEach((duck, i) => {
      const spot = spots[state.onPond + i];
      duck.dataset.where = 'pond';
      duck.dataset.slot = state.onPond + i;
      gsap.set(duck, { x: hill.x - size / 2 + 40, y: hill.y - size * 0.6 - 10, opacity: 0, scaleX: -1 });
      gsap.timeline({ delay: 2.2 + i * 0.45 })
        .to(duck, { x: hill.x - size / 2, opacity: 1, duration: 0.4 })
        .to(duck, { x: spot.x - size / 2, y: spot.y - size * 0.6, duration: 1.6, ease: 'sine.inOut' })
        .set(duck, { scaleX: 1 });
    });
    gsap.delayedCall(2.2 + (count - 1) * 0.45 + 2.1, () => {
      state.onPond += count;
      onDone();
    });
  }

  // ---------- numbers ----------

  // Three numbers, smallest first, never next to each other; 0 counts ("no ducks").
  const choicesFor = (answer) => spacedChoices(answer, 0, state.total);

  function showNumbers() {
    $('numbers').replaceChildren(...choicesFor(state.answer).map((n, i) => {
      const [color, shade] = PALETTE[(i + 1) % PALETTE.length];
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

  // The voice counts the ducks on the pond, each bobbing up with its number.
  function countDucks({ before = [], after = [], onDone } = {}) {
    const onPond = pondDucks();
    ducks().forEach((d) => d.classList.remove('counted'));
    const ids = onPond.length ? onPond.map((_, i) => `num-${i + 1}`) : ['ducks-none'];
    Voice.sequence([...before, ...ids, ...after], {
      gap: 230,
      onEach: (i) => {
        const duck = onPond[i - before.length];
        if (!duck || i - before.length >= onPond.length) return;
        duck.classList.add('counted');
        duck.querySelector('.badge').textContent = i - before.length + 1;
        Sfx.tick();
        gsap.fromTo(duck, { scale: 1 }, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1 });
      },
      onDone,
    });
  }

  // ---------- rounds ----------

  const ask = () => Voice.say('ducks-how-many');

  function newRound() {
    state.misses = 0;
    state.busy = true;
    $('numbers').replaceChildren();
    ducks().forEach((d) => d.classList.remove('counted'));
    const away = state.total - state.onPond;

    // In "Swim away", an empty pond means everyone comes home before the next round.
    if (state.onPond === 0 && state.story === 'away') {
      comeBack(away, () => {
        Sfx.fanfare();
        Voice.say('ducks-all-back');
        gsap.delayedCall(2.6, newRound);
      });
      return;
    }

    const most = LEVELS[state.level].most;
    const canGoBack = state.story === 'both' && away > 0;
    const goAway = state.onPond > 0 && (!canGoBack || Math.random() < 0.55);
    const count = Math.floor(random(1, Math.min(most, goAway ? state.onPond : away) + 1));
    state.answer = state.onPond + (goAway ? -count : count);

    const then = () => {
      showNumbers();
      state.busy = false;
      ask();
    };
    if (goAway) swimAway(count, then);
    else comeBack(count, then);
  }

  function onTapNumber(e) {
    const tile = e.currentTarget;
    e.preventDefault();
    if (state.busy || tile.disabled) return;
    state.pendingAsk?.kill();
    if (Number(tile.dataset.number) === state.answer) right(tile);
    else wrong(tile);
  }

  function right(tile) {
    state.busy = true;
    tile.classList.add('right');
    Sfx.chime();
    Fx.burst(Fx.centerOf(tile), tile.style.getPropertyValue('--color'), tile.offsetWidth * 1.2);
    gsap.to('.numbers .tile:not(.right)', { opacity: 0.25, duration: 0.3 });
    countDucks({
      after: [Voice.line('correct', CORRECT_LINES.length)],
      onDone: () => {
        if (Fx.addPoint(Fx.centerOf(tile))) gsap.delayedCall(1.4, earnStar);
        else gsap.delayedCall(1.2, newRound);
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
      // Count the ducks together; then the right number glows.
      state.busy = true;
      countDucks({
        before: ['count-together'],
        onDone: () => {
          document.querySelector(`.numbers .tile[data-number="${state.answer}"]`)?.classList.add('hint');
          state.busy = false;
        },
      });
      return;
    }
    Voice.wrong();
    state.pendingAsk = gsap.delayedCall(2.2, ask);
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

  // Ducks are placed in pixels, so put them back in their slots if the screen turns.
  window.addEventListener('resize', () => {
    if (state.busy) return;
    const { size, spots } = slots();
    pondDucks().forEach((duck) => {
      duck.style.setProperty('--size', `${size}px`);
      Object.assign(duck.style, { width: `${size}px`, height: `${size * 0.9}px` });
      place(duck, spots[duck.dataset.slot], size);
    });
  });

  // ---------- start screen ----------

  $('hill').innerHTML = HILL;
  $('mother').innerHTML = MOTHER;
  $('start-art').innerHTML = MOTHER + DUCK.repeat(3);
  gsap.from('.start-art svg', { y: -30, opacity: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.12, delay: 0.2 });
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.total = Number(document.querySelector('[name="total"]:checked').value);
    state.story = document.querySelector('[name="story"]:checked').value;
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    Voice.say(`ducks-swim-${state.total}`); // playing inside the tap unlocks audio on iPad/iPhone
    gsap.to('#start', {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        $('start').classList.add('hidden');
        makeDucks();
        gsap.delayedCall(3, newRound);
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
