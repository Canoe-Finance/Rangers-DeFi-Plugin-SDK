import { Component, Prop, h } from '@stencil/core'

@Component({
  tag: 'meta-mini',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaChart {
  @Prop() token: string

  render() {
    return <div class="mini">{this.token}</div>
  }
}
