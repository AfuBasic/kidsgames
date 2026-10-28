// Every line the games speak, keyed by clip id. tools/make_voice.py turns each one into
// audio/<id>.m4a; anything without a clip falls back to the browser voice.
const POSITION_NAMES = { f: 'first', m: 'middle', l: 'last' };
// Picked at random (never the same twice in a row). Wrong answers get a pause, then "Try again."
const CORRECT_LINES = ['Correct!', 'Good job!', 'Nice!', 'Well done!', 'Great!', 'Brilliant!'];
const WRONG_LINES = ['Wrong.', 'Incorrect.'];
// Read aloud when a game is tapped on the homepage.
const GAME_NAMES = {
  'pop-a-sound': 'Pop a Sound!',
  'build-a-word': 'Build a Word!',
  'word-slots': 'Word Slots!',
  'blend-robot': 'Blend Robot!',
  'word-fishing': 'Word Fishing!',
  'count-it': 'Count It!',
  'quick-peek': 'Quick Peek!',
  'number-train': 'Number Train!',
  'five-little-ducks': 'Five Little Ducks!',
  'egg-box': 'The egg box game!', // "Egg Box!" came out as "egg boxes"
  'rocket-launch': 'Rocket Launch!',
  'hungry-crocodile': 'The hungry crocodile game!',
  'number-race': 'Number race!',
};

