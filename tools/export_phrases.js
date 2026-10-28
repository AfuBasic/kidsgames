// Prints every phrase the game speaks as JSON ({ "clip-id": "text" }) for tools/make_voice.py.
// Loads words.js, numbers.js and phrases.js the same way the browser does, so the two can't drift apart.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const context = vm.createContext({});
for (const file of ['shared/words.js', 'shared/numbers.js', 'shared/phrases.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
}
process.stdout.write(JSON.stringify(vm.runInContext('PHRASES', context), null, 2));
