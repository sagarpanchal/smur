const config = require('config')
const forOwn = require('lodash/forOwn')
const { DateTime, Duration } = require('luxon')
const clone = require('nanoclone')

const REGEX = require('utils/regex')

const TIMEZONE_IANA = config.get('timezone')
const LOCALE = config.get('locale')

const CURRENCY = 'USD'
const PRECISION = 2
const LUXON_FORMAT = { DATE: 'dd/LL/y', TIME: 'hh:mm a', DATE_TIME: 'dd/LL/y hh:mm a', DURATION: 'hh:mm:ss' }

const runInDevelopment = (callback) => [undefined, '', 'development'].includes(process.env.REACT_APP_ENV) && callback()

const logInfo = (...args) => runInDevelopment(() => console.info(...args)) // eslint-disable-line no-console
const logWarn = (...args) => runInDevelopment(() => console.warn(...args)) // eslint-disable-line no-console
const logError = (...args) => runInDevelopment(() => console.error(...args)) // eslint-disable-line no-console
const logTable = (...args) => runInDevelopment(() => console.table(...args)) // eslint-disable-line no-console

const catchError = (func, onError) => {
  const handleError = (error) => {
    if (onError?.constructor?.name === 'Function') return onError(error)
    throw error
  }
  try {
    const output = func?.()
    return output?.constructor?.name === 'Promise' ? output?.catch?.(handleError) : output
  } catch (error) {
    return handleError(error)
  }
}

const typeOf = (input, type) => input?.constructor?.name === (type ?? null)

const isArray = (input) => typeOf(input, 'Array')

const isObject = (input) => typeOf(input, 'Object')

const isBoolean = (input) => typeOf(input, 'Boolean')

const isString = (input) => typeOf(input, 'String')

const isNumber = (input) => typeOf(input, 'Number') && !Number.isNaN(input) && Number.isFinite(input)

const isNumeric = (input, strict = false) => new RegExp(strict ? REGEX.NUMERIC.STRICT : REGEX.NUMERIC.LOOSE).test(input)

const isAlphaNumeric = (input) => new RegExp(REGEX.ALPHA_NUMERIC).test(input)

const isFunction = (input) => typeOf(input, 'Function')

const callFunction = (func, ...args) => isFunction(func) && func(...args)

const forEach = (instance, callback) => Array.prototype.forEach.call(instance, callback)

const isEmpty = (input, options) => {
  options = { isEmpty: [], isNotEmpty: [], ...options }

  if (options.isEmpty?.includes?.(input)) return true
  if (options.isNotEmpty?.includes?.(input)) return false
  if ([undefined, null].includes(input)) return true

  if (input?.constructor?.name === 'Array') return !input.length
  if (input?.constructor?.name === 'Number') return Number.isNaN(input)
  if (input?.constructor?.name === 'Object') return !Object.keys(input).length
  if (input?.constructor?.name === 'String') return !input.trim().length

  return false
}

const isNotEmpty = (...args) => !isEmpty(...args)

const pruneEmpty = (obj, options) => {
  const prune = (current) => {
    forOwn(current, (value, key) => {
      if (isEmpty(value, options) || ((isObject(value) || isArray(value)) && isEmpty(prune(value), options)))
        delete current[key]
    })
    if (isArray(current)) current = current.filter(isNotEmpty)
    return current
  }
  return prune(clone(obj))
}

const hasKey = (object, key) => {
  return catchError(
    () => Object.keys(object).includes(key),
    () => false
  )
}

const getCurrentTime = () => DateTime.local().setZone(TIMEZONE_IANA)

const formatDateTime = (isoDate, format = LUXON_FORMAT.DATE_TIME) => {
  const dateTime = DateTime.fromISO(isoDate)
  return dateTime.isValid ? dateTime.toFormat(format) : undefined
}

const formatDate = (isoDate, format = LUXON_FORMAT.DATE) => formatDateTime(isoDate, format)

const formatTime = (isoDate, format = LUXON_FORMAT.TIME) => formatDateTime(isoDate, format)

const formatDuration = (duration, format = LUXON_FORMAT.DURATION) =>
  Duration.isDuration(duration) && duration?.isValid ? duration.toFormat(format) : undefined

const getDateTimeDiff = (startISO, endISO) => DateTime.fromISO(endISO).diff(DateTime.fromISO(startISO))

const getFormattedDateTimeDiff = (startISO, endISO, format = LUXON_FORMAT.DURATION) =>
  formatDuration(getDateTimeDiff(startISO, endISO), format)

const formatNumber = (input, options = {}) => {
  if (!isNumber(Number(input))) return input
  const { locale, ...rest } = { locale: LOCALE, ...options }
  const fractionLength = rest?.fractionLength ?? `${input}`.split('.')?.[1]?.length
  const defaults = { maximumFractionDigits: fractionLength, minimumFractionDigits: fractionLength }
  return Intl.NumberFormat(locale, { ...defaults, ...rest }).format(input)
}

const formatCurrency = (input, options = {}) => {
  return formatNumber(input, { style: 'currency', currency: CURRENCY, ...options })
}

const formatDecimal = (input, options = {}) => {
  return formatNumber(input, { fractionLength: PRECISION, options })
}

const parseDecimal = (input, fractionLength = PRECISION) => {
  if (!isNumber(Number(input))) return undefined
  return Number(parseFloat(input).toFixed(fractionLength))
}

const formatFloat = (input, fractionLength = PRECISION) => {
  if (!isNumber(Number(input))) return undefined
  return parseFloat(input).toFixed(fractionLength)
}

