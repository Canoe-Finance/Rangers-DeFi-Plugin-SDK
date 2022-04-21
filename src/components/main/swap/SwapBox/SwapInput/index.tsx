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
  @Prop() value: number = 0
  @Event() tokenBlur: EventEmitter
  @Event() updateValue: EventEmitter
  @Event() openSearch: EventEmitter

  private onBlur = () => {
    this.tokenBlur.emit()
  }
  private _openSearch = () => {
    this.openSearch.emit()
  }

  _blockInvalidChar = e => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
  _updateValue = (e: any) => {
    this.updateValue.emit(e.target.value)
  }
  render() {
    return (
      <div class="input-container">
        <div class="token-info" onClick={this._openSearch}>
          <img src={this.token.logoURI} class="token-logo" />
          <span class="token-symbol">{this.token.symbol}</span>
        </div>
        <input
          class="customs focus:outline-none"
          placeholder="0"
          type="number"
          value={this.value}
          onInput={this._updateValue}
          onBlur={this.onBlur}
          onKeyDown={this._blockInvalidChar}
        />
      </div>
    )
  }
}
