// Even more clue illustrations, mainly regular words for spelling. Same style as pictures.js.
Object.assign(PICTURES, (() => {
  const { INK, dot, line, grad, svg } = PICTURE_KIT;
  const shine = (x, y, rx, ry, rot = 0) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="0.3" transform="rotate(${rot} ${x} ${y})"/>`;
  const SKIN = '#f1d3b3';
  const water = (y) => line(`M4 ${y} Q14 ${y - 6} 24 ${y} T44 ${y} T64 ${y} T84 ${y} T100 ${y}`, 3, '#7fbde0');

  return {
    ham: svg(`
      <ellipse cx="50" cy="84" rx="42" ry="8" fill="#d4d8de"/>
      ${line('M70 34 L84 18', 7, '#f3e9d6')}
      <circle cx="84" cy="14" r="5" fill="#f3e9d6"/><circle cx="90" cy="20" r="5" fill="#f3e9d6"/>
      <path d="M12 66 C10 44 34 30 58 34 C76 38 80 56 72 70 C64 82 42 86 26 82 C18 80 12 74 12 66Z" fill="#c9773d"/>
      ${line('M24 50 L54 80 M34 40 L66 72 M46 36 L74 62 M20 66 L40 46 M28 76 L56 46 M44 80 L68 54', 1.6, '#a85a28')}
      <ellipse cx="26" cy="64" rx="14" ry="17" fill="#f4a9b8" transform="rotate(-20 26 64)"/>
      <ellipse cx="26" cy="64" rx="8" ry="10" fill="#e88aa1" transform="rotate(-20 26 64)"/>
      <ellipse cx="26" cy="64" rx="2.5" ry="3" fill="#f3e9d6"/>
    `),

    cub: svg(`
      <circle cx="26" cy="28" r="13" fill="#8a5a3b"/><circle cx="26" cy="28" r="6" fill="#c48a58"/>
      <circle cx="74" cy="28" r="13" fill="#8a5a3b"/><circle cx="74" cy="28" r="6" fill="#c48a58"/>
      <circle cx="50" cy="56" r="34" fill="#9a6a43"/>
      <ellipse cx="50" cy="68" rx="15" ry="12" fill="#e3b77c"/>
      <ellipse cx="50" cy="62" rx="6" ry="4.5" fill="${INK}"/>
      ${line('M50 66 V71 M44 73 Q50 77 56 73', 2.2)}
      ${dot(38, 50, 4)}${dot(62, 50, 4)}
    `),

    sad: svg(`
      <circle cx="50" cy="50" r="40" fill="#f6d743"/>
      <path d="M78 22 C90 40 88 70 70 84 C80 66 82 40 78 22Z" fill="#000" opacity="0.06"/>
      ${dot(36, 42, 4.5)}${dot(64, 42, 4.5)}
      ${line('M30 34 L40 30 M70 34 L60 30', 3)}
      ${line('M34 70 Q50 58 66 70', 3.5)}
      <path d="M36 52 C36 52 41 60 41 63 A5 5 0 0 1 31 63 C31 60 36 52 36 52Z" fill="#3d8bd4"/>
    `),

    mud: svg(`
      <path d="M8 64 C8 52 22 50 30 54 C34 42 52 40 60 50 C70 42 90 46 92 60 C98 66 94 80 82 80 H20 C10 80 4 72 8 64Z" fill="#7a5233"/>
      <ellipse cx="40" cy="62" rx="12" ry="5" fill="#9a6a43"/>
      <ellipse cx="68" cy="66" rx="9" ry="4" fill="#9a6a43"/>
      <circle cx="56" cy="54" r="3" fill="#9a6a43"/><circle cx="26" cy="68" r="2.5" fill="#9a6a43"/>
      <circle cx="20" cy="40" r="4" fill="#7a5233"/><circle cx="80" cy="34" r="3" fill="#7a5233"/><circle cx="62" cy="30" r="2.5" fill="#7a5233"/>
    `),

    gum: svg(`
      <rect x="18" y="68" width="64" height="20" rx="4" fill="#5f63d0"/>
      <rect x="18" y="68" width="22" height="20" rx="4" fill="#8f92e3"/>
      <circle cx="50" cy="38" r="30" fill="#f497b6"/>
      <circle cx="50" cy="38" r="30" fill="none" stroke="#e57a9b" stroke-width="2"/>
      ${shine(38, 26, 8, 5, -30)}
    `),

    ram: svg(`
      ${[[26, 50], [40, 40], [58, 40], [72, 50], [74, 64], [60, 72], [42, 72], [26, 64]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="#f3f0e8" stroke="#cfc8b8" stroke-width="2"/>`).join('')}
      ${[[26, 50], [40, 40], [58, 40], [72, 50], [74, 64], [60, 72], [42, 72], [26, 64]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#f3f0e8"/>`).join('')}
      <ellipse cx="50" cy="56" rx="16" ry="22" fill="#5b6b85"/>
      <path d="M36 42 C20 36 18 60 32 58 C38 56 36 48 30 50" fill="none" stroke="#b5835a" stroke-width="7" stroke-linecap="round"/>
      <path d="M64 42 C80 36 82 60 68 58 C62 56 64 48 70 50" fill="none" stroke="#b5835a" stroke-width="7" stroke-linecap="round"/>
      <circle cx="44" cy="54" r="2.8" fill="#fff"/><circle cx="56" cy="54" r="2.8" fill="#fff"/>
      <ellipse cx="50" cy="70" rx="4" ry="2.6" fill="${INK}"/>
    `),

    red: svg(`
      <path d="M22 34 H78 V82 C78 88 72 92 66 92 H34 C28 92 22 88 22 82Z" fill="#b9c3d3"/>
      <ellipse cx="50" cy="34" rx="28" ry="7" fill="#e63946"/>
      <path d="M22 34 C22 44 30 42 30 52 C30 56 36 56 36 50 C36 42 44 44 44 38 H22Z" fill="#e63946"/>
      <path d="M62 34 C62 40 68 40 68 48 C68 52 73 52 73 46 C73 40 78 42 78 34Z" fill="#e63946"/>
      <rect x="30" y="58" width="40" height="18" rx="3" fill="#fbf3e8"/>
      <circle cx="50" cy="67" r="6" fill="#e63946"/>
    `),

    dot: svg(`
      <rect x="10" y="10" width="80" height="80" rx="16" fill="#f8f9fa" stroke="#d4d8de" stroke-width="2"/>
      <circle cx="50" cy="50" r="22" fill="#ef6f6c"/>
      ${shine(43, 43, 6, 4, -30)}
    `),

    pod: svg(`
      <path d="M10 60 C24 30 76 24 92 40 C80 70 30 78 10 60Z" fill="#5aa469"/>
      <path d="M18 56 C32 38 70 32 84 42 C72 62 36 68 18 56Z" fill="#a9cf94"/>
      ${[[32, 54], [46, 50], [60, 46], [73, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7.5" fill="#6cbf5c"/><circle cx="${x - 2}" cy="${y - 2}" r="2" fill="#fff" opacity="0.4"/>`).join('')}
      ${line('M92 40 Q96 32 92 24', 3, '#3f8650')}
    `),

    cod: svg(`
      <path d="M72 50 L94 32 L90 50 L94 68Z" fill="#6b8f7a"/>
      <path d="M8 52 C20 30 56 28 76 50 C56 72 20 72 8 52Z" fill="#8fae9a"/>
      <path d="M8 52 C20 60 56 66 76 50 C56 72 20 72 8 52Z" fill="#dfe8df"/>
      <path d="M36 32 L44 22 L52 32Z M40 68 L46 78 L52 68Z" fill="#6b8f7a"/>
      ${line('M14 58 Q12 66 16 70', 1.6, '#4a5568')}
      <circle cx="20" cy="48" r="4.5" fill="#fff"/>${dot(21, 48, 2.4)}
      ${[30, 40, 50, 60].map((x) => `<circle cx="${x}" cy="44" r="1.6" fill="#6b8f7a"/>`).join('')}
    `),

    tag: svg(`
      <path d="M30 20 H82 C86 20 88 22 88 26 V74 C88 78 86 80 82 80 H30 L10 50Z" fill="#f2b134"/>
      <circle cx="28" cy="50" r="6" fill="#fff"/>
      ${line('M28 50 C20 40 10 30 6 16', 2, '#ef6f6c')}
      ${line('M44 40 H76 M44 50 H72 M44 60 H66', 3, '#c07a14')}
    `),

    sub: svg(`
      <rect x="54" y="18" width="5" height="16" fill="#c07a14"/>
      <rect x="54" y="16" width="14" height="5" rx="2" fill="#c07a14"/>
      <rect x="40" y="30" width="26" height="14" rx="5" fill="#f2b134"/>
      <path d="M10 56 C10 42 22 38 34 38 H74 C88 38 96 46 96 56 C96 66 88 74 74 74 H34 C22 74 10 70 10 56Z" fill="#f6c945"/>
      <path d="M4 46 L14 50 L14 62 L4 66Z" fill="#c07a14"/>
      ${[40, 56, 72].map((x) => `<circle cx="${x}" cy="56" r="6" fill="#7fbde0" stroke="#c07a14" stroke-width="2.5"/>`).join('')}
      ${water(90)}
    `),

    tug: svg(`
      <circle cx="58" cy="18" r="6" fill="#d4d8de"/><circle cx="66" cy="10" r="5" fill="#e6e9ee"/>
      <rect x="52" y="24" width="10" height="16" fill="${INK}"/>
      <rect x="30" y="38" width="38" height="20" rx="2" fill="#f3f4f6"/>
      <rect x="36" y="43" width="10" height="8" rx="1" fill="#7fbde0"/><rect x="52" y="43" width="10" height="8" rx="1" fill="#7fbde0"/>
      <path d="M8 58 H92 C90 72 80 82 64 82 H24 C14 82 8 70 8 58Z" fill="#e63946"/>
      <rect x="8" y="58" width="84" height="6" fill="${INK}"/>
      <circle cx="76" cy="70" r="7" fill="none" stroke="${INK}" stroke-width="4"/>
      ${water(90)}
    `),

    mat: svg(`
      <rect x="10" y="28" width="80" height="48" rx="6" fill="#b5835a"/>
      <rect x="16" y="34" width="68" height="36" rx="3" fill="#d39a5b"/>
      ${line('M22 40 V64 M30 40 V64 M38 40 V64 M46 40 V64 M54 40 V64 M62 40 V64 M70 40 V64 M78 40 V64', 2, '#b5835a')}
    `),

    lip: svg(`
      <path d="M10 50 C22 30 36 28 50 38 C64 28 78 30 90 50 C72 52 28 52 10 50Z" fill="#e63946"/>
      <path d="M10 50 C28 54 72 54 90 50 C78 74 22 74 10 50Z" fill="#ef6f6c"/>
      ${line('M12 50 Q50 56 88 50', 2, '#b02f35')}
      ${shine(40, 62, 8, 3)}
    `),

    mum: svg(`
      <path d="M18 56 C14 22 34 10 50 10 C66 10 86 22 82 56 C82 76 76 88 70 92 H30 C24 88 18 76 18 56Z" fill="#8a5a3b"/>
      <ellipse cx="50" cy="52" rx="24" ry="28" fill="${SKIN}"/>
      <path d="M26 44 C28 26 44 20 56 22 C66 24 74 32 74 44 C64 38 48 36 38 30 C34 36 30 42 26 44Z" fill="#8a5a3b"/>
      ${dot(41, 52, 3.4)}${dot(59, 52, 3.4)}
      ${line('M42 66 Q50 72 58 66', 3, '#c94f4f')}
      <circle cx="35" cy="62" r="4" fill="#f4a9b8" opacity="0.6"/><circle cx="65" cy="62" r="4" fill="#f4a9b8" opacity="0.6"/>
      <circle cx="26" cy="62" r="3" fill="#f2b134"/><circle cx="74" cy="62" r="3" fill="#f2b134"/>
    `),

    dad: svg(`
      <ellipse cx="50" cy="54" rx="27" ry="32" fill="${SKIN}"/>
      <path d="M22 46 C20 22 36 14 50 14 C66 14 80 22 78 46 C74 36 66 30 50 30 C36 30 28 36 22 46Z" fill="#3a2a22"/>
      <circle cx="40" cy="50" r="8" fill="none" stroke="${INK}" stroke-width="2.5"/>
      <circle cx="60" cy="50" r="8" fill="none" stroke="${INK}" stroke-width="2.5"/>
      ${line('M48 50 H52', 2.5)}
      ${dot(40, 50, 2.8)}${dot(60, 50, 2.8)}
      <path d="M36 66 C42 62 58 62 64 66 C60 70 40 70 36 66Z" fill="#3a2a22"/>
      ${line('M43 74 Q50 78 57 74', 2.5, '#c94f4f')}
    `),

    rod: svg(`
      ${line('M14 92 L76 14', 4, '#5b6b85')}
      <circle cx="28" cy="76" r="7" fill="#9aa3b2"/>
      ${line('M76 14 Q84 40 80 70', 1.4, '#9aa3b2')}
      ${line('M80 70 V80 Q80 86 74 84', 2.5, '#5b6b85')}
      <circle cx="80" cy="64" r="4" fill="#ef6f6c"/>
      ${water(92)}
    `),

    bud: svg(`
      ${line('M50 92 V44', 5, '#3f8650')}
      <path d="M50 74 C36 64 24 66 18 72 C30 80 42 80 50 74Z" fill="#5aa469"/>
      <path d="M50 62 C64 52 76 54 82 60 C70 68 58 68 50 62Z" fill="#5aa469"/>
      <path d="M50 12 C64 22 66 38 50 48 C34 38 36 22 50 12Z" fill="#f497b6"/>
      <path d="M50 12 C58 22 58 38 50 48 C44 38 44 22 50 12Z" fill="#e57a9b"/>
      <path d="M38 40 C42 50 58 50 62 40 C58 46 42 46 38 40Z" fill="#5aa469"/>
    `),

    cab: svg(`
      <rect x="38" y="16" width="24" height="10" rx="2" fill="${INK}"/>
      <text x="50" y="21.5" text-anchor="middle" dominant-baseline="central" font-family="Outfit, sans-serif" font-weight="700" font-size="7" fill="#f6d743">TAXI</text>
      <path d="M8 66 C8 56 14 52 24 50 L32 30 C34 28 38 26 42 26 H60 C66 26 70 28 74 34 L84 50 C92 52 94 58 94 66 V72 H8Z" fill="#f6c945"/>
      <path d="M36 34 H48 V50 H30Z M54 34 H62 C65 34 67 36 69 38 L74 50 H54Z" fill="#cfe8f3"/>
      ${[16, 28, 40, 52, 64, 76].map((x, i) => `<rect x="${x}" y="58" width="6" height="6" fill="${i % 2 ? '#f6c945' : INK}"/>`).join('')}
      <circle cx="28" cy="74" r="10" fill="${INK}"/><circle cx="28" cy="74" r="4" fill="#d4d8de"/>
      <circle cx="74" cy="74" r="10" fill="${INK}"/><circle cx="74" cy="74" r="4" fill="#d4d8de"/>
    `),

    pad: svg(`
      <rect x="20" y="14" width="60" height="78" rx="4" fill="#fdf6d8"/>
      <rect x="20" y="14" width="60" height="12" rx="4" fill="#5f63d0"/>
      ${[30, 40, 50, 60, 70].map((x) => `<circle cx="${x}" cy="14" r="3" fill="none" stroke="#9aa3b2" stroke-width="2"/>`).join('')}
      ${line('M28 38 H72 M28 48 H72 M28 58 H72 M28 68 H60 M28 78 H66', 1.6, '#a8c8d8')}
    `),

    fin: svg(`
      <path d="M30 70 C40 50 52 26 74 16 C66 34 66 54 72 70Z" fill="#7c8aa5"/>
      <path d="M58 30 C54 46 56 60 62 70 H72 C66 54 66 34 74 16 C68 20 62 24 58 30Z" fill="#5b6b85"/>
      <path d="M0 70 H100 V100 H0Z" fill="#7fbde0" opacity="0.6"/>
      ${line('M0 70 Q12 64 24 70 T48 70 T72 70 T100 70', 3, '#3d8bd4')}
    `),

    bib: svg(`
      ${line('M30 22 Q20 10 10 14 M70 22 Q80 10 90 14', 3, '#7fbde0')}
      <path d="M50 10 C70 10 82 22 82 40 V72 C82 86 68 94 50 94 C32 94 18 86 18 72 V40 C18 22 30 10 50 10Z" fill="#cfe8f3"/>
      <path d="M38 20 C38 32 62 32 62 20 C62 14 38 14 38 20Z" fill="#f6efe4"/>
      <path d="M50 10 C70 10 82 22 82 40 V72 C82 86 68 94 50 94" fill="none" stroke="#7fbde0" stroke-width="3"/>
      <path d="M18 40 C18 22 30 10 50 10 M18 40 V72 C18 86 32 94 50 94" fill="none" stroke="#7fbde0" stroke-width="3"/>
      <path d="M50 52 C58 44 68 54 50 70 C32 54 42 44 50 52Z" fill="#ef6f6c"/>
    `),

    cob: svg(`
      <path d="M50 92 C30 80 22 50 30 20 C36 40 44 60 50 92Z" fill="#5aa469"/>
      <path d="M50 92 C70 80 78 50 70 20 C64 40 56 60 50 92Z" fill="#3f8650"/>
      <ellipse cx="50" cy="44" rx="14" ry="36" fill="#f6d743"/>
      ${Array.from({ length: 8 }, (_, r) => [-6, 0, 6].map((dx) => `<circle cx="${50 + dx}" cy="${16 + r * 7}" r="2.8" fill="#e9b923"/>`).join('')).join('')}
    `),

    yam: svg(`
      <path d="M12 58 C10 40 30 30 50 32 C70 34 90 42 90 54 C90 66 72 74 50 72 C30 70 14 72 12 58Z" fill="#8a5a3b"/>
      <ellipse cx="86" cy="54" rx="8" ry="12" fill="#f3e2c3"/>
      <ellipse cx="86" cy="54" rx="5" ry="8" fill="#f6efe4"/>
      ${[[30, 46], [44, 56], [58, 44], [70, 60], [24, 62]].map(([x, y]) => line(`M${x} ${y} l4 2`, 2, '#5a3a22')).join('')}
    `),

    wok: svg(`
      ${line('M40 30 Q36 20 40 12 M54 30 Q50 20 54 12', 2.5, '#b9c3d3')}
      <path d="M8 44 H84 C82 66 66 80 46 80 C26 80 10 66 8 44Z" fill="#3a3a4a"/>
      ${line('M84 48 L98 40', 6, '#a0703f')}
      <ellipse cx="46" cy="44" rx="38" ry="7" fill="#55566a"/>
      <circle cx="34" cy="42" r="5" fill="#ef6f6c"/><circle cx="48" cy="40" r="4" fill="#5aa469"/><circle cx="60" cy="43" r="5" fill="#f2b134"/>
      <rect x="40" y="44" width="10" height="3" rx="1.5" fill="#5aa469"/>
    `),

    kid: svg(`
      <rect x="38" y="74" width="9" height="18" rx="3" fill="#3d6fb5"/><rect x="53" y="74" width="9" height="18" rx="3" fill="#3d6fb5"/>
      <path d="M32 50 C32 44 38 42 50 42 C62 42 68 44 68 50 V78 H32Z" fill="#ef6f6c"/>
      ${line('M32 52 L22 66 M68 52 L78 66', 6, '#ef6f6c')}
      <circle cx="21" cy="68" r="4" fill="${SKIN}"/><circle cx="79" cy="68" r="4" fill="${SKIN}"/>
      <circle cx="50" cy="26" r="15" fill="${SKIN}"/>
      <path d="M35 24 C35 10 65 10 65 24 C60 18 52 16 46 18 C42 20 38 22 35 24Z" fill="#8a5a3b"/>
      ${dot(45, 27, 2.4)}${dot(55, 27, 2.4)}
      ${line('M46 33 Q50 36 54 33', 1.8, '#c94f4f')}
    `),

    nap: svg(`
      <rect x="10" y="62" width="80" height="22" rx="10" fill="#cfe8f3"/>
      <circle cx="34" cy="56" r="16" fill="${SKIN}"/>
      <path d="M18 54 C18 40 48 38 50 52 C42 46 30 46 18 54Z" fill="#8a5a3b"/>
      ${line('M28 58 Q31 61 34 58 M38 58 Q41 61 44 58', 2)}
      <path d="M48 62 H90 V72 C90 78 86 82 80 82 H48Z" fill="#5f63d0"/>
      <text x="64" y="40" font-family="Outfit, sans-serif" font-weight="700" font-size="14" fill="#7b7fe0">z</text>
      <text x="74" y="28" font-family="Outfit, sans-serif" font-weight="700" font-size="18" fill="#7b7fe0">z</text>
      <text x="86" y="14" font-family="Outfit, sans-serif" font-weight="700" font-size="22" fill="#7b7fe0">z</text>
    `),

    dig: svg(`
      <path d="M4 92 C14 70 40 62 60 70 C80 76 94 86 96 92Z" fill="#9a6a43"/>
      <circle cx="30" cy="80" r="2" fill="#73492b"/><circle cx="66" cy="84" r="2.5" fill="#73492b"/>
      ${line('M76 10 L56 58', 5, '#a0703f')}
      ${line('M70 10 H84', 5, '#a0703f')}
      <path d="M52 52 L66 58 L58 80 C54 84 46 82 44 76Z" fill="#9aa3b2"/>
    `),

    milk: svg(`
      <path d="M28 30 L36 14 H64 L72 30Z" fill="#e3f2f8"/>
      <rect x="44" y="8" width="12" height="8" rx="2" fill="#3d8bd4"/>
      <rect x="28" y="30" width="44" height="62" rx="3" fill="#f8f9fa"/>
      <path d="M28 52 C40 46 60 58 72 52 V92 H28Z" fill="#3d8bd4"/>
      <text x="50" y="74" text-anchor="middle" dominant-baseline="central" font-family="Outfit, sans-serif" font-weight="700" font-size="12" fill="#fff">MILK</text>
      <path d="M62 30 L72 30 V92 H64Z" fill="#000" opacity="0.06"/>
    `),

    belt: svg(`
      <rect x="4" y="40" width="92" height="20" rx="4" fill="#8a5a3b"/>
      ${[16, 26, 36].map((x) => `<circle cx="${x}" cy="50" r="2.5" fill="#5a3a22"/>`).join('')}
      <rect x="54" y="32" width="26" height="36" rx="5" fill="none" stroke="#f2b134" stroke-width="6"/>
      ${line('M58 50 H76', 4, '#c07a14')}
    `),

    desk: svg(`
      <rect x="10" y="40" width="80" height="10" rx="2" fill="#b5835a"/>
      <rect x="14" y="50" width="8" height="40" fill="#9a6a43"/>
      <rect x="58" y="50" width="28" height="40" fill="#9a6a43"/>
      <rect x="62" y="56" width="20" height="12" rx="1" fill="#b5835a"/><circle cx="72" cy="62" r="1.8" fill="#f2b134"/>
      <rect x="62" y="72" width="20" height="12" rx="1" fill="#b5835a"/><circle cx="72" cy="78" r="1.8" fill="#f2b134"/>
      <rect x="22" y="30" width="22" height="10" rx="1" fill="#5f63d0"/>
      <rect x="24" y="26" width="20" height="4" fill="#ef6f6c"/>
      ${line('M60 40 L66 18 L74 22', 3, '#5b6b85')}
      <path d="M70 16 L82 22 L76 30Z" fill="#f2b134"/>
    `),

    plum: svg(`
      <defs>${grad('p-plum', '#9b5de5', '#5e2f8f', 1, 1)}</defs>
      <circle cx="50" cy="56" r="34" fill="url(#p-plum)"/>
      ${line('M50 24 Q46 40 50 56', 2, '#5e2f8f')}
      ${shine(36, 44, 6, 11, 20)}
      ${line('M50 24 Q50 14 56 8', 4, '#6b4a2e')}
      <path d="M54 16 Q68 4 80 12 Q68 24 54 16Z" fill="#5aa469"/>
    `),

    twig: svg(`
      ${line('M12 84 L88 20 M40 60 L30 34 M62 42 L82 46 M70 34 L68 14', 5, '#8a5a3b')}
      <path d="M30 34 Q18 26 22 14 Q34 20 30 34Z M82 46 Q94 40 96 52 Q86 56 82 46Z M68 14 Q74 4 84 8 Q78 18 68 14Z" fill="#5aa469"/>
    `),

    slug: svg(`
      <path d="M8 76 C8 66 18 60 30 62 C40 50 64 48 76 56 C84 50 92 54 90 64 C92 72 88 80 80 80 H16 C10 80 8 78 8 76Z" fill="#c9a24e"/>
      <path d="M30 62 C40 50 64 48 76 56 C66 60 44 62 30 62Z" fill="#a8842e"/>
      ${line('M80 58 L84 40 M86 60 L94 44', 2.5, '#a8842e')}
      <circle cx="84" cy="38" r="3" fill="#a8842e"/><circle cx="95" cy="42" r="3" fill="#a8842e"/>
      ${dot(82, 66, 2.5)}
      ${shine(48, 68, 14, 3)}
    `),

    pond: svg(`
      <ellipse cx="50" cy="60" rx="44" ry="26" fill="#9cc8ac"/>
      <ellipse cx="50" cy="60" rx="38" ry="21" fill="#7fbde0"/>
      ${line('M28 56 Q36 52 44 56 M58 66 Q66 62 74 66', 2, '#cfe8f3')}
      <path d="M64 50 A10 6 0 1 1 64.1 50 L64 56Z" fill="#5aa469"/>
      <circle cx="32" cy="66" r="5" fill="#f497b6"/><circle cx="32" cy="66" r="2" fill="#f6d743"/>
      ${line('M14 44 V22 M20 42 V26 M86 44 V24', 2.5, '#5a7a3a')}
      <ellipse cx="14" cy="22" rx="2.5" ry="6" fill="#8a5a3b"/><ellipse cx="86" cy="24" rx="2.5" ry="6" fill="#8a5a3b"/>
    `),

    sand: svg(`
      <path d="M0 80 C30 72 70 72 100 80 V100 H0Z" fill="#f3d9a4"/>
      <rect x="26" y="50" width="44" height="30" fill="#e8c27a"/>
      <rect x="22" y="40" width="14" height="14" fill="#e8c27a"/><rect x="60" y="40" width="14" height="14" fill="#e8c27a"/>
      <rect x="40" y="34" width="16" height="20" fill="#e8c27a"/>
      ${[22, 28, 60, 66].map((x) => `<rect x="${x}" y="36" width="4" height="5" fill="#e8c27a"/>`).join('')}
      <path d="M42 80 V68 C42 62 54 62 54 68 V80Z" fill="#c9a24e"/>
      ${line('M48 34 V20', 2)}
      <path d="M48 20 L60 24 L48 28Z" fill="#ef6f6c"/>
      <path d="M78 66 H94 L90 86 H82Z" fill="#3d8bd4"/>
      ${line('M78 66 Q86 54 94 66', 2, '#235d96')}
    `),

    vest: svg(`
      <path d="M30 14 C34 26 42 30 50 30 C58 30 66 26 70 14 L84 22 C80 34 80 44 84 52 V90 H16 V52 C20 44 20 34 16 22Z" fill="#2a9d8f"/>
      <path d="M30 14 C34 26 42 30 50 30 C58 30 66 26 70 14 L64 12 C60 20 56 24 50 24 C44 24 40 20 36 12Z" fill="#1a6a60"/>
      ${line('M16 70 H84 M16 78 H84', 3, '#7fd3c6')}
    `),

    mint: svg(`
      ${line('M50 94 V40', 4, '#3f8650')}
      <path d="M50 70 C30 72 18 60 20 46 C34 46 46 54 50 70Z" fill="#5aa469"/>
      <path d="M50 70 C70 72 82 60 80 46 C66 46 54 54 50 70Z" fill="#6cbf5c"/>
      <path d="M50 46 C34 44 26 30 30 16 C44 20 52 30 50 46Z" fill="#6cbf5c"/>
      <path d="M50 46 C66 44 74 30 70 16 C56 20 48 30 50 46Z" fill="#5aa469"/>
      ${line('M50 70 L32 54 M50 70 L68 54 M50 46 L36 26 M50 46 L64 26', 1.5, '#3f8650')}
    `),
  };
})());
