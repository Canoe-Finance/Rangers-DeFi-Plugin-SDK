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
      cName: 'swap',
      menuList: [
        { name: 'refresh', icon: 'refresh' },
        { name: 'reload', icon: 'reload' },
        { name: 'customize', icon: 'customize' },
      ],
    },
    {
      title: 'credit card',
      cName: 'credit',
      menuList: [],
    },
    {
      title: 'Transfer',
      cName: 'transfer',
      menuList: [],
    },
  ]
  tabRef!: HTMLElement
  swapBoxRef!: HTMLElement
  creditBoxRef!: HTMLElement
  transferBoxRef!: HTMLElement

  @State() showContent: boolean = true

  clickTabMenu = async ({ detail }) => {
    const { cName, menuName } = detail
    if (cName === 'swap') {
      await this.swapBoxRef['clickMenu'](menuName)
    } else if (cName === 'credit') {
      await this.creditBoxRef['clickMenu'](menuName)
    } else if (cName === 'transfer') {
      await this.transferBoxRef['clickMenu'](menuName)
    }
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
            <swap-box class="container" ref={el => (this.swapBoxRef = el as HTMLElement)}></swap-box>
            <div class="footer">
              Powered by <span>MetaDEX</span>
            </div>
          </div>
          <div class="content-item">
            <credit-box class="container" ref={el => (this.creditBoxRef = el as HTMLElement)}></credit-box>
            <div class="footer">
              Powered by <span>MetaDEX</span>
            </div>
          </div>
          <div class="content-item">
            <transfer-box class="container" ref={el => (this.transferBoxRef = el as HTMLElement)}></transfer-box>
            <div class="footer">
              Powered by <span>MetaDEX</span>
            </div>
          </div>
        </my-tab>
      </div>
    )
  }
}
