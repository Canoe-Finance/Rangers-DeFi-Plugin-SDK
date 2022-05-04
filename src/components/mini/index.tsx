import { Component, Prop, h, Event, EventEmitter } from '@stencil/core'
import { IState } from 'interface'
import { state } from 'store'

@Component({
  tag: 'canoe-mini',
  styleUrl: 'index.scss',
  shadow: true,
})
export class CanoeMini {
  @Prop() mini = []
  @Prop() state: IState = state

  @Event() openSwap: EventEmitter
  private _openSwap = () => {
    this.openSwap.emit()
  }
  render() {
    return (
      this.state.info.image && (
        <div class="mini-chart">
          <base-chart mini={this.mini} state={this.state}></base-chart>
          <div class="mini-container box-border absolute top-0 left-0 flex items-center justify-between w-full h-full">
            <div class="token-part text-lg font-bold text-white flex items-center">
              <div class="token-icon">
                <img src={this.state.info.image} alt="coin" />
              </div>
              <div class="token-info flex flex-col items-start ml-2">
                <div class="token-symbol">{this.state.info.name}</div>
                <div class="token-price flex">
                  <div class="price-value">{this.state.info.current_price}</div>
                  <div class={`ml-2 flex items-center ${this.state.info.state == 0 ? 'red-color' : 'green-color'}`}>
                    <xy-icon
                      class={this.state.info.state == 0 ? 'red-color' : 'green-color'}
                      name={this.state.info.state == 0 ? 'price-down' : 'price-up'}
                    ></xy-icon>
                    {this.state.info.price_change_percentage}%
                  </div>
                </div>
              </div>
            </div>
            <div class="swap-part cursor-pointer" onClick={this._openSwap}>
              <xy-icon class="icon text-[30px]" name="SWAP"></xy-icon>
            </div>
          </div>
        </div>
      )
    )
  }
}
