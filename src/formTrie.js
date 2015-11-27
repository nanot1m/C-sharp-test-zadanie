/**
 * Adds current word to trie
 * @param word
 * @param weight
 * @param trie
 * @returns {Object} trie
 */
function addToTrie(word, weight, trie) {
  'use strict';
  let cur = trie;
  for (let index = 0; index < word.length; index++) {
    let letter = word[index];
    cur[letter] = cur[letter] || Object.create(null);
    if (index === word.length - 1) {
      cur[letter].weight = weight;
    } else {
      cur = cur[letter];
    }
  }
  return trie;
}

/**
 * Forms hash table: {<prefix>: <Array<words>>}
 * @param {Array<string>} words - list of strings with weights
 * @returns {Object} trie
 */
module.exports = function(words) {
  'use strict';
  let trie = Object.create(null);
  const now = new Date();
  words.forEach(wordWithWeight => {
    /**
     * matches 'string 789' -> ['string 789', 'string', ' ', '789']
     */
    const matches = wordWithWeight.match(/(\w+)(\s)(\d+)/);
    trie = addToTrie(matches[1] /* word */, matches[3] /* weight */, trie)
  });
  console.info('\x1b[36m Trie formed: ' + (new Date() - now) + ' ms\x1b[0m');
  return trie;
};
