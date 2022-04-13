import { Component, State, Prop, h } from '@stencil/core'

import '../xy-ui/index'

@Component({
  tag: 'meta-swap',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaApp {
  @Prop() token: string

  // TODO:
  @State() show: boolean = true

  private handleClick = (status: boolean) => {
    this.show = status
  }

  render() {
    return (
      <div class={`app-main app-mini ${this.show ? 'show' : 'hide'}`}>
        <meta-mini
          class={this.show ? 'hidden' : ''}
          onOpenSwap={() => this.handleClick(true)}
          token={this.token}
        ></meta-mini>
        <meta-main class={this.show ? '' : 'invisible'}></meta-main>
      </div>
    )
  }
}
