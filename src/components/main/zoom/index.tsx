import { Component, h, Event, EventEmitter } from '@stencil/core'

@Component({
  tag: 'canoe-zoom',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaZoom {
  @Event() clickClose: EventEmitter

  render() {
    return (
      <div
        class="w-[24px] h-[90px] box-border zoom-top absolute cursor-pointer flex flex-col items-center justify-between text-xs py-4"
        onClick={() => {
          this.clickClose.emit()
        }}
      >
        <div class="flex justify-center items-center">
          <xy-icon name="close"></xy-icon>
        </div>
        <span>CLOSE</span>
      </div>
    )
  }
}
