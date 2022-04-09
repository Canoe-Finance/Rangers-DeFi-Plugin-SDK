const CHAIN_ID = 'chain-id'
const USER_ADDRESS = 'user-address'
const IS_LOGIN = 'user-login'

export default {
  setChainId: id => {
    window.localStorage.setItem(CHAIN_ID, id)
  },
  getChainId: () => {
    return window.localStorage.getItem(CHAIN_ID)
  },
  rmChainId: () => {
    window.localStorage.removeItem(CHAIN_ID)
  },

  setUserAddress: address => {
    window.localStorage.setItem(USER_ADDRESS, address)
  },
  getUserAddress: () => {
    return window.localStorage.getItem(USER_ADDRESS)
  },
  rmUserAddress: () => {
    window.localStorage.removeItem(USER_ADDRESS)
  },

  setIsLogin: payload => {
    window.localStorage.setItem(IS_LOGIN, payload)
  },
  getIsLogin: () => {
    return window.localStorage.getItem(IS_LOGIN) === 'true'
  },
  rmIsLogin: () => {
    window.localStorage.removeItem(IS_LOGIN)
  },
}
