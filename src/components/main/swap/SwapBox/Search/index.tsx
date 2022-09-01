import { Component, h, Prop, State, Event, EventEmitter } from '@stencil/core'
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

  @State() list: IToken[] = tokens

  autocomplete: HTMLDivElement

  timer: NodeJS.Timeout | null = null

  /**
   * Emitted when an item from suggestions was selected
   */
  @Event() selected: EventEmitter

  handleInput = e => {
    const value = e.target.value
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      if (value) {
        this.list = tokens.filter(
          token =>
            token.name.toLowerCase().startsWith(value.toLowerCase()) ||
            token.symbol.toLowerCase().startsWith(value.toLowerCase()) ||
            token.address.toLowerCase() == value.toLowerCase(),
        )
      } else {
        this.list = tokens
      }
    }, 300)
  }

  handleSelect = (token: IToken) => {
    this.selected.emit(token)
    this.autocomplete.querySelector('input').value = ''
    this.list = tokens
  }

  componentDidLoad() {
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
      <div class="search" ref={el => (this.autocomplete = el)}>
        <input class="autocomplete-input" onInput={this.handleInput} placeholder="Search name or paste address" />
        <ul class={`result-list ${this.list.length ? '' : 'flex flex-col items-center justify-center'}`}>
          {this.list.length ? (
            this.list.map(item => {
              return (
                <li
                  class={`flex items-center token-info ${this.disableAddress == item.address ? 'token-disable' : ''}`}
                  onClick={() => this.handleSelect(item)}
                >
                  <div class="token-img">
                    <img src={item.logoURI} />
                  </div>
                  <div class="token-symbol">{item.symbol}</div>
                  <div class="token-name">{item.name}</div>
                </li>
              )
            })
          ) : (
            <div class="flex flex-col items-center justify-center">
              <div>
                <xy-icon name="frown" size="30"></xy-icon>
              </div>
              <div class="mt-2 text-sm">No Data</div>
            </div>
          )}
        </ul>
      </div>
    )
  }
}