const PHRASES = (() => {
  const title = (word) => word[0].toUpperCase() + word.slice(1);
  const phrases = {
    start: "Let's pop some balloons!",
    'start-build': "Let's build some words!",
    'start-slots': "Let's make some words!",
    'start-robot': 'Listen to the robot. Which picture is it?',
    'start-fishing': "Let's catch some fish today!", // "…some fish!" came out as "fishy"
    'start-count': "Let's do some counting!",
    'count-together': "Let's count them together.",
    'start-peek': 'Watch closely, then tell me how many.',
    'how-many-dots': 'How many dots did you see?',
    'start-train': 'All aboard the number train!',
    'which-missing': 'Which number is missing?',
    'what-next': 'What number comes next?',
    // Five Little Ducks, after the traditional song
    'ducks-away': 'Over the hill and far away!',
    'ducks-mother': 'Mother duck said, quack, quack, quack, quack!',
    'ducks-how-many': 'How many ducks are on the pond now?',
    'ducks-none': 'There are no ducks on the pond!',
    'ducks-all-back': 'Hooray! All the little ducks came back!',
    // Egg Box
    'start-eggs': "Let's fill the egg boxes!",
    'eggs-how-many-more': 'How many more eggs to fill the box?',
    'count-empty': "Let's count the empty spaces.",
    // Rocket Launch
    'start-rocket': "Let's fuel up the rocket!",
    'rocket-ones': "Let's count in ones.",
    'rocket-twos': "Let's count in twos.",
    'rocket-fives': "Let's count in fives.",
    'rocket-tens': "Let's count in tens.",
    'rocket-find': 'Can you find the next number?',
    'blast-off': 'Blast off!',
    // Hungry Crocodile
    'start-croc': 'Help feed the hungry crocodile!',
    'croc-more': 'Which side has more?',
    'croc-fewer': 'Which side has fewer?',
    'more-than': 'is more than',
    // Number Race
    'start-race-10': "Let's race to ten!",
    'start-race-20': "Let's race to twenty!",
    'start-race-50': "Let's race to fifty!",
    'start-race-100': "Let's race to one hundred!",
    'race-roll': 'Roll the dice!',
    'race-hop-3': 'Hop three spaces.',
    'race-hop-4': 'Hop four spaces.',
    'race-hop-5': 'Hop five spaces.',
    'race-hop-6': 'Hop six spaces.',
    'race-spin': 'Give the spinner a spin!', // "Spin the spinner!" was heard as "It's been the spinner"
    'race-hop-1': 'Hop one space.',
    'race-hop-2': 'Hop two spaces.',
    'race-rabbit-turn': "It's Rabbit's turn to play.",
    'race-tortoise-turn': "It's Tortoise's turn to play.",
    'race-rabbit-wins': 'Hooray! Rabbit won the race!',
    'race-tortoise-wins': 'Hooray! Tortoise won the race!',
    'race-again': "Let's race again!",
    'race-last-turn': 'One last turn to catch up!',
    'race-draw': "It's a draw! What a close race!",
    'race-match-rabbit': 'Rabbit wins the game! Well played, everyone!',
    'race-match-tortoise': 'Tortoise wins the game! Well played, everyone!',
    'race-match-tie': "It's a tie! You are both winners!",
    'fewer-than': 'is fewer than',
    'try-again': 'Try again.',
    star: 'Hooray! You got a star!',
    more: 'Hooray! More balloons!',
    harder: 'Hooray! Now a bit harder!',
    'go-home': 'Go home?',
  };
  CORRECT_LINES.forEach((text, i) => { phrases[`correct-${i}`] = text; });
  WRONG_LINES.forEach((text, i) => { phrases[`wrong-${i}`] = text; });
  Object.entries(GAME_NAMES).forEach(([id, text]) => { phrases[`game-${id}`] = text; });

  // Pop-a-Sound questions
  Object.entries(WORDS).forEach(([word, positions]) => {
    for (const pos of positions) {
      phrases[`ask-${pos}-${word}`] = `Pop the ${POSITION_NAMES[pos]} sound in ${word}.`;
    }
  });
  // Build-a-Word: the request, and the finished word said back. Tested wordings: a short word
  // at the end of a statement ("Spell cat.", "Cat!") came out unclear ("catty"); a question,
  // or the word mid-sentence, comes out clean.
  SPELL_WORDS.forEach((word) => {
    // Blend Robot: the word said slowly ("caaat"); make_voice.py builds these specially.
    phrases[`stretch-${word}`] = word;
    // A final "x" picks up a tail even in a question ("boxes"), so those words aren't last.
    phrases[`spell-${word}`] = word.endsWith('x') ? `Can you spell ${word} for me?` : `Can you spell ${word}?`;
    phrases[`word-${word}`] = `${title(word)} is right!`;
    // Word Fishing: same question shape as "spell", which tested clean.
    phrases[`catch-${word}`] = word.endsWith('x') ? `Can you catch the word ${word} for me?` : `Can you catch the word ${word}?`;
  });
  // Word Slots: "Can you make the word hat?", then "Hat is right!" (shared with Build-a-Word).
  // "Can you make hat?" alone was misheard for some words (van → "fans", hen → "hens").
  WORD_FAMILIES.forEach(({ words }) => words.forEach((word) => {
    phrases[`make-${word}`] = `Can you make the word ${word}?`;
    phrases[`word-${word}`] = `${title(word)} is right!`;
  }));
  // Number games. num-3 is the single word "three" (num-40 "forty"), for counting aloud;
  // make_voice.py cuts it out of a sentence, as with Blend Robot's slow words.
  SPOKEN_NUMBERS.forEach((n) => { phrases[`num-${n}`] = numberWord(n); });
  // Five Little Ducks: "Five little ducks went swimming one day."
  for (let n = 1; n <= 10; n++) {
    const word = NUMBER_WORDS[n];
    phrases[`ducks-swim-${n}`] = `${word[0].toUpperCase()}${word.slice(1)} little ${n === 1 ? 'duck' : 'ducks'} went swimming one day.`;
  }
  // Egg Box: "Seven and three make ten altogether!" for every way to fill a box of 5 or 10.
  // With the number last ("…make ten!") some came out as "tens"
  for (const total of [5, 10]) {
    for (let a = 0; a < total; a++) {
      const first = NUMBER_WORDS[a];
      phrases[`bond-${a}-${total - a}`] = `${first[0].toUpperCase()}${first.slice(1)} and ${NUMBER_WORDS[total - a]} make ${NUMBER_WORDS[total]} altogether!`;
    }
  }
  // Count It: "How many apples can you see?"
  Object.values(COUNTABLES).forEach((plural) => {
    phrases[`how-many-${plural}`] = `How many ${plural} can you see?`;
  });
  return phrases;
})();

if (typeof module !== 'undefined') module.exports = { PHRASES };
