import { Component, h, Fragment, Prop } from '@stencil/core'
import { IChartData, IState } from 'interface'
import { state } from 'store'

@Component({
  tag: 'meta-main',
  shadow: true,
})
export class MetaMain {
  @Prop() data: IChartData[] = []
  @Prop() state: IState = state

  render() {
    return (
      <Fragment>
        <meta-header class="bg-color"></meta-header>
        <meta-rank state={this.state}></meta-rank>
        <xy-tab activekey="PRICE">
          <xy-tab-content label="PRICE" key="PRICE">
            <meta-price state={this.state}></meta-price>
            <meta-chart data={this.data}></meta-chart>
          </xy-tab-content>
          <xy-tab-content label="INFO" key="INFO">
            Common Soon
          </xy-tab-content>
          <xy-tab-content label="NEWS" key="NEWS">
            Common Soon
          </xy-tab-content>
          <xy-tab-content label="SOCIAL" key="SOCIAL">
            Common Soon
          </xy-tab-content>
        </xy-tab>
        <token-swap></token-swap>
      </Fragment>
    )
  }
}
