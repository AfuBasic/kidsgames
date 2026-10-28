// Shared GSAP effects and the progress meter: five dots fill up, then a star is earned.
// Games include the progress markup (.progress with five .dot and a .star-number) in their HUD.
const Fx = (() => {
  const POPS_PER_STAR = 5;
  // [base, shade] colour pairs used for balloons, tiles and confetti
  const PALETTE = [
    ['#ef6f6c', '#b03f45'], ['#f2b134', '#c07a14'], ['#2a9d8f', '#1a6a60'],
    ['#5f63d0', '#383b92'], ['#c2569a', '#86336a'], ['#3d8bd4', '#235d96'],
  ];
  const random = gsap.utils.random;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  let points = 0;
  let stars = 0;

  function spawn(className, { x, y }, color) {
    const el = document.createElement('div');
    el.className = className;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    if (color) el.style.background = color;
    document.body.appendChild(el);
    return el;
  }

  const centerOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };

  // Gentle idle floating, used on balloons and tiles.
  function sway(el, amount = 1) {
    if (Scene.reduceMotion) return;
    gsap.fromTo(el, { rotation: random(-4, -1) * amount, y: 0 }, {
      rotation: random(1, 4) * amount,
      y: random(-14, -6) * amount,
      duration: random(2.2, 3.4),
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: random(0, 0.8),
    });
  }

  // A ring flash plus shards in `color` and multicoloured confetti.
  function burst(center, color, size) {
    const ring = spawn('ring', center);
    gsap.fromTo(ring, { scale: 0.4, opacity: 1 }, {
      scale: size / 20, opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: () => ring.remove(),
    });
    for (let i = 0; i < 22; i++) {
      const isShard = i < 9;
      const piece = spawn(isShard ? 'shard' : 'confetti', center, isShard ? color : pick(PALETTE)[0]);
      const angle = random(0, Math.PI * 2);
      const dist = size * random(0.45, isShard ? 0.9 : 1.3);
      gsap.timeline({ onComplete: () => piece.remove() })
        .to(piece, { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, rotation: random(-540, 540), duration: 0.55, ease: 'power3.out' })
        .to(piece, { y: `+=${random(80, 180)}`, opacity: 0, duration: 0.8, ease: 'power1.in' }, '-=0.15');
    }
  }

  // A spark flies from `from` to the next progress dot. Returns true when that completes a star.
  function addPoint(from) {
    points++;
    const dot = document.querySelectorAll('.progress .dot')[(points - 1) % POPS_PER_STAR];
    const to = centerOf(dot);
    const spark = spawn('spark', from);
    gsap.timeline({ onComplete: () => spark.remove() })
      .to(spark, { scale: 2.2, duration: 0.2, ease: 'power2.out' })
      .to(spark, { x: to.x - from.x, y: to.y - from.y, scale: 1, duration: 0.7, ease: 'power2.inOut' })
      .add(() => {
        dot.classList.add('filled');
        Sfx.chime();
        gsap.fromTo(dot, { scale: 1.8 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
      });
    return points % POPS_PER_STAR === 0;
  }

  // Full-screen star celebration. `phrase` is the voice line; `onDone` runs after it closes.
  function earnStar(message, phrase, onDone) {
    stars++;
    document.querySelectorAll('.star-number').forEach((el) => { el.textContent = stars; });

    let overlay = document.querySelector('.cheer');
    if (!overlay) {
      overlay = document.createElement('section');
      overlay.className = 'overlay cheer hidden';
      overlay.setAttribute('role', 'status');
      overlay.innerHTML = `<div class="cheer-star"><div class="rays"></div><div class="big-star">${PICTURES.star}</div></div><p></p>`;
      document.body.append(overlay);
    }
    overlay.querySelector('p').textContent = message;
    overlay.classList.remove('hidden');
    Sfx.fanfare();
    Voice.say(phrase);

    const rays = overlay.querySelector('.rays');
    gsap.timeline()
      .fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      .fromTo(overlay.querySelector('.big-star'), { scale: 0, rotation: -200 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'back.out(1.6)' }, 0.1)
      .fromTo(rays, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }, 0.2)
      .fromTo(overlay.querySelector('p'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, 0.5);
    gsap.to(rays, { rotation: '+=360', duration: 14, ease: 'none', repeat: -1 });
    gsap.fromTo('.star-icon', { scale: 1.8 }, { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.4)', delay: 0.3 });

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      timer.kill();
      overlay.removeEventListener('pointerdown', close);
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.35,
        onComplete: () => {
          overlay.classList.add('hidden');
          gsap.killTweensOf(rays);
          document.querySelectorAll('.progress .dot').forEach((d) => d.classList.remove('filled'));
          onDone();
        },
      });
    };
    const timer = gsap.delayedCall(3.4, close);
    overlay.addEventListener('pointerdown', close);
  }

  // Fill in the icons every game's HUD shares.
  document.querySelectorAll('.star-icon').forEach((el) => { el.innerHTML = PICTURES.star; });
  document.querySelectorAll('.replay').forEach((el) => { el.innerHTML = PICTURES.speaker; });

  return { PALETTE, random, pick, spawn, centerOf, sway, burst, addPoint, earnStar, get stars() { return stars; } };
})();
