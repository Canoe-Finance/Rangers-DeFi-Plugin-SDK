import { Component, h, Prop, State, Element, Watch } from '@stencil/core'
import { Chart } from 'chart.js'
import { IState } from 'interface'
import { state } from 'store'

@Component({
  tag: 'base-chart',
  styleUrl: 'index.scss',
  shadow: true,
})
export class BaseChart {
  public chart: Chart.ChartConfiguration & Chart

  @Prop() mini = []
  @Prop() state: IState = state

  @State() options = {
    elements: {
      point: {
        radius: 0,
      },
    },
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          display: false,
        },
      ],
      xAxes: [
        {
          display: false,
        },
      ],
    },
  }

  @Element() el: HTMLElement

  @Watch('mini')
  watchMini(value) {
    if (this.chart) {
      this.chart.data.datasets[0].data = value
      this.chart.update()
    } else {
      const data = {
        labels: new Array(value.length).fill(''),
        datasets: [
          {
            borderColor: this.state.info.state == 0 ? 'rgba(255, 1, 0, 0.5)' : 'rgba(43, 255, 1, 0.5)',
            backgroundColor: this.state.info.state == 0 ? 'rgba(255, 1, 0, 0.1)' : 'rgba(43, 255, 1, 0.1)',
            data: this.mini,
            fill: true,
          },
        ],
      }
      const ctx = this.el.shadowRoot.querySelector('canvas').getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: this.options,
      })
    }
  }

  render() {
    return (
      <div class="chart-size">
        <canvas></canvas>
      </div>
    )
  }
}
