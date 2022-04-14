import { Component, State, Prop, h } from '@stencil/core'
import * as workerTimers from 'worker-timers'
import { getChartData, getCoinMarketInfo, getHolders } from 'api/axios'
import { IChartData, IMarkerData } from 'interface'
import { onChange, state } from 'store'
import { formatAddressNumber, formatNumber, toDecimal2NoZero } from 'utils/number'

import '../xy-ui/index'

@Component({
  tag: 'meta-swap',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaApp {
  @Prop() token: string

  @State() state = state
  @State() mini = []
  @State() chart: IChartData[]
  @State() intervalId: number

  getInfo = async (name: string) => {
    const data = await getChartData(name)

    const info: IMarkerData = await getCoinMarketInfo(name)
    const holders = await getHolders(name)
    this.state.info = {
      name: info.name,
      symbol: info.symbol.toUpperCase(),
      image: info.image,
      state:
        info.price_change_percentage_24h == 0 ? this.state.info.state : info.price_change_percentage_24h > 0 ? 1 : 0,
      market_cap_rank: info.market_cap_rank,
      current_price: info.current_price < 1 ? info.current_price.toString() : toDecimal2NoZero(info.current_price),
      price_change_percentage: toDecimal2NoZero(info.price_change_percentage_24h),
      market_cap: formatNumber(info.market_cap),
      address_count: formatAddressNumber(holders),
      liquid: formatNumber(info.market_cap_change_24h),
      liquid_value: info.market_cap_change_24h,
      total_volume: formatNumber(info.total_volume),
    }

    this.mini = data.map(item => item[4])
    this.chart = data.map(item => {
      return {
        close: item[4],
        high: item[2],
        low: item[3],
        open: item[1],
        timestamp: item[0],
      }
    })
  }

  componentWillLoad() {
    this.getInfo(this.state.send.name)
    onChange('send', async val => {
      this.getInfo(val.name)
    })

    this.intervalId = workerTimers.setInterval(() => {
      this.getInfo(this.state.send.name)
    }, 30000)
  }

  disconnectedCallback() {
    workerTimers.clearInterval(this.intervalId)
  }

  private handleClick = (status: boolean) => {
    this.state.appShow = status
  }

  render() {
    return (
      <div class={`app-main app-mini ${this.state.appShow ? 'show' : 'hide'}`}>
        <meta-mini
          class={this.state.appShow ? 'hidden' : ''}
          onOpenSwap={() => this.handleClick(true)}
          mini={this.mini}
          state={this.state}
        ></meta-mini>
        <meta-main class={this.state.appShow ? '' : 'invisible'} data={this.chart} state={this.state}></meta-main>
      </div>
    )
  }
}
