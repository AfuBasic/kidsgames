// Pop-a-Sound: hear "Pop the first sound in sun" and pop the balloon with that letter.
(() => {
  'use strict';

  const BALLOONS_PER_LEVEL = [2, 3, 5];
  const STARS_PER_LEVEL_UP = 2;
  // With "grow" sound positions, last sounds join at 2 stars and middle sounds at 4.
  const STARS_FOR_LAST = 2;
  const STARS_FOR_MIDDLE = 4;

  const $ = (id) => document.getElementById(id);
  const field = $('balloons');
  const { PALETTE, random } = Fx;
  const shuffle = (list) => gsap.utils.shuffle(list);
  const soundOf = (letter) => SOUND_OF[letter] || letter;

  const state = {
    letters: [...LETTER_GROUPS[0].letters],
    positionsMode: 'grow',
    level: 0,
    pops: 0,
    question: null,
    pendingAsk: null,
    misses: 0,
    showWord: true,
    busy: true,
  };
  let uid = 0;

  // ---------- questions ----------

  const nextFromDeck = createDeck({ clash: (q, prev) => q.letter === prev.letter });

  function allowedPositions() {
    if (state.positionsMode === 'first') return ['f'];
    if (state.positionsMode === 'mix') return ['f', 'm', 'l'];
    return ['f', ...(Fx.stars >= STARS_FOR_LAST ? ['l'] : []), ...(Fx.stars >= STARS_FOR_MIDDLE ? ['m'] : [])];
  }

  function nextQuestion() {
    const positions = allowedPositions();
    const questions = Object.entries(WORDS).flatMap(([word, flags]) =>
      [...flags]
        .filter((pos) => positions.includes(pos))
        .map((pos) => {
          const index = pos === 'f' ? 0 : pos === 'l' ? word.length - 1 : 1;
          return { word, pos, index, letter: word[index] };
        })
        .filter((q) => state.letters.includes(q.letter)));
    return nextFromDeck(questions, positions.join('') + state.letters.join(''));
  }

  const ask = () => Voice.say(`ask-${state.question.pos}-${state.question.word}`);

  // ---------- balloons ----------

  function balloonSVG(letter, [base, shade]) {
    const id = `bg${++uid}`;
    return `<svg viewBox="0 0 120 172" aria-hidden="true">
      <defs>
        <radialGradient id="${id}" cx="34%" cy="28%" r="82%">
          <stop offset="0" stop-color="#fff" stop-opacity="0.7"/>
          <stop offset="0.2" stop-color="${base}"/>
          <stop offset="1" stop-color="${shade}"/>
        </radialGradient>
      </defs>
      <path d="M60 134 C50 146 70 154 58 171" fill="none" stroke="rgba(34,49,77,0.35)" stroke-width="1.6"/>
      <path d="M60 4 C93 4 115 30 115 63 C115 99 85 127 60 129 C35 127 5 99 5 63 C5 30 27 4 60 4Z" fill="url(#${id})"/>
      <path d="M53 128 H67 L63 136 H57Z" fill="${shade}"/>
      <ellipse cx="33" cy="38" rx="8" ry="18" fill="#fff" opacity="0.32" transform="rotate(-28 33 38)"/>
      <text x="60" y="64" text-anchor="middle" dominant-baseline="central" class="glyph">${letter}</text>
    </svg>`;
  }

  function makeBalloon(letter, i) {
    const colors = PALETTE[(i + state.pops) % PALETTE.length];
    const b = document.createElement('button');
    b.className = 'balloon';
    b.dataset.letter = letter;
    b.dataset.color = colors[0];
    b.setAttribute('aria-label', `Balloon ${letter}`);
    b.innerHTML = balloonSVG(letter, colors);
    b.addEventListener('pointerdown', onTap);
    return b;
  }

  // Spread balloons over a grid below the top bar, using two rows when the screen is narrow.
  function layoutBalloons() {
    const balloons = [...field.children];
    const n = balloons.length;
    if (!n) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const top = h * 0.25;
    const areaH = h - top - h * 0.05;
    const cols = w / n >= 160 ? n : Math.ceil(n / 2);
    const rows = Math.ceil(n / cols);
    const cellW = w / cols;
    const cellH = areaH / rows;
    const size = Math.min(cellW * 0.78, cellH * 0.6, 230);

    balloons.forEach((b, i) => {
      const row = Math.floor(i / cols);
      const inRow = row === rows - 1 ? n - row * cols : cols;
      const col = i % cols;
      const x = (w - inRow * cellW) / 2 + (col + 0.5) * cellW;
      const jitter = random(-1, 1) * Math.max(0, cellH - size * 1.43) * 0.25;
      const y = top + (row + 0.5) * cellH - size * 0.1 + jitter;
      b.style.setProperty('--x', `${x}px`);
      b.style.setProperty('--y', `${y}px`);
      b.style.setProperty('--size', `${size}px`);
    });
  }

  // ---------- rounds ----------

  function newRound() {
    const question = nextQuestion();
    const count = Math.min(BALLOONS_PER_LEVEL[state.level], state.letters.length);
    const others = shuffle(state.letters.filter((l) => soundOf(l) !== soundOf(question.letter)));
    const choices = shuffle([question.letter, ...others.slice(0, count - 1)]);

    state.question = question;
    state.misses = 0;
    state.busy = false;

    gsap.killTweensOf(field.querySelectorAll('.balloon, .balloon svg'));
    field.replaceChildren(...choices.map(makeBalloon));
    layoutBalloons();

    const balloons = [...field.children];
    gsap.from(balloons, { y: () => window.innerHeight * 0.9, opacity: 0, duration: 1.3, ease: 'power3.out', stagger: 0.12 });
    balloons.forEach((b) => Fx.sway(b.querySelector('svg')));

    showClue();
    state.pendingAsk = gsap.delayedCall(0.8, ask);
  }

  function showClue() {
    const { word, index } = state.question;
    $('clue-pic').innerHTML = PICTURES[word];
    $('clue-word').innerHTML = state.showWord
      ? [...word].map((ch, i) => (i === index ? `<b>${ch}</b>` : ch)).join('')
      : '';
    gsap.fromTo('#clue', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' });
    gsap.fromTo('#clue-pic svg', { rotation: -8 }, { rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
  }

  function onTap(e) {
    const b = e.currentTarget;
    e.preventDefault();
    if (state.busy) return;
    if (b.dataset.letter === state.question.letter) correct(b);
    else wrong(b);
  }

  function correct(b) {
    state.busy = true;
    state.pops++;
    state.pendingAsk.kill(); // a quick tap shouldn't have the question talk over the praise
    const rect = b.getBoundingClientRect();
    const center = { x: rect.left + rect.width / 2, y: rect.top + rect.width * 0.55 };

    gsap.killTweensOf(b.querySelector('svg'));
    Sfx.pop();
    gsap.timeline().to(b, { scale: 1.12, duration: 0.07, ease: 'power1.out' }).set(b, { autoAlpha: 0 });
    Fx.burst(center, b.dataset.color, rect.width);

    field.querySelectorAll('.balloon').forEach((other) => {
      if (other !== b) gsap.to(other, { y: -window.innerHeight * 1.2, duration: 1.8, ease: 'power2.in', delay: random(0.25, 0.5) });
    });

    gsap.delayedCall(0.3, () => Voice.correct());
    if (Fx.addPoint(center)) gsap.delayedCall(1.9, earnStar);
    else gsap.delayedCall(2.3, newRound);
  }

  function wrong(b) {
    Sfx.buzzer();
    state.pendingAsk.kill();
    gsap.timeline()
      .to(b, { rotation: -10, duration: 0.08 })
      .to(b, { rotation: 8, duration: 0.1 })
      .to(b, { rotation: -5, duration: 0.1 })
      .to(b, { rotation: 0, duration: 0.25, ease: 'elastic.out(1, 0.4)' });
    state.misses++;
    if (state.misses >= 2) {
      const answer = field.querySelector(`.balloon[data-letter="${state.question.letter}"]`);
      if (answer && !answer.classList.contains('hint')) {
        answer.classList.add('hint');
        gsap.to(answer, { scale: 1.08, duration: 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }
    }
    gsap.delayedCall(0.4, () => Voice.wrong());
  }

  function earnStar() {
    let message = 'You got a star!';
    let phrase = 'star';
    if ((Fx.stars + 1) % STARS_PER_LEVEL_UP === 0 && state.level < BALLOONS_PER_LEVEL.length - 1) {
      state.level++;
      message = 'More balloons!';
      phrase = 'more';
    }
    Fx.earnStar(message, phrase, newRound);
  }

  // ---------- start screen ----------

  $('group-options').innerHTML = LETTER_GROUPS.map((group, i) => `
    <label><input type="radio" name="letter-group" value="${i}" ${i === 0 ? 'checked' : ''}> <strong>${group.label}</strong><small>${i === 0 ? 'First letters' : `Groups 1 to ${i + 1}`}</small></label>
  `).join('');
  $('start-balloons').innerHTML = ['s', 'a', 't'].map((l, i) => balloonSVG(l, PALETTE[i])).join('');
  document.querySelectorAll('#start-balloons svg').forEach((el) => Fx.sway(el));
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
  gsap.from('#start-balloons svg', { y: 120, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12, delay: 0.2 });

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    const groups = Number(document.querySelector('[name="letter-group"]:checked').value);
    state.letters = [...LETTER_GROUPS.slice(0, groups + 1).map((g) => g.letters).join('')];
    state.level = Number(document.querySelector('[name="start-level"]:checked').value);
    state.positionsMode = document.querySelector('[name="positions"]:checked').value;
    state.showWord = $('show-word').checked;
    Voice.say('start'); // playing inside the tap unlocks audio on iPad/iPhone

    gsap.to('#start', {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        $('start').classList.add('hidden');
        gsap.killTweensOf('#start-balloons svg');
        newRound();
      },
    });
  });

  document.querySelector('.replay').addEventListener('click', () => {
    if (!state.question) return;
    gsap.fromTo('.replay', { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    ask();
  });
  window.addEventListener('resize', layoutBalloons);
})();
