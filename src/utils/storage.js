
const CHAINID = 'chain-id'

export default {
  setChainId: id => {
    window.localStorage.setItem(CHAINID, id)
  },
  getChainId: () => {
    return window.localStorage.getItem(CHAINID)
  },
  rmChainId: () => {
    window.localStorage.removeItem(CHAINID)
  },
}
