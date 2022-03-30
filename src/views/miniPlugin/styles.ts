import { css } from 'lit'

export default css`
  :host {
  }
  #container {
    position: relative;
    width: 300px;
    height: 64px;
    background: linear-gradient(
        0deg,
        rgba(43, 255, 1, 0.06),
        rgba(43, 255, 1, 0.06)
      ),
      #18181c;
    box-shadow: 0px 6.41771px 38.2739px
        rgba(25, 25, 30, 0.2),
      0px 2.96801px 17.8722px
        rgba(25, 25, 30, 0.127623),
      0px 1.18628px 7.30371px
        rgba(25, 25, 30, 0.0853463);
    border-radius: 12px;
  }
  .chart {
    width: 100%;
    height: 100%;
  }
  .plugin-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .token-part {
    display: flex;
    align-items: center;
    color: #fff;
    font-weight: 700;
    font-size: 18px;
  }
  .icon {
    width: 40px;
    height: 40px;
  }
  .token-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 9px;
  }
  .token-symbol {
    margin-bottom: 6px;
  }
  .token-price {
    display: flex;
  }
  .price-volate {
    margin-left: 8px;
  }
  .price-volate-up {
    color: #00E061;
  }
  .price-volate-down {
    color: #E03100;
  }
`
