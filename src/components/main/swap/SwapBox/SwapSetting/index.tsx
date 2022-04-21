import { Component, h, State, Prop, Watch, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'swap-setting',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapInput {
  slippageList = [1, 5, 10]

  @Prop({ mutable: true }) visible: boolean = false
  @Prop() slippage: number = 1

  @State() thisSlippage: number

  componentDidLoad() {
    console.log('componentDidLoad')
  }

  @Watch('visible')
  watchVisible(value) {
    if (value) {
      this.thisSlippage = this.slippage
    }
  }
  @Watch('slippage')
  watchSlippage(value) {
    this.thisSlippage = value
  }

  @Event() close: EventEmitter
  handleClose = () => {
    this.close.emit()
  }

  handleItemSelected = item => {
    this.thisSlippage = item
  }

  @Event() changeSlippage: EventEmitter
  handleSave = () => {
    this.changeSlippage.emit(this.thisSlippage)
    this.handleClose()
  }

  render() {
    return (
      <div
        class={{
          'swap-setting-box': true,
          'swap-setting-box__open': this.visible,
        }}
      >
        <div class="header">
          <div class="title">SWAP SETTING</div>
        </div>
        <div class="content">
          <div class="grow">
            <div class="flex items-center justify-between">
              <span>Slippage Tolerance</span>
              <div class="flex items-center justify-end">
                {this.slippageList.map((item, i) => (
                  <xy-button class="slippage-item" key={i} onClick={() => this.handleItemSelected(item)}>
                    {item}%
                  </xy-button>
                ))}
              </div>
            </div>
            <div class="lint-btn flex items-center justify-between">
              <xy-button class="btn btn-auto" onClick={() => this.handleItemSelected(1)}>
                AUTO
              </xy-button>
              <div class="btn btn-value">{this.thisSlippage}%</div>
            </div>
          </div>
          <bottom-button class="bottom-button" onClick={this.handleSave}>
            <xy-icon class="icon" slot="prefix" name="ok"></xy-icon>
            SAVE
          </bottom-button>
          <div class="footer">
            Powered by <span>MetaDEX</span>
          </div>
        </div>

        <div class="close-box" onClick={this.handleClose}>
          <xy-icon name="close"></xy-icon>
        </div>
      </div>
    )
  }
}
