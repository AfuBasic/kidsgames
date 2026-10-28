// More clue illustrations (mostly 3-letter words), same style and canvas as pictures.js.
Object.assign(PICTURES, (() => {
  const { INK, dot, line, grad, svg } = PICTURE_KIT;
  const wheel = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x}" cy="${y}" r="${r * 0.42}" fill="#d4d8de"/>`;
  const shine = (x, y, rx, ry, rot = 0) =>
    `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity="0.3" transform="rotate(${rot} ${x} ${y})"/>`;

  const webLines = (() => {
    const spokes = Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 8;
      return [Math.cos(a), Math.sin(a)];
    });
    const ring = (r) => `M${spokes.map(([x, y]) => `${50 + x * r} ${50 + y * r}`).join(' L')}Z`;
    return line(spokes.map(([x, y]) => `M50 50 L${50 + x * 44} ${50 + y * 44}`).join(' '), 1.6, '#7c8aa5')
      + line(`${ring(12)} ${ring(24)} ${ring(36)}`, 1.6, '#7c8aa5');
  })();

  const pips = [[30, 30], [30, 50], [30, 70], [70, 30], [70, 50], [70, 70]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${INK}"/>`).join('');

  return {
    bus: svg(`
      <rect x="6" y="24" width="88" height="52" rx="10" fill="#f2b134"/>
      <rect x="6" y="56" width="88" height="5" fill="#c07a14"/>
      <rect x="14" y="32" width="14" height="16" rx="2" fill="#cfe8f3"/>
      <rect x="32" y="32" width="14" height="16" rx="2" fill="#cfe8f3"/>
      <rect x="50" y="32" width="14" height="16" rx="2" fill="#cfe8f3"/>
      <rect x="70" y="32" width="16" height="38" rx="2" fill="#c07a14"/>
      <rect x="73" y="35" width="10" height="14" rx="1" fill="#cfe8f3"/>
      <rect x="88" y="64" width="6" height="5" rx="1" fill="#fff"/>
      ${wheel(26, 78)}${wheel(72, 78)}
    `),

    bed: svg(`
      <rect x="8" y="30" width="10" height="56" rx="3" fill="#9a6a43"/>
      <rect x="82" y="52" width="10" height="34" rx="3" fill="#9a6a43"/>
      <rect x="8" y="62" width="84" height="12" rx="2" fill="#9a6a43"/>
      <rect x="18" y="52" width="70" height="12" rx="3" fill="#f3f4f6"/>
      <ellipse cx="30" cy="50" rx="11" ry="6" fill="#fff" stroke="#d4d8de" stroke-width="1.5"/>
      <path d="M42 48 H88 V66 H42 C40 60 40 54 42 48Z" fill="#5f63d0"/>
      ${line('M50 54 H84 M50 60 H84', 1.6, '#8f92e3')}
    `),

    bag: svg(`
      ${line('M36 40 C36 18 64 18 64 40', 5, '#b03f45')}
      <path d="M18 40 H82 L88 90 H12Z" fill="#ef6f6c"/>
      <path d="M68 40 H82 L88 90 H74Z" fill="#000" opacity="0.08"/>
      <rect x="40" y="56" width="20" height="10" rx="2" fill="#f7d9e0"/>
    `),

    box: svg(`
      <path d="M14 42 L32 30 H88 L70 42Z" fill="#e8b77c"/>
      <path d="M70 42 L88 30 V78 L70 90Z" fill="#b5835a"/>
      <rect x="14" y="42" width="56" height="48" fill="#d39a5b"/>
      <rect x="36" y="42" width="12" height="20" fill="#f3e2c3"/>
      <path d="M41 30 H55 L48 42 H36Z" fill="#f3e2c3"/>
    `),

    bat: svg(`
      <path d="M42 50 C32 34 14 32 4 44 C12 46 14 54 12 62 C18 56 24 58 26 66 C30 58 36 58 42 62Z" fill="#3a3550"/>
      <path d="M58 50 C68 34 86 32 96 44 C88 46 86 54 88 62 C82 56 76 58 74 66 C70 58 64 58 58 62Z" fill="#3a3550"/>
      <path d="M40 38 L42 26 L48 36 H52 L58 26 L60 38Z" fill="#4a4466"/>
      <ellipse cx="50" cy="54" rx="11" ry="17" fill="#4a4466"/>
      <circle cx="45" cy="44" r="2.6" fill="#fff"/><circle cx="55" cy="44" r="2.6" fill="#fff"/>
    `),

    bun: svg(`
      <rect x="12" y="66" width="76" height="16" rx="8" fill="#c97f3a"/>
      <path d="M12 70 C12 34 88 34 88 70Z" fill="#e3a35a"/>
      ${shine(30, 50, 8, 4, -25)}
      ${[[34, 46], [50, 42], [64, 48], [44, 56], [58, 58], [72, 60], [28, 60]]
        .map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.8" ry="1.6" fill="#fbf3e8" transform="rotate(30 ${x} ${y})"/>`).join('')}
    `),

    cap: svg(`
      <path d="M58 64 H94 C94 74 68 76 58 70Z" fill="#235d96"/>
      <path d="M16 66 C16 30 76 30 76 66Z" fill="#3d8bd4"/>
      ${line('M46 34 L46 66', 1.8, '#235d96')}
      <circle cx="46" cy="33" r="4" fill="#235d96"/>
      ${shine(30, 48, 5, 10, 20)}
    `),

    can: svg(`
      <rect x="26" y="20" width="48" height="68" rx="4" fill="#b9c3d3"/>
      <ellipse cx="50" cy="20" rx="24" ry="6" fill="#d4d8de" stroke="#9aa3b2" stroke-width="2"/>
      <rect x="26" y="36" width="48" height="36" fill="#ef6f6c"/>
      <circle cx="50" cy="54" r="10" fill="#f6d743"/>
      ${line('M26 30 H74 M26 80 H74', 1.6, '#9aa3b2')}
    `),

    fan: svg(`
      ${line('M50 66 V86', 6, '#9aa3b2')}
      <ellipse cx="50" cy="88" rx="22" ry="6" fill="#5b6b85"/>
      <circle cx="50" cy="40" r="30" fill="#eef4f9" stroke="#9aa3b2" stroke-width="3"/>
      ${[0, 120, 240].map((r) => `<ellipse cx="50" cy="24" rx="8" ry="15" fill="#3d8bd4" transform="rotate(${r} 50 40)"/>`).join('')}
      <circle cx="50" cy="40" r="6" fill="#5b6b85"/>
    `),

    fox: svg(`
      <path d="M14 22 L34 34 L50 30 L66 34 L86 22 L78 60 L50 88 L22 60Z" fill="#e8743a"/>
      <path d="M20 28 L30 34 L26 44Z M80 28 L70 34 L74 44Z" fill="${INK}"/>
      <path d="M22 56 C32 62 42 64 50 88 C58 64 68 62 78 56 L78 60 L50 88 L22 60Z" fill="#fbf3e8"/>
      ${dot(38, 52)}${dot(62, 52)}
      <ellipse cx="50" cy="82" rx="5" ry="4" fill="${INK}"/>
    `),

    fig: svg(`
      <path d="M50 16 C56 16 58 28 66 38 C82 54 80 90 50 90 C20 90 18 54 34 38 C42 28 44 16 50 16Z" fill="#7a4a8a"/>
      <path d="M62 36 C80 52 78 86 52 90 C68 80 72 56 62 36Z" fill="#000" opacity="0.12"/>
      ${shine(36, 58, 5, 11, 15)}
      ${line('M50 18 Q50 8 56 4', 4, '#5a7a3a')}
    `),

    hat: svg(`
      <ellipse cx="50" cy="76" rx="42" ry="9" fill="#2c3a55"/>
      <path d="M28 76 V26 C28 20 72 20 72 26 V76Z" fill="#3a4a66"/>
      <rect x="28" y="58" width="44" height="9" fill="#ef6f6c"/>
      <path d="M60 22 C72 22 72 26 72 26 V76 H62 C66 56 66 34 60 22Z" fill="#000" opacity="0.12"/>
    `),

    hen: svg(`
      ${line('M40 86 V94 M54 86 V94', 3, '#f2a93b')}
      <path d="M18 58 C18 40 34 36 46 44 C50 30 62 22 72 30 C80 38 76 52 74 58 C80 74 64 88 46 88 C30 88 18 76 18 58Z" fill="#f8f9fa"/>
      <path d="M64 26 C64 16 70 14 72 20 C74 14 80 16 78 26Z" fill="#e63946"/>
      <path d="M78 36 L90 40 L78 44Z" fill="#f2a93b"/>
      <path d="M76 46 C80 46 80 54 76 54Z" fill="#e63946"/>
      ${dot(70, 36, 2.8)}
      <path d="M30 60 C40 52 56 56 60 66 C50 76 36 74 30 60Z" fill="#e2e5ea"/>
    `),

    jam: svg(`
      <rect x="26" y="14" width="48" height="14" rx="3" fill="#f3f4f6"/>
      ${[32, 44, 56, 68].map((x) => `<circle cx="${x}" cy="21" r="3" fill="#ef6f6c"/>`).join('')}
      <rect x="22" y="28" width="56" height="62" rx="10" fill="#b03f45"/>
      <rect x="30" y="48" width="40" height="24" rx="3" fill="#fbf3e8"/>
      <path d="M50 52 C58 52 60 62 50 68 C40 62 42 52 50 52Z" fill="#e63946"/>
      ${shine(30, 40, 3, 8)}
    `),

    jet: svg(`
      <path d="M46 52 L64 52 L40 84 H32Z" fill="#3d8bd4"/>
      <path d="M14 50 L6 28 H16 L28 48Z" fill="#3d8bd4"/>
      <path d="M8 54 C8 46 20 46 30 46 H80 C90 46 96 50 96 54 C96 58 90 62 80 62 H20 C12 62 8 60 8 54Z" fill="#f3f4f6"/>
      <path d="M82 47 C88 47 93 49 95 52 H82Z" fill="#3d6fb5"/>
      ${[36, 46, 56, 66, 74].map((x) => `<circle cx="${x}" cy="53" r="2.6" fill="#3d6fb5"/>`).join('')}
      <path d="M46 56 L60 56 L52 40 H46Z" fill="#235d96"/>
    `),

    jug: svg(`
      <path d="M70 40 C90 42 90 70 70 72" fill="none" stroke="#235d96" stroke-width="6"/>
      <path d="M32 24 H66 L70 38 C78 52 76 80 66 90 H32 C22 80 20 52 28 38Z" fill="#3d8bd4"/>
      <path d="M32 24 L18 20 L28 36Z" fill="#3d8bd4"/>
      <path d="M58 30 H66 L70 38 C78 52 76 80 66 90 H58 C66 74 68 48 58 30Z" fill="#000" opacity="0.1"/>
      ${shine(34, 54, 4, 12)}
    `),

    leg: svg(`
      <rect x="36" y="6" width="26" height="22" rx="4" fill="#3d8bd4"/>
      <path d="M40 28 H58 V58 C58 64 60 68 66 70 L80 74 C88 76 88 90 80 90 H46 C42 90 40 86 40 82Z" fill="#f1d3b3"/>
      <path d="M40 66 H62 C62 70 66 72 70 72 L80 74 C88 76 88 90 80 90 H46 C42 90 40 86 40 82Z" fill="#ef6f6c"/>
      <rect x="40" y="86" width="48" height="5" rx="2" fill="#f3f4f6"/>
    `),

    lid: svg(`
      <path d="M12 64 C12 36 88 36 88 64Z" fill="#b9c3d3"/>
      <ellipse cx="50" cy="64" rx="40" ry="7" fill="#9aa3b2"/>
      <rect x="40" y="30" width="20" height="10" rx="5" fill="${INK}"/>
      ${shine(32, 50, 10, 4, -20)}
    `),

    log: svg(`
      <rect x="12" y="36" width="70" height="42" rx="8" fill="#9a6a43"/>
      ${line('M20 46 H50 M26 58 H64 M18 68 H44', 2.5, '#73492b')}
      <ellipse cx="80" cy="57" rx="13" ry="21" fill="#e3b77c"/>
      <ellipse cx="80" cy="57" rx="8" ry="13" fill="none" stroke="#b5835a" stroke-width="2"/>
      <ellipse cx="80" cy="57" rx="3" ry="5" fill="#b5835a"/>
      <path d="M40 36 C40 28 50 26 52 32" fill="none" stroke="#5aa469" stroke-width="3" stroke-linecap="round"/>
    `),

    map: svg(`
      <path d="M8 24 L36 16 L64 24 L92 16 V76 L64 84 L36 76 L8 84Z" fill="#efe2c4"/>
      <path d="M36 16 L64 24 V84 L36 76Z" fill="#e2d2ae"/>
      <path d="M16 36 C24 28 32 34 30 44 C28 52 18 50 16 36Z M70 52 C78 46 86 50 84 60 C80 68 70 64 70 52Z" fill="#9cc8ac"/>
      ${line('M20 66 Q36 46 50 54 Q62 62 74 36', 2.5, '#ef6f6c').replace('stroke-linecap', 'stroke-dasharray="4 5" stroke-linecap')}
      ${line('M70 30 L78 38 M78 30 L70 38', 3, '#b03f45')}
    `),

    mop: svg(`
      ${line('M76 6 L50 62', 5, '#a0703f')}
      <rect x="36" y="58" width="28" height="10" rx="3" fill="#5b6b85" transform="rotate(25 50 63)"/>
      ${line('M38 68 L24 92 M43 70 L34 94 M48 72 L44 95 M53 74 L54 95 M58 74 L64 93 M62 72 L72 90', 5, '#d4d8de')}
    `),

    pan: svg(`
      ${line('M66 52 L96 38', 8, '#3a3a4a')}
      <circle cx="38" cy="58" r="30" fill="#3a3a4a"/>
      <circle cx="38" cy="58" r="23" fill="#55566a"/>
      ${shine(28, 48, 8, 4, -30)}
    `),

    pen: svg(`
      <path d="M24 78 L72 30 L82 40 L34 88Z" fill="#3d8bd4"/>
      <path d="M58 44 L72 30 L82 40 L68 54Z" fill="#235d96"/>
      ${line('M66 40 L80 26', 2.5, '#9aa3b2')}
      <path d="M24 78 L34 88 L14 96Z" fill="#d4d8de"/>
      <path d="M14 96 L17 89 L21 93Z" fill="${INK}"/>
    `),

    pin: svg(`
      ${line('M48 54 L26 94', 3.5, '#9aa3b2')}
      <path d="M40 46 L62 58 L58 64 L36 52Z" fill="#b03f45"/>
      <circle cx="58" cy="34" r="20" fill="#ef6f6c"/>
      ${shine(50, 26, 5, 7, -30)}
    `),

    pot: svg(`
      <path d="M50 46 C40 30 30 26 22 30 C28 40 40 44 50 46Z" fill="#5aa469"/>
      <path d="M50 46 C58 26 70 20 80 22 C74 36 62 44 50 46Z" fill="#3f8650"/>
      ${line('M50 46 V30', 3, '#3f8650')}
      <path d="M50 30 C44 22 46 12 52 10 C56 16 56 24 50 30Z" fill="#5aa469"/>
      <rect x="20" y="46" width="60" height="12" rx="3" fill="#c0603a"/>
      <path d="M24 58 H76 L68 92 H32Z" fill="#d0724a"/>
      <path d="M62 58 H76 L68 92 H58Z" fill="#000" opacity="0.08"/>
    `),

    rat: svg(`
      ${line('M86 72 Q100 80 92 92 Q84 98 70 94', 2.5, '#8e7b6b')}
      <path d="M8 66 C18 46 40 42 60 44 C80 46 90 58 88 72 C86 82 70 86 50 86 C30 86 14 80 8 66Z" fill="#8d7b6b"/>
      <circle cx="40" cy="42" r="10" fill="#8d7b6b"/><circle cx="40" cy="42" r="5" fill="#f1c6cf"/>
      ${dot(26, 58, 3)}
      <circle cx="8" cy="66" r="3.5" fill="#e48a9d"/>
      ${line('M12 68 L0 72 M12 64 L0 60', 1.4, '#4a5568')}
    `),

    rug: svg(`
      ${line('M14 32 H8 M14 42 H8 M14 52 H8 M14 62 H8 M14 72 H8 M86 32 H92 M86 42 H92 M86 52 H92 M86 62 H92 M86 72 H92', 2, '#c9a24e')}
      <rect x="14" y="26" width="72" height="52" rx="3" fill="#c2569a"/>
      <rect x="20" y="32" width="60" height="40" rx="2" fill="none" stroke="#f2b134" stroke-width="3"/>
      <path d="M50 38 L64 52 L50 66 L36 52Z" fill="#f2b134"/>
      <path d="M50 46 L56 52 L50 58 L44 52Z" fill="#c2569a"/>
    `),

    tap: svg(`
      <rect x="6" y="30" width="34" height="12" rx="2" fill="#9aa3b2"/>
      <path d="M36 28 H64 C72 28 78 34 78 42 V56 H66 V44 C66 42 64 42 62 42 H36Z" fill="#b9c3d3"/>
      <rect x="46" y="16" width="10" height="12" fill="#9aa3b2"/>
      <rect x="36" y="10" width="30" height="7" rx="3" fill="#5b6b85"/>
      <path d="M72 64 C72 64 79 74 79 79 A7 7 0 0 1 65 79 C65 74 72 64 72 64Z" fill="#3d8bd4"/>
    `),

    tub: svg(`
      ${[[28, 36, 7], [40, 30, 9], [54, 34, 7], [66, 30, 8], [78, 37, 6]]
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#a8c8d8" stroke-width="1.5"/>`).join('')}
      <path d="M10 44 H90 V54 C90 72 76 80 62 80 H38 C24 80 10 72 10 54Z" fill="#f3f4f6" stroke="#cfd6df" stroke-width="2"/>
      <rect x="6" y="40" width="88" height="7" rx="3" fill="#dfe5ec"/>
      <rect x="22" y="78" width="6" height="12" rx="2" fill="#9aa3b2"/><rect x="72" y="78" width="6" height="12" rx="2" fill="#9aa3b2"/>
    `),

    van: svg(`
      <path d="M6 72 V32 C6 28 10 24 14 24 H62 C66 24 70 26 72 30 L84 48 C90 50 94 54 94 62 V72Z" fill="#3d8bd4"/>
      <path d="M64 30 H68 L78 48 H64Z" fill="#cfe8f3"/>
      <rect x="14" y="32" width="42" height="16" rx="2" fill="#cfe8f3"/>
      <rect x="6" y="58" width="88" height="5" fill="#235d96"/>
      <rect x="88" y="52" width="6" height="5" rx="1" fill="#f6d743"/>
      ${wheel(26, 74)}${wheel(74, 74)}
    `),

    web: svg(`
      ${webLines}
      ${line('M70 6 L70 24', 1.4)}
      <circle cx="70" cy="28" r="5" fill="${INK}"/>
      ${line('M66 25 L60 22 M66 28 L59 28 M66 31 L60 34 M74 25 L80 22 M74 28 L81 28 M74 31 L80 34', 1.4)}
    `),

    wig: svg(`
      <rect x="44" y="78" width="12" height="10" fill="#9aa3b2"/>
      <ellipse cx="50" cy="92" rx="20" ry="4" fill="#5b6b85"/>
      <ellipse cx="50" cy="54" rx="20" ry="25" fill="#e9dcc3"/>
      ${[[30, 30], [42, 22], [56, 22], [68, 30], [24, 44], [76, 44], [22, 58], [78, 58], [26, 72], [74, 72], [36, 28], [62, 26]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#f2b134"/>`).join('')}
      ${[[32, 32], [50, 24], [66, 32], [24, 54], [76, 54]]
        .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#c07a14" opacity="0.5"/>`).join('')}
    `),

    yak: svg(`
      <path d="M30 30 C14 32 6 22 10 10 C14 20 22 22 32 22Z M70 30 C86 32 94 22 90 10 C86 20 78 22 68 22Z" fill="#f3e9d6"/>
      <path d="M50 18 C72 18 78 34 76 54 C74 72 66 84 50 84 C34 84 26 72 24 54 C22 34 28 18 50 18Z" fill="#5a3e36"/>
      <path d="M24 48 L18 92 L28 80 L32 94 L40 82 L46 94 L50 84 L54 94 L60 82 L68 94 L72 80 L82 92 L76 48Z" fill="#4a322b"/>
      <ellipse cx="50" cy="66" rx="13" ry="10" fill="#8a6a5a"/>
      <ellipse cx="45" cy="66" rx="2" ry="3" fill="${INK}"/><ellipse cx="55" cy="66" rx="2" ry="3" fill="${INK}"/>
      <circle cx="39" cy="44" r="3.2" fill="#fff"/><circle cx="61" cy="44" r="3.2" fill="#fff"/>
      ${dot(39, 44, 1.8)}${dot(61, 44, 1.8)}
    `),

    zip: svg(`
      <rect x="28" y="6" width="18" height="88" fill="#5f63d0"/>
      <rect x="54" y="6" width="18" height="88" fill="#5f63d0"/>
      ${Array.from({ length: 11 }, (_, i) => `<rect x="${i % 2 ? 49 : 43}" y="${8 + i * 8}" width="8" height="5" rx="1" fill="#d4d8de"/>`).join('')}
      <rect x="40" y="40" width="20" height="14" rx="3" fill="#9aa3b2"/>
      <rect x="45" y="54" width="10" height="20" rx="5" fill="#b9c3d3"/>
      <rect x="48" y="60" width="4" height="8" rx="2" fill="#5f63d0"/>
    `),

    bug: svg(`
      ${line('M26 50 L12 42 M24 64 L10 66 M30 78 L18 88 M74 50 L88 42 M76 64 L90 66 M70 78 L82 88', 3)}
      ${line('M44 18 Q40 6 32 6 M56 18 Q60 6 68 6', 2.5)}
      <circle cx="50" cy="26" r="12" fill="${INK}"/>
      <ellipse cx="50" cy="60" rx="26" ry="32" fill="#2a9d8f"/>
      <path d="M50 28 L50 92" stroke="#1a6a60" stroke-width="3"/>
      <ellipse cx="38" cy="46" rx="5" ry="10" fill="#fff" opacity="0.25" transform="rotate(15 38 46)"/>
    `),

    egg: svg(`
      <ellipse cx="50" cy="44" rx="22" ry="29" fill="#f9f1e3"/>
      <path d="M62 22 C74 36 74 58 62 70 C66 56 66 36 62 22Z" fill="#000" opacity="0.05"/>
      ${shine(42, 30, 4, 8, 15)}
      <path d="M26 60 H74 C74 76 64 84 50 84 C36 84 26 76 26 60Z" fill="#ef6f6c"/>
      <rect x="40" y="82" width="20" height="6" fill="#b03f45"/>
      <ellipse cx="50" cy="90" rx="18" ry="4" fill="#b03f45"/>
    `),

    hut: svg(`
      <rect x="22" y="50" width="56" height="40" fill="#d39a5b"/>
      ${line('M22 62 H78 M22 74 H78', 2, '#b5835a')}
      <path d="M38 90 V70 C38 62 52 62 52 70 V90Z" fill="#73492b"/>
      <path d="M8 56 L50 14 L92 56Z" fill="#d8b45a"/>
      ${line('M50 16 L30 56 M50 16 L42 56 M50 16 L58 56 M50 16 L70 56', 1.6, '#b8923a')}
      <rect x="60" y="64" width="10" height="10" fill="#73492b"/>
    `),

    ten: svg(`
      <text x="50" y="52" text-anchor="middle" dominant-baseline="central" font-family="Outfit, sans-serif" font-weight="700" font-size="58" fill="#5f63d0">10</text>
      ${Array.from({ length: 10 }, (_, i) => `<circle cx="${14 + i * 8}" cy="90" r="3" fill="#f2b134"/>`).join('')}
    `),

    six: svg(`
      <rect x="14" y="14" width="72" height="72" rx="14" fill="#f8f9fa" stroke="#d4d8de" stroke-width="2"/>
      <path d="M70 16 H72 C80 16 86 22 86 30 V72 C86 80 80 86 72 86 H30 C60 80 72 50 70 16Z" fill="#000" opacity="0.05"/>
      ${pips}
    `),

    peg: svg(`
      <rect x="38" y="8" width="11" height="84" rx="5" fill="#d39a5b"/>
      <rect x="51" y="8" width="11" height="84" rx="5" fill="#c08648"/>
      <rect x="34" y="40" width="32" height="12" rx="6" fill="#9aa3b2"/>
      ${line('M38 46 H62', 2, '#5b6b85')}
    `),

    cot: svg(`
      <rect x="10" y="20" width="8" height="70" rx="3" fill="#9a6a43"/>
      <rect x="82" y="20" width="8" height="70" rx="3" fill="#9a6a43"/>
      <rect x="18" y="58" width="64" height="12" rx="2" fill="#f3f4f6"/>
      <path d="M40 54 H82 V66 H40Z" fill="#f2b134"/>
      ${line('M10 28 H90 M10 76 H90', 4, '#9a6a43')}
      ${line('M26 28 V76 M36 28 V76 M46 28 V76 M56 28 V76 M66 28 V76 M76 28 V76', 2.5, '#b5835a')}
    `),

    bin: svg(`
      <rect x="18" y="20" width="64" height="10" rx="3" fill="#3f8650"/>
      <rect x="42" y="14" width="16" height="6" rx="3" fill="#3f8650"/>
      <path d="M22 30 H78 L72 92 H28Z" fill="#5aa469"/>
      ${line('M38 40 L40 82 M50 40 V82 M62 40 L60 82', 3, '#3f8650')}
    `),

    pup: svg(`
      <path d="M24 30 C10 32 8 52 14 66 C24 64 28 50 30 40Z" fill="#c48a58"/>
      <path d="M76 30 C90 32 92 52 86 66 C76 64 72 50 70 40Z" fill="#c48a58"/>
      <circle cx="50" cy="54" r="30" fill="#f1dfc6"/>
      <path d="M58 30 C72 32 78 44 74 54 C66 52 58 44 58 30Z" fill="#c48a58"/>
      <ellipse cx="50" cy="66" rx="7" ry="5" fill="${INK}"/>
      ${line('M50 70 V74 M44 77 Q50 81 56 77', 2.2)}
      ${dot(39, 50, 4)}${dot(63, 48, 4)}
      <path d="M48 78 Q50 88 54 78Z" fill="#ff6b81"/>
    `),

    frog: svg(`
      <ellipse cx="50" cy="62" rx="38" ry="26" fill="#5aa469"/>
      <circle cx="30" cy="38" r="13" fill="#5aa469"/><circle cx="70" cy="38" r="13" fill="#5aa469"/>
      <circle cx="30" cy="36" r="8" fill="#fff"/><circle cx="70" cy="36" r="8" fill="#fff"/>
      ${dot(31, 37, 4.5)}${dot(69, 37, 4.5)}
      ${line('M26 66 Q50 80 74 66', 3, '#2f6b3d')}
      <ellipse cx="50" cy="78" rx="20" ry="8" fill="#a9cf94"/>
    `),

    fish: svg(`
      <path d="M72 50 L94 30 V70Z" fill="#e06a1f"/>
      <path d="M12 50 C28 24 62 24 76 50 C62 76 28 76 12 50Z" fill="#f2893b"/>
      <path d="M40 30 C46 20 56 22 58 30Z" fill="#e06a1f"/>
      ${line('M44 34 C40 44 40 56 44 66 M56 36 C52 44 52 56 56 64', 3, '#fbe3c8')}
      <circle cx="26" cy="46" r="5" fill="#fff"/>${dot(27, 46, 2.6)}
    `),

    ship: svg(`
      <rect x="46" y="22" width="12" height="20" fill="#22314d"/>
      <rect x="46" y="22" width="12" height="6" fill="#ef6f6c"/>
      <rect x="26" y="40" width="48" height="22" rx="2" fill="#f3f4f6"/>
      ${[36, 50, 64].map((x) => `<circle cx="${x}" cy="51" r="4" fill="#3d8bd4"/>`).join('')}
      <path d="M6 62 H94 L80 86 H20Z" fill="#ef6f6c"/>
      <rect x="10" y="62" width="80" height="5" fill="#b03f45"/>
      ${line('M4 92 Q14 86 24 92 T44 92 T64 92 T84 92 T100 92', 3, '#7fbde0')}
    `),

    crab: svg(`
      ${line('M28 66 L12 76 M30 72 L18 86 M72 66 L88 76 M70 72 L82 86', 3.5, '#b03f45')}
      ${line('M34 52 L22 40 M66 52 L78 40 M42 46 L40 34 M58 46 L60 34', 3.5, '#b03f45')}
      <path d="M8 34 C8 20 30 18 30 32 L22 32 L26 40 C16 44 8 42 8 34Z" fill="#e8524f"/>
      <path d="M92 34 C92 20 70 18 70 32 L78 32 L74 40 C84 44 92 42 92 34Z" fill="#e8524f"/>
      <ellipse cx="50" cy="62" rx="28" ry="18" fill="#e8524f"/>
      <circle cx="40" cy="32" r="4.5" fill="#fff"/><circle cx="60" cy="32" r="4.5" fill="#fff"/>
      ${dot(40, 32, 2.4)}${dot(60, 32, 2.4)}
      ${shine(40, 54, 8, 3, -10)}
    `),

    flag: svg(`
      ${line('M22 8 V94', 4, '#5b6b85')}
      <circle cx="22" cy="7" r="4" fill="#f2b134"/>
      <path d="M24 12 C38 6 50 18 64 12 C72 9 80 10 88 12 V50 C80 48 72 47 64 50 C50 56 38 44 24 50Z" fill="#ef6f6c"/>
      <path d="M24 24 C38 18 50 30 64 24 C72 21 80 22 88 24 V36 C80 34 72 33 64 36 C50 42 38 30 24 36Z" fill="#fbf3e8"/>
    `),

    lamp: svg(`
      <circle cx="50" cy="48" r="40" fill="#ffe7a3" opacity="0.35"/>
      <rect x="47" y="48" width="6" height="34" fill="#5b6b85"/>
      <ellipse cx="50" cy="86" rx="20" ry="6" fill="#3a4a66"/>
      <path d="M30 14 H70 L84 50 H16Z" fill="#f2b134"/>
      <path d="M58 14 H70 L84 50 H70Z" fill="#000" opacity="0.08"/>
    `),

    hand: svg(`
      <rect x="28" y="16" width="11" height="40" rx="5.5" fill="#f1d3b3"/>
      <rect x="41" y="8" width="11" height="46" rx="5.5" fill="#f1d3b3"/>
      <rect x="54" y="12" width="11" height="44" rx="5.5" fill="#f1d3b3"/>
      <rect x="67" y="22" width="10" height="36" rx="5" fill="#f1d3b3"/>
      <rect x="10" y="44" width="12" height="32" rx="6" fill="#f1d3b3" transform="rotate(-40 16 60)"/>
      <path d="M28 44 H77 V70 C77 84 66 92 52 92 C38 92 28 84 28 70Z" fill="#f1d3b3"/>
      ${line('M40 70 Q52 76 64 70', 2, '#d9b48f')}
    `),

    bell: svg(`
      <circle cx="50" cy="12" r="6" fill="none" stroke="#c07a14" stroke-width="3"/>
      <path d="M50 16 C30 16 26 36 26 52 C26 64 18 70 12 74 H88 C82 70 74 64 74 52 C74 36 70 16 50 16Z" fill="#f2b134"/>
      <path d="M58 18 C70 22 74 36 74 52 C74 64 82 70 88 74 H70 C66 60 68 34 58 18Z" fill="#000" opacity="0.08"/>
      <rect x="12" y="72" width="76" height="6" rx="3" fill="#c07a14"/>
      <circle cx="50" cy="84" r="7" fill="#c07a14"/>
      ${shine(38, 40, 4, 12, 10)}
    `),

    ball: svg(`
      <circle cx="50" cy="50" r="38" fill="#ef6f6c"/>
      <path d="M50 12 C34 26 30 74 50 88 C38 88 14 72 12 50 C12 30 30 14 50 12Z" fill="#3d8bd4"/>
      <path d="M50 12 C66 26 70 74 50 88 C62 88 86 72 88 50 C88 30 70 14 50 12Z" fill="#f6d743"/>
      <path d="M50 12 C42 30 42 70 50 88 C58 70 58 30 50 12Z" fill="#fff"/>
      ${shine(34, 30, 6, 10, -30)}
    `),

    rocket: svg(`
      <path d="M40 76 C40 88 50 98 50 98 C50 98 60 88 60 76Z" fill="#f2893b"/>
      <path d="M44 76 C44 84 50 90 50 90 C50 90 56 84 56 76Z" fill="#f6d743"/>
      <path d="M32 54 L18 76 L34 72Z M68 54 L82 76 L66 72Z" fill="#ef6f6c"/>
      <path d="M50 4 C66 16 70 40 68 76 H32 C30 40 34 16 50 4Z" fill="#f3f4f6"/>
      <path d="M50 4 C58 10 62 18 64 26 H36 C38 18 42 10 50 4Z" fill="#ef6f6c"/>
      <circle cx="50" cy="44" r="10" fill="#3d8bd4" stroke="#9aa3b2" stroke-width="3"/>
      ${shine(46, 40, 3, 5, -30)}
    `),

    robot: svg(`
      ${line('M50 18 V8', 3, '#5b6b85')}
      <circle cx="50" cy="7" r="4" fill="#ef6f6c"/>
      <rect x="26" y="18" width="48" height="34" rx="8" fill="#9aa3b2"/>
      <circle cx="40" cy="34" r="6" fill="#7fe0e8"/><circle cx="60" cy="34" r="6" fill="#7fe0e8"/>
      <rect x="40" y="44" width="20" height="4" rx="2" fill="${INK}"/>
      <rect x="44" y="52" width="12" height="6" fill="#5b6b85"/>
      <rect x="22" y="58" width="56" height="34" rx="6" fill="#b9c3d3"/>
      <circle cx="40" cy="72" r="4" fill="#f2b134"/><circle cx="52" cy="72" r="4" fill="#2a9d8f"/>
      <rect x="36" y="82" width="28" height="4" rx="2" fill="#9aa3b2"/>
      ${line('M22 66 L10 78 M78 66 L90 78', 5, '#9aa3b2')}
    `),

    rabbit: svg(`
      <ellipse cx="38" cy="26" rx="8" ry="22" fill="#e9e4ec"/><ellipse cx="38" cy="26" rx="4" ry="16" fill="#f1c6cf"/>
      <ellipse cx="62" cy="26" rx="8" ry="22" fill="#e9e4ec"/><ellipse cx="62" cy="26" rx="4" ry="16" fill="#f1c6cf"/>
      <circle cx="50" cy="62" r="28" fill="#f3f0f5"/>
      ${dot(40, 56)}${dot(60, 56)}
      <path d="M46 66 L54 66 L50 70Z" fill="#e48a9d"/>
      <rect x="46" y="72" width="8" height="7" rx="1" fill="#fff" stroke="#d4d8de" stroke-width="1"/>
      ${line('M34 66 L18 62 M34 70 L18 72 M66 66 L82 62 M66 70 L82 72', 1.4, '#9aa3b2')}
    `),

    lemon: svg(`
      <path d="M12 52 C14 46 18 44 22 42 C30 26 70 26 78 42 C82 44 86 46 88 52 C86 58 82 60 78 62 C70 78 30 78 22 62 C18 60 14 58 12 52Z" fill="#f6d743"/>
      <path d="M60 30 C74 34 80 46 78 62 C70 76 54 78 46 76 C64 70 70 50 60 30Z" fill="#000" opacity="0.06"/>
      ${shine(36, 42, 8, 4, -15)}
      <path d="M50 30 Q60 16 74 18 Q66 32 50 30Z" fill="#5aa469"/>
    `),

    carrot: svg(`
      <path d="M50 30 C42 18 34 14 26 16 C32 24 40 28 50 30Z" fill="#5aa469"/>
      <path d="M50 30 C50 16 56 8 62 6 C62 16 58 24 50 30Z" fill="#3f8650"/>
      <path d="M50 30 C58 18 68 16 76 18 C70 26 60 30 50 30Z" fill="#5aa469"/>
      <path d="M34 30 H66 C66 50 56 78 50 94 C44 78 34 50 34 30Z" fill="#f2893b"/>
      ${line('M38 42 H46 M54 52 H62 M42 62 H48 M52 72 H57', 2.5, '#d4691f')}
    `),

    banana: svg(`
      <path d="M14 26 C18 70 58 92 90 66 C84 64 80 62 78 58 C58 72 32 62 24 24Z" fill="#f6d743"/>
      <path d="M78 58 C58 72 32 62 24 24 L20 25 C24 56 50 76 78 62Z" fill="#000" opacity="0.07"/>
      <path d="M14 26 L12 16 L22 14 L24 24Z" fill="#8a6a3a"/>
      <path d="M86 66 L94 64 L92 70Z" fill="#5a4a2a"/>
    `),

    zebra: svg(`
      <path d="M32 24 L28 8 L42 18Z M68 24 L72 8 L58 18Z" fill="#f3f4f6" stroke="${INK}" stroke-width="2"/>
      <ellipse cx="50" cy="50" rx="23" ry="36" fill="#f8f9fa"/>
      ${line('M28 38 L40 42 M27 50 L40 52 M30 62 L42 62 M72 38 L60 42 M73 50 L60 52 M70 62 L58 62 M44 16 L50 30 L56 16', 4)}
      <ellipse cx="50" cy="76" rx="16" ry="11" fill="#4a5568"/>
      <ellipse cx="44" cy="76" rx="2" ry="3" fill="${INK}"/><ellipse cx="56" cy="76" rx="2" ry="3" fill="${INK}"/>
      ${dot(38, 46)}${dot(62, 46)}
      <path d="M40 10 L44 16 L48 8 L52 16 L56 8 L60 16" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    `),

    umbrella: svg(`
      ${line('M50 50 V84 C50 92 40 92 40 86', 4, '#5b6b85')}
      <path d="M8 50 C8 22 92 22 92 50 C84 44 76 44 71 50 C64 44 56 44 50 50 C44 44 36 44 29 50 C24 44 16 44 8 50Z" fill="#5f63d0"/>
      <path d="M29 50 C34 30 42 24 50 24 C42 30 38 40 36 47 C34 46 31 47 29 50Z M71 50 C66 30 58 24 50 24 C58 30 62 40 64 47 C66 46 69 47 71 50Z" fill="#8f92e3"/>
      <circle cx="50" cy="22" r="3" fill="#5b6b85"/>
    `),
  };
})());
