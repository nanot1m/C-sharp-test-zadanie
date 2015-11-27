const fs = require('fs');

function sortByWeight(word1, word2) {
  return word1.weight > word2.weight;
}

/**
 * adding word to array with weight checking
 * @param wordArray
 * @param word
 * @returns {Array.<T>}
 */

function addWordToResult(wordArray, word, weight) {
  'use strict';
  let res = wordArray;

  const obj = {
    value: word,
    weight: weight,
  }

  if (res.length < 10) {
    res = wordArray.concat(obj);
  } else {
    const first = wordArray[0];
    const last = wordArray[wordArray.length - 1];

    if ((weight > last.weight) && (weight < first.weight)) {
      res = wordArray.concat(obj);
    }
  }

  return res.sort(sortByWeight).slice(0,10);
}

/**
 * Checks if prefix in trie
 * @param trie
 * @param prefix
 * @returns {Object} leaf matches prefix
 */
function getCurrentLeaf(trie, prefix) {
  'use strict';
  let cur = trie;

  const isInTree = prefix.split('').every(letter => {
    if (cur[letter]) {
      cur = cur[letter];
      return true
    }
  });
  if (isInTree) return cur;

  return false;
}

/**
 * Returns an array of words with weight in leaf
 * @param leaf
 * @param prefix
 * @returns {Array}
 */
function findWordsInLeaf(leaf, prefix) {
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
}

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
    cur[letter] = cur[letter] || {};
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
function formTrie(words) {
  'use strict';
  let trie = {};
  const now = new Date();
  words.forEach(wordWithWeight => {
    /**
     * matches 'string 789' -> ['string 789', 'string', ' ', '789']
     */
    const matches = wordWithWeight.match(/(\w+)(\s)(\d+)/);
    trie = addToTrie(matches[1] /* word */, matches[3] /* weight */, trie)
  });
  console.log((new Date() - now) / 1000 + ' s');
  return trie;
}

/**
 * Reads file content and returns function(prefix){}
 *
 * @param {string} file - path to file
 * @returns {Function}
 */
module.exports = file => {
  'use strict';
  const lines = fs.readFileSync(file)
    .toString()
    .split('\n');
  const wordsCount = Number(lines[0]);
  const words = lines.slice(1, wordsCount + 1);

  const trie = formTrie(words);

  /**
   * function(prefix){} - returns list of words
   * starting by prefix sorted by weights
   */
  return prefix => {
    const leaf = getCurrentLeaf(trie, prefix);
    if (!leaf) return false;
    return findWordsInLeaf(leaf, prefix).map(word => word.value);
  };
};
