import { Component, h, State } from '@stencil/core'
import { state, onChange } from 'store'

@Component({
  tag: 'token-swap',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapMain {
  @State() isCredit = false

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
    // {
    //   title: 'Transfer',
    //   cName: 'transfer',
    //   menuList: [],
    // },
  ]
  tabRef!: HTMLElement
  swapBoxRef!: HTMLElement
  creditBoxRef!: HTMLElement
  transferBoxRef!: HTMLElement

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

  handleTabChange = ({ detail }) => {
    this.isCredit = detail === 1
  }

  componentWillLoad() {
    onChange('appShow', val => {
      setTimeout(() => {
        state.showContent = val
      }, 300)
    })
  }

  render() {
    return (
      <div
        class={`token-swap flex ${this.isCredit ? 'credit' : ''} ${
          state.appShow && state.showContent ? '' : 'token-swap__close'
        }`}
      >
        <div
          class="open-btn"
          onClick={() => {
            state.showContent = !state.showContent
          }}
        ></div>
        <my-tab
          class="my-tab grow"
          disabled={!state.showContent}
          tabList={this.tabList}
          onClickMenu={this.clickTabMenu}
          onTabChange={this.handleTabChange}
        >
          <div class="content-item">
            <swap-box class="flex-1 flex-shrink-0" ref={el => (this.swapBoxRef = el as HTMLElement)}></swap-box>
            <div class="footer">
              Powered by <span>Canoe</span>
            </div>
          </div>
          <div class={`content-item ${this.isCredit ? '' : 'hidden'}`}>
            <credit-box class="flex-1 flex-shrink-0" ref={el => (this.creditBoxRef = el as HTMLElement)}></credit-box>
            <div class="footer">
              Powered by <span>Canoe</span>
            </div>
          </div>
          <div class="content-item">
            <transfer-box
              class="flex-1 flex-shrink-0"
              ref={el => (this.transferBoxRef = el as HTMLElement)}
            ></transfer-box>
            <div class="footer">
              Powered by <span>Canoe</span>
            </div>
          </div>
        </my-tab>
      </div>
    )
  }
}
