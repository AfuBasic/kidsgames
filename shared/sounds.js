// Sound effects, generated with the Web Audio API so no files are needed.
const Sfx = (() => {
  let audioCtx = null;

  // Call inside a tap first: browsers only allow sound after the user has interacted.
  function unlock() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function tone(freq, start, duration, { type = 'sine', volume = 0.18, endFreq = freq } = {}) {
    const ac = unlock();
    const t = ac.currentTime + start;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  function pop() {
    const ac = unlock();
    const length = Math.floor(ac.sampleRate * 0.12);
    const buffer = ac.createBuffer(1, length, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    const src = ac.createBufferSource();
    const gain = ac.createGain();
    gain.gain.value = 0.55;
    src.buffer = buffer;
    src.connect(gain).connect(ac.destination);
    src.start();
  }

  const chime = () => [784, 1047, 1319].forEach((f, i) => tone(f, i * 0.07, 0.35, { volume: 0.12 }));
  const fanfare = () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.4, { type: 'triangle', volume: 0.14 }));
  const tick = () => tone(1400, 0, 0.06, { type: 'triangle', volume: 0.1, endFreq: 900 });
  // Two short low "eh-eh" pulses, like a quiz-show buzzer.
  const buzzer = () => [0, 0.17].forEach((start) => tone(140, start, 0.14, { type: 'sawtooth', volume: 0.12, endFreq: 120 }));

  // A soft rising "shhh", like curtains sweeping open (Quick Peek).
  function swish() {
    const ac = unlock();
    const length = Math.floor(ac.sampleRate * 0.35);
    const buffer = ac.createBuffer(1, length, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.sin((Math.PI * i) / length);
    const src = ac.createBufferSource();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2600, ac.currentTime + 0.35);
    gain.gain.value = 0.35;
    src.buffer = buffer;
    src.connect(filter).connect(gain).connect(ac.destination);
    src.start();
  }

  // "Toot-toot!": two blasts of a three-note whistle chord (Number Train).
  const toot = () => [0, 0.42].forEach((start) => [587, 740, 880].forEach((f) => tone(f, start, 0.32, { type: 'triangle', volume: 0.07, endFreq: f * 0.97 })));

  // A nasal "quack": a falling buzzy tone through a narrow filter (Five Little Ducks).
  function quack(start = 0) {
    const ac = unlock();
    const t = ac.currentTime + start;
    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(560, t);
    osc.frequency.exponentialRampToValueAtTime(330, t + 0.16);
    filter.type = 'bandpass';
    filter.frequency.value = 1300;
    filter.Q.value = 4;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc.connect(filter).connect(gain).connect(ac.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  return { unlock, pop, chime, fanfare, tick, buzzer, swish, toot, quack };
})();
