const config = require('config')
const { DateTime } = require('luxon')
const { NUMERIC } = require('./regex')

const ianaTimezone = config.get('timezone')
const ianaLocale = config.get('locale')

exports.typeOf = (input, type) => input?.constructor?.name === type
exports.isArray = (input) => this.typeOf(input, 'Array')
exports.isBoolean = (input) => this.typeOf(input, 'Boolean')
exports.isFunction = (input) => this.typeOf(input, 'Function')
exports.isNumber = (input) => this.typeOf(input, 'Number') && !Number?.isNaN(input)
exports.isNumeric = (input, strict = true) => new RegExp(strict ? NUMERIC.STRICT : NUMERIC.LOOSE).test(input)
exports.isObject = (input) => this.typeOf(input, 'Object')
exports.isString = (input) => this.typeOf(input, 'String')

exports.forEach = (instance, callback) => Array.prototype.forEach.call(instance, callback)
exports.sortArrayByKey = (key = 'id', desc = false) => {
  if (!this.isString(key)) return undefined
  const n = { less: desc ? 1 : -1, more: desc ? -1 : 1 }
  return (curr, next) => (curr?.[key] < next?.[key] ? n.less : curr?.[key] > next?.[key] ? n.more : 0)
}

exports.hasKey = (object, key) => this.isObject(object) && !this.isEmpty(object) && Object.keys(object).includes(key)

exports.callIfExists = (func, args = []) => this.isFunction(func) && func(...args)

exports.isEmpty = (input) => {
  if (this.isArray(input)) return !input?.length
  if (this.isObject(input)) return !Object.keys(input)?.length
  return [undefined, null, NaN, ''].includes(input)
}
exports.isNotEmpty = (...args) => !this.isEmpty(...args)
exports.returnIfNotEmpty = (value, replaceWith) => (this.isEmpty(value) ? replaceWith : value)

exports.runInEnv = (env, callback) => (process.env.NODE_ENV === env ? callback() : undefined)
exports.runInDevelopment = (callback) => this.runInEnv('development', callback)
exports.runInProduction = (callback) => this.runInEnv('production', callback)

exports.getCurrentTime = () => DateTime.local().setZone(ianaTimezone)

exports.formatDate = (isoDate, format = 'dd/LL/y') => {
  const output = DateTime.fromISO(isoDate).toFormat(format)
  return this.isEmpty(output) || ['Invalid DateTime'].includes(output) ? undefined : output
}

exports.formatTime = (isoDate, format = 'hh:mm a') => {
  const output = DateTime.fromISO(isoDate).toFormat(format)
  return this.isEmpty(output) || ['Invalid DateTime'].includes(output) ? undefined : output
}

exports.formatDateTime = (isoDate, format = 'dd/LL/y | hh:mm a') => {
  const output = DateTime.fromISO(isoDate).toFormat(format)
  return this.isEmpty(output) || ['Invalid DateTime'].includes(output) ? undefined : output
}

exports.formatNumber = (input, options = {}) => {
  if (!this.isNumber(Number(input))) return input
  const { locale, trimFractions, ...rest } = { locale: ianaLocale, trimFractions: false, ...options }
  const fractionLength = trimFractions ? rest?.fractionLength : `${input}`.split('.')?.[1]?.length
  const defaults = { maximumFractionDigits: fractionLength, minimumFractionDigits: fractionLength }
  return new Intl.NumberFormat(locale, { ...defaults, ...rest }).format(input)
}

exports.formatCurrency = (number, options = {}) => {
  const { locale, ...rest } = { locale: ianaLocale, currency: 'USD', ...options }
  return new Intl.NumberFormat(locale, { style: 'currency', ...rest }).format(number)
}

exports.formatInlineList = (value, options = {}) => {
  if (!this.isString(value)) return
  const { separator, allowAppend } = { separator: ',', allowAppend: false, ...options }
  const valueList = `${value}`.replace(/[\s,]+/gm, separator).split(separator)
  return valueList
    .filter((value, index) => !this.isEmpty(value) || (allowAppend && valueList.length === index + 1))
    .join(separator)
}

exports.objectToQueryString = (object) => {
  return `?${Object.keys(object)
    .map((key) => `${key}=${object?.[key]?.toString ? object[key].toString() : ''}`)
    .join('&')}`
}

exports.queryStringToObject = (location) => {
  return this.isString(location?.search)
    ? JSON.parse(
        `{"${decodeURI(location.search.substr(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`
      )
    : {}
}
