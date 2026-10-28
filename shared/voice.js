// Voice lines: pre-generated clips in audio/ (made by tools/make_voice.py), with the
// browser's own voice as a fallback for any line that has no clip. Needs phrases.js.
const Voice = (() => {
  const base = new URL('../audio/', document.currentScript.src);
  // clip id -> fingerprint of its wording; part of the address, so a changed clip is fetched fresh
  let clips = new Map();
  fetch(new URL('manifest.json', base), { cache: 'no-cache' })
    .then((r) => (r.ok ? r.json() : {}))
    .then((list) => { clips = new Map(Array.isArray(list) ? list.map((id) => [id, '']) : Object.entries(list)); })
    .catch(() => {});
  const clipUrl = (id) => new URL(`${id}.m4a${clips.get(id) ? `?v=${clips.get(id)}` : ''}`, base).href;

  // One reused element: iPad/iPhone only allow later playback once it has played inside a tap.
  const el = new Audio();
  let token = 0;
  let browserVoice = null;

  function pickVoice() {
    const voices = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('en'));
    browserVoice = voices.find((v) => /en-gb/i.test(v.lang)) || voices.find((v) => v.default) || voices[0] || null;
  }
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (browserVoice) utterance.voice = browserVoice;
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
  }

  function stop() {
    token++;
    el.pause();
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  // Say phrases (ids from phrases.js) in order; a number in the list is a pause in milliseconds.
  function say(...parts) {
    stop();
    const current = token;
    const text = (from) => parts.slice(from).filter((p) => typeof p === 'string').map((id) => PHRASES[id]).join(' ... ');
    if (!parts.every((p) => typeof p === 'number' || clips.has(p))) return speak(text(0));

    const playFrom = (i) => {
      if (current !== token || i >= parts.length) return;
      if (typeof parts[i] === 'number') {
        setTimeout(() => playFrom(i + 1), parts[i]);
        return;
      }
      el.onended = () => playFrom(i + 1);
      el.src = clipUrl(parts[i]);
      el.play().catch(() => speak(text(i)));
    };
    playFrom(0);
  }

  // Say phrases one after another with `gap` ms between, calling onEach(i) as phrase i starts,
  // so a game can light up each object as its number is said. onDone runs after the last one.
  function sequence(ids, { gap = 200, onEach, onDone } = {}) {
    stop();
    const current = token;
    const step = (i) => {
      if (current !== token) return;
      if (i >= ids.length) {
        onDone?.();
        return;
      }
      onEach?.(i);
      const next = () => setTimeout(() => step(i + 1), gap);
      const fallback = () => {
        if (!('speechSynthesis' in window)) return setTimeout(next, 500);
        const utterance = new SpeechSynthesisUtterance(PHRASES[ids[i]]);
        if (browserVoice) utterance.voice = browserVoice;
        utterance.rate = 0.85;
        utterance.onend = () => current === token && next();
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      };
      if (!clips.has(ids[i])) return fallback();
      el.onended = next;
      el.src = clipUrl(ids[i]);
      el.play().catch(fallback);
    };
    step(0);
  }

  // Pick a line that differs from the last one of the same kind.
  const lastLine = {};
  function line(kind, count) {
    let i;
    do i = Math.floor(Math.random() * count); while (count > 1 && i === lastLine[kind]);
    lastLine[kind] = i;
    return `${kind}-${i}`;
  }

  return {
    say,
    sequence,
    stop,
    line,
    correct: (...after) => say(line('correct', CORRECT_LINES.length), ...after),
    wrong: () => say(line('wrong', WRONG_LINES.length), 450, 'try-again'),
  };
})();
