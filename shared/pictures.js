// Clue illustrations: flat, two-tone SVG on a 100 x 100 canvas, keyed by clue word (see words.js).
// PICTURE_KIT holds the drawing helpers shared with pictures-2.js.
const PICTURE_KIT = (() => {
  const INK = '#22314d';
  const dot = (x, y, r = 3.4) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/>`;
  const line = (d, width = 3, color = INK) =>
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const grad = (id, from, to, x2 = 0, y2 = 1) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient>`;
  const svg = (body) => `<svg viewBox="0 0 100 100" aria-hidden="true">${body}</svg>`;
  return { INK, dot, line, grad, svg };
})();

const PICTURES = (() => {
  const { INK, dot, line, grad, svg } = PICTURE_KIT;

  const sunRays = Array.from({ length: 12 }, (_, i) =>
    `<path d="M50 4 L54 18 L46 18Z" fill="#f6b042" transform="rotate(${i * 30} 50 50)"/>`).join('');

  return {
    sun: svg(`
      <defs><radialGradient id="p-sun" cx="40%" cy="38%" r="65%"><stop offset="0" stop-color="#ffe7a3"/><stop offset="1" stop-color="#f4a53a"/></radialGradient></defs>
      <circle cx="50" cy="50" r="34" fill="#f6b042" opacity="0.18"/>
      ${sunRays}
      <circle cx="50" cy="50" r="25" fill="url(#p-sun)"/>
    `),

    apple: svg(`
      <defs>${grad('p-apple', '#f0605d', '#b8323a', 1, 1)}</defs>
      <path d="M50 30 C40 22 16 24 16 51 C16 77 34 93 50 86 C66 93 84 77 84 51 C84 24 60 22 50 30Z" fill="url(#p-apple)"/>
      <path d="M70 32 C82 38 86 58 78 72 C74 80 66 86 60 87 C72 76 78 54 70 32Z" fill="#000" opacity="0.08"/>
      <ellipse cx="31" cy="46" rx="5" ry="10" fill="#fff" opacity="0.35" transform="rotate(12 31 46)"/>
      ${line('M50 31 Q49 19 55 10', 4.5, '#6b4a2e')}
      <path d="M54 20 Q66 6 80 12 Q68 28 54 20Z" fill="#5aa469"/>
      <path d="M54 20 Q67 14 80 12 Q68 28 54 20Z" fill="#3f8650"/>
    `),

    tiger: svg(`
      <path d="M16 30 L24 10 L40 22Z" fill="#e8873a"/><path d="M84 30 L76 10 L60 22Z" fill="#e8873a"/>
      <path d="M22 26 L26 15 L34 22Z" fill="#fbe3c8"/><path d="M78 26 L74 15 L66 22Z" fill="#fbe3c8"/>
      <path d="M50 16 C76 16 88 36 88 56 C88 78 70 92 50 92 C30 92 12 78 12 56 C12 36 24 16 50 16Z" fill="#f29a4a"/>
      <path d="M50 58 C62 58 74 66 74 76 C74 86 62 92 50 92 C38 92 26 86 26 76 C26 66 38 58 50 58Z" fill="#fbf3e8"/>
      <path d="M44 18 L50 34 L56 18Z M30 24 L38 36 L34 22Z M70 24 L62 36 L66 22Z" fill="${INK}"/>
      <path d="M12 52 L28 56 L13 60Z M14 66 L28 66 L16 72Z M88 52 L72 56 L87 60Z M86 66 L72 66 L84 72Z" fill="${INK}"/>
      ${dot(37, 50, 4)}${dot(63, 50, 4)}
      <path d="M44 66 L56 66 L50 73Z" fill="${INK}"/>
    `),

    pig: svg(`
      <defs>${grad('p-pig', '#f8c4cf', '#ec9aae')}</defs>
      <path d="M18 34 L24 10 L42 24Z" fill="#e88aa1"/><path d="M82 34 L76 10 L58 24Z" fill="#e88aa1"/>
      <circle cx="50" cy="55" r="35" fill="url(#p-pig)"/>
      <ellipse cx="50" cy="66" rx="16" ry="12" fill="#e88aa1"/>
      <ellipse cx="44.5" cy="66" rx="2.6" ry="4" fill="#b34d68"/>
      <ellipse cx="55.5" cy="66" rx="2.6" ry="4" fill="#b34d68"/>
      ${dot(37, 46)}${dot(63, 46)}
    `),

    insect: svg(`
      <defs>${grad('p-bug', '#e8524f', '#b02f35', 1, 1)}</defs>
      ${line('M24 52 L10 46 M22 66 L8 68 M28 80 L16 90 M76 52 L90 46 M78 66 L92 68 M72 80 L84 90', 3)}
      ${line('M44 18 Q38 6 30 8 M56 18 Q62 6 70 8', 2.5)}
      <circle cx="50" cy="28" r="14" fill="${INK}"/>
      <path d="M50 30 C70 30 82 46 82 62 C82 80 68 92 50 92 C32 92 18 80 18 62 C18 46 30 30 50 30Z" fill="url(#p-bug)"/>
      <path d="M50 30 L50 92" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="36" cy="52" r="6" fill="${INK}"/><circle cx="64" cy="52" r="6" fill="${INK}"/>
      <circle cx="32" cy="72" r="5" fill="${INK}"/><circle cx="68" cy="72" r="5" fill="${INK}"/>
      <circle cx="43" cy="85" r="3.5" fill="${INK}"/><circle cx="57" cy="85" r="3.5" fill="${INK}"/>
      <ellipse cx="34" cy="40" rx="6" ry="3" fill="#fff" opacity="0.35" transform="rotate(-30 34 40)"/>
    `),

    nest: svg(`
      <ellipse cx="36" cy="48" rx="10" ry="13" fill="#cfe8f3"/>
      <ellipse cx="64" cy="48" rx="10" ry="13" fill="#cfe8f3"/>
      <ellipse cx="50" cy="42" rx="10" ry="13" fill="#e3f2f8"/>
      <circle cx="47" cy="38" r="1.3" fill="#7fa7ba"/><circle cx="53" cy="44" r="1.1" fill="#7fa7ba"/>
      <circle cx="33" cy="46" r="1.2" fill="#7fa7ba"/><circle cx="66" cy="44" r="1.2" fill="#7fa7ba"/>
      <path d="M8 52 Q50 64 92 52 Q88 90 50 92 Q12 90 8 52Z" fill="#9a6a43"/>
      ${line('M14 62 Q50 72 86 62 M20 74 Q50 83 80 74 M28 56 L38 68 M50 60 L58 72 M68 56 L74 66', 2.5, '#73492b')}
    `),

    moon: svg(`
      <defs>
        <mask id="p-moon-cut"><rect width="100" height="100" fill="#fff"/><circle cx="64" cy="38" r="28" fill="#000"/></mask>
        ${grad('p-moon', '#fff1bf', '#f2c75c', 1, 1)}
      </defs>
      <circle cx="46" cy="54" r="36" fill="url(#p-moon)" mask="url(#p-moon-cut)"/>
      <circle cx="30" cy="60" r="4" fill="#e5b546" opacity="0.6"/>
      <circle cx="40" cy="76" r="3" fill="#e5b546" opacity="0.6"/>
      <path d="M80 62 L82.5 69 L90 70 L84 74.5 L86 82 L80 77.5 L74 82 L76 74.5 L70 70 L77.5 69Z" fill="#f2c75c"/>
      <circle cx="86" cy="16" r="2.5" fill="#f2c75c"/><circle cx="74" cy="90" r="2" fill="#f2c75c"/>
    `),

    dog: svg(`
      <path d="M26 24 C12 26 8 48 14 66 C24 64 30 50 30 36Z" fill="#7a4e2d"/>
      <path d="M74 24 C88 26 92 48 86 66 C76 64 70 50 70 36Z" fill="#7a4e2d"/>
      <path d="M50 20 C70 20 80 36 80 54 C80 76 66 90 50 90 C34 90 20 76 20 54 C20 36 30 20 50 20Z" fill="#c48a58"/>
      <path d="M50 54 C62 54 70 64 70 74 C70 84 60 90 50 90 C40 90 30 84 30 74 C30 64 38 54 50 54Z" fill="#efd7bb"/>
      <ellipse cx="50" cy="63" rx="7" ry="5" fill="${INK}"/>
      ${line('M50 68 L50 74 M43 77 Q50 81 57 77', 2.5)}
      ${dot(39, 46, 3.8)}${dot(61, 46, 3.8)}
    `),

    goat: svg(`
      <path d="M38 24 Q30 4 14 9 Q28 10 32 26Z" fill="#9aa3b2"/>
      <path d="M62 24 Q70 4 86 9 Q72 10 68 26Z" fill="#9aa3b2"/>
      <ellipse cx="20" cy="42" rx="15" ry="6" fill="#d4d8de" transform="rotate(-15 20 42)"/>
      <ellipse cx="80" cy="42" rx="15" ry="6" fill="#d4d8de" transform="rotate(15 80 42)"/>
      <path d="M43 74 L50 96 L57 74Z" fill="#c6cbd3"/>
      <ellipse cx="50" cy="50" rx="25" ry="31" fill="#f3f4f6"/>
      <path d="M50 19 C64 19 75 32 75 50 C75 66 66 78 54 81 C64 70 66 40 50 19Z" fill="#000" opacity="0.05"/>
      <ellipse cx="50" cy="70" rx="13" ry="9" fill="#e9cbd2"/>
      <ellipse cx="45.5" cy="69" rx="1.8" ry="2.8" fill="${INK}"/><ellipse cx="54.5" cy="69" rx="1.8" ry="2.8" fill="${INK}"/>
      ${dot(40, 44)}${dot(60, 44)}
    `),

    octopus: svg(`
      <defs>${grad('p-octo', '#9c7be0', '#6c4fc0')}</defs>
      ${line('M28 58 Q18 76 28 90 M39 62 Q34 80 40 93 M50 64 Q50 82 50 95 M61 62 Q66 80 60 93 M72 58 Q82 76 72 90', 9, '#7a5bcc')}
      <path d="M20 60 C20 16 80 16 80 60 C80 70 20 70 20 60Z" fill="url(#p-octo)"/>
      <circle cx="34" cy="32" r="3.5" fill="#fff" opacity="0.25"/><circle cx="64" cy="28" r="2.5" fill="#fff" opacity="0.25"/>
      ${dot(40, 48, 4)}${dot(60, 48, 4)}
    `),

    cat: svg(`
      <path d="M20 42 L26 8 L48 28Z" fill="#8e97a6"/><path d="M26 34 L28 18 L39 28Z" fill="#f1c6cf"/>
      <path d="M80 42 L74 8 L52 28Z" fill="#8e97a6"/><path d="M74 34 L72 18 L61 28Z" fill="#f1c6cf"/>
      <circle cx="50" cy="55" r="31" fill="#a3abb8"/>
      <path d="M50 24 C68 24 81 38 81 55 C81 72 68 86 50 86 C64 76 70 44 50 24Z" fill="#000" opacity="0.06"/>
      <ellipse cx="39" cy="51" rx="4" ry="5" fill="${INK}"/><ellipse cx="61" cy="51" rx="4" ry="5" fill="${INK}"/>
      <path d="M46 61 L54 61 L50 66Z" fill="#e48a9d"/>
      ${line('M32 62 L12 58 M32 67 L12 69 M68 62 L88 58 M68 67 L88 69', 1.6, '#4a5568')}
    `),

    kite: svg(`
      <path d="M50 6 L20 40 L50 40Z" fill="#ef6f6c"/>
      <path d="M50 6 L80 40 L50 40Z" fill="#f2b134"/>
      <path d="M20 40 L50 76 L50 40Z" fill="#3d8bd4"/>
      <path d="M80 40 L50 76 L50 40Z" fill="#2a9d8f"/>
      ${line('M50 6 L50 76 M20 40 L80 40', 1.5, 'rgba(255,255,255,0.6)')}
      ${line('M50 76 Q40 84 50 90 Q60 96 50 100', 2)}
      <path d="M42 81 L49 84 L42 88Z M58 89 L51 92 L58 95Z" fill="#ef6f6c"/>
    `),

    // ----- s -----
    sock: svg(`
      <path d="M36 10 H64 V54 C64 60 70 63 77 66 C90 71 90 92 72 92 H44 C32 92 28 82 33 72 L36 64Z" fill="#5f63d0"/>
      <rect x="36" y="10" width="28" height="12" rx="2" fill="#8f92e3"/>
      <rect x="36" y="32" width="28" height="6" fill="#8f92e3"/>
      <rect x="36" y="46" width="28" height="6" fill="#8f92e3"/>
      <path d="M66 66 C80 70 88 78 84 88 C80 92 74 92 72 92 C82 84 76 72 66 66Z" fill="#000" opacity="0.1"/>
    `),

    snail: svg(`
      <path d="M8 84 C8 74 16 70 26 72 L86 72 C93 72 93 86 84 86 H16 C10 86 8 86 8 84Z" fill="#a9cf94"/>
      <path d="M12 80 C8 62 16 50 26 54 L34 74Z" fill="#a9cf94"/>
      ${line('M20 54 L12 36 M26 54 L28 36', 2.5, '#7fa86c')}
      <circle cx="12" cy="36" r="3" fill="#7fa86c"/><circle cx="28" cy="36" r="3" fill="#7fa86c"/>
      ${dot(20, 64, 2.6)}
      <circle cx="58" cy="50" r="25" fill="#e8a15c"/>
      ${line('M58 50 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 1 1 8 8 a12 12 0 1 1 -12 -12 a17 17 0 1 1 17 17', 3, '#b86d2e')}
    `),

    // ----- a -----
    ant: svg(`
      ${line('M40 58 L28 78 M46 60 L46 82 M52 58 L64 78 M42 52 L28 40 M50 52 L62 40', 3)}
      ${line('M18 42 Q14 26 6 24 M22 42 Q26 26 32 20', 2.5)}
      <circle cx="22" cy="50" r="11" fill="#5a3e36"/>
      <ellipse cx="46" cy="56" rx="10" ry="8" fill="#6b4a40"/>
      <ellipse cx="74" cy="58" rx="18" ry="15" fill="#5a3e36"/>
      <ellipse cx="70" cy="52" rx="6" ry="3" fill="#fff" opacity="0.25" transform="rotate(-20 70 52)"/>
      <circle cx="18" cy="47" r="2.5" fill="#fff"/>
    `),

    arrow: svg(`
      ${line('M18 82 L78 22', 5, '#a0703f')}
      <path d="M90 10 L64 18 L82 36Z" fill="#5b6b85"/>
      <path d="M18 82 L8 76 L14 70 L26 74Z M18 82 L24 92 L30 86 L26 74Z" fill="#ef6f6c"/>
    `),

    axe: svg(`
      ${line('M30 92 L62 20', 8, '#a0703f')}
      <path d="M50 12 C70 4 92 18 88 44 L64 34 L56 22Z" fill="#9aa3b2"/>
      <path d="M88 44 C92 24 80 10 66 8 C80 14 86 28 82 42Z" fill="#d4d8de"/>
    `),

    // ----- t -----
    tent: svg(`
      <path d="M50 14 L92 84 H8Z" fill="#ef6f6c"/>
      <path d="M50 14 L92 84 H62Z" fill="#000" opacity="0.08"/>
      <path d="M50 42 L64 84 H36Z" fill="#7d2b33"/>
      ${line('M50 14 L50 4', 2.5)}
      <path d="M50 4 L62 7 L50 10Z" fill="#f2b134"/>
      ${line('M4 86 H96', 3, '#9cc8ac')}
    `),

    tomato: svg(`
      <defs>${grad('p-tomato', '#f0605d', '#b8323a', 1, 1)}</defs>
      <ellipse cx="50" cy="58" rx="36" ry="32" fill="url(#p-tomato)"/>
      <ellipse cx="32" cy="48" rx="6" ry="10" fill="#fff" opacity="0.3" transform="rotate(30 32 48)"/>
      <path d="M50 30 L40 22 L46 32 L32 32 L46 36 L42 44 L50 38 L58 44 L54 36 L68 32 L54 32 L60 22Z" fill="#3f8650"/>
      ${line('M50 30 L52 18', 4, '#3f8650')}
    `),

    tree: svg(`
      <rect x="44" y="58" width="12" height="34" rx="3" fill="#8a5a3b"/>
      <circle cx="32" cy="52" r="18" fill="#3f8650"/>
      <circle cx="68" cy="52" r="18" fill="#3f8650"/>
      <circle cx="50" cy="36" r="24" fill="#5aa469"/>
      <circle cx="42" cy="28" r="6" fill="#fff" opacity="0.15"/>
      ${line('M12 92 H88', 3, '#9cc8ac')}
    `),

    // ----- p -----
    pear: svg(`
      <defs>${grad('p-pear', '#d4e07a', '#9bb33f', 1, 1)}</defs>
      <path d="M50 20 C61 20 62 36 66 46 C82 58 82 92 50 92 C18 92 18 58 34 46 C38 36 39 20 50 20Z" fill="url(#p-pear)"/>
      <ellipse cx="36" cy="66" rx="5" ry="10" fill="#fff" opacity="0.3" transform="rotate(15 36 66)"/>
      ${line('M50 22 Q50 12 55 6', 4, '#6b4a2e')}
      <path d="M53 14 Q66 4 76 10 Q66 22 53 14Z" fill="#5aa469"/>
    `),

    pencil: svg(`
      <path d="M22 78 L70 30 L82 42 L34 90Z" fill="#f2b134"/>
      <path d="M28 84 L76 36 L82 42 L34 90Z" fill="#c07a14"/>
      <path d="M70 30 L78 22 L90 34 L82 42Z" fill="#ef8fa0"/>
      <path d="M70 30 L74 26 L86 38 L82 42Z" fill="#9aa3b2"/>
      <path d="M22 78 L34 90 L10 96Z" fill="#f1d3b3"/>
      <path d="M10 96 L14 86 L20 92Z" fill="${INK}"/>
    `),

    penguin: svg(`
      <path d="M26 56 L12 72 L28 66Z M74 56 L88 72 L72 66Z" fill="${INK}"/>
      <ellipse cx="50" cy="54" rx="26" ry="38" fill="${INK}"/>
      <ellipse cx="50" cy="62" rx="18" ry="28" fill="#f8f9fa"/>
      <circle cx="42" cy="32" r="4" fill="#fff"/><circle cx="58" cy="32" r="4" fill="#fff"/>
      ${dot(42.5, 32.5, 2)}${dot(57.5, 32.5, 2)}
      <path d="M44 40 L56 40 L50 48Z" fill="#f2a93b"/>
      <ellipse cx="40" cy="92" rx="8" ry="4" fill="#f2a93b"/><ellipse cx="60" cy="92" rx="8" ry="4" fill="#f2a93b"/>
    `),

    // ----- i -----
    igloo: svg(`
      <path d="M8 82 C8 36 92 36 92 82Z" fill="#eaf5fa"/>
      <path d="M50 40 C76 40 92 58 92 82 H74 C74 60 66 46 50 40Z" fill="#000" opacity="0.05"/>
      ${line('M12 66 H88 M18 52 H82 M30 44 L32 52 M50 40 L50 52 M70 44 L68 52 M24 52 L26 66 M44 52 L42 66 M62 52 L64 66 M80 52 L78 66', 1.6, '#a8c8d8')}
      <path d="M36 82 C36 62 64 62 64 82Z" fill="#3a4a66"/>
      ${line('M4 84 H96', 3, '#cfe3f2')}
    `),

    ink: svg(`
      <rect x="38" y="16" width="24" height="12" rx="3" fill="${INK}"/>
      <rect x="42" y="28" width="16" height="10" fill="#cfe3f2"/>
      <path d="M28 46 C28 40 32 38 38 38 H62 C68 38 72 40 72 46 V84 C72 89 68 92 63 92 H37 C32 92 28 89 28 84Z" fill="#3d6fb5"/>
      <path d="M28 60 H72 V84 C72 89 68 92 63 92 H37 C32 92 28 89 28 84Z" fill="#244a85"/>
      <rect x="36" y="50" width="28" height="14" rx="2" fill="#f8f9fa"/>
      <path d="M84 56 C84 56 92 68 92 74 A8 8 0 0 1 76 74 C76 68 84 56 84 56Z" fill="#244a85"/>
    `),

    // ----- n -----
    nut: svg(`
      <path d="M28 46 H72 C72 70 62 88 50 92 C38 88 28 70 28 46Z" fill="#d39a5b"/>
      <path d="M58 48 H72 C72 70 62 88 50 92 C60 80 62 64 58 48Z" fill="#000" opacity="0.08"/>
      <path d="M22 48 C22 26 78 26 78 48Z" fill="#8a5a3b"/>
      ${line('M30 40 L40 30 M42 44 L56 30 M56 44 L68 32 M28 32 L36 44 M44 30 L56 44 M60 30 L72 42', 1.6, '#6b4428')}
      ${line('M50 28 Q50 18 56 14', 4, '#6b4428')}
    `),

    net: svg(`
      ${line('M60 46 L92 92', 6, '#a0703f')}
      <path d="M14 30 C14 66 34 88 50 86 C64 84 66 60 66 30Z" fill="#e3f2f8" opacity="0.9"/>
      ${line('M22 32 L52 84 M34 32 L60 76 M48 32 L64 58 M60 32 L36 82 M46 32 L24 68 M30 32 L16 46', 1.4, '#7fa7ba')}
      <ellipse cx="40" cy="30" rx="27" ry="10" fill="none" stroke="#5b6b85" stroke-width="4"/>
    `),

    // ----- m -----
    mouse: svg(`
      ${line('M88 72 Q100 88 80 94', 2.5, '#8e97a6')}
      <path d="M12 68 C18 48 40 42 60 44 C80 46 90 58 88 72 C86 82 70 86 50 86 C30 86 16 80 12 68Z" fill="#a3abb8"/>
      <circle cx="42" cy="40" r="13" fill="#a3abb8"/><circle cx="42" cy="40" r="7" fill="#f1c6cf"/>
      ${dot(30, 60, 3)}
      <circle cx="12" cy="68" r="3.5" fill="#e48a9d"/>
      ${line('M16 70 L4 74 M16 66 L4 62', 1.4, '#4a5568')}
    `),

    mug: svg(`
      <path d="M70 42 C88 42 88 72 70 72" fill="none" stroke="#c94f4f" stroke-width="7"/>
      <rect x="22" y="30" width="50" height="58" rx="8" fill="#ef6f6c"/>
      <rect x="22" y="30" width="50" height="10" rx="4" fill="#c94f4f"/>
      <rect x="30" y="48" width="8" height="30" rx="4" fill="#fff" opacity="0.25"/>
      ${line('M38 22 Q34 16 38 10 M52 22 Q48 16 52 10', 2.5, '#b9c3d3')}
    `),

    mitten: svg(`
      <path d="M34 66 C26 60 20 50 26 42 C30 36 36 40 38 46 L38 24 C38 12 70 12 70 26 V66Z" fill="#2a9d8f"/>
      <path d="M58 14 C66 16 70 20 70 26 V66 H60 C64 50 64 26 58 14Z" fill="#000" opacity="0.1"/>
      <rect x="32" y="64" width="42" height="22" rx="6" fill="#f3f4f6"/>
      ${line('M40 70 V80 M48 70 V80 M56 70 V80 M64 70 V80', 2, '#d4d8de')}
    `),

    // ----- d -----
    duck: svg(`
      <path d="M14 62 C14 48 30 46 44 50 L72 50 C86 50 92 60 88 72 C84 84 70 88 50 88 C28 88 14 78 14 62Z" fill="#f6c945"/>
      <circle cx="68" cy="36" r="17" fill="#f6c945"/>
      <path d="M82 36 L96 40 L82 45Z" fill="#f2893b"/>
      ${dot(71, 32, 3)}
      <path d="M30 60 C40 54 56 58 60 66 C50 74 36 72 30 60Z" fill="#e0ad2c"/>
      ${line('M6 92 H94', 3, '#7fbde0')}
    `),

    drum: svg(`
      ${line('M20 12 L50 40 M80 12 L52 40', 4, '#a0703f')}
      <circle cx="20" cy="12" r="5" fill="#f1d3b3"/><circle cx="80" cy="12" r="5" fill="#f1d3b3"/>
      <path d="M16 44 V78 C16 86 84 86 84 78 V44Z" fill="#ef6f6c"/>
      ${line('M16 52 L30 76 L44 52 L58 76 L72 52 L84 72', 2.5, '#f8e3c3')}
      <ellipse cx="50" cy="44" rx="34" ry="9" fill="#f3f4f6" stroke="#c94f4f" stroke-width="3"/>
    `),

    door: svg(`
      <rect x="26" y="8" width="48" height="86" rx="4" fill="#9a6a43"/>
      <rect x="22" y="6" width="56" height="4" rx="2" fill="#73492b"/>
      <rect x="33" y="16" width="34" height="28" rx="3" fill="#b5835a"/>
      <rect x="33" y="52" width="34" height="34" rx="3" fill="#b5835a"/>
      <circle cx="64" cy="52" r="4" fill="#f2c75c"/>
    `),

    // ----- g -----
    gift: svg(`
      <rect x="16" y="42" width="68" height="48" rx="4" fill="#5f63d0"/>
      <rect x="12" y="32" width="76" height="14" rx="3" fill="#7b7fe0"/>
      <rect x="44" y="32" width="12" height="58" fill="#f2b134"/>
      <path d="M50 32 C38 14 22 20 30 30 C34 34 44 32 50 32Z M50 32 C62 14 78 20 70 30 C66 34 56 32 50 32Z" fill="#f2b134"/>
      <path d="M50 32 C38 14 22 20 30 30" fill="none" stroke="#c07a14" stroke-width="2"/>
    `),

    grapes: svg(`
      ${line('M50 22 Q52 12 60 8', 4, '#6b4a2e')}
      <path d="M52 18 Q66 8 78 16 Q66 28 52 18Z" fill="#5aa469"/>
      ${[[38, 30], [52, 28], [66, 32], [32, 44], [46, 44], [60, 44], [72, 46], [40, 58], [54, 58], [66, 60], [46, 72], [60, 72], [52, 84]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#8a5cc4"/><circle cx="${x - 2.5}" cy="${y - 2.5}" r="2.2" fill="#fff" opacity="0.35"/>`).join('')}
    `),

    guitar: svg(`
      <rect x="47" y="6" width="8" height="46" rx="2" fill="#73492b"/>
      <rect x="44" y="4" width="14" height="10" rx="3" fill="#5a3a22"/>
      <path d="M51 44 C66 44 70 52 66 60 C78 64 80 92 51 92 C22 92 24 64 36 60 C32 52 36 44 51 44Z" fill="#e8873a"/>
      <circle cx="51" cy="66" r="7" fill="#5a3a22"/>
      <rect x="42" y="80" width="18" height="4" rx="2" fill="#5a3a22"/>
      ${line('M49 14 V82 M53 14 V82', 0.8, '#f3f4f6')}
    `),

    // ----- o -----
    olive: svg(`
      ${line('M20 20 Q50 24 80 14', 3, '#6b4a2e')}
      <path d="M40 22 Q34 10 22 10 Q30 22 40 22Z M62 18 Q68 6 80 6 Q72 18 62 18Z" fill="#5aa469"/>
      <ellipse cx="36" cy="58" rx="17" ry="24" fill="#7a9a3a" transform="rotate(-12 36 58)"/>
      <ellipse cx="66" cy="62" rx="17" ry="24" fill="#8fae45" transform="rotate(12 66 62)"/>
      <ellipse cx="30" cy="48" rx="4" ry="8" fill="#fff" opacity="0.3" transform="rotate(-12 30 48)"/>
      <ellipse cx="60" cy="52" rx="4" ry="8" fill="#fff" opacity="0.3" transform="rotate(12 60 52)"/>
      ${line('M36 34 L38 24 M66 38 L62 20', 2, '#6b4a2e')}
    `),

    ox: svg(`
      <path d="M30 30 C14 30 6 20 8 10 C14 18 22 20 32 22Z M70 30 C86 30 94 20 92 10 C86 18 78 20 68 22Z" fill="#e9dcc3"/>
      <ellipse cx="18" cy="40" rx="12" ry="6" fill="#7a4e2d" transform="rotate(-20 18 40)"/>
      <ellipse cx="82" cy="40" rx="12" ry="6" fill="#7a4e2d" transform="rotate(20 82 40)"/>
      <path d="M50 18 C70 18 76 34 74 54 C72 76 64 90 50 90 C36 90 28 76 26 54 C24 34 30 18 50 18Z" fill="#9a6a43"/>
      <ellipse cx="50" cy="74" rx="18" ry="14" fill="#d9b48f"/>
      <ellipse cx="44" cy="74" rx="2.6" ry="4" fill="${INK}"/><ellipse cx="56" cy="74" rx="2.6" ry="4" fill="${INK}"/>
      ${dot(39, 46)}${dot(61, 46)}
    `),

    // ----- c -----
    cup: svg(`
      <ellipse cx="48" cy="84" rx="40" ry="8" fill="#d4d8de"/>
      <path d="M72 44 C90 44 90 66 70 68" fill="none" stroke="#3d8bd4" stroke-width="6"/>
      <path d="M18 38 H78 C78 64 66 82 48 82 C30 82 18 64 18 38Z" fill="#3d8bd4"/>
      <ellipse cx="48" cy="38" rx="30" ry="6" fill="#8a5a3b"/>
      <path d="M26 50 C28 62 34 72 42 76" fill="none" stroke="#fff" stroke-width="3" opacity="0.3" stroke-linecap="round"/>
      ${line('M40 28 Q36 20 40 12 M54 28 Q50 20 54 12', 2.5, '#b9c3d3')}
    `),

    car: svg(`
      <path d="M8 66 C8 56 14 52 24 50 L32 34 C34 30 38 28 42 28 H62 C68 28 72 30 76 36 L84 50 C92 52 94 58 94 66 V72 H8Z" fill="#ef6f6c"/>
      <path d="M36 36 H48 V50 H30Z M54 36 H64 C67 36 69 38 71 40 L76 50 H54Z" fill="#cfe8f3"/>
      <rect x="84" y="58" width="8" height="5" rx="2" fill="#f6c945"/>
      <circle cx="28" cy="74" r="10" fill="${INK}"/><circle cx="28" cy="74" r="4" fill="#d4d8de"/>
      <circle cx="74" cy="74" r="10" fill="${INK}"/><circle cx="74" cy="74" r="4" fill="#d4d8de"/>
    `),

    cake: svg(`
      <rect x="47" y="12" width="6" height="16" rx="2" fill="#7b7fe0"/>
      <path d="M50 2 C54 6 54 10 50 12 C46 10 46 6 50 2Z" fill="#f2a93b"/>
      <rect x="18" y="28" width="64" height="26" rx="6" fill="#f7d9e0"/>
      <rect x="14" y="54" width="72" height="32" rx="6" fill="#c2569a"/>
      <path d="M18 34 C18 28 82 28 82 34 V40 C78 46 74 40 70 44 C66 48 62 40 58 44 C54 48 50 40 46 44 C42 48 38 40 34 44 C30 48 26 40 22 44 C20 46 18 42 18 40Z" fill="#fff"/>
      ${line('M14 70 H86', 4, '#f7d9e0')}
      <rect x="8" y="86" width="84" height="6" rx="3" fill="#d4d8de"/>
    `),

    // ----- k -----
    key: svg(`
      <circle cx="30" cy="40" r="20" fill="none" stroke="#f2b134" stroke-width="9"/>
      ${line('M44 54 L84 88', 9, '#f2b134')}
      ${line('M68 74 L60 84 M78 82 L70 92', 7, '#f2b134')}
      <circle cx="24" cy="34" r="4" fill="#fff" opacity="0.4"/>
    `),

    king: svg(`
      <path d="M22 40 L24 12 L38 26 L50 8 L62 26 L76 12 L78 40Z" fill="#f2b134"/>
      <circle cx="50" cy="24" r="3.5" fill="#ef6f6c"/><circle cx="34" cy="32" r="3" fill="#3d8bd4"/><circle cx="66" cy="32" r="3" fill="#3d8bd4"/>
      <circle cx="50" cy="60" r="26" fill="#f1d3b3"/>
      <path d="M26 64 C28 90 72 90 74 64 C68 74 60 70 50 74 C40 70 32 74 26 64Z" fill="#a8742f"/>
      ${dot(41, 56)}${dot(59, 56)}
      <rect x="20" y="38" width="60" height="8" rx="3" fill="#c07a14"/>
    `),

    speaker: svg(`
      <path d="M14 38 H30 L50 22 V78 L30 62 H14Z" fill="currentColor" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>
      ${line('M63 37 Q72 50 63 63 M73 27 Q89 50 73 73', 6.5, 'currentColor')}
    `),

    star: svg(`
      <defs>${grad('p-star', '#ffe08a', '#f2a93b')}</defs>
      <path d="M50 6 L62 37 L95 38 L69 58 L78 91 L50 72 L22 91 L31 58 L5 38 L38 37Z"
        fill="url(#p-star)" stroke="#e39a2d" stroke-width="3" stroke-linejoin="round"/>
    `),
  };
})();
