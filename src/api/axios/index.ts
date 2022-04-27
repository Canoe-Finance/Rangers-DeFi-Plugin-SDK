import axios from 'axios'
import { state } from '../../store'
import { url } from './url'

/**
 * get coingecko market info
 */
export const getCoinMarketInfo = async (name: string) => {
  const { data } = await axios.get(`${url.market}${name.toLowerCase()}`)
  return data[0]
}

/**
 * get holds
 */
export const getHolders = async (name: string) => {
  const { data } = await axios.get(`${url.holders}${name.toLowerCase()}`)
  return data.data.top.addrcount
}

/**
 * get chart
 */
export const getChartData = async (send: string, receive: string, from: string, to: string) => {
  const apiUrl = `${url.chart}${send}/${receive}&interval=15m&limit=96&addresses=${from}/${to}&network=bsc-mainnet`
  const { data } = await axios.get(apiUrl)
  return data.data
}

/**
 * get dodo api data
 */
export const getDodoData = ({
  fromTokenAddress,
  fromTokenDecimals,
  toTokenAddress,
  toTokenDecimals,
  fromAmount,
  slippage,
}) => {
  const params = {
    fromTokenAddress: fromTokenAddress,
    fromTokenDecimals: fromTokenDecimals,
    toTokenAddress: toTokenAddress,
    toTokenDecimals: toTokenDecimals,
    fromAmount: fromAmount,
    slippage: slippage,
    userAddr: '0x257Dc3a71607044F281B24c7A48A0a9D544e769D',
    chainId: state.chain.chainId,
    rpc: '',
  }
  return axios.get(url.router, { params: params }).then(res => {
    if (res.status === 200) {
      return res.data.data
    } else {
      return Promise.reject(res.data.data)
    }
  })
}
