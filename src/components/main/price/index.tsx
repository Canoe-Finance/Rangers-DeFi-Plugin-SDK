import { Component, Prop, h } from '@stencil/core'
import { IState } from 'interface'
import { state } from 'store'

@Component({
  tag: 'canoe-price',
  styleUrl: 'index.scss',
  shadow: true,
})
export class CanoePrice {
  @Prop() state: IState = state

  render() {
    return (
      <section class="price-info">
        <div class="flex justify-between">
          <div class="w-1/3">
            <label>Price</label>
            <div class="font-bold mt-1">{this.state.info.current_price}</div>
          </div>
          <div class="w-1/3">
            <label>24h Change</label>
            <div class={`font-bold mt-1 flex items-center ${this.state.info.state == 0 ? 'red-color' : 'green-color'}`}>
              <xy-icon
                class={this.state.info.state == 0 ? 'red-color' : 'green-color'}
                name={this.state.info.state == 0 ? 'price-down' : 'price-up'}
              ></xy-icon>
              {this.state.info.price_change_percentage}%
            </div>
          </div>
          <div class="w-1/3">
            <label>Market Cap</label>
            <div class="font-bold mt-1">{this.state.info.market_cap}</div>
          </div>
        </div>
        <div class="mt-4 flex justify-between">
          <div class="w-1/3">
            <label>Holders</label>
            <div class="font-bold mt-1">{this.state.info.address_count}</div>
          </div>
          <div class="w-1/3">
            <label>Liquidity</label>
            <div
              class={`font-bold mt-1 flex items-center ${
                this.state.info.liquid_value < 0 ? 'red-color' : 'green-color'
              }`}
            >
              <xy-icon
                class={this.state.info.liquid_value < 0 ? 'red-color' : 'green-color'}
                name={this.state.info.liquid_value < 0 ? 'price-down' : 'price-up'}
              ></xy-icon>
              {this.state.info.liquid}
            </div>
          </div>
          <div class="w-1/3">
            <label>24h Volume</label>
            <div class="font-bold mt-1">{this.state.info.total_volume}</div>
          </div>
        </div>
      </section>
    )
  }
}
