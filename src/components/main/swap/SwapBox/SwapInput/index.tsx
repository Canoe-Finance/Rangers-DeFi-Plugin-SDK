import { Component, h, Prop, Event, EventEmitter } from '@stencil/core'

import { IToken } from '../../../../../interface'
@Component({
  tag: 'swap-input',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapInput {
  @Prop() token: IToken = {
    name: '',
    address: '',
    symbol: '',
    logoURI: '',
    decimals: 0,
  }
  @Event() openSearch: EventEmitter

  private _openSearch = () => {
    this.openSearch.emit()
  }

  render() {
    return (
      <div class="input-container">
        <div class="token-info" onClick={this._openSearch}>
          <img src={this.token.logoURI} class="token-logo" />
          <span class="token-symbol">{this.token.symbol}</span>
        </div>
        <input class="customs" placeholder="0" inputmode="numeric" type="text" />
      </div>
    )
  }
}
