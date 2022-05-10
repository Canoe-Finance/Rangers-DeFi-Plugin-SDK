import { createStore } from '@stencil/store'
import { IState } from 'interface'

const { state, onChange } = createStore<IState>({
  appShow: false,
  loading: false,
  circle: false,
  reload: false,
  chain: {
    chainId: 0,
    chainName: '',
  },
  userAddress: '',
  userBalance: 0,
  receiveAmount: 0,
  sendAmount: 0,
  send: {
    id: 'metafinance',
    code: 'metapoolfinance',
    name: 'MetaFinance',
    symbol: 'MFI',
    address: '0x808f1350dff684C099F4837A01D863fC61A86BC6',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/17365/thumb/meta.PNG?1627435447',
  },
  receive: {
    id: 'tether',
    code: 'tether',
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/325/thumb/Tether-logo.png?1598003707',
    name: 'Tether',
    symbol: 'USDT',
  },
  info: {
    name: '',
    symbol: '',
    image: '',
    state: 0,
    market_cap_rank: 0,
    current_price: '',
    price_change_percentage: '',
    market_cap: '',
    address_count: '',
    liquid: '',
    liquid_value: 0,
    total_volume: '',
  },
})

export { state, onChange }
