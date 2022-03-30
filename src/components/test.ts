import InputDataDecoder from 'ethereum-input-data-decoder'
import { ethers } from 'ethers'
import { css, html, LitElement } from 'lit'
import {
  customElement,
  property
} from 'lit/decorators.js'

import dodoABI from '../abi/dodoABI.json'
import metaDexSwap from '../abi/metaDexABI.json'

@customElement('connect-button')
export class ConnectButton extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
    }
    button {
      background: #0074d9;
      border: none;
      color: white;
      padding: 15px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
    }
  `
  @property()
  address?: string

  @property()
  fromTokenAddress =
    '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
  fromTokenDecimals = 18
  toTokenDecimals = 18
  toTokenAddress =
    '0x55d398326f99059fF775485246999027B3197955'
  fromAmount = '1416502301092000'
  render() {
    return html`
      <button @click=${this.connect}
        >${this.address?.length
          ? this.address
          : 'connect'}</button
      >
    `
  }
  async connect() {
    const provider =
      new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      )

    const account = await this.connectAccount(
      provider
    )
    this.address = account
    const balance = await provider.getBalance(
      account
    )
    console.log(ethers.utils.formatEther(balance))
    this.getDodoAPI()
    this.metadexSwap(provider)
  }
  async connectAccount(provider: any) {
    const signer = provider.getSigner()
    return await signer.getAddress()
  }
  async getDodoAPI() {
    fetch(
      'https://route-api.dodoex.io/dodoapi/getdodoroute?fromTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&fromTokenDecimals=18&toTokenAddress=0x55d398326f99059fF775485246999027B3197955&toTokenDecimals=18&fromAmount=1416502301092817991&slippage=5&userAddr=0xFdab977F215436FF8ec79AbF3A598f7e8766b1dA&chainId=56&rpc=https://bsc-dataseed1.binance.org/'
    )
      .then(response => response.json())
      .then(res => {
        this.dataDecoder(res.data.data)
      })
  }
  async metadexSwap(provider: any) {
    const contractAddress =
      '0xFdab977F215436FF8ec79AbF3A598f7e8766b1dA'
    const signer = provider.getSigner()
    const metaDexContract = new ethers.Contract(
      contractAddress,
      metaDexSwap,
      signer
    )
    await metaDexContract.externalSwap(
      'ymg',
      [
        '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        '0x6B3D817814eABc984d51896b1015C0b89E9737Ca',
        this.fromTokenAddress,
        this.toTokenAddress
      ],
      '0x0000000000000000000000000000000000000000',
      '0xDef1C0ded9bec7F1a1670819833240f027b25EfF',
      this.fromAmount,
      '0xc43c9ef6000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000013a86d5680292c4700000000000000000000000000000000000000000000001d0cc298f8c3598cd300000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000002000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000055d398326f99059ff775485246999027b3197955869584cd000000000000000000000000221d5c4993297fd95fa17743b9297e2e49fce9d20000000000000000000000000000000000000000000000c598cce8b462283348',
      false,
      {
        value: this.fromAmount
      }
    )
  }

  dataDecoder(data: string) {
    const decoder = new InputDataDecoder(dodoABI)
    const result = decoder.decodeData(data)
    console.log(result)
  }
}
@customElement('twitter-item')
export class TwitterItem extends LitElement {
  static styles = css`
    .tweet {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }
    .tweet-text {
      font-size: 14px;
      line-height: 1.5;
      word-break: break-all;
      color: red;
    }
  `
  @property()
  text?: string

  render() {
    return html`
      <div class="tweet">
        <div class="tweet-text">${this.text}</div>
      </div>
    `
  }
}

@customElement('twitter-list')
export class TwitterList extends LitElement {
  static styles = css`
    .tweet-list {
      display: flex;
      flex-direction: column;
      align-items: felex-start;
    }
  `
  @property({ type: Array })
  tweets: { name: string }[] = []

  @property()
  showList = false
  private _toggle() {
    if (this.tweets.length === 0) {
      this._getList()
    }
    this.showList = !this.showList
  }

  private _getList() {
    fetch('https://swapi.dev/api/people/')
      .then(res => res.json())
      .then(tweets => {
        this.tweets = tweets.results
      })
  }

  render() {
    return html`
      <button @click=${this._toggle}
        >Toggle</button
      >
      ${this.showList
        ? html`
            <div class="tweet-list">
              ${this.tweets.map(
                tweet => html`
                  <twitter-item
                    text=${tweet.name}
                  ></twitter-item>
                `
              )}
            </div>
          `
        : ''}
    `
  }
}
