// Word Fishing: fish swim around the pond, each carrying a written word. The voice asks for
// one ("Can you catch the word cat?") and the child taps that fish. Builds word reading.
(() => {
  'use strict';

  // Each level: how many fish, which tricky look-alikes to include, and seconds per crossing.
  const LEVELS = [
    { fish: 2, sameStart: false, rhyme: false, crossing: 9 },
    { fish: 3, sameStart: true, rhyme: false, crossing: 8 },
    { fish: 4, sameStart: true, rhyme: true, crossing: 7 },
  ];

  const $ = (id) => document.getElementById(id);
  const { pick, random, PALETTE } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);
  const nextFromDeck = createDeck();
  let fishCount = 0;

  const state = {
    length: '3',
    level: 0,
    word: null,
    misses: 0,
    showPicture: true,
    busy: true,
    pendingAsk: null,
    firstRound: true,
  };

  // ---------- drawing ----------

  // A fish facing left; the word label sits over the middle of its body (x = 80).
  function fishSVG([color, shade]) {
    const id = `fish-${fishCount++}`;
    return `<svg viewBox="0 0 160 100" aria-hidden="true">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${shade}"/>
      </linearGradient></defs>
      <path class="tail" d="M130 50 L158 20 Q150 50 158 80 Z" fill="${shade}"/>
      <path d="M62 18 Q84 0 108 20 Z" fill="${shade}"/>
      <path d="M74 82 Q86 96 100 80 Z" fill="${shade}"/>
      <ellipse cx="80" cy="50" rx="58" ry="34" fill="url(#${id})"/>
      <path d="M118 26 Q110 50 118 74" fill="none" stroke="${shade}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
      <circle cx="40" cy="42" r="7" fill="#fff"/><circle cx="38.5" cy="42" r="3.6" fill="${PICTURE_KIT.INK}"/>
      <path d="M24 58 Q30 62 36 58" fill="none" stroke="${PICTURE_KIT.INK}" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="62" cy="34" rx="14" ry="5" fill="#fff" opacity="0.28" transform="rotate(-14 62 34)"/>
    </svg>`;
  }

  const wagTail = (svg, speed = 1) => gsap.to(svg.querySelector('.tail'), {
    rotation: 14, svgOrigin: '130 50', duration: 0.35 / speed, yoyo: true, repeat: -1, ease: 'sine.inOut',
  });

  function decoratePond() {
    const reed = (flip) => `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="transform: scaleX(${flip})">
      <path d="M20 100 Q14 50 28 6" fill="none" stroke="#3f8f5a" stroke-width="7" stroke-linecap="round"/>
      <path d="M44 100 Q50 40 38 0" fill="none" stroke="#2f7a4a" stroke-width="7" stroke-linecap="round"/>
      <path d="M66 100 Q60 60 76 22" fill="none" stroke="#4fa36a" stroke-width="7" stroke-linecap="round"/>
      <rect x="23" y="4" width="10" height="22" rx="5" fill="#8a5a3b" transform="rotate(12 28 15)"/>
    </svg>`;
    $('reeds').innerHTML = `<div class="reed" style="left: 0">${reed(1)}</div><div class="reed" style="right: 0">${reed(-1)}</div>`;

    if (Scene.reduceMotion) return;
    const bubbles = $('bubbles');
    for (let i = 0; i < 9; i++) {
      const b = document.createElement('div');
      const size = random(8, 22);
      b.className = 'bubble';
      Object.assign(b.style, { width: `${size}px`, height: `${size}px`, left: `${random(4, 96)}%` });
      bubbles.append(b);
      gsap.to(b, {
        y: () => -bubbles.offsetHeight - 40,
        x: `+=${random(-30, 30)}`,
        duration: random(6, 11),
        ease: 'none',
        repeat: -1,
        delay: random(0, 8),
      });
    }
  }

  // ---------- swimming ----------

  // Each fish swims back and forth along its own lane, turning at the edges, so it never
  // leaves the pond. `fish.swim` is the current leg, which wrong/hint answers speed up or slow.
  function swim(fish) {
    const school = $('fish-school');
    const maxX = Math.max(school.offsetWidth - fish.offsetWidth, 0);
    const speed = school.offsetWidth / LEVELS[state.level].crossing;
    const goingRight = fish.dataset.dir === 'right';
    const to = goingRight ? maxX : 0;
    const from = gsap.getProperty(fish, 'x');
    const svg = fish.querySelector('svg');
    gsap.to(svg, { scaleX: goingRight ? -1 : 1, duration: 0.3, ease: 'power2.inOut' });
    const timeScale = fish.swim ? fish.swim.timeScale() : 1;
    fish.swim = gsap.to(fish, {
      x: to,
      duration: Math.max(Math.abs(to - from) / speed, 0.4),
      ease: 'sine.inOut',
      onComplete: () => {
        fish.dataset.dir = goingRight ? 'left' : 'right';
        swim(fish);
      },
    }).timeScale(timeScale);
  }

  function makeFish(word, lane, lanes) {
    const fish = document.createElement('button');
    fish.className = 'fish';
    fish.dataset.word = word;
    fish.setAttribute('aria-label', word);
    fish.innerHTML = `${fishSVG(pick(PALETTE))}<span class="word">${word}</span>`;
    fish.addEventListener('pointerdown', onTap);
    $('fish-school').append(fish);

    const school = $('fish-school');
    const laneHeight = school.offsetHeight / lanes;
    const maxX = Math.max(school.offsetWidth - fish.offsetWidth, 0);
    const y = lane * laneHeight + (laneHeight - fish.offsetHeight) / 2;
    // Stagger starting spots so fish in neighbouring lanes don't line up.
    const x = maxX * ((lane % 2 ? 0.65 : 0.15) + random(-0.1, 0.1));
    fish.dataset.dir = Math.random() < 0.5 ? 'left' : 'right';
    gsap.set(fish, { x, y });
    gsap.set(fish.querySelector('svg'), { scaleX: fish.dataset.dir === 'right' ? -1 : 1 });

    if (!Scene.reduceMotion) {
      wagTail(fish.querySelector('svg'));
      gsap.to(fish.querySelector('svg'), { y: random(-8, -4), duration: random(1.2, 1.8), yoyo: true, repeat: -1, ease: 'sine.inOut' });
      swim(fish);
    }
    gsap.from(fish, { opacity: 0, scale: 0.6, duration: 0.5, ease: 'back.out(1.7)', delay: lane * 0.08 });
    return fish;
  }

  function clearFish(except) {
    document.querySelectorAll('.fish').forEach((fish) => {
      if (fish === except) return;
      fish.swim?.kill();
      fish.disabled = true;
      gsap.to(fish, {
        x: fish.dataset.dir === 'right' ? '+=320' : '-=320',
        opacity: 0,
        duration: 0.7,
        ease: 'power2.in',
        onComplete: () => { gsap.killTweensOf([fish, ...fish.querySelectorAll('*')]); fish.remove(); },
      });
    });
  }

  // ---------- rounds ----------

  const wordPool = () => SPELL_WORDS.filter((w) => state.length === 'all' || w.length === 3);

  function choicesFor(word) {
    const level = LEVELS[state.level];
    const pool = wordPool().filter((w) => w !== word);
    const rhymes = (a, b) => a.length === b.length && a.slice(1) === b.slice(1);
    const tricky = [];
    if (level.sameStart) {
      const sameStart = pool.filter((w) => w[0] === word[0] && !rhymes(w, word));
      if (sameStart.length) tricky.push(pick(sameStart));
    }
    if (level.rhyme) {
      const rhyming = pool.filter((w) => rhymes(w, word));
      if (rhyming.length) tricky.push(pick(rhyming));
    }
    const plain = shuffle(pool.filter((w) => w[0] !== word[0] && !rhymes(w, word) && !tricky.includes(w)));
    return shuffle([word, ...tricky, ...plain].slice(0, level.fish));
  }

  const ask = () => Voice.say(`catch-${state.word}`);

  function showTarget() {
    const target = $('target');
    target.classList.toggle('blank', !state.showPicture);
    target.innerHTML = state.showPicture ? PICTURES[state.word] : '';
    if (state.showPicture) gsap.fromTo(target, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' });
  }

  function newRound() {
    const word = nextFromDeck(wordPool().map((w) => ({ word: w })), state.length).word;
    state.word = word;
    state.misses = 0;
    state.busy = false;
    showTarget();

    const choices = choicesFor(word);
    choices.forEach((w, lane) => makeFish(w, lane, choices.length));

    // The first word waits for the intro ("Let's catch some fish!") to finish.
    state.pendingAsk = gsap.delayedCall(state.firstRound ? 1.8 : 0.6, ask);
    state.firstRound = false;
  }

  function onTap(e) {
    const fish = e.currentTarget;
    e.preventDefault();
    if (state.busy || fish.disabled) return;
    state.pendingAsk?.kill();
    if (fish.dataset.word === state.word) caught(fish);
    else missed(fish);
  }

  // The fish leaps out of the water and up into the picture card.
  function caught(fish) {
    state.busy = true;
    fish.swim?.kill();
    fish.classList.add('caught');
    Sfx.pop();
    Voice.correct(250, `word-${state.word}`);
    const start = Fx.centerOf(fish);
    Fx.burst(start, '#7cc4e4', fish.offsetWidth * 0.7);
    clearFish(fish);

    const card = Fx.centerOf($('target'));
    const dx = card.x - start.x;
    const dy = card.y - start.y;
    const svg = fish.querySelector('svg');
    gsap.to(svg.querySelector('.tail'), { rotation: 0, duration: 0.2, overwrite: true });
    gsap.timeline({
      onComplete: () => {
        Fx.burst(card, '#2a9d8f', 160);
        Sfx.chime();
        gsap.fromTo('#target', { scale: 1.2 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        fish.remove();
        if (Fx.addPoint(card)) gsap.delayedCall(1.6, earnStar);
        else gsap.delayedCall(1.8, newRound);
      },
    })
      .to(fish, { y: '-=60', rotation: dx > 0 ? 18 : -18, scale: 1.1, duration: 0.35, ease: 'power2.out' })
      .to(fish, { x: `+=${dx}`, duration: 0.9, ease: 'power1.inOut' }, 0.35)
      .to(fish, { y: `+=${dy + 60}`, scale: 0.25, opacity: 0.2, rotation: dx > 0 ? 300 : -300, duration: 0.9, ease: 'power2.in' }, 0.35);
  }

  // The wrong fish darts off in a hurry and goes pale; the voice asks again.
  function missed(fish) {
    Sfx.buzzer();
    fish.disabled = true;
    if (fish.swim) {
      fish.swim.timeScale(4);
      gsap.delayedCall(0.6, () => fish.swim?.timeScale(1));
    }
    gsap.fromTo(fish.querySelector('svg'), { rotation: -12 }, { rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    state.misses++;
    if (state.misses >= 2) {
      const target = document.querySelector(`.fish[data-word="${state.word}"]`);
      target?.classList.add('hint');
      target?.swim?.timeScale(0.35);
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

  // A fish whose leg was set up for the old pond width would swim off the edge, so restart.
  window.addEventListener('resize', () => {
    document.querySelectorAll('.fish:not(.caught)').forEach((fish) => {
      if (!fish.swim) return;
      fish.swim.kill();
      gsap.set(fish, { x: Math.min(gsap.getProperty(fish, 'x'), $('fish-school').offsetWidth - fish.offsetWidth) });
      swim(fish);
    });
  });

  // ---------- start screen ----------

  decoratePond();
  $('start-fish').innerHTML = fishSVG(PALETTE[1]);
  if (!Scene.reduceMotion) {
    wagTail($('start-fish').querySelector('svg'));
    gsap.to('#start-fish', { y: -8, rotation: -3, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.length = document.querySelector('[name="length"]:checked').value;
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    state.showPicture = $('show-picture').checked;
    Voice.say('start-fishing'); // playing inside the tap unlocks audio on iPad/iPhone
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
    state.pendingAsk?.kill();
    ask();
  });
})();
