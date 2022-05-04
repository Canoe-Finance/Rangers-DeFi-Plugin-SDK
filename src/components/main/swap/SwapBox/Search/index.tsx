import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core'
import Autocomplete from '@trevoreyre/autocomplete-js'
import { IToken } from 'interface'
import { state, onChange } from 'store'
import tokens from 'tokens/bsc.json'

@Component({
  tag: 'search-tokens',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SearchTokens {
  @Prop() swapTokenType: string

  @State() disableAddress: string = state.send.address

  autocomplete: HTMLDivElement

  timer: any = 0

  /**
   * Emitted when an item from suggestions was selected
   */
  @Event() selected: EventEmitter

  componentDidRender() {
    new Autocomplete(this.autocomplete, {
      baseClass: 'search',
      search: input => {
        if (!input || input.length < 1) {
          return []
        }
        return tokens.filter(token => {
          return (
            token.name.toLowerCase().startsWith(input.toLowerCase()) ||
            token.symbol.toLowerCase().startsWith(input.toLowerCase()) ||
            token.address.toLowerCase() == input.toLowerCase()
          )
        })
      },
      getResultValue: (result: IToken) => result.symbol,
      renderResult: (result: IToken, props) => `
        <li class="flex items-center token-info ${
          this.disableAddress == result.address ? 'token-disable' : ''
        }" ${props}>
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
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(() => {
          this.selected.emit(result)
          this.autocomplete.querySelector('input').value = ''
        }, 300)
      },
    })

    onChange('send', val => {
      if (this.swapTokenType == 'send') {
        this.disableAddress = val.address
      }
    })

    onChange('receive', val => {
      if (this.swapTokenType == 'receive') {
        this.disableAddress = val.address
      }
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
