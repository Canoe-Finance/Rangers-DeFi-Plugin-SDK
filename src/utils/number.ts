import numabbr, { NumberAbbreviate } from 'numabbr'

export const toDecimal2NoZero = (num: number) => {
  const f = Math.round(Math.abs(num) * 100) / 100
  const s = f.toString()
  return s
}

export const formatNumber = (num: number) => {
  return numabbr(Math.abs(num), { precision: 2 })
}

export const formatAddressNumber = (num: number) => {
  const abbr = new NumberAbbreviate({
    M: 1000000,
    B: 1000000000,
    T: 1000000000000,
  })
  return abbr.abbreviate(num, { precision: 2, commatize: { division: 3 } })
}
