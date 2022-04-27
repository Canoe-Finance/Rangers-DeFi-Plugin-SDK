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
        class="zoom-top absolute w-[12px] h-[180px] -left-[11px] cursor-pointer"
        onClick={() => {
          this.clickClose.emit()
        }}
      >
        <div class="zoom-show bg-[#545e8380] rounded-[46px] h-[180px] relative right-[4px] flex justify-center items-center">
          <xy-icon class="text-sm" name="right"></xy-icon>
        </div>
        <div class="zoom-hide bg-[#545e8380] rounded-[46px] h-[180px]"></div>
      </div>
    )
  }
}
