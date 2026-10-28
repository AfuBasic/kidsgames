// Blend Robot: the robot says a word slowly ("caaat") while its screen lights up each letter,
// and the child taps the matching picture. Builds blending: hearing sounds join into a word.
(() => {
  'use strict';

  // Each level: how many pictures, and which tricky look-alikes to include.
  const LEVELS = [
    { pictures: 2, sameStart: false, rhyme: false },
    { pictures: 3, sameStart: true, rhyme: false },
    { pictures: 4, sameStart: true, rhyme: true },
  ];
  const TALK_TIME = 1.7; // seconds: about how long a stretched word lasts

  const $ = (id) => document.getElementById(id);
  const { pick } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);
  const nextFromDeck = createDeck();

  const state = {
    length: '3',
    level: 0,
    word: null,
    misses: 0,
    showLetters: true,
    busy: true,
    pendingTalk: null,
    firstRound: true,
  };

  // ---------- the robot ----------

  function robotSVG(id) {
    return `<svg viewBox="0 0 200 220" id="${id}">
      <line x1="100" y1="30" x2="100" y2="12" stroke="#7c8aa5" stroke-width="5" stroke-linecap="round"/>
      <circle class="antenna" cx="100" cy="10" r="8" fill="#ef6f6c"/>
      <rect x="40" y="50" width="12" height="28" rx="5" fill="#7c8aa5"/>
      <rect x="148" y="50" width="12" height="28" rx="5" fill="#7c8aa5"/>
      <rect x="50" y="28" width="100" height="74" rx="22" fill="#9aa3b2"/>
      <rect x="62" y="40" width="76" height="50" rx="14" fill="#22314d"/>
      <g class="eyes">
        <circle cx="83" cy="60" r="8.5" fill="#7fe0e8"/>
        <circle cx="117" cy="60" r="8.5" fill="#7fe0e8"/>
      </g>
      <g class="mouth">${[80, 88, 96, 104, 112].map((x) => `<rect class="bar" x="${x}" y="74" width="5" height="6" rx="2" fill="#7fe0e8"/>`).join('')}</g>
      <rect x="88" y="102" width="24" height="10" fill="#7c8aa5"/>
      <g class="arm arm-left"><rect x="12" y="116" width="24" height="64" rx="12" fill="#9aa3b2"/></g>
      <g class="arm arm-right"><rect x="164" y="116" width="24" height="64" rx="12" fill="#9aa3b2"/></g>
      <rect x="38" y="110" width="124" height="96" rx="20" fill="#b9c3d3"/>
      <rect x="52" y="122" width="96" height="54" rx="10" fill="#22314d"/>
      <g class="screen"></g>
      <circle cx="80" cy="192" r="6" fill="#f2b134"/><circle cx="100" cy="192" r="6" fill="#2a9d8f"/><circle cx="120" cy="192" r="6" fill="#ef6f6c"/>
    </svg>`;
  }

  const robot = () => $('robot-svg');

  function idleRobot(svg) {
    if (Scene.reduceMotion) return;
    gsap.to(svg.querySelector('.antenna'), { fill: '#ffd66e', duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to(svg, { y: -6, duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    // blink every few seconds
    gsap.timeline({ repeat: -1, repeatDelay: 2.6 })
      .to(svg.querySelectorAll('.eyes circle'), { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.08 })
      .to(svg.querySelectorAll('.eyes circle'), { scaleY: 1, duration: 0.1 });
  }

  // Put the word's letters on the chest screen (dim until spoken).
  function setScreen(word) {
    const screen = robot().querySelector('.screen');
    if (!state.showLetters) {
      screen.innerHTML = '';
      return;
    }
    const step = 22;
    const startX = 100 - ((word.length - 1) * step) / 2;
    screen.innerHTML = [...word].map((letter, i) =>
      `<text class="screen-letter" x="${startX + i * step}" y="150" text-anchor="middle" dominant-baseline="central">${letter}</text>`).join('');
  }

  // The robot says the stretched word: mouth moves and letters light up one by one.
  function talk() {
    const svg = robot();
    Voice.say(`stretch-${state.word}`);
    const bars = svg.querySelectorAll('.mouth .bar');
    gsap.killTweensOf(bars);
    gsap.to(bars, {
      attr: { height: () => gsap.utils.random(6, 14), y: () => gsap.utils.random(70, 74) },
      duration: 0.12,
      repeat: Math.round(TALK_TIME / 0.12),
      yoyo: true,
      stagger: 0.03,
      onComplete: () => gsap.set(bars, { attr: { height: 6, y: 74 } }),
    });
    const letters = svg.querySelectorAll('.screen-letter');
    letters.forEach((l) => l.classList.remove('lit'));
    letters.forEach((l, i) => gsap.delayedCall(0.15 + (i * (TALK_TIME - 0.3)) / Math.max(letters.length - 1, 1), () => l.classList.add('lit')));
  }

  function dance() {
    const svg = robot();
    gsap.timeline()
      .to(svg.querySelector('.arm-left'), { rotation: 140, transformOrigin: '24px 122px', duration: 0.25, ease: 'back.out(2)' }, 0)
      .to(svg.querySelector('.arm-right'), { rotation: -140, transformOrigin: '176px 122px', duration: 0.25, ease: 'back.out(2)' }, 0)
      .to(svg, { rotation: 6, duration: 0.15, yoyo: true, repeat: 5 }, 0)
      .to(svg.querySelectorAll('.arm'), { rotation: 0, duration: 0.4, ease: 'power2.inOut' }, 1.1);
    gsap.fromTo(svg.querySelectorAll('.eyes circle'), { attr: { r: 8.5 } }, { attr: { r: 11 }, duration: 0.2, yoyo: true, repeat: 3 });
  }

  function shrug() {
    const svg = robot();
    gsap.timeline()
      .to(svg, { rotation: -4, duration: 0.1 })
      .to(svg, { rotation: 4, duration: 0.12 })
      .to(svg, { rotation: 0, duration: 0.15 });
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
    return shuffle([word, ...tricky, ...plain].slice(0, level.pictures));
  }

  function newRound() {
    const word = nextFromDeck(wordPool().map((w) => ({ word: w })), state.length).word;
    state.word = word;
    state.misses = 0;
    state.busy = false;
    setScreen(word);

    const choices = choicesFor(word);
    const picks = $('picks');
    picks.style.setProperty('--n', choices.length);
    picks.classList.toggle('many', choices.length > 2);
    picks.replaceChildren(...choices.map((w) => {
      const button = document.createElement('button');
      button.className = 'pick glass';
      button.dataset.word = w;
      button.setAttribute('aria-label', w);
      button.innerHTML = PICTURES[w];
      button.addEventListener('pointerdown', onTap);
      return button;
    }));
    gsap.from('.pick', { y: 50, opacity: 0, scale: 0.8, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.08 });

    // The first word waits for the intro ("Listen to the robot…") to finish.
    state.pendingTalk = gsap.delayedCall(state.firstRound ? 2.4 : 0.6, talk);
    state.firstRound = false;
  }

  function onTap(e) {
    const button = e.currentTarget;
    e.preventDefault();
    if (state.busy || button.disabled) return;
    state.pendingTalk.kill();
    if (button.dataset.word === state.word) right(button);
    else wrong(button);
  }

  function right(button) {
    state.busy = true;
    button.classList.add('right');
    robot().querySelectorAll('.screen-letter').forEach((l) => l.classList.add('lit'));
    dance();
    Sfx.chime();
    const center = Fx.centerOf(button);
    Fx.burst(center, '#2a9d8f', button.offsetWidth * 0.8);
    Voice.say(`word-${state.word}`);
    gsap.timeline()
      .to(button, { scale: 1.1, duration: 0.2, ease: 'power2.out' })
      .to(button, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    gsap.to('.pick:not(.right)', { opacity: 0, scale: 0.8, duration: 0.4, delay: 0.3 });

    if (Fx.addPoint(center)) gsap.delayedCall(2.4, earnStar);
    else gsap.delayedCall(2.6, newRound);
  }

  function wrong(button) {
    Sfx.buzzer();
    shrug();
    button.disabled = true;
    gsap.timeline()
      .to(button, { x: -10, duration: 0.06 })
      .to(button, { x: 10, duration: 0.08 })
      .to(button, { x: 0, duration: 0.1 });
    state.misses++;
    if (state.misses >= 2) document.querySelector(`.pick[data-word="${state.word}"]`)?.classList.add('hint');

    // "Wrong… Try again." and the robot says the word again
    Voice.say(Voice.line('wrong', WRONG_LINES.length), 450, 'try-again');
    state.pendingTalk = gsap.delayedCall(2.2, talk);
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

  $('robot').innerHTML = robotSVG('robot-svg');
  $('start-robot').innerHTML = robotSVG('start-robot-svg');
  idleRobot(robot());
  idleRobot($('start-robot-svg'));
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    state.length = document.querySelector('[name="length"]:checked').value;
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    state.showLetters = $('show-letters').checked;
    Voice.say('start-robot'); // playing inside the tap unlocks audio on iPad/iPhone
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
    state.pendingTalk?.kill();
    talk();
  });
})();
