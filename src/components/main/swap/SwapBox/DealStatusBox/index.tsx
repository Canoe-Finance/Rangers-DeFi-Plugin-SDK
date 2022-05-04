import { Component, h, State, Prop, Event, EventEmitter } from '@stencil/core'
import * as workerTimers from 'worker-timers'
import { ITransformTokenInfo } from '../../../../../interface'
import { dodoSwap } from 'api/ethers/dodo'
import { getBlockExplorerUrls } from 'utils/func'
import { state } from 'store'

@Component({
  tag: 'deal-status-box',
  styleUrl: 'index.scss',
  shadow: true,
})
export class DealStatusBox {
  hash = ''
  @State() intervalId = null
  @State() timeout: number = 0
  @State() type: string = 'primary'
  @State() title: string = 'SWAP CONFIRMATION'
  @State() statusIcon: string = 'https://g-dex.canoe.finance/assets/icon/transform.svg'
  @State() buttonText: string = 'CONFIRM'

  @Prop() visible: boolean = false
  @Prop() swapData = null
  @Prop() send: ITransformTokenInfo = { symbol: '', logoURI: '' }
  @Prop() receive: ITransformTokenInfo = { symbol: '', logoURI: '' }

  handleButtonClick = () => {
    if (this.type === 'primary') {
      this.setPending()
    } else if (this.type === 'success' || this.type === 'error') {
      if (this.hash) {
        const url = getBlockExplorerUrls(state.chain.chainId) + '/tx/' + this.hash
        window.open(url)
      }
    }
  }
  setPending = async () => {
    try {
      this.hash = ''
      this.title = 'PENDING'
      this.type = 'info'
      this.buttonText = 'PENDING'
      this.statusIcon = 'https://g-dex.canoe.finance/assets/icon/transforming.svg'
      const tx = await dodoSwap(this.swapData)
      this.hash = tx.hash
      this.timeout = 60
      if (this.intervalId) {
        workerTimers.clearInterval(this.intervalId)
      }

      this.intervalId = workerTimers.setInterval(() => {
        if (this.timeout > 0) {
          this.timeout--
        } else {
          this.setError()
          workerTimers.clearInterval(this.intervalId)
        }
      }, 1000)
      await tx.wait()
      this.setSuccess()
      workerTimers.clearInterval(this.intervalId)
    } catch (e) {
      this.setError()
      workerTimers.clearInterval(this.intervalId)
    }
  }

  setSuccess = () => {
    this.timeout = 0
    workerTimers.clearInterval(this.intervalId)
    this.title = 'SWAP succeed'
    this.type = 'success'
    this.buttonText = 'VIEW SWAP DETAIL'
    this.statusIcon = 'https://g-dex.canoe.finance/assets/icon/success.svg'
  }
  setError = () => {
    this.timeout = 0
    workerTimers.clearInterval(this.intervalId)
    this.title = 'failure'
    this.type = 'error'
    this.buttonText = this.hash ? 'VIEW SWAP DETAIL' : 'ERROR'
    this.statusIcon = 'https://g-dex.canoe.finance/assets/icon/error.svg'
  }
  setInit = () => {
    this.timeout = 0
    workerTimers.clearInterval(this.intervalId)
    this.title = 'SWAP CONFIRMATION'
    this.type = 'primary'
    this.buttonText = 'CONFIRM'
    this.statusIcon = 'https://g-dex.canoe.finance/assets/icon/transform.svg'
  }

  @Event() close: EventEmitter
  handleClose = () => {
    this.hash = ''
    this.setInit()
    this.close.emit()
  }

  render() {
    return (
      <div
        class={{
          'deal-status-box': true,
          'deal-status-box__open': this.visible,
        }}
      >
        <div
          class={{
            title: true,
            title__success: this.type === 'success',
            title__error: this.type === 'error',
          }}
        >
          {this.title}
        </div>
        <div class="content">
          <div class="token-line token-from">
            <img class="token-icon" src={this.send.logoURI} />
            <div class="token-name">{this.send.symbol}</div>
            <div class="token-price">{this.swapData.showFromAmount}</div>
          </div>
          <div class="transform-icon">
            <img class="icon" src={this.statusIcon} alt="logo" />
          </div>
          <div class="token-line token-from">
            <img class="token-icon" src={this.receive.logoURI} />
            <div class="token-name">{this.receive.symbol}</div>
            <div class="token-price">{this.swapData.showToAmount}</div>
          </div>
        </div>
        <bottom-button type={this.type} loading={this.type === 'info'} onClick={this.handleButtonClick}>
          {this.buttonText}
          {this.timeout > 0 ? (
            <span class="button-suffix" slot="suffix">
              {this.timeout}S
            </span>
          ) : (
            ''
          )}
        </bottom-button>

        <div class="close-box" onClick={this.handleClose}>
          <xy-icon name="close"></xy-icon>
        </div>
      </div>
    )
  }
}
