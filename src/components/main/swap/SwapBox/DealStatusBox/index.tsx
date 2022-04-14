import { Component, h, State, Prop, Event, EventEmitter } from '@stencil/core'
import * as workerTimers from 'worker-timers'
import { ITransformTokenInfo } from '../../../../../interface'

@Component({
  tag: 'deal-status-box',
  styleUrl: 'index.scss',
  shadow: true,
})
export class DealStatusBox {
  @State() intervalId: number

  @State() timeout: number = 0
  @State() type: string = 'primary'
  @State() title: string = 'SWAP CONFIRMATION'
  @State() statusIcon: string = '../../../../../assets/icon/transform.svg'
  @State() buttonText: string = 'CONFIRM'

  @Prop() visible: boolean = false
  @Prop() send: ITransformTokenInfo = { symbol: '', logoURI: '' }
  @Prop() receive: ITransformTokenInfo = { symbol: '', logoURI: '' }

  handleButtonClick = () => {
    if (this.type === 'primary') {
      this.setPending()
    } else if (this.type === 'success' || this.type === 'error') {
      // TODO:
      console.log('view swap detail')
    }
  }
  handleViewDetail = () => {
    console.log('view detail')
  }

  setPending = () => {
    this.title = 'PENDING'
    this.type = 'info'
    this.buttonText = 'PENDING'
    this.statusIcon = '../../../../../assets/icon/transforming.svg'
    this.timeout = 60
    this.intervalId = workerTimers.setInterval(() => {
      if (this.timeout > 0) {
        this.timeout--
      } else {
        workerTimers.clearInterval(this.intervalId)
      }
    }, 1000)
    setTimeout(() => {
      this.setSuccess()
      // this.setError()
    }, 3000)
  }

  setSuccess = () => {
    this.timeout = 0
    workerTimers.clearInterval(this.intervalId)
    this.title = 'SWAP succeed'
    this.type = 'success'
    this.buttonText = 'VIEW SWAP DETAIL'
    this.statusIcon = '../../../../../assets/icon/success.svg'
  }
  setError = () => {
    this.timeout = 0
    workerTimers.clearInterval(this.intervalId)
    this.title = 'failure'
    this.type = 'error'
    this.buttonText = 'VIEW SWAP DETAIL'
    this.statusIcon = '../../../../../assets/icon/error.svg'
  }
  setInit = () => {
    this.timeout = 0
    workerTimers.clearInterval(this.intervalId)
    this.title = 'SWAP CONFIRMATION'
    this.type = 'primary'
    this.buttonText = 'CONFIRM'
    this.statusIcon = '../../../../../assets/icon/transform.svg'
  }

  @Event() close: EventEmitter
  handleClose = () => {
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
            <div class="token-price"></div>
          </div>
          <div class="transform-icon">
            <img class="icon" src={this.statusIcon} alt="logo" />
          </div>
          <div class="token-line token-from">
            <img class="token-icon" src={this.receive.logoURI} />
            <div class="token-name">{this.receive.symbol}</div>
            <div class="token-price"></div>
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
