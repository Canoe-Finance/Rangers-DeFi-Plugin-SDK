import { Component, h, State } from '@stencil/core'
@Component({
  tag: 'token-swap',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapMain {
  tabList = [{ title: 'swap' }, { title: 'credit card' }, { title: 'Transfer' }]
  tabRef!: HTMLElement

  @State() showContent: boolean = true
  @State() currentTab: number = 0
  @State() tabLeft: string = '0'
  @State() tabWidth: string = '0'

  handleTabChange = (e, i) => {
    const { offsetLeft, offsetWidth } = e.target
    this.tabLeft = offsetLeft + 'px'
    this.tabWidth = offsetWidth + 'px'
    this.currentTab = i
  }

  componentDidLoad() {
    // select first tab
    this.handleTabChange({ target: this.tabRef.childNodes[0] }, 0)
  }

  handleRefresh = () => {}
  handleReload = () => {}
  handleCustomize = () => {}
  render() {
    return (
      <div class={`token-swap ${!this.showContent ? 'token-swap__close' : ''}`}>
        <div
          class="open-btn"
          onClick={() => {
            this.showContent = !this.showContent
          }}
        ></div>
        <div class="token-swap-title">
          <div
            class="title-tab"
            style={{ '--tab-width': this.tabWidth, '--tab-left': this.tabLeft }}
            ref={el => (this.tabRef = el as HTMLElement)}
          >
            {this.tabList.map((tab, i) => (
              <xy-button
                class={`tab-item ${this.currentTab === i ? 'tab-item__active' : ''}`}
                onClick={e => {
                  this.handleTabChange(e, i)
                }}
              >
                {tab.title}
              </xy-button>
            ))}
          </div>
          <div class="title-menu">
            <xy-button class="menu-item" onClick={this.handleRefresh}>
              <xy-icon class="icon" name="refresh"></xy-icon>
            </xy-button>
            <xy-button class="menu-item" onClick={this.handleReload}>
              <xy-icon class="icon" name="reload"></xy-icon>
            </xy-button>
            <xy-button class="menu-item" onClick={this.handleCustomize}>
              <xy-icon class="icon" name="customize"></xy-icon>
            </xy-button>
          </div>
        </div>
        <div class="token-swap-content" style={{ transform: `translateX(${-100 * this.currentTab}%)` }}>
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
        </div>
      </div>
    )
  }
}
