import { Component, Prop, h } from '@stencil/core'
import { IDodoRouterRes } from 'interface'
import { state } from 'store'
@Component({
  tag: 'router-path',
  styleUrl: 'index.scss',
  shadow: true,
})
export class RouterPath {
  @Prop() dodoData: IDodoRouterRes

  render() {
    return (
      <div class="router-container mt-[15px] divide-y divide-[#43485E]">
        <div class="router-path h-[30px] flex justify-center items-center text-sm">
          <span class="text-[#A2A8BA]">{state.send.symbol}</span>
          <span class="text-[#A2A8BA]"> &gt; </span>
          {/* <span>{this.dodoData.useSource}</span> */}
          <span class="text-[#A2A8BA]">{state.receive.symbol}</span>
        </div>
        <div class="router-amount flex flex-col h-[60px] px-[10px] text-xs justify-around">
          <div class="amount-item flex justify-between">
            <span class="text-[#A2A8BA]">Minimum Received</span>
            <span class="text-[#A2A8BA]">5325</span>
          </div>
          <div class="amount-item flex justify-between">
            <span>Received</span>
            <span>BNB</span>
          </div>
          <div class="amount-item flex justify-between">
            <span>Price Impact</span>
            <span>0.04%</span>
          </div>
        </div>
      </div>
    )
  }
}
