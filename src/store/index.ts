import { createStore } from '@stencil/store'
import { IState } from 'interface'
import { getShortAddress } from '../utils/func'

const { state, onChange } = createStore<IState>({
  chain: {
    chainId: 0,
    chainName: '',
  },
  userAddress: '',
  shortUserAddress: '',
  send: {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
  },
  receive: {
    name: '',
    symbol: '',
    address: '',
    decimals: 0,
    logoURI: '',
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

onChange('userAddress', value => {
  state.shortUserAddress = getShortAddress(value)
})

export { state, onChange }
