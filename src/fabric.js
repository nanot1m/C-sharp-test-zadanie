const fs = require('fs');

function getArrayLastItem(arr) {
  return arr[arr.length - 1];
}

/**
 * Removes not suitable level items
 * and returns last matched
 *
 * level = ['a', 'aa', 'aaab']
 * prefix = 'aab'
 * level -> ['a', 'aa']
 * @returns 'aa'
 */
function getLevelPrefix(level, prefix) {
  if (!level.length) return undefined;
  while ((prefix.indexOf(getArrayLastItem(level)) === -1) && level.length) {
    level.pop();
  }
  return getArrayLastItem(level);
}

/**
 * Sort array by weights in strings
 * @param {Array<string>} array - string with weight 'aaa 8321\r'
 * @returns {Array<string>}
 */
function sortByWeight(array) {
  return array.sort((v1,v2) => parseInt(v1.split(' ')[1]) < parseInt(v2.split(' ')[1]));
}

/**
 * Returns array without weights
 * @param {Array<string>} array - array of strings with weights 'aaa 8321\r'
 * @returns {Array<string>}
 */
function removeWeights(array) {
  return array.map(val => val.split(' ')[0]);
}

/**
 * Filter words with prefix,
 * sort with weights and removes weights from words
 * if not sorted
 *
 * @param {Array<string>} words
 * @param {string} prefix
 * @returns {Array<string>}
 */
function getWordsByPrefix(words, prefix) {
  const filtered = words.filter(word => word.indexOf(prefix) === 0);
  if (filtered[0] && filtered[0].split(' ').length === 2) {
    const sorted = sortByWeight(filtered);
    return removeWeights(sorted);
  }
  return filtered;
}

function deduplicateArray(array) {
  return Object.keys(array.reduce((res, next) => {
    res[next] = true;
    return res;
  }, {}));
}

/**
 * Forms hash table: {<prefix>: <Array<words>>}
 * @param {Array<string>} words - list of strings with weights
 * @param {Array<string>} prefixes - sorted list of prefixes
 * @returns {Object} hash table
 */
function formHashTable(words, prefixes) {
  const hashTable = Object.create(null);
  const level = [];
  prefixes.forEach(prefix => {
    const levelPrefix = getLevelPrefix(level, prefix);
    if (levelPrefix) {
      hashTable[prefix] = getWordsByPrefix(
        hashTable[levelPrefix],
        prefix
      );
    } else {
      hashTable[prefix] = getWordsByPrefix(words, prefix);
    }
    level.push(prefix);
  });
  return hashTable;
}

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
  const prefixCount = Number(lines[wordsCount + 1]);
  const prefixes = deduplicateArray(
    lines
      .slice(wordsCount + 2, wordsCount + 2 + prefixCount)
      .map(val => val.replace('\r', ''))
  ).sort();

  const hashTable = formHashTable(words, prefixes);

  /**
   * function(prefix){} - returns list of words
   * starting by prefix sorted by weights
   */
  return prefix => hashTable[prefix];
};
