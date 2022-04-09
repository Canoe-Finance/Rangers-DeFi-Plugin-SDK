import { Component, State, h } from '@stencil/core'

import '../xy-ui/index'

@Component({
  tag: 'meta-swap',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaApp {
  @State() show: boolean = false

  private handleClick = (status: boolean) => {
    this.show = status
  }

  render() {
    return (
      <div class={`app-main app-mini ${this.show ? 'show' : 'hide'}`}>
        <meta-mini class={this.show ? 'hidden' : ''} onClick={() => this.handleClick(true)}></meta-mini>
        <meta-main class={this.show ? '' : 'hidden'}></meta-main>
      </div>
    )
  }
}
