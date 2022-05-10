import { Component, h, State, Prop, Watch, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'swap-setting',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapInput {
  inputRef!: HTMLElement

  slippageList = [0.5, 1, 5, 10]

  @Prop({ mutable: true }) visible: boolean = false
  @Prop() slippage: number = 0.5

  @State() thisSlippage: number

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

  _inputKeyDown = e => {
    const { keyCode } = e
    if (keyCode >= 65 && keyCode <= 90) {
      e.preventDefault()
    }
  }
  _inputChange = e => {
    this.thisSlippage = e.target.value
  }
  _inputBlur = () => {
    if (this.thisSlippage > 50) {
      this.thisSlippage = 50
    }
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
              <span class="subtitle">Slippage Tolerance</span>
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
              <div class="btn btn-value-box" onClick={() => this.inputRef.focus()}>
                <input
                  class="input"
                  placeholder="0"
                  type="number"
                  ref={el => (this.inputRef = el as HTMLElement)}
                  value={this.thisSlippage}
                  onInput={this._inputChange}
                  onBlur={this._inputBlur}
                  onKeyDown={this._inputKeyDown}
                />
                <span class="span">%</span>
              </div>
            </div>
          </div>
          <bottom-button class="bottom-button" onClick={this.handleSave}>
            <xy-icon class="icon" slot="prefix" name="ok"></xy-icon>
            SAVE
          </bottom-button>
          <div class="footer">
            Powered by <span>Canoe</span>
          </div>
        </div>

        <div class="close-box" onClick={this.handleClose}>
          <xy-icon name="close"></xy-icon>
        </div>
      </div>
    )
  }
}
