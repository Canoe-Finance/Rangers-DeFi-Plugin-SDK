import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { changeEthereumChainForPc } from '@/api/ethereum/index.js'
import storage from '@/utils/storage.js'
import { getChainList } from '@/utils/func.js'
import styles from './styles.scss'

@customElement('swap-header')
export class SwapHeader extends LitElement {
  static styles = styles
  public networkList = getChainList()
  public currentChainId = storage.getChainId()

  changeNetwork = (chainId: number) => {
    // if (!checkInstallMetamask()) {
    //   return
    // }
    // if (item.id !== currentNetwork.value.id) {
    //   changeEthereumChainForPc(item.id).then(_ => {
    //   // localStore.setNetwork(item) // not set, auto refresh page
    //   }).catch(err => {
    //     const message = err.message || 'Connect error.'
    //     ElNotification.warning({ title: 'Warning Info', message: message })
    //   })
    // }
    changeEthereumChainForPc(chainId).then(res => {
      if (chainId !== this.currentChainId) {
        console.log('change network', res)
        this.currentChainId = chainId
        storage.setChainId(chainId)
      }
    })
  }

  render() {
    return html`
      <div class="container">
        <div class="left">
          <div class="logo">
            <sl-icon src="src/icons/logo.svg" ></sl-icon>
            <span>MetaDEX</span>
          </div>
        </div>
        <div class="right">
          <div class="network">
            <sl-icon src="src/icons/network.svg"></sl-icon>
            <sl-dropdown>
              <span slot="trigger">${this.currentChainId}</span>
              <sl-menu>
                ${this.networkList.map(
                  item => html`
                    <sl-menu-item
                      @click=${() => this.changeNetwork(item.chainId)}
                    >
                      ${item.name}
                    </sl-menu-item>
                  `
                )}
              </sl-menu>
            </sl-dropdown></div
          >
          <div class="account">
            <sl-icon src="src/icons/wallet.svg"></sl-icon>
            <span>WALLAT</span>
          </div>
        </div>
      </div>
    `
  }
}
