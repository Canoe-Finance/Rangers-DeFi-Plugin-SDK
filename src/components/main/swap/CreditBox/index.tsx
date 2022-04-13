import { Component, h } from '@stencil/core'

@Component({
  tag: 'credit-box',
  styleUrl: 'index.scss',
  shadow: true,
})
export class CreditBox {
  render() {
    return <div class="credit-box flex items-center justify-center">Common Soon</div>
  }
}
