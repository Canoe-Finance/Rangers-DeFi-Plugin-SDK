import { Component, h, Prop } from '@stencil/core'
import { State } from '@stencil/core/internal'
import copy from 'copy-to-clipboard'
import { IState } from 'interface'
import { formatAddress } from '../../../utils/format'

@Component({
  tag: 'meta-rank',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaRank {
  @Prop() state: IState
  @State() copied = false

  handleCopy = () => {
    if (!this.copied) {
      copy(this.state.send.address)
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 5000)
    }
  }

  render() {
    return (
      <section class="coin-info">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img class="coin" src={this.state.info.image} alt="coin" />
            <span class="text-lg font-bold">{this.state.info.name}</span>
            <span class="text-xs info ml-1">{this.state.info.symbol}</span>
          </div>
          <div class="coin-address info flex items-center cursor-pointer" onClick={this.handleCopy}>
            <span>{formatAddress(this.state.send.address)}</span>
            <xy-icon class="ml-2" name={this.copied ? 'check' : 'copy'}></xy-icon>
          </div>
        </div>
        <div class="mt-2">
          <span class="info active">RANK #{this.state.info.market_cap_rank}</span>
          <span class="info">DEX</span>
          <span class="info">COIN</span>
        </div>
      </section>
    )
  }
}
