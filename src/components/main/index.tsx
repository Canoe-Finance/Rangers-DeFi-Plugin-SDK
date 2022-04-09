import { Component, h } from '@stencil/core'

import { data } from '../../data'

@Component({
  tag: 'meta-main',
  shadow: true,
})
export class MetaMain {
  render() {
    return (
      <div class="app-main">
        <meta-header class="bg-color"></meta-header>
        <meta-chart data={data}></meta-chart>
      </div>
    )
  }
}
