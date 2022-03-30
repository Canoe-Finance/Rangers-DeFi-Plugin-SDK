import { css, html, LitElement } from 'lit'
import {
  customElement,
  property
} from 'lit/decorators.js'

@customElement('swap-container')
export class SwapContainer extends LitElement {
  static styles = css`
    :host {
    }
    .container {
      width: 360px;
      height: 365px;
      background: #24242e;
    }
    sl-tab-group.custom {
      text-transform: uppercase;
      --indicator-color: #a2a8ba;
    }
  `
  render() {
    return html`
      <div class="container">
        <sl-tab-group class="custom">
          <sl-tab
            slot="nav"
            panel="swap"
            >swap</sl-tab
          >
          <sl-tab slot="nav" panel="credit card"
            >credit card</sl-tab
          >
          <sl-tab slot="nav" panel="Transfer"
            >transfer</sl-tab
          >

          <sl-tab-panel name="swap">
            <sl-button>test</sl-button>
          </sl-tab-panel>
          <sl-tab-panel name="credit card"
            >coming soon</sl-tab-panel
          >
          <sl-tab-panel name="Transfer"
            >coming soon</sl-tab-panel
          >
        </sl-tab-group>
      </div>
    `
  }
}
