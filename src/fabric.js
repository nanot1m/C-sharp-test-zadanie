const fs = require('fs');
const formTrie = require('./formTrie');
const getFromTrie = require('./getFromTrie');
const findWordsInLeaf = getFromTrie.findWordsInLeaf;
const getCurrentLeaf = getFromTrie.getCurrentLeaf;

/**
 * Reads file content and returns function(prefix){}
 *
 * @param {string} file - path to file
 * @returns {Function}
 */
module.exports = file => {
  'use strict';
  const lines = fs.readFileSync(file).toString().split('\n');
  const wordsCount = Number(lines[0]);
  const words = lines.slice(1, wordsCount + 1);

  const trie = formTrie(words);

  // fs.writeFile('trie.json', JSON.stringify(trie, null, 2));

  /**
   * Hash table of results
   */
  const resHash = Object.create(null);

  /**
   * function(prefix){} - returns list of words
   * starting by prefix sorted by weights
   */
  return prefix => {
    if (prefix in resHash) return resHash[prefix];

    const leaf = getCurrentLeaf(trie, prefix);
    if (!leaf) return '\n';
    return resHash[prefix] = findWordsInLeaf(leaf, prefix).map(word => word.value).join('\n');
  };
};
