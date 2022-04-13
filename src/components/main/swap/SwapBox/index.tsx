import { Component, h, Fragment, Prop, State, Element } from '@stencil/core'

import { ITransformTokenInfo, IToken } from '../../../../interface'

import './SwapInput/index'
import './Search/index'
import bscTokenList from '../../../../tokens/tokenlist-bsc.json'
@Component({
  tag: 'swap-box',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapBox {
  @Element() el: HTMLElement
  @Prop() defaultSellToken: IToken = {
    name: 'Ethereum',
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    logoURI:
      'https://raw.githubusercontent.com/complusnetwork/default-token-list/master/src/bsc/0x2170Ed0880ac9A755fd29B2688956BD959F933F8/logo.png',
    symbol: 'ETH',
    decimals: 18,
  }
  @Prop() selectedSellToken: IToken = {
    name: '',
    address: '',
    symbol: '',
    logoURI: '',
    decimals: 0,
  }
  @Prop() tokens = []
  @State() showSearch: boolean = false
  _openSearch = () => {
    this.showSearch = !this.showSearch
  }
  _selectToken = item => {
    const webcomplete = this.el
    const input = webcomplete.shadowRoot.querySelector('search-tokens')
    this.selectedSellToken = item.detail
    console.log('selected', this.selectedSellToken)
    this.showSearch = false
    input.clear()
  }
  componentWillLoad() {
    this.selectedSellToken = this.defaultSellToken
    this.tokens = bscTokenList
  }
  componentDidLoad() {
    const webcomplete = this.el
    const input = webcomplete.shadowRoot.querySelector('search-tokens')
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
  @State() transformFromInfo: ITransformTokenInfo = {
    icon: 'https://wallet-asset.matic.network/img/tokens/eth.svg',
    name: 'ETH',
    price: 0.1569,
  }
  @State() transformToInfo: ITransformTokenInfo = {
    icon: 'https://wallet-asset.matic.network/img/tokens/usdt.svg',
    name: 'BNB',
    price: 1.09191,
  }
  openTransformInfoBox = () => {
    this.transformInfoVisible = true
  }

  render() {
    return (
      <Fragment>
        <div class="swap-box flex flex-col items-center">
          <div class="grow">
            <swap-input token={this.selectedSellToken} onOpenSearch={this._openSearch}></swap-input>
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
          from={this.transformFromInfo}
          to={this.transformToInfo}
          onClose={() => (this.transformInfoVisible = false)}
        ></deal-status-box>
      </Fragment>
    )
  }
}
