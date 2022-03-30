import './miniPlugin/index'
import './swapPlugin/index'

import { css, html, LitElement } from 'lit'
import {
  customElement,
  property,
  state
} from 'lit/decorators.js'

@customElement('metadex-swap')
export class MetadexSwap extends LitElement {
  static styles = css`
    :host {
      position: absolute;
      right: 5vh;
      bottom: 10vh;
    }
  `
  @property({ type: String })
  token = ''
  @state()
  isOpenSwap = false
  openSwap() {
    this.isOpenSwap = true
  }
  render() {
    return html`
      ${this.isOpenSwap
        ? html`<swap-plugin></swap-plugin>`
        : html`<mini-plugin
            token=${this.token}
            @open-swap=${this.openSwap}
          ></mini-plugin>`}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'metadex-swap': MetadexSwap
  }
}
