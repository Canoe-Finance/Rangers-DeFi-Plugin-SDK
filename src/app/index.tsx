import { Component, State, Prop, h } from '@stencil/core'
import * as workerTimers from 'worker-timers'
import { getChartData, getCoinMarketInfo, getHolders } from 'api/axios'
import { IChartData, IMarkerData } from 'interface'
import { onChange, state } from 'store'
import { formatAddressNumber, formatNumber, toDecimal2NoZero } from 'utils/number'
import tokens from 'tokens/bsc.json'

import '../xy-ui/index'

@Component({
  tag: 'canoe-dex',
  styleUrl: 'index.scss',
  shadow: true,
})
export class CanoeApp {
  @Prop() token: string
  @Prop() logo: string
  @Prop() name: string

  @State() state = state
  @State() mini = []
  @State() chart: IChartData[]
  @State() intervalId: number

  timer: NodeJS.Timeout | null = null

  getInfo = (id: string, code: string, send: string, receive: string, from: string, to: string) => {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(async () => {
      const data = await getChartData(send, receive, from, to)

      const info: IMarkerData = await getCoinMarketInfo(id)
      const holders = await getHolders(code)
      this.state.info = {
        name: info.name,
        symbol: info.symbol.toUpperCase(),
        image: info.image,
        state:
          info.price_change_percentage_24h == 0 ? this.state.info.state : info.price_change_percentage_24h > 0 ? 1 : 0,
        market_cap_rank: info.market_cap_rank,
        current_price: info.current_price < 0.001 ? '< $0.001' : '$' + toDecimal2NoZero(info.current_price, 3),
        price_change_percentage: toDecimal2NoZero(info.price_change_percentage_24h),
        market_cap: '$' + formatNumber(info.market_cap),
        address_count: formatAddressNumber(holders),
        liquid: '$' + formatNumber(info.market_cap_change_24h),
        liquid_value: info.market_cap_change_24h,
        total_volume: '$' + formatNumber(info.total_volume),
      }

      this.mini = data.map(item => item[4])
      this.chart = data.map(item => {
        return {
          close: item[4],
          high: item[2],
          low: item[3],
          open: item[1],
          timestamp: item[0],
          volume: item[5],
        }
      })
      state.loading = false
    }, 500)
  }

  componentWillLoad() {
    const find = tokens.find(item => item.symbol == this.token)
    if (find) {
      state.send = find
    }
    this.getInfo(
      this.state.send.id,
      this.state.send.code,
      this.state.send.symbol,
      this.state.receive.symbol,
      this.state.send.address,
      this.state.receive.address,
    )
    onChange('send', val => {
      this.getInfo(val.id, val.code, val.symbol, this.state.receive.symbol, val.address, this.state.receive.address)
    })

    onChange('receive', val => {
      this.getInfo(
        this.state.send.id,
        this.state.send.code,
        this.state.send.symbol,
        val.symbol,
        this.state.send.address,
        val.address,
      )
    })

    this.intervalId = workerTimers.setInterval(() => {
      this.getInfo(
        this.state.send.id,
        this.state.send.code,
        this.state.send.symbol,
        this.state.receive.symbol,
        this.state.send.address,
        this.state.receive.address,
      )
    }, 30000)
  }

  disconnectedCallback() {
    if (this.intervalId) {
      workerTimers.clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  private handleClick = (status: boolean) => {
    this.state.appShow = status
  }

  render() {
    return (
      <div class={`app-main app-mini ${this.state.appShow ? 'show' : 'hide'}`}>
        {this.state.appShow && <canoe-zoom onClickClose={() => this.handleClick(false)}></canoe-zoom>}
        <canoe-mini
          class={this.state.appShow ? 'hidden' : ''}
          onOpenSwap={() => this.handleClick(true)}
          mini={this.mini}
          state={this.state}
        ></canoe-mini>
        <canoe-main
          class={this.state.appShow ? '' : 'invisible'}
          logo={this.logo}
          name={this.name}
          data={this.chart}
          state={this.state}
        ></canoe-main>
      </div>
    )
  }
}
