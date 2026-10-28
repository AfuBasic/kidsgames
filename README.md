# Kids Games

Phonics, spelling and early maths games for children under 5: 13 short, calm games with a natural voice, hand-drawn pictures and no ads, accounts or tracking.

**Play:** [kidswordgames.pages.dev](https://kidswordgames.pages.dev). It installs as an app on iPad, iPhone and Android, and works offline.

## Highlights

- **Made for little hands and ears.** Big tap targets, one simple spoken question at a time, and a replay button to hear it again. No reading needed to play.
- **A real voice.** Every line is a pre-recorded clip ([Kokoro](https://huggingface.co/hexgrad/Kokoro-82M), voice `bf_isabella`), checked by speech recognition so it says exactly the right word.
- **Kind feedback.** Varied praise, a gentle buzzer for a wrong answer, then help: after two misses the right answer glows, so nobody gets stuck.
- **Gets harder as they learn.** Five right answers earn a star, and stars raise the level. Questions come from a shuffled deck, so they rarely repeat.
- **Settings for grown-ups** in every game: word lengths, letter groups, number ranges, starting level and more.
- **Installable and offline.** A PWA with a service worker; the homepage can save every voice clip (about 22 MB) for offline play.
- **No build step.** Plain HTML, CSS and JavaScript. Animation is [GSAP](https://gsap.com/) from a CDN, the fonts (Andika for letters, Outfit for everything else) come from Google Fonts, and every picture is hand-drawn SVG.

## Run it locally

Any static file server works. From this folder:

```bash
python3 -m http.server 8765
```

Then open <http://localhost:8765>. (Opening `index.html` straight from disk mostly works, but the service worker and voice manifest need a server.)

Every game has a home button in the top-left corner, which asks "Go home?" first so a stray tap doesn't end the game.

## The games

Games are grouped by subject: `games/words/` and `games/numbers/`, shown as sections on the homepage.

### Words

| Game | Folder | Status |
|---|---|---|
| **Pop-a-Sound**: "Pop the last sound in sun." Pop the balloon with that letter. | `games/words/pop-a-sound/` | Ready |
| **Build-a-Word**: see a picture, hear "Spell cat.", tap letter tiles into the slots. | `games/words/build-a-word/` | Ready |
| **Word Slots**: a slot machine shows "? a t"; hear "Can you make the word hat?" and tap the first letter. | `games/words/word-slots/` | Ready |
| **Blend Robot**: the robot says a word slowly ("caaat") as its screen lights each letter; tap the matching picture. | `games/words/blend-robot/` | Ready |
| **Word Fishing**: hear a word and catch the fish carrying it. | `games/words/word-fishing/` | Ready |

### Numbers

| Game | Folder | Status |
|---|---|---|
| **Count It**: tap each picture to count it, then tap how many. | `games/numbers/count-it/` | Ready |
| **Quick Peek**: dots flash for a moment; how many did you see? | `games/numbers/quick-peek/` | Ready |
| **Number Train**: find the missing number on the train (later in 10s to 100). | `games/numbers/number-train/` | Ready |
| **Five Little Ducks**: the song as a take-away game. | `games/numbers/five-little-ducks/` | Ready |
| **Egg Box**: how many more eggs to fill the box? (bonds to 5 and 10) | `games/numbers/egg-box/` | Ready |
| **Rocket Launch**: fuel tanks in order (10s, 5s, 2s, 1s), then count down and blast off. | `games/numbers/rocket-launch/` | Ready |
| **Hungry Crocodile**: which plate has more (or fewer)? | `games/numbers/hungry-crocodile/` | Ready |
| **Number Race**: a board game to play together: spin, hop and say the numbers, to 10, 20, 50 or 100. | `games/numbers/number-race/` | Ready |

All games share:

- **Feedback:** "Correct!", "Good job!", "Nice!" and so on, never the same twice in a row. A wrong answer gets a buzzer, "Wrong…" or "Incorrect…", a pause, then "Try again." After two misses the right answer glows, so nobody gets stuck.
- **Progress:** five dots earn a star, and stars make the game harder (more balloons, fewer letters given).
- **No repetition:** questions come from a shuffled deck that deals each one once before repeating, and a word never returns within 10 rounds.

## How each game works

### Pop-a-Sound

Asks for the **first**, **middle** (3-letter words) or **last** sound of 190 pictured words, and highlights that letter in the word. Settings: letter groups in phonics order (s a t p i n → + m d g o c k → + e u r h b f l → + j v w x y z), which sound positions to ask, 2, 3 or 5 balloons to start, and whether to show the word.

### Build-a-Word

Spells 114 regular words (93 three-letter, 21 four-letter), where every letter makes its usual sound. There are four levels, and each star moves up one:

1. Add the last letter (c a _)
2. First letter given (c _ _)
3. Spell it all
4. Spell it all, with extra vowels to tell apart

Settings: 3-letter words only, or 3- and 4-letter words, and the starting level.

### Word Slots

Teaches rhyme and reading by pattern. The machine stays on one rhyming family (-at: cat, hat, mat, rat, bat) until every word in it is made, collecting them in a row under the machine so the shared ending stands out, then spins to a new family. A 4-letter family gets a fourth reel.

- **3-letter:** 27 families, 86 words, grouped automatically from the regular 3-letter words.
- **4-letter:** 18 families, 46 words (-ock: sock, rock, lock; -ail: nail, tail, sail, mail; -ook, -ose, -ing, -ake…), listed in `RHYME_WORDS` in `shared/words.js`.

The letter choices include other letters from the same family, so a wrong tap often makes a real word ("rat" instead of "hat"). Each star adds a choice (2, then 3, then 4). Settings: 3-letter words, 4-letter words or both, and how many choices to start with.

### Blend Robot

Builds blending: hearing separate sounds join into a word. The robot says each of the 114 spellable words at half speed while its chest screen lights the letters one by one, and the child taps the matching picture. Levels (each star moves up one):

1. 2 pictures, clearly different
2. 3 pictures, one starting with the same letter (cat / cup)
3. 4 pictures, adding a rhyme (cat / cup / hat), so the whole word has to be heard

Settings: 3-letter or 3- and 4-letter words, starting level, and whether the screen shows the letters. The slow words are made specially (see Voice below).

### Word Fishing

Builds word reading. Fish swim back and forth across the pond, each carrying a written word. The voice asks "Can you catch the word cat?" and the child taps that fish, which leaps out of the water into the picture card. A wrong fish darts away and goes pale, then the question repeats; after two misses the right fish glows and slows down. Levels use the same look-alikes as Blend Robot (2 fish, then 3 with the same first letter, then 4 adding a rhyme), and the fish swim a little faster at each level. Settings: 3-letter or 3- and 4-letter words, starting level, and the picture clue (turn it off once children read the words alone).

### Count It

Builds counting: one number for each thing (one-to-one), and knowing the last number counted is how many there are. A group of pictures appears with "How many apples can you see?". Tapping a picture counts it: it gets a number badge and the voice says the number. The child taps the answer from a row of numbers, laid out in order like a number line. After each answer the voice counts them all aloud as each one lights up, and the last one glows. After two misses it says "Let's count them together." and counts, then the answer glows.

Levels (each star moves up one): 2 numbers in tidy rows of five, then 3, then 4 numbers next to the answer with the pictures scattered. Settings: count up to 5, 10 or 20, starting level, and counting together after each answer. About 50 different things to count.

### Quick Peek

Builds subitising: seeing how many without counting. Little stage curtains open on some dots for a moment, then close, and the voice asks "How many dots did you see?". The peek is too short to count one by one. Patterns are dice faces and scattered dots up to 6; 7 to 10 are ten-frames (two rows of five) or pairs of dice (7 = 5 and 2); above 10, stacked ten-frames, so 23 is seen as two full frames and 3 more. A right answer opens the curtains again and the voice says the number. A wrong one gets another peek; after two misses the curtains open and the voice counts the dots (full frames as tens: "ten, twenty, twenty-one…"). Replay (the speaker button) peeks again.

There are always three numbers to choose from, smallest first and never next to each other (3, 5, 8). Levels shorten the peek (2.4, 1.7, then 1.2 seconds) and use fewer tidy patterns. Settings: Easy (up to 6), Medium (up to 15) or Hard (up to 30), and starting level.

### Number Train

Builds number order and counting in steps. A train pulls in with five numbered carriages in order, one or two showing "?". The voice counts along the carriages and stops at the gap: "three, four… Which number is missing?" (or "What number comes next?" when the gap is at the end). The child taps the missing number; it flies into the carriage window, the voice counts the whole train, and it toots off. After two misses the voice counts up to the gap and says the missing number, and its tile glows.

Settings: count in 1s to 10, 1s to 20, 10s (to 100), 5s (to 50) or 2s (to 20), and starting level. Levels: what comes next (2 choices), missing in the middle (3), two missing (4). The other choices are nearby numbers from the same count, so the choice is about order rather than size.

### Five Little Ducks

Builds taking away and adding, after the traditional counting song. Five (or ten) ducks swim on a pond in rows of five. Some paddle off "over the hill and far away" and vanish behind the hill, and the voice asks "How many ducks are on the pond now?". In "Away and back", Mother Duck also quacks ("Mother duck said, quack, quack, quack, quack!") and some ducks come back from behind the hill. The pond carries on from round to round like the song; in "Swim away", when the pond is empty every duck comes home ("Hooray! All the little ducks came back!"). A right answer counts the ducks on the pond aloud, each bobbing up with its number (or "There are no ducks on the pond!" for 0).

Settings: 5 or 10 ducks, the story (swim away, or away and back), and starting level. Levels: one duck at a time, then up to 2, then up to 3. Three numbers to choose from, smallest first and never next to each other; 0 is a possible answer.

### Egg Box

Builds number bonds to 5 and 10. An egg carton (a five- or ten-frame) has some eggs in; "How many more eggs to fill the box?" A right answer drops the missing eggs in one by one, each numbered as the voice counts them, then says the bond: "Seven and three make ten altogether!" After two misses the voice says "Let's count the empty spaces." and see-through eggs show the gaps, then the answer glows. Settings: make 5 or make 10, and starting level. Levels: eggs in order (for 10, the top row is always full), eggs in order with any amount, then eggs in any holes. Three numbers to choose from, never next to each other.

### Rocket Launch

Builds counting in steps and counting backwards. Ten numbered fuel tanks; tapping them in order (10, 20, 30…) sends each into the rocket's fuel gauge as the voice says the number. A wrong tank wobbles, the voice asks "Can you find the next number?" and the right one glows. When the gauge is full: "ten, nine, eight … one, Blast off!" and the rocket launches in smoke and flame. Two tanks fill one progress dot, so every launch is a star. Settings: count in 10s, 5s, 2s or 1s, and starting level (tanks in order with the next one glowing; mixed up with a glow after 5 seconds; mixed up with no glow).

### Hungry Crocodile

Builds comparing: more and fewer. Two plates of food with a crocodile between them: "Which side has more?" (and, if chosen, sometimes "Which side has fewer?"). The child taps a plate; the crocodile turns, opens wide and gobbles the food, and the voice says "Seven is more than four" (or "Four is fewer than seven"). A wrong plate makes the crocodile shake its head, then the voice counts both plates with numbered badges and the right plate glows. Settings: up to 5 or 10, more only or more and fewer, starting level, and writing the number under each plate. Levels: very different piles (at least 3 apart) in tidy rows, then 2 apart, then 1 or 2 apart and scattered.

### Number Race

A numbered board game, after Siegler and Ramani's studies: preschoolers who played a simple straight-line number board game (1 to 10), saying each number as they moved, got better at numbers, and a round board didn't help the same way. Rabbit and Tortoise take turns. Spin the spinner (1 or 2), or on the big boards roll the dice (1 to 6); then tap the glowing next square (or your own piece) to hop one square at a time while the voice says each number. First to the end wins, but turns are always equal: if whoever went first gets there, the other has one last turn to catch up, and if they make it too it's a draw.

The players' names go on the start screen (a grown-up types them; against the computer Tortoise plays itself). A scoreboard in the top bar (along the bottom on phones) keeps wins and draws race after race, so they can play on and on. It's saved on the device for each pair of names, so it's still there next visit. **End** on the scoreboard pauses the race and shows who won the game on a little podium; **New game** puts the score back to 0, **Keep playing** carries on. The voice can't say typed names (every clip is made ahead of time), so it says "Rabbit" and "Tortoise": each player keeps their animal.

Settings: race to 10 or 20 (one line that wraps on narrow screens, spinner) or 50 or 100 (rows of ten like a hundred square, dice), and Rabbit and Tortoise (your child is Rabbit and goes first; Tortoise has the same fair spinner) or two players on one screen (who goes first swaps each race). The mode and race length are remembered. A win or a draw by Rabbit (or either player in a two-player game) earns a star; when Tortoise wins it's just "Let's race again!".

## Project layout

Everything is named after the word itself: the picture of a cat is `PICTURES.cat`, its entry in the word list is `cat`, and its voice clips are `audio/ask-f-cat.m4a` ("Pop the first sound in cat.") and `audio/spell-cat.m4a`.

```
index.html, home.css, home.js   homepage
install.js                      homepage panel: install button, offline download
manifest.webmanifest, sw.js     installable app (PWA) and offline service worker
icons/                          app icon (icon.svg, rendered to PNGs)
shared/
  pictures.js, -2, -3, -4       all drawings (100 × 100 SVG)
  words.js                      word list, letter groups, SPELL_WORDS
  numbers.js                    number words, things to count (with plurals)
  phrases.js                    every spoken line (also read by the voice tool)
  voice.js                      plays clips, falls back to the browser voice
  sounds.js                     pop, chime, buzzer, fanfare (generated, no files)
  effects.js                    confetti, progress dots, star celebration
  scene.js                      sky scenery, home button and "Go home?" check
  deck.js                       the no-repeat question deck
  offline.js                    files the installed app keeps on the device
  theme.css                     shared look
games/<group>/<name>/           index.html, game.js, style.css for each game
                                (groups: words, numbers)
audio/                          voice clips + manifest.json
tools/                          voice generator (runs on your Mac only)
```

## Add a word

1. Draw it in `shared/pictures-4.js` (or a new pictures file, added to each page's script list).
2. Add it to `WORDS` in `shared/words.js` with the sound positions that are fair to ask: `f` first, `m` middle (3-letter words only), `l` last. Only list a position where that single letter makes its usual short sound. Regular 3-letter words (`'fml'`) are automatically spellable in Build-a-Word and join their Word Slots family; add regular 4-letter words to `SPELL_WORDS`, and rhyming 4-letter words to `RHYME_WORDS`.
3. Generate the voice clips (below).

## Voice

Every spoken line has a pre-generated clip in `audio/`, made with [Kokoro](https://huggingface.co/hexgrad/Kokoro-82M), a free local neural voice. Any line without a clip falls back to the browser's built-in voice.

The voice is `bf_isabella` (British) at speed 0.85. It won a speech-recognition comparison of 12 Kokoro voices: it says "in" clearly, and its short vowels match the phonics order the games use. As each clip is made, the generator plays it to Whisper speech recognition and remakes it with slightly varied speed or punctuation if it's misheard. This catches Kokoro's occasional "froggy" for "frog".

Blend Robot's slow words (`audio/stretch-cat.m4a`) can't come from asking Kokoro to talk slowly, because that garbles single words ("pig" came out as "peggies"). Instead the generator cuts the word out of a sentence it says cleanly ("Can you spell cat?"), using Kokoro's word timings, and time-stretches it to half speed with ffmpeg, which keeps the pitch. Half speed was the slowest that speech recognition still heard correctly for every test word.

```bash
~/.venvs/kokoro/bin/python tools/make_voice.py
```

Only new, changed or failed lines are redone. Options: `--voice af_heart` (American), `--speed 0.8`, `--force` to redo everything, `--no-check` to skip the recognition check. `tools/voice-cache.json` records what each clip was made from and what the check heard.

## Deploy (Cloudflare Pages)

It's a static site, so it works on Cloudflare Pages (or any static host) as-is: no build command, and the folder root is the output. Game links are plain relative links. The `tools/` folder is only needed on your Mac.

The site has over 1,000 files (mostly voice clips), more than the dashboard's drag-and-drop upload takes, so deploy with Wrangler from this folder. The live branch of the `kidswordgames` project is `production`; any other branch name makes a preview link instead:

```bash
npx wrangler pages deploy . --project-name kidswordgames --branch production
```

Alternatively, connect this GitHub repo to the Pages project with no build command and `/` as the output directory, and every push deploys.

## Install and offline play

The site is an installable app (PWA). On Android, Chrome and Edge the homepage shows an **Install** button; on iPad and iPhone it shows the Safari steps (Share, then Add to Home Screen). The installed app opens full-screen.

`sw.js`, the service worker, keeps the app files, GSAP and the fonts on the device, and plays voice clips from the device once saved. Clips save as they play; the homepage's **Download** button (automatic in the installed app) saves all of them at once, about 22 MB.

When you change things:

- **Add a file:** list it in `OFFLINE.files` in `shared/offline.js`.
- **Change code or pictures:** nothing to do. When online, the app always loads the latest files (and saves them); the saved copies are only used offline.
- **Regenerate voice clips:** nothing to do. `audio/manifest.json` lists each clip with a fingerprint of its wording, and the game asks for `cat.m4a?v=<fingerprint>`, so a changed clip has a new address and devices fetch it instead of an old saved copy.
