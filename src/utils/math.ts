import Decimal from 'decimal.js-light'

Decimal.set({
  precision: 50,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -18,
  toExpPos: 50,
})

/**
 * Decimal operation: add、sub、mul、div
 * @param {[Number|null, ...String|Number|Decimal]} args
 * @return {String} Decimal String
 */
const numberMath = (args, type) => {
  const [dp, first, ...arr] = args
  const res = arr.reduce((pre, cur) => {
    return pre[type](cur)
  }, new Decimal(first))
  return dp === null ? res.toString() : res.toFixed(dp)
}
export const numberAdd = (...args) => {
  return numberMath(args, 'plus')
}
export const numberSub = (...args) => {
  return numberMath(args, 'minus')
}
export const numberMul = (...args) => {
  return numberMath(args, 'times')
}
export const numberDiv = (...args) => {
  return numberMath(args, 'div')
}
export const isNumberLt = (num1, num2) => {
  return new Decimal(num1).lt(num2)
}
export const isNumberLte = (num1, num2) => {
  return new Decimal(num1).lte(num2)
}
export const isNumberGt = (num1, num2) => {
  return new Decimal(num1).gt(num2)
}
export const isNumberGte = (num1, num2) => {
  return new Decimal(num1).gte(num2)
}
export const isNumberEq = (num1, num2) => {
  return new Decimal(num1).eq(num2)
}
export const isNumberZero = num => {
  return new Decimal(num).isZero()
}
export const formatNumber = (num, decimal = 6) => {
  return new Decimal(num).toDecimalPlaces(decimal, Decimal.ROUND_DOWN).toString()
}
