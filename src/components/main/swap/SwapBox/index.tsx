import { Component, h, Fragment, Prop, State, Element } from '@stencil/core'
import { state } from '../../../../store'
import { getDodoData } from 'api/axios'
// import bscTokenList from '../../../../tokens/tokenlist-bsc.json'
@Component({
  tag: 'swap-box',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapBox {
  @Element() el: HTMLElement

  @Prop() tokens = []
  @Prop() slippage: number = 5
  @Prop() chainId: number = 1
  @Prop() rpc: string = 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
  @Prop() fromAmount = 10000000000000000000
  resAmount = 0
  @Prop() swapTokenType: string = 'send'
  @State() showSearch: boolean = false
  _openSearch = (type: string) => {
    this.swapTokenType = type
    this.showSearch = !this.showSearch
  }
  _selectToken = async ({ detail }) => {
    const webcomplete = this.el
    const input = webcomplete.shadowRoot.querySelector('search-tokens')
    if (this.swapTokenType === 'send') {
      state.send = detail
    } else {
      state.receive = detail
    }
    const data = await getDodoData(
      state.send.address,
      state.send.decimals,
      state.receive.address,
      state.receive.decimals,
      this.fromAmount,
      this.slippage,
      state.userAddress,
      this.chainId,
      this.rpc,
    )
    console.log(data)
    this.resAmount = data.data.resAmount
    this.showSearch = false
    input.clear()
  }
  componentDidLoad() {
    const webcomplete = this.el
    const input = webcomplete.shadowRoot.querySelector('search-tokens')
    // TODO:
    input.suggestionGenerator = function (text) {
      return fetch('https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link')
        .then(response => response.json())
        .then(data =>
          data.tokens.filter(token => {
            const symbol = token.symbol.toLowerCase()
            return symbol.search(text.toLowerCase()) >= 0
          }),
        )
        .then(tokens =>
          tokens.map(token => {
            return {
              symbol: token.symbol,
              name: token.name,
              logoURI: token.logoURI,
              decimals: token.decimals,
              address: token.address,
              suggestion: `${token.symbol} (${token.name})`,
            }
          }),
        )
    }
  }

  @State() transformInfoVisible: boolean = false
  openTransformInfoBox = () => {
    this.transformInfoVisible = true
  }

  render() {
    return (
      <Fragment>
        <div class="swap-box flex flex-col items-center">
          <div class="grow">
            <swap-input
              token={state.send}
              value={this.fromAmount}
              onOpenSearch={() => this._openSearch('send')}
            ></swap-input>
            <div class="flex items-center justify-end h-[26px] text-[12px]">
              <span>Balance</span>
              <button class="flex items-center w-[25px] h-[13px] bg-[#323645] text-[#A2A8BA] ml-[4px]">MAX</button>
            </div>
            <swap-input
              token={state.receive}
              value={this.resAmount}
              onOpenSearch={() => this._openSearch('receive')}
            ></swap-input>
          </div>
          <bottom-button class="bottom-button" onClick={this.openTransformInfoBox}>
            <xy-icon class="icon" slot="prefix" name="swap-m"></xy-icon>
            SWAP
          </bottom-button>
        </div>

        <xy-dialog open={this.showSearch}>
          <search-tokens onSelected={this._selectToken}></search-tokens>
        </xy-dialog>

        <deal-status-box
          visible={this.transformInfoVisible}
          send={state.send}
          receive={state.receive}
          onClose={() => (this.transformInfoVisible = false)}
        ></deal-status-box>
      </Fragment>
    )
  }
}
