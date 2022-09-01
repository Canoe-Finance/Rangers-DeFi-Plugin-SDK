import { Component, h, Prop, Event, EventEmitter } from '@stencil/core'

import { IToken, ICrossToken } from '../../../../../interface'
@Component({
  tag: 'swap-input',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapInput {
  @Prop() token: IToken | ICrossToken = {
    id: '',
    code: '',
    name: '',
    address: '',
    symbol: '',
    logoURI: '',
    decimals: 0,
  }
  @Prop() value: string | number = 0
  @Prop() readonly: boolean = false

  @Event() updateValue: EventEmitter
  @Event() openSearch: EventEmitter

  private _openSearch = () => {
    this.openSearch.emit()
  }

  handleInput = e => {
    let value = e.target.value
    if (/^0[0-9]/.test(value)) {
      value = '0'
    } else if (value == '.') {
      value = '0.'
    } else {
      const regex = new RegExp(`^\\D*(\\d*(?:\\.\\d{0,${this.token.decimals}})?).*$`, 'g')
      value = value.replace(regex, '$1')
    }
    e.target.value = value
    this.updateValue.emit(value)
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
          readonly={this.readonly}
          value={this.value}
          onInput={this.handleInput}
          placeholder="0.0"
        />
      </div>
    )
  }
}
