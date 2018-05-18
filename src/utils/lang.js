
/** Used to check objects for own properties. */
// const hasOwnProperty = Object.prototype.hasOwnProperty;

const keyList = Object.keys
const hasProp = Object.prototype.hasOwnProperty

function isArray(value) {
  const _isArray = Array.isArray || (_arg => Object.prototype.toString.call(_arg) === '[object Array]')
  return _isArray(value)
}

function isEmpty(value) {
  if (value === null || value === undefined) return true
  if (isObject(value)) return Object.keys(value).length === 0
  if (isArray(value)) return value.length === 0

  return false
}

function baseGet(object, path) {
  path = path.split('.')

  let index = 0
  const length = path.length

  while (object != null && index < length) {
    object = object[path[index++]]
  }
  return (index && index === length) ? object : undefined
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @see has, hasIn, set, unset
 * @example
 *
 * const object = { 'a': [{ 'b': { 'c': 3 } }] }
 *
 * get(object, 'a[0].b.c')
 * // => 3
 *
 * get(object, ['a', '0', 'b', 'c'])
 * // => 3
 *
 * get(object, 'a.b.c', 'default')
 * // => 'default'
 */
function get(object, path, defaultValue) {
  const result = object == null ? undefined : baseGet(object, path)
  return result === undefined ? defaultValue : result
}

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
  isArray,
  get,
  equal,
  deepEqual,
  isEmpty,
}
