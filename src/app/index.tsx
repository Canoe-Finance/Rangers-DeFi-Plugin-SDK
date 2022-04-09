import { Component, State, h } from '@stencil/core'

import '../xy-ui/index'

@Component({
  tag: 'meta-swap',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaApp {
  @State() show: boolean = false

  private handleClick = () => {
    this.show = true
  }

  render() {
    return (
      <div class={this.show ? 'app-main' : 'app-mini'}>
        {this.show ? <meta-main></meta-main> : <meta-mini onClick={this.handleClick}></meta-mini>}
      </div>
    )
  }
}
