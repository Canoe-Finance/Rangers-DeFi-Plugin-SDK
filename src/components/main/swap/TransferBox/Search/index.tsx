import { Component, h, Prop, State, Watch, Event, EventEmitter } from '@stencil/core'
import { IChainToken, TCrossType } from 'interface'
import cross from 'data/cross.json'

@Component({
  tag: 'search-cross',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SearchCross {
  @Prop() crossType: TCrossType

  @Prop() fromChain: string

  @Prop() toChain: string

  @Prop() token: IChainToken

  @State() disableSymbol: string = 'RPG'

  @State() cacheList: any[] = cross

  @State() list: any[] = cross

  autocomplete: HTMLDivElement

  timer: NodeJS.Timeout | null = null

  @Watch('crossType')
  watchType(value: TCrossType) {
    this.autocomplete.querySelector('input').value = ''
    if (value === 'fromChain') {
      const result = cross.find(item => item.symbol == this.fromChain)
      if (result) {
        this.disableSymbol = result.symbol
        this.cacheList = cross
        this.list = cross
      }
    } else if (value === 'toChain') {
      const currentChain = cross.find(item => item.symbol == this.fromChain)
      if (currentChain) {
        const result = currentChain.chain.find(item => item.symbol == this.toChain)
        if (result) {
          this.disableSymbol = result.symbol
          this.cacheList = currentChain.chain
          this.list = currentChain.chain
        }
      }
    } else if (value === 'token') {
      const currentFromChain = cross.find(item => item.symbol == this.fromChain)
      if (currentFromChain) {
        const currentToChain = currentFromChain.chain.find(item => item.symbol == this.toChain)
        if (currentToChain) {
          const result = currentToChain.token.find(item => item.symbol == this.token.symbol)
          if (result) {
            this.disableSymbol = result.symbol
            this.cacheList = currentToChain.token
            this.list = currentToChain.token
          }
        }
      }
    }
  }

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
        this.list = this.cacheList.filter(
          item =>
            item.name.toLowerCase().startsWith(value.toLowerCase()) ||
            item.symbol.toLowerCase().startsWith(value.toLowerCase()) ||
            (item.address && item.address.toLowerCase() == value.toLowerCase()),
        )
      } else {
        this.list = this.cacheList
      }
    }, 300)
  }

  handleSelect = (data: any) => {
    const fromChain = this.crossType == 'fromChain' ? data.symbol : this.fromChain
    const toChain = this.crossType == 'toChain' ? data.symbol : this.toChain
    const selectToken = this.crossType == 'token' ? data.symbol : this.token.symbol
    const currentFromChain = cross.find(item => item.symbol == fromChain)
    if (currentFromChain) {
      const currentToChain = currentFromChain.chain.find(item => item.symbol == toChain)
      if (currentToChain) {
        const token = currentToChain.token.find(item => item.symbol == selectToken) || currentToChain.token[0]
        this.selected.emit({
          fromChain,
          toChain,
          token,
        })
        this.autocomplete.querySelector('input').value = ''
        this.disableSymbol = data.symbol
      }
    }
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
                  class={`flex items-center token-info ${this.disableSymbol == item.symbol ? 'token-disable' : ''}`}
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
