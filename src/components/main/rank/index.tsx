import { Component, h, Prop } from '@stencil/core'
import { State } from '@stencil/core/internal'
import copy from 'copy-to-clipboard'

import { checkEthereum } from 'api/ethereum'
import { IState } from 'interface'
import { state } from 'store'
import { formatAddress } from '../../../utils/format'

@Component({
  tag: 'canoe-rank',
  styleUrl: 'index.scss',
  shadow: true,
})
export class CanoeRank {
  @Prop() state: IState = state
  @State() copied = false
  @State() isMetaMask = checkEthereum()

  handleCopy = () => {
    if (!this.copied) {
      copy(this.state.send.address)
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 5000)
    }
  }

  handleFont = (txt: string) => {
    if (txt.length > 14) {
      return 'text-xs'
    } else if (txt.length > 10) {
      return 'text-sm'
    } else if (txt.length > 6) {
      return 'text-base'
    }
    return 'text-lg'
  }

  render() {
    return (
      <section class="coin-info">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img class="coin" src={this.state.info.image} alt="coin" />
            <span class={`font-bold truncate ${this.handleFont(this.state.info.name)}`}>{this.state.info.name}</span>
            <span class="text-xs info ml-1">{this.state.info.symbol}</span>
          </div>
          <div class="coin-address info flex items-center cursor-pointer" onClick={this.handleCopy}>
            <span>{formatAddress(this.state.send.address)}</span>
            <xy-icon class="ml-2" name={this.copied ? 'check' : 'copy'}></xy-icon>
          </div>
        </div>
        <div class="mt-2 flex items-center justify-between">
          <div>
            <span class="info active">RANK #{this.state.info.market_cap_rank}</span>
            <span class="info">DEX</span>
            <span class="info">COIN</span>
          </div>
          {!this.isMetaMask && <div class="text-red-500 text-xs">Please Install MetaMask.</div>}
        </div>
      </section>
    )
  }
}
