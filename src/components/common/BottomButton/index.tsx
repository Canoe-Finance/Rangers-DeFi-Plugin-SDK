import { Component, Prop, h } from '@stencil/core'

@Component({
  tag: 'bottom-button',
  styleUrl: 'index.scss',
  shadow: true,
})
export class BottomButton {
  // default primary info success error
  @Prop() type: string = 'default'
  @Prop({ mutable: true }) disabled: boolean = false
  @Prop({ mutable: true }) loading: boolean = false

  render() {
    return (
      <xy-button
        class={{
          'm-bottom-button': true,
          'm-bottom-button--default': this.type === 'default',
          'm-bottom-button--primary': this.type === 'primary',
          'm-bottom-button--info': this.type === 'info',
          'm-bottom-button--success': this.type === 'success',
          'm-bottom-button--error': this.type === 'error',
          'm-bottom-button--disabled': this.disabled,
          'm-bottom-button--loading': this.loading,
        }}
        disabled={this.disabled || this.loading}
      >
        <span class="prefix">
          <slot name="prefix"></slot>
        </span>
        <span class="text flex items-center">
          <xy-loading class="loading-icon"></xy-loading>
          <slot></slot>
        </span>
        <span class="suffix">
          <slot name="suffix"></slot>
        </span>
      </xy-button>
    )
  }
}
