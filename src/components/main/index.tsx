import { Component, h, State, Fragment } from '@stencil/core'
import * as workerTimers from 'worker-timers'
import { getChartData, getCoinMarketInfo, getHolders } from 'api/axios'
import { IChartData, IMarkerData } from 'interface'
import { onChange, state } from 'store'
import { formatAddressNumber, formatNumber, toDecimal2NoZero } from 'utils/number'

@Component({
  tag: 'meta-main',
  shadow: true,
})
export class MetaMain {
  @State() data: IChartData[]
  @State() intervalId: number

  getInfo = async (name: string) => {
    const info: IMarkerData = await getCoinMarketInfo(name)
    const holders = await getHolders(name)
    state.info = {
      name: info.name,
      symbol: info.symbol.toUpperCase(),
      image: info.image,
      state: info.price_change_percentage_24h == 0 ? state.info.state : info.price_change_percentage_24h > 0 ? 1 : 0,
      market_cap_rank: info.market_cap_rank,
      current_price: toDecimal2NoZero(info.current_price),
      price_change_percentage: toDecimal2NoZero(info.price_change_percentage_24h),
      market_cap: formatNumber(info.market_cap),
      address_count: formatAddressNumber(holders),
      liquid: formatNumber(info.market_cap_change_24h),
      liquid_value: info.market_cap_change_24h,
      total_volume: formatNumber(info.total_volume),
    }

    const data = await getChartData(name)
    this.data = data.map(item => {
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
    this.getInfo(state.send.name)
    onChange('send', async val => {
      this.getInfo(val.name)
    })

    this.intervalId = workerTimers.setInterval(() => {
      this.getInfo(state.send.name)
    }, 30000)
  }

  disconnectedCallback() {
    workerTimers.clearInterval(this.intervalId)
  }

  render() {
    return (
      <Fragment>
        <meta-header class="bg-color"></meta-header>
        <meta-rank state={state}></meta-rank>
        <xy-tab activekey="PRICE">
          <xy-tab-content label="PRICE" key="PRICE">
            <meta-price state={state}></meta-price>
            <meta-chart data={this.data}></meta-chart>
          </xy-tab-content>
          <xy-tab-content label="INFO" key="INFO">
            Common Soon
          </xy-tab-content>
          <xy-tab-content label="NEWS" key="NEWS">
            Common Soon
          </xy-tab-content>
          <xy-tab-content label="SOCIAL" key="SOCIAL">
            Common Soon
          </xy-tab-content>
        </xy-tab>
        <token-swap></token-swap>
      </Fragment>
    )
  }
}
