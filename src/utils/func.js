import config from '@/config'
import chains from '@/lib/chains.js'

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
