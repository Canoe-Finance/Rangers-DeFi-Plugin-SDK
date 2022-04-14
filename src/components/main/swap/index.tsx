import { Component, h, State } from '@stencil/core'
import { state, onChange } from 'store'

@Component({
  tag: 'token-swap',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapMain {
  tabList = [
    {
      title: 'swap',
      menuList: [
        { name: 'swapRefresh', icon: 'refresh' },
        { name: 'swapReload', icon: 'reload' },
        { name: 'swapCustomize', icon: 'customize' },
      ],
    },
    {
      title: 'credit card',
      menuList: [],
    },
    {
      title: 'Transfer',
      menuList: [],
    },
  ]
  tabRef!: HTMLElement

  @State() showContent: boolean = false
  @State() currentTab: number = 0
  @State() tabLeft: string = '0'
  @State() tabWidth: string = '0'

  handleRefresh = () => {}
  handleReload = () => {}
  handleCustomize = () => {}

  clickTabMenu = ({ detail }) => {
    console.log('click tab menu:', detail)
  }

  componentWillLoad() {
    onChange('appShow', val => {
      setTimeout(() => {
        this.showContent = val
      }, 300)
    })
  }

  render() {
    return (
      <div class={`token-swap flex ${state.appShow && this.showContent ? '' : 'token-swap__close'}`}>
        <div
          class="open-btn"
          onClick={() => {
            this.showContent = !this.showContent
          }}
        ></div>
        <my-tab class="my-tab grow" disabled={!this.showContent} tabList={this.tabList} onClickMenu={this.clickTabMenu}>
          <div class="content-item">
            <swap-box class="container"></swap-box>
            <div class="footer">
              Powered by <span>MetaDEX</span>
            </div>
          </div>
          <div class="content-item">
            <credit-box class="container"></credit-box>
            <div class="footer">
              Powered by <span>MetaDEX</span>
            </div>
          </div>
          <div class="content-item">
            <transfer-box class="container"></transfer-box>
            <div class="footer">
              Powered by <span>MetaDEX</span>
            </div>
          </div>
        </my-tab>
      </div>
    )
  }
}