const formatInlineList = (input, options = {}) => {
  if (!isString(input)) return input
  const { separator, allowAppend } = { separator: ',', allowAppend: false, ...options }
  const valueList = `${input}`.replace(/[\s,]+/gm, separator).split(separator)
  return valueList
    .filter((value, index) => !isEmpty(value) || (allowAppend && index && valueList?.length === index + 1))
    .join(separator)
}

const sortEntriesByKey = (desc = false) => {
  const n = { less: desc ? 1 : -1, more: desc ? -1 : 1 }
  return (curr, next) => (curr?.[0] < next?.[0] ? n.less : curr?.[0] > next?.[0] ? n.more : 0)
}

const sortArrayByKey = (key = 'id', desc = false) => {
  if (!isString(key)) return undefined
  const n = { less: desc ? 1 : -1, more: desc ? -1 : 1 }
  return (curr, next) => (curr?.[key] < next?.[key] ? n.less : curr?.[key] > next?.[key] ? n.more : 0)
}

const reduceUnique = (key) => {
  return (a = [], c) => {
    const indexFound = a.findIndex((item) => (key === undefined ? item === c : item[key] === c[key]))
    if (indexFound === -1) a.push(c)
    return a
  }
}

const padArray = (list, length, fillWith) => {
  return list.concat(Array(length).fill(fillWith)).slice(0, length)
}

const reduceTotal = (list, key) => {
  if (!isArray(list) || isEmpty(list)) return 0
  const numList = key === undefined ? list.map(Number) : list.map((item) => Number(item?.[key]))
  return numList.filter(isNumber).reduce((pv, cv) => (pv += cv), 0)
}

const classNames = (list) => list.filter(isString).join(' ')

const upperFirst = (input, locale = LOCALE) =>
  isString(input) ? input.replace(/(^[a-z])/, (match) => match.toLocaleUpperCase(locale)) : input

const lowerFirst = (input, locale = LOCALE) =>
  isString(input) ? input.replace(/(^[a-z])/, (match) => match.toLocaleLowerCase(locale)) : input

const upperCase = (input, locale = LOCALE) => (isString(input) ? input.toLocaleUpperCase(locale) : input)

const lowerCase = (input, locale = LOCALE) => (isString(input) ? input.toLocaleLowerCase(locale) : input)

const titleCase = (input, locale = LOCALE) => {
  return catchError(() => {
    if (!isString(input)) return input

    return input
      .split(/([ :–—-])/)
      .map((current, index, list) => {
        return (
          // Check for small words
          current.search(/^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i) > -1 &&
            // Skip first and last word
            index !== 0 &&
            index !== list.length - 1 &&
            // Ignore title end and subtitle start
            list[index - 3] !== ':' &&
            list[index + 1] !== ':' &&
            // Ignore small words that start a hyphenated phrase
            (list[index + 1] !== '-' || (list[index - 1] === '-' && list[index + 1] === '-'))
            ? current.toLocaleLowerCase(locale)
            : current.substr(1).search(/[A-Z]|\../) > -1 // Ignore intentional capitalization
            ? current
            : list[index + 1] === ':' && list[index + 2] !== '' // Ignore URLs
            ? current
            : current.replace(/([A-Za-z0-9\u00C0-\u00FF])/, (match) => match.toLocaleUpperCase(locale)) // Capitalize the first letter
        )
      })
      .join('')
  })
}

const objectToQueryString = (object) => {
  return catchError(
    () => {
      return `?${Object.entries(object)
        .map(([key, value]) => `${key}${!isEmpty(value) && isFunction(value?.toString) ? `=${value.toString()}` : ''}`)
        .join('&')}`
    },
    () => ''
  )
}

const queryStringToObject = (search = '') => {
  return catchError(
    () => {
      return JSON.parse(
        `{"${decodeURI(search.substr(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`
      )
    },
    () => {}
  )
}

exports.runInDevelopment = runInDevelopment
exports.logInfo = logInfo
exports.logWarn = logWarn
exports.logError = logError
exports.logTable = logTable
exports.catchError = catchError
exports.typeOf = typeOf
exports.isArray = isArray
exports.isObject = isObject
exports.isBoolean = isBoolean
exports.isString = isString
exports.isNumber = isNumber
exports.isNumeric = isNumeric
exports.isAlphaNumeric = isAlphaNumeric
exports.isFunction = isFunction
exports.callFunction = callFunction
exports.forEach = forEach
exports.isEmpty = isEmpty
exports.isNotEmpty = isNotEmpty
exports.pruneEmpty = pruneEmpty
exports.hasKey = hasKey
exports.getCurrentTime = getCurrentTime
exports.formatDateTime = formatDateTime
exports.formatDate = formatDate
exports.formatTime = formatTime
exports.formatDuration = formatDuration
exports.getDateTimeDiff = getDateTimeDiff
exports.getFormattedDateTimeDiff = getFormattedDateTimeDiff
exports.formatNumber = formatNumber
exports.formatCurrency = formatCurrency
exports.formatDecimal = formatDecimal
exports.parseDecimal = parseDecimal
exports.formatFloat = formatFloat
exports.formatInlineList = formatInlineList
exports.sortEntriesByKey = sortEntriesByKey
exports.sortArrayByKey = sortArrayByKey
exports.reduceUnique = reduceUnique
exports.padArray = padArray
exports.reduceTotal = reduceTotal
exports.classNames = classNames
exports.upperFirst = upperFirst
exports.lowerFirst = lowerFirst
exports.upperCase = upperCase
exports.lowerCase = lowerCase
exports.titleCase = titleCase
exports.objectToQueryString = objectToQueryString
exports.queryStringToObject = queryStringToObject
