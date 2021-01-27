const Utils = require('utils/utils')

test('should identify Boolean value', () => {
  expect(Utils.isBoolean(true)).toBe(true)
  expect(Utils.isBoolean(1)).toBe(false)
})

test('should identify Number value', () => {
  expect(Utils.isNumber(1)).toBe(true)
  expect(Utils.isNumber('1')).toBe(false)
})

test('should identify String value', () => {
  expect(Utils.isString('1')).toBe(true)
  expect(Utils.isString(1)).toBe(false)
})

test('should identify Array value', () => {
  expect(Utils.isArray(new Array(2))).toBe(true)
  expect(Utils.isArray([])).toBe(true)
  expect(Utils.isArray('')).toBe(false)
})

test('should identify Object value', () => {
  expect(Utils.isObject(new Object())).toBe(true)
  expect(Utils.isObject({})).toBe(true)
  expect(Utils.isObject([])).toBe(false)
  expect(Utils.isObject(new Date())).toBe(false)
})

test('should identify Numeric value', () => {
  expect(Utils.isNumeric(-100.001)).toBe(true)
  expect(Utils.isNumeric('-01.001')).toBe(true)
  expect(Utils.isNumeric('-01.0.0')).toBe(false)
  expect(Utils.isNumeric('as0f0asasdf')).toBe(false)
})
