import { Component, h } from '@stencil/core'
import { getChainList, getShortAddress } from '../../../utils/func'
import { chainItemType } from '../../../interface'
import storage from '../../../utils/storage'
import { hexToNumber } from '../../../api/ethers/utils'
import { state } from '../../../store'
import {
  changeEthereumChainForPc,
  checkEthereum,
  getUserAddress,
  getWindowNetwork,
  requestAccounts,
} from '../../../api/ethereum/index'

@Component({
  tag: 'canoe-header',
  styleUrl: 'index.scss',
  shadow: true,
})
export class CanoeHeader {
  networkPopover!: HTMLElement
  walletPopover!: HTMLElement
  networkList: chainItemType[] = getChainList()

  initNetworkInfo = async () => {
    const windowNetworkId = await getWindowNetwork()
    this.setNetworkInfo(windowNetworkId)
  }
  setNetworkInfo = (chainId: number): void => {
    const item = this.networkList.find(x => x.chainId === chainId)
    if (item) {
      state.chain = item
    } else {
      state.chain = { chainId: 0, chainName: '' }
    }
  }

  handleNetworkChange = chainId => {
    this.networkPopover.removeAttribute('open')
    if (!checkEthereum()) {
      return
    }
    if (chainId !== state.chain.chainId) {
      changeEthereumChainForPc(chainId)
        .then(() => {
          this.setNetworkInfo(chainId)
        })
        .catch(err => {
          const msg = err.message || 'Connect error.'
          console.log('error:', msg)
        })
    }
  }

  initUserAddress = async () => {
    if (storage.getIsLogin()) {
      const userAddress = await getUserAddress()
      if (userAddress) {
        this.setUserAddress(userAddress)
      } else {
        storage.rmIsLogin()
      }
    } else {
      this.setUserAddress('')
    }
  }
  setUserAddress = (address: string) => {
    if (address) {
      storage.setIsLogin(true)
    }
    state.userAddress = address
  }
  handleWalletConnect = async () => {
    if (state.userAddress) {
      this.handleLogout()
      return
    }
    if (!checkEthereum()) {
      return
    }
    try {
      const account = await requestAccounts()
      this.setUserAddress(account)
    } catch (err) {
      // const message = err.message || 'Connect error.'
    }
  }

  handleLogout = () => {
    storage.rmIsLogin()
    this.setUserAddress('')
    this.walletPopover.removeAttribute('open')
  }

  componentDidLoad() {
    if (!checkEthereum()) {
      return
    }
    this.initNetworkInfo()
    this.initUserAddress()

    if (checkEthereum()) {
      window['ethereum'].on('chainChanged', (id: number) => {
        const chainId = hexToNumber(id)
        this.setNetworkInfo(chainId)
      })
      window['ethereum'].on('accountsChanged', (account: string[]) => {
        this.setUserAddress(account[0])
      })
    }
  }

  render() {
    return (
      <header class="flex items-center">
        <div class="header-logo h-full flex flex-1 items-center">
          <img src="https://dex.canoe.finance/assets/icon/favicon.svg" class="w-6" alt="logo" />
          <div class="font-bold">Canoe</div>
        </div>
        <div class="network-container h-full flex items-center">
          <xy-popover class="popover">
            <div class="network-title h-full flex items-center has-right-arrow">
              <xy-icon class="icon" name="earth"></xy-icon>
              <div class="font-bold truncate">{state.chain.chainName ? state.chain.chainName : 'NET'}</div>
            </div>
            <xy-popcon class="popover-content" ref={el => (this.networkPopover = el as HTMLElement)}>
              <div class="popover-list">
                {this.networkList.map(item => (
                  <div
                    class={`popover-item truncate font-bold ${
                      item.chainId === state.chain.chainId ? 'popover-item__active' : ''
                    }`}
                    key={item.chainId}
                    onClick={() => {
                      this.handleNetworkChange(item.chainId)
                    }}
                  >
                    {item.chainName}
                  </div>
                ))}
              </div>
            </xy-popcon>
          </xy-popover>
        </div>
        <div class="wallet-container h-full flex items-center">
          {!state.userAddress ? (
            <div class="wallet-title h-full flex items-center" onClick={this.handleWalletConnect}>
              <xy-icon class="icon" name="wallet"></xy-icon>
              <div class="font-bold">WALLET</div>
            </div>
          ) : (
            <xy-popover class="popover">
              <div class="wallet-title h-full flex items-center has-right-arrow">
                <xy-icon class="icon" name="wallet"></xy-icon>
                <div class="font-bold">{getShortAddress(state.userAddress)}</div>
              </div>
              <xy-popcon class="popover-content" ref={el => (this.walletPopover = el as HTMLElement)}>
                <div class="popover-list">
                  <div class="popover-item font-bold" onClick={this.handleLogout}>
                    LOGOUT
                  </div>
                </div>
              </xy-popcon>
            </xy-popover>
          )}
        </div>
      </header>
    )
  }
}
