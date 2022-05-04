import config from '../config'
import chains from '../lib/chains'
import { chainItemType } from '../interface'

export const copy = data => {
  return JSON.parse(JSON.stringify(data))
}

export const getBlockExplorerUrls = (id: number): string => {
  return chains[id].blockExplorerUrls[0]
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

export const showEthersError = info => {
  // TODO:
  console.log('ethers error:', info.message)
  // ElNotification.warning({
  //   title: 'Error Info',
  //   message: info.message || '',
  // })
}
