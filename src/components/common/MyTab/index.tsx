import { Component, State, h, Prop, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'my-tab',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MyTab {
  tabRef!: HTMLElement

  @Prop() tabList = []
  @Prop() disabled: boolean = false
  @State() currentTab: number = 0
  @State() tabLeft: string = '0'
  @State() tabWidth: string = '0'
  @State() menuList = []

  handleTabChange = (e, i) => {
    const { offsetLeft, offsetWidth } = e.target
    this.tabLeft = offsetLeft + 'px'
    this.tabWidth = offsetWidth + 'px'
    this.currentTab = i
    this.menuList = this.tabList[i].menuList || []
  }

  componentDidLoad() {
    // select first tab
    this.handleTabChange({ target: this.tabRef.childNodes[0] }, 0)
  }

  @Event() clickMenu: EventEmitter
  handleMenu = (menuName: string) => {
    this.clickMenu.emit(menuName)
  }

  render() {
    return (
      <div
        class={{
          'my-tab': true,
          'my-tab-disabled': this.disabled,
        }}
      >
        <div class="title">
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
            {this.menuList.map((item, i) => (
              <xy-button
                class="menu-item"
                onClick={() => {
                  this.handleMenu(item.name)
                }}
                key={i}
              >
                <xy-icon class="icon" name={item.icon}></xy-icon>
              </xy-button>
            ))}
          </div>
        </div>
        <div class="content">
          <div class="content-wrap" style={{ transform: `translateX(${-100 * this.currentTab}%)` }}>
            <slot></slot>
          </div>
        </div>
      </div>
    )
  }
}
