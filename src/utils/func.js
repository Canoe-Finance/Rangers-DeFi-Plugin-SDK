import chains from '@/lib/chainInfo.js'
import config from '@/config'

export const copy = data => {
  return JSON.parse(JSON.stringify(data))
}


export const getChainList = () => {
  return config.chainIds.map(x => {
    const chain = chains[x]
    return {
      name: chain.showName,
      chainId: chain.chainId,
    }
  })
}
