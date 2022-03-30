import './Header/index'
import './Swap/index'

import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('swap-plugin')
export class SwapPlugin extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      right: 0vh;
      bottom: 0vh;
    }
  `
  token = ''
  render() {
    return html`
      <swap-header></swap-header>
      <swap-container></swap-container>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'swap-plugin': SwapPlugin
  }
}
