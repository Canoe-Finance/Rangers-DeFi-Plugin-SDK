import '@/components/LineChart'

import { html, LitElement } from 'lit'
import {
  customElement,
  property
} from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

import styles from '@/styles/mini-plugin.scss'
// import styles from './styles'

@customElement('mini-plugin')
export class MiniPlugin extends LitElement {
  static styles = styles

  @property({ type: String })
  token = ''

  @property({ type: Number })
  priceVolate = -1.23

  public data = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [
      {
        borderColor:
          this.priceVolate > 0
            ? 'rgba(43, 255, 1, 0.3)'
            : 'rgba(255, 1, 0, 0.3)',
        backgroundColor:
          this.priceVolate > 0
            ? 'rgba(43, 255, 1, 0.1)'
            : 'rgba(255, 1, 0, 0.1)',
        pointBackgroundColor: 'transparent',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        pointBorderColor: 'transparent',
        data: [0, 10, 5, 2, 20, 30, 45]
      }
    ]
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
            minRotation: 0
          },
          gridLines: {
            display: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            display: false
            // stepSize: 0.5
          },
          gridLines: {
            display: false
          }
        }
      ]
    },
    legend: {
      display: false
    },
    tooltips: {
      displayColors: false,
      callbacks: {
        label: function (tooltipItem: {
          yLabel: string
        }) {
          return `$${tooltipItem.yLabel}`
        }
      }
    }
  }
  public type = 'line'
  private _openSwap() {
    // TODO: emit event
    this.dispatchEvent(
      new CustomEvent('open-swap', {
        bubbles: true,
        composed: true
      })
    )
  }
  render() {
    const { type, data, options } = this
    return html`
      <div id="container">
        <base-chart
          class="chart"
          type="${type}"
          .data="${data}"
          .options="${options}"
        ></base-chart>
        <div class="plugin-container">
          <div class="token-part">
            <div class="token-icon">
              <sl-icon
                class="icon"
                src="src/icons/eth.svg"
              ></sl-icon>
            </div>
            <div class="token-info">
              <div class="token-symbol"
                >${this.token}</div
              >
              <div class="token-price">
                <div class="price-value"
                  >$100</div
                >
                <div
                  class=${classMap({
                    'price-volate': true,
                    'price-volate-up':
                      this.priceVolate > 0,
                    'price-volate-down':
                      this.priceVolate < 0
                  })}
                  >${this.priceVolate}%</div
                >
              </div>
            </div>
          </div>
          <div
            class="swap-part"
            @click=${this._openSwap}
          >
            <svg
              width="32"
              height="23"
              viewBox="0 0 32 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M26.3849 12.3939L21.6204 7.62943L23.6964 5.55352L32 13.8572L23.6964 22.1608L21.6204 20.0849L26.3757 15.3297H14.3853V12.3939H26.3849ZM5.61509 6.84037H17.6147V9.77615H5.62433L10.3795 14.5314L8.30364 16.6073L0 8.30364L8.30364 0L10.3795 2.07591L5.61509 6.84037Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'mini-plugin': MiniPlugin
  }
}
