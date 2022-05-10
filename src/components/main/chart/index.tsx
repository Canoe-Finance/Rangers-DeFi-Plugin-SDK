import { Component, Prop, h, Watch } from '@stencil/core'
import { Chart, init } from 'klinecharts'
import { state } from 'store'

import { IChartData } from '../../../interface'

@Component({
  tag: 'canoe-chart',
  styleUrl: 'index.scss',
  shadow: true,
})
export class CanoeChart {
  @Prop() data: IChartData[]

  chartDom!: HTMLDivElement
  chart!: Chart

  @Watch('data')
  watchData(value: IChartData[]) {
    this.chart.applyNewData(value)
    if (value.length) {
      let priceDecimals = 2
      if (value[0].close < 0.000000001) {
        priceDecimals = 18
      } else if (value[0].close < 0.1) {
        priceDecimals = 10
      }
      this.chart.setPriceVolumePrecision(priceDecimals, state.send.decimals)
    }
  }

  componentDidLoad() {
    this.chart = init(this.chartDom, {
      grid: {
        show: false,
      },
      yAxis: {
        show: false,
        width: 0,
      },
      candle: {
        tooltip: {
          showRule: 'follow_cross',
          showType: 'rect',
          labels: ['T: ', 'O: ', 'C: ', 'H: ', 'L: ', 'V: '],
          text: {
            size: 10,
          },
        },
      },
      technicalIndicator: {
        tooltip: {
          showRule: 'none',
        },
      },
    })
    this.chart.createTechnicalIndicator('MA', false, { id: 'candle_pane' })
  }

  render() {
    return (
      <div class="relative">
        {state.loading && <xy-loading class="absolute top-0 left-0 right-0 bottom-0 z-50" size="50"></xy-loading>}
        <div class="absolute top-2 left-2 text-xs">
          {state.send.symbol}/{state.receive.symbol}
        </div>
        <div class="chart" ref={el => (this.chartDom = el)}></div>
      </div>
    )
  }
}
