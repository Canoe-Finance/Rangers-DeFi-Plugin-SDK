import { Component, h, Prop, Element } from '@stencil/core'

import { Chart } from 'chart.js'

@Component({
  tag: 'base-chart',
  styleUrl: 'index.scss',
  shadow: true,
})
export class BaseChart {
  public chart: Chart.ChartConfiguration & Chart
  @Prop() type: Chart.ChartType
  @Prop() data: Chart.ChartData
  @Prop() options: Chart.ChartOptions

  @Element() el: HTMLElement

  componentDidLoad() {
    const data: Chart.ChartData = this.data || {}
    const options: Chart.ChartOptions = this.options || {}
    if (!this.chart) {
      const ctx = this.el.shadowRoot.querySelector('canvas').getContext('2d')
      this.chart = new Chart(ctx, {
        type: this.type,
        data: this.data,
        options: this.options,
      })
    } else {
      this.chart.data = data
      this.chart.options = options
      this.chart.update()
    }

    window.addEventListener('resize', () => {
      if (this.chart) {
        this.chart.resize()
      }
    })
  }
  render() {
    return (
      <div class="chart-size">
        <canvas></canvas>
      </div>
    )
  }
}
