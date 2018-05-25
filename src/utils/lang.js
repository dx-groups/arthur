
import { isArray } from '@dx-groups/utils/lang.js'

// const keyList = Object.keys
// const hasProp = Object.prototype.hasOwnProperty

/**
 * Come with [fast-deep-equal](https://github.com/epoberezkin/fast-deep-equal)
 *
 * Features
 *
 *  - ES5 compatible
 *  - works in node.js (0.10+) and browsers (IE9+)
 *  - checks equality of Date and RegExp objects by value
 *
 * @param {*} a
 * @param {*} b
 */
function equal(a, b) {
  if (a === b) return true

  let arrA = isArray(a)
  let arrB = isArray(b)
  let length = 0

  if (arrA && arrB) {
    length = a.length
    if (length !== b.length) return false
    for (let i = length; i-- !== 0;) { if (!equal(a[i], b[i])) return false }
    return true
  }

  if (arrA !== arrB) return false

  let dateA = a instanceof Date
  let dateB = b instanceof Date
  if (dateA !== dateB) return false
  if (dateA && dateB) return a.getTime() === b.getTime()

  let regexpA = a instanceof RegExp
  let regexpB = b instanceof RegExp
  if (regexpA !== regexpB) return false
  if (regexpA && regexpB) return a.toString() === b.toString()

  if (a instanceof Object && b instanceof Object) {
    let keys = keyList(a)
    length = keys.length

    if (length !== keyList(b).length) { return false }

    for (let i = length; i-- !== 0;) { if (!hasProp.call(b, keys[i])) return false }

    let key = ''
    for (let i = length; i-- !== 0;) {
      key = keys[i]
      if (!equal(a[key], b[key])) return false
    }

    return true
  }

  return false
}

function deepEqual(a, b) {
  if (a === b) return true
  if (!a || !b) return false
  return JSON.stringify(a) === JSON.stringify(b)
}

export {
  equal,
  deepEqual,
}
