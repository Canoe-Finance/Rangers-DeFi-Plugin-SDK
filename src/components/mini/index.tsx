import { Component, Prop, h, Event, EventEmitter } from '@stencil/core'
import './chart/index'
@Component({
  tag: 'meta-mini',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaMini {
  @Prop() token: string

  @Prop() priceVolate = -1.23

  public data = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [
      {
        borderColor: this.priceVolate > 0 ? 'rgba(43, 255, 1, 0.3)' : 'rgba(255, 1, 0, 0.3)',
        backgroundColor: this.priceVolate > 0 ? 'rgba(43, 255, 1, 0.1)' : 'rgba(255, 1, 0, 0.1)',
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        pointBorderColor: 'transparent',
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ],
  }
  public options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          ticks: {
            autoskip: true,
            autoSkipPadding: 80,
            // userCallback: function(item, index) {
            // 	if (!(index % 4)) return item;
            // },
            maxRotation: 0,
            minRotation: 0,
          },
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            display: false,
            // stepSize: 0.5
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    tooltips: {
      displayColors: false,
      callbacks: {
        label: function (tooltipItem: { yLabel: string }) {
          return `$${tooltipItem.yLabel}`
        },
      },
    },
  }
  public type = 'line'
  @Event() openSwap: EventEmitter
  private _openSwap = () => {
    this.openSwap.emit()
  }
  render() {
    return (
      <div class="container">
        <base-chart type={this.type} data={this.data} options={this.options}></base-chart>
        <div class="plugin-container">
          <div class="token-part">
            <div class="token-icon">
              <xy-icon class="icon text-[40px]" name="ETH"></xy-icon>
            </div>
            <div class="token-info">
              <div class="token-symbol">{this.token}</div>
              <div class="token-price">
                <div class="price-value">$100</div>
                <div class={`price-volate ${this.priceVolate > 0 ? 'up' : 'down'}`}>{this.priceVolate}%</div>
              </div>
            </div>
          </div>
          <div class="swap-part cursor-pointer" onClick={this._openSwap}>
            <xy-icon class="icon text-[30px]" name="SWAP"></xy-icon>
          </div>
        </div>
      </div>
    )
  }
}
