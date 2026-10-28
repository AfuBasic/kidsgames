// Letters are added in the UK "Letters and Sounds" teaching order; each group includes the ones before it.
const LETTER_GROUPS = [
  { label: 's a t p i n', letters: 'satpin' },
  { label: '+ m d g o c k', letters: 'mdgock' },
  { label: '+ e u r h b f l', letters: 'eurhbfl' },
  { label: '+ j v w x y z', letters: 'jvwxyz' },
];

// Letters that make the same sound are never offered as choices together.
const SOUND_OF = { c: 'k', k: 'k' };

// Each word lists the sound positions the game may ask about:
//   f = first sound, m = middle sound (3-letter words only), l = last sound.
// A position is only listed when that single letter makes its usual (short) sound,
// so no "last sound in sock" (ck) or "first sound in ship" (sh).
const WORDS = {
  // s
  sun: 'fml', sock: 'f', snail: 'fl', star: 'f', six: 'fml',
  // a
  apple: 'f', ant: 'fl', arrow: 'f', axe: 'f',
  // t
  tiger: 'f', tent: 'fl', tomato: 'f', tree: 'f', tap: 'fml', ten: 'fml', tub: 'fml',
  // p
  pig: 'fml', pear: 'f', pencil: 'fl', penguin: 'fl', pan: 'fml', pen: 'fml', pin: 'fml',
  pot: 'fml', peg: 'fml', pup: 'fml',
  // i
  insect: 'fl', igloo: 'f', ink: 'fl',
  // n
  nest: 'fl', nut: 'fml', net: 'fml',
  // m
  moon: 'fl', mouse: 'f', mug: 'fml', mitten: 'fl', map: 'fml', mop: 'fml',
  // d
  dog: 'fml', duck: 'f', drum: 'fl', door: 'f',
  // g
  goat: 'fl', gift: 'fl', grapes: 'f', guitar: 'f',
  // o
  octopus: 'fl', olive: 'f', ox: 'fl',
  // c / k
  cat: 'fml', cup: 'fml', car: 'f', cake: 'f', cap: 'fml', can: 'fml', cot: 'fml',
  kite: 'f', key: 'f', king: 'f',
  // e
  egg: 'f',
  // u
  umbrella: 'f',
  // r
  rat: 'fml', rug: 'fml', rocket: 'fl', robot: 'fl', rabbit: 'fl',
  // h
  hat: 'fml', hen: 'fml', hut: 'fml', hand: 'fl',
  // b
  bus: 'fml', bed: 'fml', bag: 'fml', box: 'fml', bat: 'fml', bun: 'fml', bug: 'fml', bin: 'fml',
  bell: 'f', ball: 'f', banana: 'f',
  // f
  fan: 'fml', fox: 'fml', fig: 'fml', frog: 'fl', fish: 'f', flag: 'fl',
  // l
  leg: 'fml', lid: 'fml', log: 'fml', lamp: 'fl', lemon: 'fl',
  // j
  jam: 'fml', jet: 'fml', jug: 'fml',
  // v
  van: 'fml',
  // w
  web: 'fml', wig: 'fml',
  // y
  yak: 'fml',
  // z
  zip: 'fml', zebra: 'f',
  // last sounds only
  ship: 'l', crab: 'fl',
  // more 3-letter words (pictures-3.js)
  ham: 'fml', cub: 'fml', sad: 'fml', mud: 'fml', gum: 'fml', ram: 'fml', red: 'fml', dot: 'fml',
  pod: 'fml', cod: 'fml', tag: 'fml', sub: 'fml', tug: 'fml', mat: 'fml', lip: 'fml', mum: 'fml',
  dad: 'fml', rod: 'fml', bud: 'fml', cab: 'fml', pad: 'fml', fin: 'fml', bib: 'fml', cob: 'fml',
  yam: 'fml', wok: 'fml', kid: 'fml', nap: 'fml', dig: 'fml',
  // more 4-letter words
  milk: 'fl', belt: 'fl', desk: 'fl', plum: 'fl', twig: 'fl', slug: 'fl', pond: 'fl', sand: 'fl',
  vest: 'fl', mint: 'fl',
  // word-family words (pictures-4.js)
  run: 'fml', sip: 'fml', wet: 'fml', fog: 'fml', keg: 'fml', cut: 'fml', wag: 'fml', mad: 'fml',
  top: 'fml', hop: 'fml', mix: 'fml', fix: 'fml', hug: 'fml', win: 'fml',
  well: 'f', rock: 'f', lock: 'f', ring: 'f', wing: 'f', dish: 'f', rake: 'f', lake: 'f',
  nail: 'fl', tail: 'fl', sail: 'fl', mail: 'fl', boat: 'fl', coat: 'fl', hill: 'f', pill: 'f',
  mill: 'f', wall: 'f', pump: 'fl', jump: 'fl', sink: 'fl', pink: 'fl', wink: 'fl', book: 'fl',
  hook: 'fl', cook: 'fl', pool: 'fl', tool: 'fl', rose: 'f', hose: 'f', cone: 'f', bone: 'f',
  bear: 'f', nose: 'f',
};

// Words to spell in Build-a-Word: every letter makes its usual short sound, so a child can
// spell them from the sounds alone. All regular 3-letter words, plus regular 4-letter ones.
const SPELL_WORDS = [
  ...Object.keys(WORDS).filter((word) => WORDS[word] === 'fml'),
  'tent', 'nest', 'drum', 'gift', 'hand', 'lamp', 'frog', 'flag', 'crab',
  'milk', 'belt', 'desk', 'plum', 'twig', 'slug', 'pond', 'sand', 'vest', 'mint', 'pump', 'jump',
];

// 4-letter rhyming words for Word Slots. Their endings are read as a chunk (-ock, -ail,
// -ook), so they're listed here rather than taken from SPELL_WORDS.
const RHYME_WORDS = [
  'sock', 'rock', 'lock', 'king', 'ring', 'wing', 'fish', 'dish', 'cake', 'rake', 'lake',
  'nail', 'tail', 'sail', 'mail', 'goat', 'boat', 'coat', 'hill', 'pill', 'mill', 'bell', 'well',
  'ball', 'wall', 'hand', 'sand', 'pump', 'jump', 'nest', 'vest', 'sink', 'pink', 'wink',
  'book', 'hook', 'cook', 'pool', 'tool', 'nose', 'rose', 'hose', 'bone', 'cone', 'bear', 'pear',
];

// Rhyming families for Word Slots: words that differ only in their first letter, grouped by
// ending (-at: cat, hat, mat…; -ock: sock, rock, lock). New regular 3-letter words join
// their family automatically.
const WORD_FAMILIES = Object.entries(
  [...SPELL_WORDS.filter((word) => word.length === 3), ...RHYME_WORDS].reduce((families, word) => {
    (families[word.slice(1)] ||= []).push(word);
    return families;
  }, {}),
)
  .filter(([, words]) => words.length >= 2)
  .map(([ending, words]) => ({ ending, words }));
