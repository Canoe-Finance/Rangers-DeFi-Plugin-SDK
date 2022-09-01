import { Component, h } from '@stencil/core'

@Component({
  tag: 'credit-box',
  styleUrl: 'index.scss',
  shadow: true,
})
export class CreditBox {
  iframeDom: HTMLElement

  componentDidLoad() {
    this.iframeDom.style.transition = 'all 0.2s ease-in-out'
    this.iframeDom.style.height = 'calc(100vh - 210px)'
  }

  render() {
    return (
      <div class="credit-box relative flex items-center justify-center">
        <iframe
          ref={el => (this.iframeDom = el)}
          class="iframe"
          src="https://www.binancecnt.com/en/buy-sell-crypto?crypto=BNB"
          width="358"
          height="560"
        ></iframe>
        <a
          class="mask"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.binancecnt.com/en/buy-sell-crypto?crypto=BNB"
        ></a>
      </div>
    )
  }
}
