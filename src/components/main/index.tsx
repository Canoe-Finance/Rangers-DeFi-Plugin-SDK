import { Component, h, Fragment } from '@stencil/core'

import { data } from '../../data'

@Component({
  tag: 'meta-main',
  shadow: true,
})
export class MetaMain {
  render() {
    return (
      <Fragment>
        <meta-header class="bg-color"></meta-header>
        <meta-chart data={data}></meta-chart>
      </Fragment>
    )
  }
}
