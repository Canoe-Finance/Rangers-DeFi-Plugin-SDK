export interface IChartData {
  close: number
  high: number
  low: number
  open: number
  timestamp: number
  volume: number
}

export interface chainItemType {
  chainName: string
  chainId: number
}

export interface IMarkerData {
  name: string
  symbol: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
}

export interface IToken {
  name: string
  address: string
  decimals: number
  symbol: string
  logoURI: string
}

export interface ITransformTokenInfo {
  logoURI: string
  symbol: string
}
export interface IInfo {
  name: string
  symbol: string
  image: string
  state: 0 | 1
  market_cap_rank: number
  current_price: string
  price_change_percentage: string
  market_cap: string
  address_count: string
  liquid: string
  liquid_value: number
  total_volume: string
}

export interface IState {
  appShow: boolean
  chain: chainItemType
  userAddress: string
  userBalance: number
  shortUserAddress: string
  send: IToken
  receive: IToken
  info: IInfo
}

export interface IDodoRouterRes {
  type: string
  resAmount: number
  priceImpact: number
  resPricePerFromToken: number
  resPricePerToToken: number
  useSource: string
}
