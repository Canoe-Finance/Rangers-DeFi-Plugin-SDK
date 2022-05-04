import { Component, State, h, Prop, Event, EventEmitter } from '@stencil/core'
import { state, onChange } from 'store'

@Component({
  tag: 'my-tab',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MyTab {
  tabRef!: HTMLElement

  @Prop() tabList = []
  @Prop({ mutable: true }) disabled: boolean = false

  @State() currentTab: number = 0
  @State() tabLeft: string = '0'
  @State() tabWidth: string = '0'
  @State() menuList = []
  @State() loading = false

  radius = 6
  strokeWidth = 2
  normalizedRadius = this.radius - Math.floor(this.strokeWidth / 2)
  circumference = this.normalizedRadius * 2 * Math.PI

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
    onChange('circle', status => {
      this.loading = status
    })
  }

  @Event() clickMenu: EventEmitter
  handleMenu = (menuName: string) => {
    const cName = this.tabList[this.currentTab].cName
    this.clickMenu.emit({ cName, menuName })
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
              <div
                class="menu-item"
                onClick={() => {
                  this.handleMenu(item.name)
                }}
                key={i}
              >
                {i == 0 && this.loading ? (
                  <svg class="svg" height={this.radius * 2} width={this.radius * 2}>
                    <circle
                      cx={this.radius}
                      cy={this.radius}
                      r={this.normalizedRadius}
                      stroke-width={this.strokeWidth}
                      stroke="#EAEFF4"
                      fill="none"
                      opacity="0.1"
                    />
                    <circle
                      class="progress"
                      cx={this.radius}
                      cy={this.radius}
                      r={this.normalizedRadius}
                      stroke-width={this.strokeWidth}
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-dasharray={`${this.circumference} ${this.circumference}`}
                      fill="none"
                    />
                  </svg>
                ) : (
                  i > 0 && (
                    <xy-icon
                      class={`icon cursor-pointer ${i == 1 && state.reload ? 'spin' : ''}`}
                      name={item.icon}
                    ></xy-icon>
                  )
                )}
              </div>
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
