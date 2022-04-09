import { Component, Prop, h } from '@stencil/core'
import klinecharts from 'klinecharts'

import { IChartData } from '../../../interface'

@Component({
  tag: 'meta-chart',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaChart {
  @Prop() data: IChartData[]

  chartDom!: HTMLDivElement
  chart!: klinecharts.Chart

  componentDidLoad() {
    this.chart = klinecharts.init(this.chartDom)
    this.chart.applyNewData(this.data)
  }

  render() {
    return <div class="chart" ref={el => (this.chartDom = el)}></div>
  }
}
