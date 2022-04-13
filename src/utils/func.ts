import config from '../config'
import chains from '../lib/chains'
import { chainItemType } from '../interface'

export const copy = data => {
  return JSON.parse(JSON.stringify(data))
}

export const getChainList = (): chainItemType[] => {
  return config.chainIds.map(x => {
    const chain = chains[x]
    return {
      chainName: chain.showName,
      chainId: chain.chainId,
    }
  })
}

export const getShortAddress = (address: string): string => {
  return address ? `${address.substr(0, 4)}...${address.substr(-4)}` : ''
}
