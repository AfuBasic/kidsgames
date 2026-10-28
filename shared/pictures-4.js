// Pictures for the word families (4-letter -ock, -ing, -ail… and extra 3-letter words).
// Same style and canvas as pictures.js.
Object.assign(PICTURES, (() => {
  const { INK, dot, line, grad, svg } = PICTURE_KIT;
  const shine = (x, y, rx, ry, rot = 0) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="0.3" transform="rotate(${rot} ${x} ${y})"/>`;
  const SKIN = '#f1d3b3';
  const water = (y) => line(`M4 ${y} Q14 ${y - 6} 24 ${y} T44 ${y} T64 ${y} T84 ${y} T100 ${y}`, 3, '#7fbde0');
  const face = (cx, cy, r, color = '#f6d743') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}"/>`;

  return {
    // ----- extra 3-letter words -----
    run: svg(`
      ${line('M6 40 H22 M2 52 H18 M8 64 H22', 3, '#b9c3d3')}
      <circle cx="58" cy="18" r="11" fill="${SKIN}"/>
      <path d="M48 14 C48 4 68 4 68 14 C62 10 54 10 48 14Z" fill="#8a5a3b"/>
      ${line('M56 30 L48 56', 12, '#3d8bd4')}
      ${line('M54 36 L70 46 L80 38 M54 36 L38 44 L30 36', 6, '#3d8bd4')}
      ${line('M48 56 L64 70 L60 90 M48 56 L36 74 L22 72', 7, '#2c3a55')}
      <ellipse cx="62" cy="92" rx="8" ry="4" fill="#ef6f6c"/><ellipse cx="20" cy="72" rx="4" ry="7" fill="#ef6f6c"/>
    `),

    sip: svg(`
      ${line('M58 34 L66 6 L80 6', 4, '#ef6f6c')}
      <path d="M28 30 H72 L66 90 H34Z" fill="#e3f2f8" opacity="0.9"/>
      <path d="M31 48 H69 L66 90 H34Z" fill="#f2893b"/>
      ${shine(38, 60, 3, 12)}
      <circle cx="46" cy="64" r="2.5" fill="#fbe3c8"/><circle cx="56" cy="76" r="2" fill="#fbe3c8"/><circle cx="50" cy="56" r="1.8" fill="#fbe3c8"/>
    `),

    wet: svg(`
      <path d="M20 44 C10 44 8 30 20 28 C20 14 40 10 48 22 C54 12 74 14 74 28 C88 28 90 44 78 44Z" fill="#9aa3b2"/>
      ${[[26, 56], [44, 62], [62, 56], [34, 74], [54, 78], [72, 70]].map(([x, y]) =>
        `<path d="M${x} ${y - 8} C${x} ${y - 8} ${x + 5} ${y - 1} ${x + 5} ${y + 2} A5 5 0 0 1 ${x - 5} ${y + 2} C${x - 5} ${y - 1} ${x} ${y - 8} ${x} ${y - 8}Z" fill="#3d8bd4"/>`).join('')}
      <ellipse cx="50" cy="92" rx="36" ry="5" fill="#7fbde0"/>
    `),

    fog: svg(`
      <path d="M0 76 C30 56 70 56 100 76 V100 H0Z" fill="#9cc8ac" opacity="0.5"/>
      <rect x="62" y="44" width="5" height="22" fill="#8a5a3b" opacity="0.5"/>
      <circle cx="64" cy="40" r="12" fill="#5aa469" opacity="0.5"/>
      ${[24, 40, 56, 72].map((y, i) => `<rect x="${i % 2 ? 4 : 14}" y="${y}" width="${i % 2 ? 80 : 82}" height="9" rx="4.5" fill="#d4d8de" opacity="0.85"/>`).join('')}
    `),

    keg: svg(`
      <path d="M26 16 H74 C82 36 82 64 74 84 H26 C18 64 18 36 26 16Z" fill="#b5835a"/>
      ${line('M38 16 C34 36 34 64 38 84 M50 16 V84 M62 16 C66 36 66 64 62 84', 1.6, '#8a5a3b')}
      <path d="M22 28 H78 M20 50 H80 M22 72 H78" fill="none" stroke="#5b6b85" stroke-width="5"/>
      <ellipse cx="50" cy="16" rx="24" ry="5" fill="#9a6a43"/>
    `),

    cut: svg(`
      ${line('M6 70 H94', 3, '#ef6f6c').replace('stroke-linecap', 'stroke-dasharray="6 6" stroke-linecap')}
      <rect x="6" y="62" width="88" height="30" fill="#f8f9fa" opacity="0.6"/>
      <circle cx="24" cy="22" r="10" fill="none" stroke="#3d8bd4" stroke-width="6"/>
      <circle cx="24" cy="50" r="10" fill="none" stroke="#3d8bd4" stroke-width="6"/>
      <path d="M32 28 L80 62 L76 66 L30 34Z M32 44 L80 66 L74 70 L30 40Z" fill="#b9c3d3"/>
      <circle cx="36" cy="36" r="3" fill="#5b6b85"/>
    `),

    wag: svg(`
      ${line('M76 44 Q90 30 86 18 M82 50 Q98 42 98 30', 2, '#b9c3d3')}
      ${line('M72 50 Q84 36 82 24', 6, '#c48a58')}
      <ellipse cx="54" cy="58" rx="22" ry="14" fill="#c48a58"/>
      ${line('M38 68 V86 M48 70 V88 M62 70 V88 M70 68 V86', 6, '#c48a58')}
      <circle cx="28" cy="46" r="15" fill="#c48a58"/>
      <path d="M20 38 C10 40 10 56 16 60 C22 56 22 46 20 38Z" fill="#7a4e2d"/>
      <ellipse cx="14" cy="50" rx="5" ry="4" fill="${INK}"/>
      ${dot(26, 42, 2.8)}
    `),

    mad: svg(`
      ${face(50, 50, 40, '#ef8a6c')}
      ${line('M28 34 L44 42 M72 34 L56 42', 4)}
      ${dot(38, 48, 4.5)}${dot(62, 48, 4.5)}
      ${line('M34 72 Q50 60 66 72', 4)}
      ${line('M84 16 L92 8 M88 22 L98 20 M80 12 L80 2', 3, '#e63946')}
    `),

    top: svg(`
      ${line('M50 6 V22', 5, '#5b6b85')}
      <path d="M14 46 C14 32 86 32 86 46 L54 88 C52 92 48 92 46 88Z" fill="#ef6f6c"/>
      <path d="M14 46 C14 52 86 52 86 46 C86 40 14 40 14 46Z" fill="#f2b134"/>
      <path d="M26 56 L74 56 L66 66 L34 66Z" fill="#5f63d0"/>
      ${line('M4 70 Q14 64 22 70 M78 70 Q88 64 96 70', 2, '#b9c3d3')}
    `),

    hop: svg(`
      ${line('M10 90 Q40 20 80 84', 2.5, '#b9c3d3').replace('stroke-linecap', 'stroke-dasharray="4 6" stroke-linecap')}
      <ellipse cx="38" cy="18" rx="5" ry="14" fill="#e9e4ec" stroke="#b8afc4" stroke-width="2" transform="rotate(-20 38 18)"/>
      <ellipse cx="50" cy="16" rx="5" ry="14" fill="#e9e4ec" stroke="#b8afc4" stroke-width="2" transform="rotate(10 50 16)"/>
      <ellipse cx="50" cy="52" rx="20" ry="16" fill="#f3f0f5" stroke="#b8afc4" stroke-width="2"/>
      <circle cx="44" cy="34" r="12" fill="#f3f0f5" stroke="#b8afc4" stroke-width="2"/>
      ${dot(40, 32, 2.6)}
      <circle cx="33" cy="36" r="2.2" fill="#e48a9d"/>
      <circle cx="70" cy="52" r="6" fill="#fff" stroke="#b8afc4" stroke-width="2"/>
      <ellipse cx="38" cy="66" rx="10" ry="5" fill="#e9e4ec" stroke="#b8afc4" stroke-width="2"/>
    `),

    mix: svg(`
      ${line('M58 50 L80 8', 4, '#9aa3b2')}
      <path d="M58 50 C48 44 50 30 58 26 C66 30 66 44 58 50Z" fill="none" stroke="#9aa3b2" stroke-width="2.5"/>
      <path d="M10 46 H90 C88 74 72 90 50 90 C28 90 12 74 10 46Z" fill="#3d8bd4"/>
      <ellipse cx="50" cy="46" rx="40" ry="8" fill="#fbf3e8"/>
      ${line('M30 46 Q40 40 50 46 T70 46', 2, '#e3b77c')}
      ${shine(26, 62, 4, 10, 20)}
    `),

    fix: svg(`
      ${line('M24 76 L64 36', 10, '#9aa3b2')}
      <path d="M60 24 A16 16 0 1 0 76 40 L68 40 L60 32Z" fill="#9aa3b2"/>
      <circle cx="20" cy="80" r="9" fill="#9aa3b2"/><circle cx="20" cy="80" r="4" fill="#f6efe4"/>
      <path d="M66 70 L78 70 L84 78 L78 86 L66 86 L60 78Z" fill="#5b6b85"/>
      <circle cx="72" cy="78" r="3.5" fill="#f6efe4"/>
    `),

    hug: svg(`
      <circle cx="50" cy="28" r="16" fill="#c48a58"/>
      <circle cx="38" cy="16" r="6" fill="#c48a58"/><circle cx="62" cy="16" r="6" fill="#c48a58"/>
      <ellipse cx="50" cy="34" rx="7" ry="5" fill="#efd7bb"/>
      ${dot(44, 26, 2.4)}${dot(56, 26, 2.4)}
      <ellipse cx="50" cy="66" rx="24" ry="24" fill="#c48a58"/>
      <path d="M50 54 C58 44 72 54 50 76 C28 54 42 44 50 54Z" fill="#ef6f6c"/>
      ${line('M28 56 Q36 70 46 64 M72 56 Q64 70 54 64', 8, '#a8742f')}
    `),

    win: svg(`
      <path d="M30 12 H70 V36 C70 50 60 58 50 58 C40 58 30 50 30 36Z" fill="#f2b134"/>
      <path d="M30 18 C14 18 14 40 32 42 M70 18 C86 18 86 40 68 42" fill="none" stroke="#f2b134" stroke-width="5"/>
      <rect x="45" y="56" width="10" height="14" fill="#c07a14"/>
      <rect x="32" y="70" width="36" height="8" rx="2" fill="#c07a14"/>
      <rect x="26" y="78" width="48" height="12" rx="3" fill="#8a5a3b"/>
      <path d="M50 24 L53 31 L60 31 L54 35 L56 42 L50 38 L44 42 L46 35 L40 31 L47 31Z" fill="#fff6d6"/>
      ${shine(38, 30, 3, 10)}
    `),

    // ----- 4-letter family words -----
    well: svg(`
      <path d="M18 34 L50 12 L82 34Z" fill="#b03f45"/>
      ${line('M26 34 V60 M74 34 V60', 5, '#8a5a3b')}
      ${line('M50 30 V48', 1.6)}
      <path d="M44 48 H56 L54 58 H46Z" fill="#9a6a43"/>
      <rect x="16" y="60" width="68" height="30" rx="4" fill="#9aa3b2"/>
      ${line('M16 70 H84 M16 80 H84 M32 60 V70 M52 60 V70 M68 60 V70 M24 70 V80 M44 70 V80 M62 70 V80 M76 70 V80', 1.6, '#7c8aa5')}
    `),

    rock: svg(`
      <path d="M10 82 C6 66 16 46 32 40 C40 26 62 24 74 36 C88 42 96 64 90 82Z" fill="#9aa3b2"/>
      <path d="M74 36 C88 42 96 64 90 82 H66 C78 66 80 48 74 36Z" fill="#7c8aa5"/>
      ${line('M32 56 L44 62 M52 44 L58 54', 2, '#7c8aa5')}
      ${line('M4 84 H96', 3, '#9cc8ac')}
    `),

    lock: svg(`
      <path d="M30 44 V32 C30 10 70 10 70 32 V44" fill="none" stroke="#9aa3b2" stroke-width="9"/>
      <rect x="18" y="42" width="64" height="48" rx="8" fill="#f2b134"/>
      <path d="M62 42 H74 C78 42 82 46 82 50 V82 C82 86 78 90 74 90 H62Z" fill="#000" opacity="0.08"/>
      <circle cx="50" cy="62" r="7" fill="${INK}"/>
      <path d="M47 64 H53 L55 78 H45Z" fill="${INK}"/>
    `),

    ring: svg(`
      <circle cx="50" cy="60" r="28" fill="none" stroke="#f2b134" stroke-width="9"/>
      <path d="M38 24 L50 10 L62 24 L50 36Z" fill="#7fe0e8"/>
      <path d="M38 24 H62 L50 36Z" fill="#3fb8c4"/>
      ${shine(30, 54, 3, 10, 20)}
    `),

    wing: svg(`
      <path d="M12 70 C20 40 50 18 90 16 C84 26 78 30 70 32 C78 34 82 38 84 42 C72 44 66 46 60 50 C66 54 68 58 68 62 C54 62 44 66 36 74 C26 82 14 82 12 70Z" fill="#eef1f5" stroke="#8e9bb0" stroke-width="2.5"/>
      ${line('M20 68 C34 52 54 36 84 20 M30 70 C44 58 58 48 78 40 M40 70 C50 62 58 58 64 56', 1.8, '#a8b3c4')}
    `),

    dish: svg(`
      <ellipse cx="50" cy="62" rx="44" ry="16" fill="#e3f2f8" stroke="#a8c8d8" stroke-width="2"/>
      <ellipse cx="50" cy="58" rx="30" ry="9" fill="#cfe8f3"/>
      <circle cx="40" cy="54" r="6" fill="#5aa469"/><circle cx="54" cy="52" r="7" fill="#ef6f6c"/><circle cx="64" cy="57" r="5" fill="#f2b134"/>
      ${line('M40 34 Q36 26 40 18 M56 34 Q52 26 56 18', 2.5, '#b9c3d3')}
    `),

    rake: svg(`
      ${line('M50 8 V64', 5, '#a0703f')}
      <rect x="18" y="62" width="64" height="8" rx="3" fill="#7c8aa5"/>
      ${line('M22 70 V90 M32 70 V90 M42 70 V90 M52 70 V90 M62 70 V90 M72 70 V90 M80 70 V90', 3.5, '#7c8aa5')}
    `),

    lake: svg(`
      <path d="M0 58 L22 26 L38 46 L56 18 L82 52 L100 40 V64 H0Z" fill="#7c8aa5"/>
      <path d="M22 26 L28 34 L18 34Z M56 18 L63 28 L50 28Z" fill="#fff"/>
      <ellipse cx="50" cy="76" rx="48" ry="16" fill="#7fbde0"/>
      ${line('M24 72 H40 M56 80 H74', 2, '#cfe8f3')}
      <path d="M86 64 L92 50 L98 64Z M4 66 L10 52 L16 66Z" fill="#3f8650"/>
    `),

    nail: svg(`
      <rect x="28" y="12" width="44" height="10" rx="3" fill="#7c8aa5"/>
      <rect x="45" y="22" width="10" height="58" fill="#9aa3b2"/>
      <path d="M45 80 H55 L50 94Z" fill="#9aa3b2"/>
      <rect x="45" y="22" width="4" height="58" fill="#fff" opacity="0.35"/>
    `),

    tail: svg(`
      <path d="M10 80 C10 60 30 52 44 56 C60 60 68 46 66 30 C64 18 76 8 88 14 C96 30 92 54 76 70 C60 84 30 90 10 80Z" fill="#e8743a"/>
      <path d="M88 14 C96 30 92 44 84 52 C80 40 80 24 88 14Z" fill="#fbf3e8"/>
      ${line('M24 74 C40 70 56 66 66 56', 2, '#c95c26')}
    `),

    sail: svg(`
      ${line('M50 6 V70', 4, '#8a5a3b')}
      <path d="M54 10 C76 26 84 50 80 66 H54Z" fill="#f8f9fa" stroke="#cfd6df" stroke-width="2"/>
      <path d="M46 18 C30 32 24 52 26 66 H46Z" fill="#ef6f6c"/>
      <path d="M12 70 H88 L78 86 H22Z" fill="#9a6a43"/>
      ${water(92)}
    `),

    mail: svg(`
      <rect x="12" y="26" width="76" height="52" rx="5" fill="#f8f9fa" stroke="#cfd6df" stroke-width="2"/>
      <path d="M12 30 L50 58 L88 30" fill="none" stroke="#cfd6df" stroke-width="3"/>
      <rect x="68" y="32" width="14" height="16" rx="2" fill="#ef6f6c"/>
      ${line('M22 66 H44 M22 72 H38', 2, '#9aa3b2')}
    `),

    boat: svg(`
      <path d="M8 54 H92 C88 74 72 84 50 84 C28 84 12 74 8 54Z" fill="#c48a58"/>
      <path d="M8 54 H92 C91 58 90 60 89 62 H11 C10 60 9 58 8 54Z" fill="#9a6a43"/>
      ${line('M28 30 L40 70 M74 26 L60 70', 4, '#8a5a3b')}
      <ellipse cx="26" cy="26" rx="4" ry="8" fill="#8a5a3b" transform="rotate(-18 26 26)"/>
      ${water(92)}
    `),

    coat: svg(`
      <path d="M34 12 L50 22 L66 12 L86 24 L92 62 L80 64 L76 40 V92 H24 V40 L20 64 L8 62 L14 24Z" fill="#ef6f6c"/>
      <path d="M34 12 L50 22 L44 40 L30 20Z M66 12 L50 22 L56 40 L70 20Z" fill="#b03f45"/>
      ${line('M50 24 V92', 2, '#b03f45')}
      ${[44, 58, 72].map((y) => `<circle cx="56" cy="${y}" r="3" fill="#f2b134"/>`).join('')}
      <rect x="28" y="60" width="14" height="10" rx="2" fill="#b03f45"/>
    `),

    hill: svg(`
      <path d="M0 90 C20 40 80 40 100 90Z" fill="#5aa469"/>
      <path d="M50 52 C70 52 88 66 100 90 H64 C68 74 62 60 50 52Z" fill="#3f8650"/>
      ${line('M50 54 V24', 3, '#5b6b85')}
      <path d="M50 24 L66 30 L50 36Z" fill="#ef6f6c"/>
      <circle cx="80" cy="18" r="8" fill="#f6d743"/>
    `),

    pill: svg(`
      <g transform="rotate(-35 50 50)">
        <rect x="18" y="36" width="64" height="28" rx="14" fill="#f8f9fa" stroke="#cfd6df" stroke-width="2"/>
        <path d="M50 36 H68 C76 36 82 42 82 50 C82 58 76 64 68 64 H50Z" fill="#ef6f6c"/>
        ${shine(36, 44, 8, 3)}
      </g>
    `),

    mill: svg(`
      <path d="M36 92 L42 46 H58 L64 92Z" fill="#e9dcc3"/>
      <path d="M38 46 L50 32 L62 46Z" fill="#b03f45"/>
      <path d="M46 92 V80 C46 74 54 74 54 80 V92Z" fill="#8a5a3b"/>
      ${[0, 90, 180, 270].map((r) => `<path d="M50 40 L52 8 L64 10 L56 40Z" fill="#f8f9fa" stroke="#9aa3b2" stroke-width="1.5" transform="rotate(${r + 20} 50 40)"/>`).join('')}
      <circle cx="50" cy="40" r="4" fill="#5b6b85"/>
    `),

    wall: svg(`
      ${[0, 1, 2, 3, 4].map((row) => [0, 1, 2, 3, 4].map((col) => {
        const x = 6 + col * 18 - (row % 2 ? 9 : 0);
        return `<rect x="${Math.max(x, 6)}" y="${14 + row * 15}" width="${x < 6 ? 9 : Math.min(17, 94 - x)}" height="13" rx="1.5" fill="${(row + col) % 3 ? '#c9643f' : '#b55636'}"/>`;
      }).join('')).join('')}
      ${line('M4 90 H96', 3, '#9cc8ac')}
    `),

    pump: svg(`
      <rect x="40" y="26" width="20" height="58" rx="4" fill="#3d8bd4"/>
      ${line('M50 26 V10', 4, '#9aa3b2')}
      <rect x="34" y="6" width="32" height="8" rx="4" fill="${INK}"/>
      <rect x="34" y="84" width="32" height="8" rx="3" fill="#5b6b85"/>
      ${line('M60 70 C80 70 82 50 92 46', 3.5, INK)}
      ${shine(46, 50, 2, 14)}
    `),

    jump: svg(`
      ${line('M14 74 C14 96 86 96 86 74', 3, '#ef6f6c')}
      <circle cx="50" cy="16" r="10" fill="${SKIN}"/>
      <path d="M40 12 C40 2 60 2 60 12 C54 8 46 8 40 12Z" fill="#3a2a22"/>
      ${line('M50 28 V54', 12, '#2a9d8f')}
      ${line('M48 32 L30 22 L16 72 M52 32 L70 22 L84 72', 4, '#2a9d8f')}
      ${line('M46 54 L38 70 M54 54 L62 70', 7, '#2c3a55')}
      <circle cx="14" cy="74" r="4" fill="#f2b134"/><circle cx="86" cy="74" r="4" fill="#f2b134"/>
    `),

    sink: svg(`
      ${line('M50 24 V12 H66 V20', 6, '#9aa3b2')}
      <path d="M64 22 C64 22 69 30 69 33 A5 5 0 0 1 59 33 C59 30 64 22 64 22Z" fill="#3d8bd4"/>
      <rect x="6" y="40" width="88" height="10" rx="3" fill="#b9c3d3"/>
      <path d="M18 50 H82 C80 70 68 80 50 80 C32 80 20 70 18 50Z" fill="#e3f2f8" stroke="#b9c3d3" stroke-width="2"/>
      <ellipse cx="50" cy="56" rx="26" ry="4" fill="#7fbde0"/>
      <rect x="44" y="80" width="12" height="14" fill="#9aa3b2"/>
    `),

    pink: svg(`
      <path d="M50 14 C66 14 70 28 82 30 C94 34 92 52 84 60 C90 74 76 88 62 82 C54 92 36 90 32 80 C16 84 6 70 14 58 C4 48 10 32 24 32 C28 20 40 14 50 14Z" fill="#f497b6"/>
      <circle cx="88" cy="18" r="5" fill="#f497b6"/><circle cx="12" cy="86" r="4" fill="#f497b6"/><circle cx="92" cy="84" r="3" fill="#f497b6"/>
      ${shine(38, 36, 8, 4, -20)}
    `),

    wink: svg(`
      ${face(50, 50, 40)}
      <path d="M78 22 C90 40 88 70 70 84 C80 66 82 40 78 22Z" fill="#000" opacity="0.05"/>
      ${dot(36, 44, 5)}
      ${line('M56 46 Q64 38 72 46', 4)}
      ${line('M32 64 Q50 80 68 64', 4)}
      <circle cx="28" cy="58" r="5" fill="#f497b6" opacity="0.6"/><circle cx="72" cy="58" r="5" fill="#f497b6" opacity="0.6"/>
    `),

    book: svg(`
      <path d="M50 26 C40 18 22 16 8 20 V82 C22 78 40 80 50 88Z" fill="#f8f9fa" stroke="#cfd6df" stroke-width="2"/>
      <path d="M50 26 C60 18 78 16 92 20 V82 C78 78 60 80 50 88Z" fill="#f8f9fa" stroke="#cfd6df" stroke-width="2"/>
      <path d="M8 82 C22 78 40 80 50 88 C60 80 78 78 92 82 V88 C78 84 60 86 50 94 C40 86 22 84 8 88Z" fill="#5f63d0"/>
      ${line('M16 34 C26 32 36 33 42 37 M16 46 C26 44 36 45 42 49 M16 58 C26 56 36 57 42 61 M58 37 C64 33 74 32 84 34 M58 49 C64 45 74 44 84 46 M58 61 C64 57 74 56 84 58', 1.8, '#a8c8d8')}
    `),

    hook: svg(`
      <circle cx="50" cy="10" r="5" fill="none" stroke="#5b6b85" stroke-width="3"/>
      <path d="M50 15 V62 C50 82 26 82 24 66 L18 72 L24 58 L32 66 C34 74 44 74 44 62 V15Z" fill="#9aa3b2"/>
      ${line('M50 15 V62', 1.4, '#fff')}
    `),

    cook: svg(`
      <path d="M28 40 C16 40 16 22 28 22 C30 10 46 8 50 16 C54 8 70 10 72 22 C84 22 84 40 72 40Z" fill="#f8f9fa" stroke="#cfd6df" stroke-width="2"/>
      <rect x="30" y="38" width="40" height="10" fill="#f8f9fa" stroke="#cfd6df" stroke-width="2"/>
      <ellipse cx="50" cy="66" rx="22" ry="22" fill="${SKIN}"/>
      ${dot(42, 62, 3)}${dot(58, 62, 3)}
      ${line('M42 74 Q50 80 58 74', 2.5, '#c94f4f')}
      <path d="M36 70 C42 66 46 68 50 70 C54 68 58 66 64 70 C58 72 54 72 50 70 C46 72 42 72 36 70Z" fill="#8a5a3b"/>
    `),

    pool: svg(`
      <rect x="8" y="34" width="84" height="50" rx="8" fill="#cfe8f3"/>
      <rect x="14" y="40" width="72" height="38" rx="5" fill="#3fb8c4"/>
      ${line('M20 52 Q28 48 36 52 T52 52 M46 66 Q54 62 62 66 T78 66', 2.5, '#a8e8ee')}
      ${line('M74 20 V48 M86 20 V48 M74 30 H86 M74 40 H86', 3, '#9aa3b2')}
      <circle cx="30" cy="62" r="7" fill="#ef6f6c"/><circle cx="30" cy="62" r="3" fill="#3fb8c4"/>
    `),

    tool: svg(`
      <rect x="10" y="40" width="80" height="48" rx="6" fill="#ef6f6c"/>
      <rect x="10" y="40" width="80" height="12" rx="4" fill="#b03f45"/>
      <path d="M34 40 V28 C34 22 66 22 66 28 V40" fill="none" stroke="#5b6b85" stroke-width="5"/>
      <rect x="44" y="56" width="12" height="8" rx="2" fill="#f2b134"/>
      ${line('M22 34 L30 14 M78 34 L72 12', 4, '#9aa3b2')}
      <rect x="66" y="6" width="14" height="8" rx="2" fill="#5b6b85" transform="rotate(15 73 10)"/>
    `),

    rose: svg(`
      ${line('M50 50 V94', 4, '#3f8650')}
      <path d="M50 76 C36 66 24 70 20 78 C32 84 42 82 50 76Z" fill="#5aa469"/>
      <path d="M50 66 C64 58 74 62 78 70 C66 74 58 72 50 66Z" fill="#5aa469"/>
      <circle cx="50" cy="32" r="22" fill="#e63946"/>
      <path d="M50 14 C62 18 66 30 58 38 C52 42 44 38 46 30 C48 24 54 26 54 30" fill="none" stroke="#b02f35" stroke-width="2.5"/>
      <path d="M30 34 C34 46 44 52 50 54 C56 52 66 46 70 34" fill="none" stroke="#b02f35" stroke-width="2.5"/>
    `),

    hose: svg(`
      <path d="M8 60 C8 30 46 30 46 50 C46 70 14 70 14 54 C14 40 36 40 36 52" fill="none" stroke="#5aa469" stroke-width="7" stroke-linecap="round"/>
      ${line('M46 50 C50 70 60 72 66 62', 7, '#5aa469')}
      <rect x="62" y="52" width="14" height="10" rx="2" fill="#f2b134" transform="rotate(-30 69 57)"/>
      ${[[82, 40], [88, 32], [86, 48], [94, 40], [92, 26]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#3d8bd4"/>`).join('')}
    `),

    bear: svg(`
      <circle cx="24" cy="26" r="13" fill="#7a4e2d"/><circle cx="24" cy="26" r="6" fill="#a8742f"/>
      <circle cx="76" cy="26" r="13" fill="#7a4e2d"/><circle cx="76" cy="26" r="6" fill="#a8742f"/>
      <circle cx="50" cy="56" r="36" fill="#8a5a3b"/>
      <ellipse cx="50" cy="70" rx="17" ry="13" fill="#d9b48f"/>
      <ellipse cx="50" cy="63" rx="7" ry="5" fill="${INK}"/>
      ${line('M50 68 V74 M43 76 Q50 80 57 76', 2.2)}
      ${dot(36, 48, 4)}${dot(64, 48, 4)}
    `),

    nose: svg(`
      ${face(50, 50, 40, SKIN)}
      ${dot(34, 38, 4)}${dot(66, 38, 4)}
      <path d="M50 34 C46 48 38 56 40 62 C42 68 58 68 60 62 C62 56 54 48 50 34Z" fill="#e4b48f"/>
      <ellipse cx="44" cy="63" rx="3" ry="2" fill="#b5835a"/><ellipse cx="56" cy="63" rx="3" ry="2" fill="#b5835a"/>
      ${line('M38 76 Q50 82 62 76', 2.5, '#c94f4f')}
    `),

    bone: svg(`
      <g transform="rotate(-30 50 50)">
        <rect x="24" y="42" width="52" height="16" fill="#f3e9d6" stroke="#c9b48a" stroke-width="2.5"/>
        <circle cx="22" cy="40" r="10" fill="#f3e9d6" stroke="#c9b48a" stroke-width="2.5"/><circle cx="22" cy="60" r="10" fill="#f3e9d6" stroke="#c9b48a" stroke-width="2.5"/>
        <circle cx="78" cy="40" r="10" fill="#f3e9d6" stroke="#c9b48a" stroke-width="2.5"/><circle cx="78" cy="60" r="10" fill="#f3e9d6" stroke="#c9b48a" stroke-width="2.5"/>
        ${line('M30 46 H70', 2, '#e0d2b4')}
      </g>
    `),

    cone: svg(`
      <circle cx="40" cy="30" r="16" fill="#f497b6"/>
      <circle cx="60" cy="30" r="16" fill="#fbf3e8"/>
      <circle cx="50" cy="18" r="14" fill="#7a4e2d"/>
      <circle cx="50" cy="4" r="4" fill="#e63946"/>
      <path d="M26 40 H74 L52 94 C51 96 49 96 48 94Z" fill="#e3b77c"/>
      ${line('M34 48 L58 76 M46 46 L64 64 M58 46 L68 56 M66 46 L42 76 M54 46 L36 64 M42 46 L32 56', 1.8, '#c99a52')}
    `),
  };
})());
