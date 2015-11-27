/**
 * adding word to array with weight checking
 * @param {Array} wordArray
 * @param word
 * @param weight
 * @returns {Array<Object>}
 */
function addWordToResult(wordArray, word, weight) {
  'use strict';
  let res = [];
  const obj = {
    value: word,
    weight: weight,
  };

  if (!wordArray.length) return [obj];

  for (let index = 0; (index < wordArray.length) && (index < 10); index++) {
    if (Number(weight) > Number(wordArray[index].weight)) {
      return wordArray.slice(0, index).concat(obj, wordArray.slice(index, 10))
    }
  }

  return res;
}

/**
 * Return leaf matching prefix
 * @param trie
 * @param prefix
 * @returns {Object} leaf matches prefix
 */
module.exports.getCurrentLeaf = function(trie, prefix) {
  'use strict';
  let cur = trie;

  for (let index = 0; index < prefix.length; index++) {
    const letter = prefix[index];
    if (cur[letter]) cur = cur[letter];
    else return false;
  }

  return cur;
};

/**
 * Returns an array of words with weight in leaf
 * @param leaf
 * @param prefix
 * @returns {Array}
 */
module.exports.findWordsInLeaf = function findWordsInLeaf(leaf, prefix) {
  'use strict';

  let res = [];
  for (let letter in leaf) {
    if (letter === 'weight') {
      res = addWordToResult(res, prefix, leaf[letter]);
    } else {
      let word = prefix + letter;
      res = res.concat(findWordsInLeaf(leaf[letter], word))
    }
  }

  return res;
};
