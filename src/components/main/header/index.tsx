import { Component, h } from '@stencil/core'

@Component({
  tag: 'meta-header',
  styleUrl: 'index.scss',
  shadow: true,
})
export class MetaHeader {
  render() {
    return (
      <header class="flex items-center">
        <div class="header-logo h-full flex flex-1 items-center">
          <img src="../../assets/images/logo.svg" alt="logo" />
          <div>MetaDEX</div>
        </div>
        <div class="network-container h-full flex items-center">
          <xy-icon name="earth"></xy-icon>
          <xy-select type="flat" placeholder="NET">
            <xy-option value="bsc">BSC</xy-option>
            <xy-option value="eth">ETH</xy-option>
            <xy-option value="solana">SOLANA</xy-option>
            <xy-option value="polygon">POLYGON</xy-option>
          </xy-select>
        </div>
        <div class="wallet-container h-full flex items-center">
          <xy-icon name="wallet"></xy-icon>
          <span>WALLET</span>
        </div>
      </header>
    )
  }
}
