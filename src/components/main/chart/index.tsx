import { Component, Prop, h, Watch } from '@stencil/core'
import { Chart, init } from 'klinecharts'

import { IChartData } from '../../../interface'

@Component({
  tag: 'meta-chart',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaChart {
  @Prop() data: IChartData[]

  chartDom!: HTMLDivElement
  chart!: Chart

  @Watch('data')
  watchData(value: IChartData[]) {
    this.chart.applyNewData(value)
  }

  componentDidLoad() {
    this.chart = init(this.chartDom, {
      grid: {
        show: false,
      },
    })
  }

  render() {
    return <div class="chart" ref={el => (this.chartDom = el)}></div>
  }
}
