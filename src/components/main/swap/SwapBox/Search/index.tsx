import { Component, h, State, Event, EventEmitter } from '@stencil/core'
import Autocomplete from '@trevoreyre/autocomplete-js'
import { IToken } from 'interface'
import { throttle } from 'utils'

@Component({
  tag: 'search-tokens',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SearchTokens {
  @State() tokens: IToken[] = []

  autocomplete: HTMLDivElement

  /**
   * Emitted when an item from suggestions was selected
   */
  @Event() selected: EventEmitter

  componentDidLoad() {
    fetch('https://api.1inch.exchange/v4.0/56/tokens')
      .then(response => response.json())
      .then(data => {
        this.tokens = Object.values(data.tokens) as IToken[]
      })
  }

  componentDidRender() {
    new Autocomplete(this.autocomplete, {
      baseClass: 'search',
      search: input => {
        if (!input || input.length < 1) {
          return []
        }
        return this.tokens.filter(token => {
          const value = token.name || token.symbol || token.address
          return value.toLowerCase().startsWith(input.toLowerCase())
        })
      },
      getResultValue: (result: IToken) => result.symbol,
      renderResult: (result: IToken, props) => `
        <li class="flex items-center token-info" ${props}>
          <div class="token-img">
            <img src=${result.logoURI} />
          </div>
          <div class="token-symbol">
            ${result.symbol}
          </div>
          <div class="token-name">
            ${result.name}
          </div>
        </li>`,
      onSubmit: result => {
        throttle(this.selected.emit(result))
      },
    })
  }

  render() {
    return (
      <div class="search" data-position="below" ref={el => (this.autocomplete = el)}>
        <input type="text" class="autocomplete-input" />
        <ul class="result-list"></ul>
      </div>
    )
  }
}
