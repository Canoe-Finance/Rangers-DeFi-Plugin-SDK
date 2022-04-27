import { createStore } from '@stencil/store'
import { IState } from 'interface'
import { getShortAddress } from '../utils/func'

const { state, onChange } = createStore<IState>({
  appShow: true,
  chain: {
    chainId: 0,
    chainName: '',
  },
  userAddress: '',
  userBalance: 0,
  shortUserAddress: '',
  receiveAmount: 0,
  sendAmount: 0,
  send: {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    decimals: 18,
    logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',

    // address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    // decimals: 18,
    // logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png',
    // name: 'Wrapped BNB',
    // symbol: 'WBNB',

    // address: '0xc748673057861a797275CD8A068AbB95A902e8de',
    // decimals: 9,
    // logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png',
    // name: 'DOG',
    // symbol: 'DOG',

    // address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    // decimals: 18,
    // logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png',
    // name: 'bnb',
    // symbol: 'BNB',
  },
  receive: {
    // address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    // name: 'Wrapped Binance',
    // symbol: 'WBNB',
    // decimals: 18,
    // logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7192.png',
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
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

onChange('userAddress', value => {
  state.shortUserAddress = getShortAddress(value)
})

export { state, onChange }
