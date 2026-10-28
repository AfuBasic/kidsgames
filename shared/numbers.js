// Number words and things to count, for the number games.
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const MAX_COUNT = 20;
const TENS_WORDS = { 20: 'twenty', 30: 'thirty', 40: 'forty', 50: 'fifty', 60: 'sixty', 70: 'seventy', 80: 'eighty', 90: 'ninety' };

// "twenty-five", "one hundred"
function numberWord(n) {
  if (n <= 20) return NUMBER_WORDS[n];
  if (n === 100) return 'one hundred';
  const tens = Math.floor(n / 10) * 10;
  return n % 10 ? `${TENS_WORDS[tens]}-${NUMBER_WORDS[n % 10]}` : TENS_WORDS[tens];
}

// Every number the games say aloud (num-<n> clips): 1 to 100, for Number Race's hundred square.
const SPOKEN_NUMBERS = Array.from({ length: 100 }, (_, i) => i + 1);

// Three numbers to choose from: smallest first, never next to each other (3, 5, 8, not
// 4, 5, 6), so a child can't land on the answer by guessing "the middle one". The others are
// close enough to tempt: within about a third of the answer, wider if there's no room.
function spacedChoices(answer, min, max) {
  const shuffle = (list) => list.map((n) => [Math.random(), n]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
  const all = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const apart = (list) => list.every((a) => list.every((b) => a === b || Math.abs(a - b) >= 2));
  for (let spread = Math.max(3, Math.round(answer * 0.35)); spread <= max - min + 1; spread++) {
    const near = shuffle(all.filter((n) => n !== answer && Math.abs(n - answer) <= spread));
    for (let i = 0; i < near.length; i++) {
      for (let j = i + 1; j < near.length; j++) {
        const set = [answer, near[i], near[j]];
        if (apart(set)) return set.sort((a, b) => a - b);
      }
    }
  }
  return [answer];
}

// Number Train: ways to count, with the numbers each one goes through.
const COUNT_STEPS = {
  'ones-10': { step: 1, from: 1, to: 10 },
  'ones-20': { step: 1, from: 1, to: 20 },
  tens: { step: 10, from: 10, to: 100 },
  fives: { step: 5, from: 5, to: 50 },
  twos: { step: 2, from: 2, to: 20 },
};

// Pictures that look good repeated, with the plural the voice says ("How many apples can you see?").
const COUNTABLES = {
  apple: 'apples', star: 'stars', fish: 'fish', cat: 'cats', dog: 'dogs', duck: 'ducks', pig: 'pigs',
  hen: 'hens', frog: 'frogs', egg: 'eggs', ball: 'balls', cake: 'cakes', car: 'cars', bus: 'buses',
  kite: 'kites', sock: 'socks', cup: 'cups', hat: 'hats', bug: 'bugs', pear: 'pears', lemon: 'lemons',
  banana: 'bananas', carrot: 'carrots', boat: 'boats', bell: 'bells', drum: 'drums', key: 'keys',
  rocket: 'rockets', rabbit: 'rabbits', penguin: 'penguins', snail: 'snails', tree: 'trees', nut: 'nuts',
  plum: 'plums', mitten: 'mittens', rose: 'roses', book: 'books', bone: 'bones', bear: 'bears',
  robot: 'robots', insect: 'ladybirds', tomato: 'tomatoes', pencil: 'pencils', umbrella: 'umbrellas',
  ship: 'ships', crab: 'crabs', flag: 'flags', gift: 'presents', ant: 'ants', moon: 'moons',
};
