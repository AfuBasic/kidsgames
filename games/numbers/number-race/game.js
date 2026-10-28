// Number Race: a numbered board game (after Siegler & Ramani's straight-line board studies).
// Rabbit and Tortoise take turns: spin 1 or 2 (or roll 1–6 on the big boards), then hop one
// square per tap while the voice says each number. Turns are kept equal: when whoever went
// first reaches the end, the other gets one last turn, and if they get there too it's a draw.
// The score (with the players' names) is kept on the device, so they can play on and on.
(() => {
  'use strict';

  const PLAYERS = {
    rabbit: { name: 'Rabbit' },
    tortoise: { name: 'Tortoise' },
  };

  const $ = (id) => document.getElementById(id);
  const { random, PALETTE } = Fx;

  // Every timer and move that drives the race, so End game can pause it and New game cancel it.
  const timers = new Set();
  const track = (anim) => {
    timers.add(anim);
    anim.then(() => timers.delete(anim));
    return anim;
  };
  const later = (seconds, fn) => track(gsap.delayedCall(seconds, fn));

  const state = {
    target: 10,
    players: 1,
    dice: false,         // 1–6 die on 50 and 100; a 1–2 spinner on 10 and 20
    pos: { rabbit: 0, tortoise: 0 },
    turn: 'rabbit',
    starter: 'rabbit',   // who went first this race
    round: 0,            // turns each, counted when the starter's turn begins
    leader: null,        // reached the end first; the other is having a last turn
    phase: 'wait',       // wait | spin | hop
    hopsLeft: 0,
    prompt: null,
  };

  // ---------- names and score, kept on this device between visits ----------

  const STORE = 'number-race';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE)) || {}; } catch { /* no storage: nothing remembered */ }
  saved.names ||= { rabbit: '', tortoise: '' };
  saved.scores ||= {};
  const keep = () => { try { localStorage.setItem(STORE, JSON.stringify(saved)); } catch { /* the score just isn't kept */ } };

  // Against the computer, Tortoise is always Tortoise.
  const nameOf = (who) => (who === 'tortoise' && state.players === 1 ? '' : saved.names[who]) || PLAYERS[who].name;
  // Each pair of players (and the game against Tortoise) has its own score.
  const score = () => (saved.scores[`${state.players}|${nameOf('rabbit')}|${nameOf('tortoise')}`] ||= { rabbit: 0, tortoise: 0, draws: 0 });

  // ---------- drawing ----------

  const TORTOISE = `<svg viewBox="0 0 100 100">
    <ellipse cx="22" cy="66" rx="14" ry="10" fill="#9ccf8e"/>
    <circle cx="16" cy="62" r="2.6" fill="#22314d"/>
    <path d="M14 70 q4 3 8 0" fill="none" stroke="#22314d" stroke-width="2" stroke-linecap="round"/>
    <rect x="34" y="70" width="12" height="18" rx="5" fill="#9ccf8e"/><rect x="68" y="70" width="12" height="18" rx="5" fill="#9ccf8e"/>
    <path d="M28 76 C28 44 48 30 62 30 C80 30 94 46 94 76Z" fill="#5fae6c"/>
    <path d="M44 74 L50 52 L62 46 L74 52 L80 74 M50 52 L40 74 M74 52 L86 74 M62 46 L62 34" fill="none" stroke="#3f7f4c" stroke-width="3" stroke-linejoin="round"/>
    <path d="M26 76 H96" stroke="#3f7f4c" stroke-width="4" stroke-linecap="round"/>
    <path d="M94 70 l6 4 l-6 2Z" fill="#9ccf8e"/>
  </svg>`;
  const face = (who) => (who === 'rabbit' ? PICTURES.rabbit : TORTOISE);

  // A two-part spinner (1 and 2), or a die face.
  const pips = (n, x, y, size) => {
    const P = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] };
    const step = size / 3.4;
    return P[n].map(([gx, gy]) => `<circle cx="${x + (size - step * 2) / 2 + gx * step}" cy="${y + (size - step * 2) / 2 + gy * step}" r="${size * 0.09}" fill="#22314d"/>`).join('');
  };
  const SPINNER = `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="#fff" stroke="#22314d" stroke-width="3"/>
    <path d="M50 50 L50 2 A48 48 0 0 0 50 98Z" fill="#5f63d0"/>
    <path d="M50 50 L50 2 A48 48 0 0 1 50 98Z" fill="#f2b134"/>
    <text x="27" y="54" text-anchor="middle" dominant-baseline="central" font-family="Andika, sans-serif" font-weight="700" font-size="26" fill="#fff">1</text>
    <text x="73" y="54" text-anchor="middle" dominant-baseline="central" font-family="Andika, sans-serif" font-weight="700" font-size="26" fill="#fff">2</text>
    <g class="arrow"><path d="M50 50 L46 50 L50 10 L54 50Z" fill="#ef6f6c" stroke="#b03f45" stroke-width="1.5"/><circle cx="50" cy="50" r="7" fill="#22314d"/></g>
  </svg>`;
  const die = (n) => `<svg viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="18" fill="#fff" stroke="#22314d" stroke-width="4"/>${pips(n, 6, 6, 88)}</svg>`;

  // The track: a start square, then 1 … target. Up to 20 it wraps like one long line; 50 and
  // 100 are rows of ten, like a hundred square (start sits on its own above them).
  function buildTrack() {
    const track = $('track');
    const board = track.parentElement.getBoundingClientRect();
    const portrait = window.innerWidth / window.innerHeight < 1.25;
    const dense = state.target > 20;
    const room = { w: portrait ? board.width : board.width * 0.72, h: portrait ? board.height * (dense ? 0.78 : 0.7) : board.height };
    const squares = state.target + 1;
    let cols;
    if (state.target > 20) cols = 10;
    else {
      // the fewest rows that keep squares a good size
      cols = squares;
      while (cols > 5 && room.w / cols < 52) cols = Math.ceil(squares / (Math.ceil(squares / cols) + 1));
    }
    const rows = Math.ceil((state.target > 20 ? state.target : squares) / cols) + (state.target > 20 ? 1 : 0);
    // rows on the line boards have room above for the pieces; the dense boards don't need it
    const cell = Math.floor(Math.min(room.w / cols / 1.08, dense ? room.h / (rows * 1.1) : room.h / (rows * 1.75 + 0.7), 92));
    track.classList.toggle('dense', dense);
    track.style.setProperty('--cols', cols);
    track.style.setProperty('--cell', `${cell}px`);

    const cells = [];
    for (let n = 0; n <= state.target; n++) {
      // each ten gets its own colour (the start square is grey, from CSS)
      const [color, shade] = PALETTE[Math.floor(Math.max(n - 1, 0) / 10) % PALETTE.length];
      const startRow = state.target > 20 && n === 0 ? `grid-column: 1 / span 2; width: auto;` : '';
      cells.push(`<div class="cell ${n === 0 ? 'start' : ''} ${n === state.target ? 'finish' : ''}" data-n="${n}" style="--color:${color};--shade:${shade};${startRow}">
        <span class="label">${n === 0 ? 'Start' : n}</span><div class="pieces"></div></div>`);
    }
    // on the big boards the start square gets a row to itself
    if (state.target > 20) cells.splice(1, 0, `<div style="grid-column: 3 / -1"></div>`);
    track.innerHTML = cells.join('');
    track.querySelectorAll('.cell').forEach((c) => c.addEventListener('pointerdown', onTapCell));
    placePieces();
  }

  const cellOf = (n) => document.querySelector(`#track .cell[data-n="${n}"]`);
  const pieceOf = (who) => document.querySelector(`#track .piece[data-who="${who}"]`);

  function placePieces() {
    ['tortoise', 'rabbit'].forEach((who) => {
      const piece = document.createElement('div');
      piece.className = 'piece';
      piece.dataset.who = who;
      piece.innerHTML = face(who);
      piece.addEventListener('pointerdown', onTapPiece);
      cellOf(state.pos[who]).querySelector('.pieces').append(piece);
    });
  }

  // Move a piece to a new square with a little hop (FLIP: measure, move, animate the difference).
  function hopTo(who, n, onDone) {
    const piece = pieceOf(who);
    const from = piece.getBoundingClientRect();
    cellOf(n).querySelector('.pieces').append(piece);
    const to = piece.getBoundingClientRect();
    track(gsap.timeline({ onComplete: onDone }))
      .fromTo(piece, { x: from.left - to.left, y: from.top - to.top }, { x: 0, duration: 0.35, ease: 'power1.inOut' })
      .fromTo(piece, { y: from.top - to.top }, { y: -to.height * 0.5, duration: 0.17, ease: 'power2.out' }, 0)
      .to(piece, { y: 0, duration: 0.18, ease: 'power2.in' }, 0.17);
  }

  // ---------- turns ----------

  const human = (who) => state.players === 2 || who === 'rabbit';

  function showTurn() {
    const count = state.leader ? 'Last turn!' : `Turn ${state.round}`;
    $('turn').innerHTML = `<span class="face">${face(state.turn)}</span><span class="who"><span class="name"></span><small>${count}</small></span>`;
    $('turn').querySelector('.name').textContent = nameOf(state.turn);
    document.querySelectorAll('#track .piece').forEach((p) => p.classList.toggle('active', p.dataset.who === state.turn));
  }

  function say(...ids) {
    state.prompt = ids;
    Voice.say(...ids);
  }

  function startTurn() {
    if (state.turn === state.starter) state.round++;
    showTurn();
    state.phase = 'spin';
    const roll = state.dice ? 'race-roll' : 'race-spin';
    const spinner = $('spinner');
    spinner.innerHTML = state.dice ? die(1) : SPINNER;
    if (human(state.turn)) {
      spinner.disabled = false;
      spinner.classList.add('ready');
      const whose = state.players === 2 ? [`race-${state.turn}-turn`, 300] : [];
      say(...(state.leader ? ['race-last-turn', 300] : whose), roll);
    } else {
      spinner.disabled = true;
      say(state.leader ? 'race-last-turn' : 'race-tortoise-turn');
      later(state.leader ? 2.4 : 1.8, spin);
    }
  }

  // A fair spin or roll for both. In the one-player game Rabbit (the child) always goes first,
  // which is a small head start: Rabbit wins about 6 races in 10 on the short tracks, fewer on
  // the long ones, so winning is likely but never certain.
  const result = () => Math.floor(random(1, state.dice ? 7 : 3));

  function spin() {
    if (state.phase !== 'spin') return;
    state.phase = 'wait';
    const spinner = $('spinner');
    spinner.disabled = true;
    spinner.classList.remove('ready');
    const n = result();
    Sfx.swish();
    const done = () => {
      Sfx.chime();
      gsap.fromTo(spinner, { scale: 1.15 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
      state.hopsLeft = n;
      state.phase = 'hop';
      say(`race-hop-${n}`);
      if (human(state.turn)) markNext();
      else later(1.4, autoHop);
    };
    if (state.dice) {
      // tumble through faces, then land
      const tumble = track(gsap.timeline({ onComplete: () => { spinner.innerHTML = die(n); done(); } }));
      for (let i = 0; i < 8; i++) tumble.call(() => { spinner.innerHTML = die(Math.floor(random(1, 7))); Sfx.tick(); }, null, i * 0.09);
      tumble.to(spinner, { rotation: '+=360', duration: 0.8, ease: 'power2.out' }, 0);
    } else {
      // the arrow points into the "1" half (left) or the "2" half (right)
      const arrow = spinner.querySelector('.arrow');
      const current = gsap.getProperty(arrow, 'rotation') % 360;
      const land = n === 1 ? random(200, 340) : random(20, 160);
      track(gsap.to(arrow, { rotation: `+=${720 + ((land - current + 360) % 360)}`, svgOrigin: '50 50', duration: 1.4, ease: 'power3.out', onComplete: done }));
    }
  }

  // The next square glows; tapping it (or your own piece) hops one square.
  function markNext() {
    document.querySelectorAll('#track .cell.next').forEach((c) => c.classList.remove('next'));
    const hopping = state.phase === 'hop' && human(state.turn);
    if (hopping) cellOf(Math.min(state.pos[state.turn] + 1, state.target))?.classList.add('next');
    $('spinner').disabled = !hopping;
    $('spinner').classList.toggle('ready', hopping);
  }

  function onTapCell(e) {
    if (e.currentTarget.classList.contains('next')) hop();
  }
  function onTapPiece(e) {
    if (e.currentTarget.dataset.who === state.turn) hop();
  }

  function hop() {
    if (state.phase !== 'hop' || !human(state.turn) || state.hopping) return;
    stepForward();
  }

  function autoHop() {
    if (state.phase === 'hop') stepForward(() => later(0.45, autoHop));
  }

  // One square forward, saying its number. When the hops run out (or the finish is reached),
  // the turn ends.
  function stepForward(then) {
    const who = state.turn;
    const n = state.pos[who] + 1;
    state.hopping = true;
    state.pos[who] = n;
    state.hopsLeft--;
    document.querySelectorAll('#track .cell.next').forEach((c) => c.classList.remove('next'));
    Voice.say(`num-${n}`);
    Sfx.pop();
    hopTo(who, n, () => {
      state.hopping = false;
      const cell = cellOf(n);
      cell.classList.add('said');
      later(0.6, () => cell.classList.remove('said'));
      if (n >= state.target) {
        // hops left over at the finish are dropped, so extra taps can't hop off the end
        state.phase = 'wait';
        markNext();
        return later(0.8, () => reachedEnd(who));
      }
      if (state.hopsLeft > 0) {
        if (human(who)) markNext();
        then?.();
        return;
      }
      state.phase = 'wait';
      markNext();
      later(1, () => {
        // a last turn that falls short: the leader wins
        if (state.leader) return finish(state.leader);
        state.turn = who === 'rabbit' ? 'tortoise' : 'rabbit';
        startTurn();
      });
    });
  }

  // Whoever went first gets there: the other has had one turn fewer, so they get a last one.
  // The second player getting there means the first already had the same turns and fell short.
  function reachedEnd(who) {
    if (state.leader) return finish(null);
    if (who !== state.starter) return finish(who);
    state.leader = who;
    Sfx.chime();
    Fx.burst(Fx.centerOf(cellOf(state.target)), '#f2b134', 90);
    state.turn = who === 'rabbit' ? 'tortoise' : 'rabbit';
    later(0.6, startTurn);
  }

  // A winner, or null for a draw.
  function finish(who) {
    state.phase = 'wait';
    $('spinner').disabled = true;
    Fx.burst(Fx.centerOf(cellOf(state.target)), '#f2b134', 160);
    score()[who || 'draws']++;
    keep();
    showScore(who || 'draws');
    // the score ticks up first, then the cheer. In the one-player game a star is for Rabbit
    // (the child) winning or drawing; Tortoise winning just means "let's race again".
    later(1.2, () => {
      if (!who) Fx.earnStar("It's a draw!", 'race-draw', newRace);
      else if (human(who) || state.players === 2) Fx.earnStar(`${nameOf(who)} won the race!`, `race-${who}-wins`, newRace);
      else {
        Sfx.fanfare();
        Voice.say('race-tortoise-wins', 400, 'race-again');
        later(4.5, newRace);
      }
    });
  }

  // ---------- the scoreboard ----------

  function showScore(bump) {
    const s = score();
    const board = $('score');
    board.querySelector('[data-who="rabbit"] .face').innerHTML = face('rabbit');
    board.querySelector('[data-who="tortoise"] .face').innerHTML = face('tortoise');
    ['rabbit', 'tortoise'].forEach((who) => {
      board.querySelector(`[data-who="${who}"] .name`).textContent = nameOf(who);
      board.querySelector(`[data-who="${who}"] .points`).textContent = s[who];
    });
    board.querySelector('.draws b').textContent = s.draws;
    board.querySelector('.draws small').textContent = s.draws === 1 ? 'draw' : 'draws';
    board.hidden = false;
    if (bump) {
      const el = board.querySelector(bump === 'draws' ? '.draws b' : `[data-who="${bump}"] .points`);
      gsap.fromTo(el, { scale: 2.2, color: '#f2b134' }, { scale: 1, color: '', duration: 0.9, ease: 'elastic.out(1, 0.45)' });
      Sfx.pop();
    }
  }

  // ---------- end of the game: who won, then a new game or keep playing ----------

  const TROPHY = `<svg viewBox="0 0 100 100">
    <path d="M30 22H17a13 13 0 0 0 15 17M70 22h13a13 13 0 0 1-15 17" fill="none" stroke="#e0a22a" stroke-width="6" stroke-linecap="round"/>
    <path d="M28 12h44v24a22 22 0 0 1-44 0Z" fill="#f2b134"/>
    <path d="M38 18v16" stroke="#fff" stroke-opacity="0.55" stroke-width="5" stroke-linecap="round"/>
    <rect x="45" y="56" width="10" height="16" fill="#d9952a"/>
    <rect x="30" y="72" width="40" height="12" rx="4" fill="#c4842a"/>
  </svg>`;

  function endGame() {
    const cheer = document.querySelector('.cheer');
    if (cheer && !cheer.classList.contains('hidden')) return; // a race has just ended
    timers.forEach((t) => t.pause()); // the race underneath waits
    Voice.stop();
    const s = score();
    const winner = s.rabbit === s.tortoise ? null : s.rabbit > s.tortoise ? 'rabbit' : 'tortoise';
    const played = s.rabbit + s.tortoise + s.draws > 0;
    const card = $('match');
    const title = !played ? 'No races yet!' : winner ? `${nameOf(winner)} wins the game!` : "It's a tie!";
    const draws = s.draws ? `, and ${s.draws} ${s.draws === 1 ? 'draw' : 'draws'}` : '';
    card.querySelector('h2').textContent = title;
    card.querySelector('.final').textContent = played
      ? `${nameOf('rabbit')} ${s.rabbit}, ${nameOf('tortoise')} ${s.tortoise}${draws}`
      : 'Race at least once, then come back to see who wins.';
    card.querySelector('.podium').innerHTML = ['rabbit', 'trophy', 'tortoise'].map((who) => (who === 'trophy'
      ? `<span class="trophy">${TROPHY}</span>`
      : `<span class="face ${played && winner && winner !== who ? 'runner-up' : ''}">${face(who)}</span>`)).join('');
    $('new-game').hidden = !played;
    card.classList.remove('hidden');
    gsap.fromTo(card, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.from(card.querySelector('.card'), { y: 40, scale: 0.94, duration: 0.6, ease: 'back.out(1.6)' });
    gsap.from(card.querySelectorAll('.podium > *'), { y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(2)', delay: 0.15 });
    if (!played) return;
    gsap.fromTo(card.querySelector('.trophy'), { rotation: -12 }, { rotation: 12, duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut', delay: 0.6, onComplete: () => gsap.to(card.querySelector('.trophy'), { rotation: 0, duration: 0.3 }) });
    Sfx.fanfare();
    gsap.delayedCall(0.4, () => Fx.burst(Fx.centerOf(card.querySelector('.trophy')), '#f2b134', 200));
    Voice.say(winner ? `race-match-${winner}` : 'race-match-tie');
  }

  function closeEndGame(then) {
    Voice.stop();
    gsap.to('#match', { opacity: 0, duration: 0.25, onComplete: () => { $('match').classList.add('hidden'); then(); } });
  }

  $('end-game').addEventListener('click', endGame);
  $('keep-playing').addEventListener('click', () => closeEndGame(() => {
    timers.forEach((t) => t.resume());
    if (human(state.turn) && state.prompt) Voice.say(...state.prompt);
  }));
  // A new game: the score goes back to 0 and a fresh race starts, Rabbit first.
  $('new-game').addEventListener('click', () => closeEndGame(() => {
    timers.forEach((t) => t.kill());
    timers.clear();
    Object.assign(score(), { rabbit: 0, tortoise: 0, draws: 0 });
    keep();
    showScore();
    gsap.fromTo('#score .points, #score .draws b', { scale: 0.4 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
    Object.assign(state, { hopping: false, phase: 'wait', starter: 'tortoise' });
    markNext();
    newRace();
  }));

  function newRace() {
    state.pos = { rabbit: 0, tortoise: 0 };
    state.leader = null;
    state.round = 0;
    // two players take turns going first; against the Tortoise the child always starts
    state.turn = state.players === 2 && state.starter === 'rabbit' ? 'tortoise' : 'rabbit';
    state.starter = state.turn;
    buildTrack();
    gsap.from('#track .cell', { scale: 0.6, opacity: 0, duration: 0.3, stagger: 0.008 });
    later(0.6, startTurn);
  }

  // ---------- start screen ----------

  $('start-art').innerHTML = PICTURES.rabbit + SPINNER + TORTOISE;
  gsap.from('.start-art svg', { y: -30, opacity: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.12, delay: 0.2 });
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
  // The big spinner/dice button also hops after a spin: easier for small fingers than a square
  // on the hundred square.
  $('spinner').addEventListener('click', () => {
    if (!human(state.turn)) return;
    if (state.phase === 'hop') hop();
    else spin();
  });

  // Names: Rabbit's player, and Tortoise's in the two-player game (against the computer,
  // Tortoise plays itself). Remembered with the settings.
  const nameField = (who) => $(`name-${who}`);
  const players = () => Number(document.querySelector('[name="players"]:checked').value);
  function showNameFields() {
    const solo = players() === 1;
    nameField('tortoise').disabled = solo;
    nameField('tortoise').value = solo ? '' : saved.names.tortoise;
    nameField('tortoise').placeholder = solo ? 'Tortoise plays itself' : 'Tortoise';
  }
  document.querySelectorAll('.name-field .face').forEach((el) => { el.innerHTML = face(el.closest('.name-field').dataset.who); });
  nameField('rabbit').value = saved.names.rabbit;
  if (saved.players) document.querySelector(`[name="players"][value="${saved.players}"]`).checked = true;
  if (saved.target) document.querySelector(`[name="target"][value="${saved.target}"]`).checked = true;
  showNameFields();
  document.querySelectorAll('[name="players"]').forEach((r) => r.addEventListener('change', showNameFields));
  ['rabbit', 'tortoise'].forEach((who) => nameField(who).addEventListener('input', (e) => {
    saved.names[who] = e.target.value.trim();
    keep();
  }));
  // Enter in a name box starts the race, like tapping Play
  document.querySelectorAll('.name-field input').forEach((input) => input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('play').click();
  }));

  $('play').addEventListener('click', () => {
    Sfx.unlock();
    document.activeElement?.blur(); // put the phone keyboard away
    state.target = Number(document.querySelector('[name="target"]:checked').value);
    state.players = players();
    state.dice = state.target > 20;
    Object.assign(saved, { players: state.players, target: state.target });
    keep();
    showScore();
    Voice.say(`start-race-${state.target}`); // playing inside the tap unlocks audio on iPad/iPhone
    gsap.to('#start', {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        $('start').classList.add('hidden');
        state.pos = { rabbit: 0, tortoise: 0 };
        state.turn = state.starter = 'rabbit';
        state.leader = null;
        state.round = 0;
        buildTrack();
        later(1.6, startTurn);
      },
    });
  });

  // Rebuild the track if the screen turns (pieces stay on their squares).
  window.addEventListener('resize', () => {
    if ($('start').classList.contains('hidden') && !state.hopping) {
      buildTrack();
      showTurn();
      markNext();
    }
  });

  document.querySelector('.replay').addEventListener('click', () => {
    if (!state.prompt) return;
    gsap.fromTo('.replay', { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    Voice.say(...state.prompt);
  });
})();
