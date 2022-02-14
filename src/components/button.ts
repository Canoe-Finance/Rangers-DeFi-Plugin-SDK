import { html, LitElement } from 'lit'
import {
  customElement,
  property
} from 'lit/decorators.js'

import styles from '../styles/button.scss'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('meta-dex-button')
export class DexButtonElement extends LitElement {
  static styles = styles

  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    return html`
      <h1>Hello, ${this.name}!</h1>
      <button
        @click=${this._onClick}
        part="button"
      >
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `
  }

  private _onClick() {
    this.count++
  }

  foo(): string {
    return 'foo'
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'meta-button': DexButtonElement
  }
}
