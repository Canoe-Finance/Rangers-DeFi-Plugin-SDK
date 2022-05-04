import { BigNumber, utils } from 'ethers'

/**
 * toHex
 * @param {String|Number|BigInt|BigNumber} mixed mixed is integer
 * @return {String} A hexadecimal character string
 */
export const toHex = mixed => {
  return utils.hexValue(mixed)
}

/**
 * get bigNumber
 * @param {String|Number|HEX|BigNumber|BigInt} mixed mixed is a integer
 * @return {Object} bigNumber object
 */
export const toBigNumber = mixed => BigNumber.from(mixed)

/**
 * get bigNumber string
 * @param {String|Number|HEX|BigNumber|BigInt} mixed mixed is a integer
 * @return {String} bigNumber string
 */
export const toBigNumberString = mixed => BigNumber.from(mixed).toString()

/**
 * check bigNumber
 * @param {Any} mixed mixed is a integer
 * @return {Boolean} check result
 */
export const isBigNumber = mixed => BigNumber.isBigNumber(mixed)

/**
 * hexadecimal to decimal
 * @param {Hex} hex hexadecimal
 * @return {Number} decimal
 */
export const hexToNumber = hex => parseInt(hex.toString().slice(2), 16)

/**
 * parse and format
 */
export const parseUnits = (value, unit: string | number = 'ether') => {
  return utils.parseUnits(value, unit).toString()
}
export const formatUnits = (value, unit = 'ether') => {
  return utils.formatUnits(value, unit)
}
export const parseEther = value => {
  return utils.parseUnits(value, 'ether').toString()
}
export const formatEther = value => {
  return utils.formatUnits(value, 'ether')
}
export const parseGwei = value => {
  return utils.parseUnits(value, 'gwei').toString()
}
export const formatGwei = value => {
  return utils.formatUnits(value, 'gwei')
}
export const parseWei = value => {
  return utils.parseUnits(value, 'wei').toString()
}
export const formatWei = value => {
  return utils.formatUnits(value, 'wei')
}
