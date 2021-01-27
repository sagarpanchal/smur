const Luxon = require('luxon')
const config = require('config')

const ianaTimezone = config.get('zoneInfo')
const ianaLocale = config.get('locale')

const Utils = {}

Utils.isArray = (input) => input?.constructor === Array
Utils.isBoolean = (input) => input?.constructor === Boolean
Utils.isFunction = (input) => input?.constructor === Function
Utils.isNumber = (input) => input?.constructor === Number && !Number?.isNaN(input)
Utils.isNumeric = (input) => /^[+-]?[\d]*[.]?[\d]*$/gm.test(input)
Utils.isObject = (input) => input?.constructor === Object
Utils.isString = (input) => input?.constructor === String

Utils.forEach = (instance, callback) => Array.prototype.forEach.call(instance, callback)
Utils.sortArrayByKey = (key = 'id', desc = false) => {
  if (!this.isString(key)) return undefined
  const n = { less: desc ? 1 : -1, more: desc ? -1 : 1 }
  return (curr, next) => (curr?.[key] < next?.[key] ? n.less : curr?.[key] > next?.[key] ? n.more : 0)
}

Utils.hasKey = (object, key) => this.isObject(object) && !this.isEmpty(object) && Object.keys(object).includes(key)

Utils.callIfExists = (func, args = []) => this.isFunction(func) && func(...args)

Utils.isEmpty = (input) => {
  if (this.isArray(input)) return !input?.length
  if (this.isObject(input)) return !Object.keys(input)?.length
  return [undefined, null, NaN, ''].includes(input)
}
Utils.isNotEmpty = (...args) => !this.isEmpty(...args)
Utils.returnIfNotEmpty = (value, replaceWith) => (this.isEmpty(value) ? replaceWith : value)

Utils.runInEnv = (env = 'development', callback) => (process.env.NODE_ENV === env ? callback() : undefined)
Utils.runInDevelopment = (callback) => this.runInEnv('development', callback)
Utils.runInProduction = (callback) => this.runInEnv('production', callback)

Utils.getCurrentTime = () => Luxon.DateTime.local().setZone(ianaTimezone)

Utils.formatDate = (isoDate, format = 'dd/LL/y') => {
  const output = Luxon.DateTime.fromISO(isoDate).toFormat(format)
  return this.isEmpty(output) || ['Invalid DateTime'].includes(output) ? undefined : output
}

Utils.formatTime = (isoDate, format = 'hh:mm a') => {
  const output = Luxon.DateTime.fromISO(isoDate).toFormat(format)
  return this.isEmpty(output) || ['Invalid DateTime'].includes(output) ? undefined : output
}

Utils.formatDateTime = (isoDate, format = 'dd/LL/y | hh:mm a') => {
  const output = Luxon.DateTime.fromISO(isoDate).toFormat(format)
  return this.isEmpty(output) || ['Invalid DateTime'].includes(output) ? undefined : output
}

Utils.formatNumber = (input, options = {}) => {
  if (!this.isNumber(Number(input))) return input
  const { locale, trimFractions, ...rest } = { locale: ianaLocale, trimFractions: false, ...options }
  const fractionLength = trimFractions ? rest?.fractionLength : `${input}`.split('.')?.[1]?.length
  const defaults = { maximumFractionDigits: fractionLength, minimumFractionDigits: fractionLength }
  return new Intl.NumberFormat(locale, { ...defaults, ...rest }).format(input)
}

Utils.formatCurrency = (number, options = {}) => {
  const { locale, ...rest } = { locale: ianaLocale, currency: 'USD', ...options }
  return new Intl.NumberFormat(locale, { style: 'currency', ...rest }).format(number)
}

Utils.formatInlineList = (value, options = {}) => {
  if (!this.isString(value)) return
  const { separator, allowAppend } = { separator: ',', allowAppend: false, ...options }
  const valueList = `${value}`.replace(/[\s,]+/gm, separator).split(separator)
  return valueList
    .filter((value, index) => !this.isEmpty(value) || (allowAppend && valueList.length === index + 1))
    .join(separator)
}

Utils.objectToQueryString = (object) => {
  return `?${Object.keys(object)
    .map((key) => `${key}=${object?.[key]?.toString ? object[key].toString() : ''}`)
    .join('&')}`
}

Utils.queryStringToObject = (location) => {
  return this.isString(location?.search)
    ? JSON.parse(
        `{"${decodeURI(location.search.substr(1)).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`
      )
    : {}
}

module.exports = Utils
