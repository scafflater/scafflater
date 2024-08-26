/**
 * @param string
 * @param string1
 * @param string2
 * @returns {boolean}
 */
export function stringEquals(string1, string2) {
  return string1 === string2;
}

/**
 * @param string
 * @param string1
 * @param string2
 * @returns {boolean}
 */
export function stringNotEquals(string1, string2) {
  return string1 !== string2;
}

export default { stringEquals, stringNotEquals };
