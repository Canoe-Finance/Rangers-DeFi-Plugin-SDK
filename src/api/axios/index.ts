import axios from 'axios'
import { state } from '../../store'
import { url } from './url'

// coingecko api url
const chainName = {
  1: 'ethereum',
  56: 'binance-smart-chain',
  137: 'polygon-pos',
}

/**
 * get coingecko market info
 */
export const getCoinMarketInfo = async (name: string) => {
  const { data } = await axios.get(`${url.market}${name.toLowerCase()}`)
  return data[0]
}

/**
 * get coingecko coin info
 */
export const getCoinInfo = async (chainId: number, address: string) => {
  const { data } = await axios.get(`${url.coins}/${chainName[chainId]}/contract/${address.toLowerCase()}`)
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
 * get mini-chart
 */
export const getMiniChartData = async (name: string) => {
  const apiUrl = url['mini-chart'].replace('name', name.toLowerCase())
  const { data } = await axios.get(apiUrl)
  return data
}

/**
 * get chart
 */
export const getChartData = async (name: string) => {
  const apiUrl = url.chart.replace('name', name.toLowerCase())
  const { data } = await axios.get(apiUrl)
  return data
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
