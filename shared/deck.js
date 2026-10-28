// A shuffled deck that deals every question once before any repeats. Words from the last
// few rounds are skipped, and `clash` can rule out a question right after another
// (e.g. the same answer letter twice in a row).
function createDeck({ recent = 10, clash = () => false } = {}) {
  let deck = [];
  let signature = '';
  let prev = null;
  const recentWords = [];

  // `items` is every question that fits the current settings; `sig` changes when they change.
  return function next(items, sig = '') {
    if (!deck.length || sig !== signature) {
      signature = sig;
      deck = gsap.utils.shuffle([...items]);
    }
    const fresh = (q) => !recentWords.includes(q.word) && !(prev && clash(q, prev));
    let i = deck.findLastIndex(fresh);
    if (i < 0) i = deck.findLastIndex((q) => !prev || q.word !== prev.word);
    if (i < 0) i = deck.length - 1;

    const question = deck.splice(i, 1)[0];
    recentWords.push(question.word);
    if (recentWords.length > recent) recentWords.shift();
    prev = question;
    return question;
  };
}
