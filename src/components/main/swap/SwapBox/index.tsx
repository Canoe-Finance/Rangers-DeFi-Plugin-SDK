import { Component, Method, h, Fragment, State, Watch } from '@stencil/core'
import * as workerTimers from 'worker-timers'
import { state, onChange } from 'store'
import config from 'config'
import { getChainList } from 'utils/func'
import { getDodoData } from 'api/axios'
import { parseUnits } from 'api/ethers/utils'
import { IDodoRouterRes } from 'interface'
import { checkTokenApprove, tokenApprove, getBalanceByToken } from 'api/ethers/token'
import { getFeePercentage } from 'api/ethers/dodo'
import { changeEthereumChainForPc, checkEthereum, getUserAddress, requestAccounts } from 'api/ethereum/index'
import storage from 'utils/storage'
import { formatNumber, numberSub } from 'utils/math'

@Component({
  tag: 'swap-box',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapBox {
  timeInterval = null
  @State() slippage: number = 0.5
  @State() tokens = []
  @State() swapTokenType: string = 'send'
  @State() balance: string = '0'
  @State() receiveAmount: string = ''
  @State() sendAmount: string = ''
  @State() swapData = {}
  @State() showSearch: boolean = false
  @State() feePercentage: number = 1
  @State() getTransformInfoLoading: boolean = false
  @State() transformInfoVisible: boolean = false
  @State() settingVisible: boolean = false
  @State() connectWalletLoading: boolean = false
  // approve
  @State() isApproved: boolean = false
  @State() checkApproveLoading: boolean = false
  @State() tokenApproveLoading: boolean = false
  @State() dodoRouterData: IDodoRouterRes = {
    type: 'send',
    useSource: '',
    priceImpact: '',
    resPricePerToToken: '0',
    resPricePerFromToken: '0',
    resAmount: '0',
  }

  timer: NodeJS.Timeout | null = null

  @Watch('sendAmount')
  watchSendAmount(value) {
    if (!value && this.timeInterval) {
      this.clearTimer()
    } else {
      this.setTimeInterval()
    }
  }

  _openSearch = (type: string) => {
    this.swapTokenType = type
    this.showSearch = !this.showSearch
  }
  getBalance = () => {
    if (storage.getIsLogin()) {
      getBalanceByToken(state.send.address, state.send.decimals).then(res => {
        this.balance = res
      })
    }
  }

  _selectToken = async ({ detail }) => {
    state.loading = true
    if (this.swapTokenType === 'send') {
      if (detail.address == state.receive.address) {
        state.receive = state.send
      }
      state.send = detail
      if (state.chain.chainId > 0 && state.userAddress) {
        this._checkApprove(detail.address)
        this.getBalance()
      }
    } else {
      if (detail.address == state.send.address) {
        state.send = state.receive
      }
      state.receive = detail
    }
    this.showSearch = false
    if (Number(this.sendAmount) > 0) {
      this.getTransformInfo()
    }
  }

  getTransformInfo = async (type: string = 'send') => {
    const dodoRouterData = {
      type: '',
      useSource: '',
      priceImpact: '',
      resPricePerToToken: '0',
      resPricePerFromToken: '0',
      resAmount: '0',
    }
    if (type === 'send' && Number(this.sendAmount) <= 0) {
      state.circle = false
      this.receiveAmount = ''
      dodoRouterData.type = 'send'
      this.dodoRouterData = dodoRouterData
      this.clearTimer()
      return
    }
    if (type === 'receive' && Number(this.receiveAmount) <= 0) {
      state.circle = false
      this.sendAmount = ''
      dodoRouterData.type = 'receive'
      this.dodoRouterData = dodoRouterData
      this.clearTimer()
      return
    }

    state.circle = false
    this.getTransformInfoLoading = true
    let body
    let fromAmount
    if (type === 'send') {
      fromAmount = parseUnits(this.sendAmount.toString(), state.send.decimals)
      body = {
        fromTokenAddress: state.send.address,
        fromTokenDecimals: state.send.decimals,
        toTokenAddress: state.receive.address,
        toTokenDecimals: state.receive.decimals,
        fromAmount: fromAmount,
        slippage: this.slippage,
      }
    } else {
      fromAmount = parseUnits(this.receiveAmount.toString(), state.receive.decimals)
      body = {
        fromTokenAddress: state.receive.address,
        fromTokenDecimals: state.receive.decimals,
        toTokenAddress: state.send.address,
        toTokenDecimals: state.send.decimals,
        fromAmount: fromAmount,
        slippage: this.slippage,
      }
    }
    return getDodoData(body)
      .then(data => {
        this.getTransformInfoLoading = false
        this.dodoRouterData = data

        const resAmount = data.resAmount * this.feePercentage
        if (type === 'send') {
          this.receiveAmount = formatNumber(resAmount) || '0'
          this.dodoRouterData = {
            type: 'send',
            useSource: data.useSource,
            priceImpact: formatNumber(data.priceImpact * 100, 3),
            resPricePerToToken: data.resPricePerToToken,
            resPricePerFromToken: formatNumber(data.resPricePerFromToken * this.feePercentage),
            resAmount: formatNumber(resAmount),
          }
        } else {
          this.sendAmount = formatNumber(resAmount) || '0'
          this.dodoRouterData = {
            type: 'receive',
            useSource: data.useSource,
            priceImpact: formatNumber(data.priceImpact * 100, 3),
            resPricePerToToken: data.resPricePerFromToken,
            resPricePerFromToken: formatNumber(data.resPricePerFromToken * this.feePercentage),
            resAmount: formatNumber(resAmount),
          }
        }
        this.swapData = {
          dodoData: data,
          fromAmount: fromAmount,
          fromAddress: state.send.address,
          toAddress: state.receive.address,
          showFromAmount: this.sendAmount,
          showToAmount: this.receiveAmount,
        }
        state.circle = true
      })
      .catch(_ => {
        this.getTransformInfoLoading = false
        state.circle = false
      })
  }

  openTransformInfoBox = async () => {
    try {
      await this.getTransformInfo()
      this.transformInfoVisible = true
    } catch (e) {}
  }

  openSetting = () => {
    this.settingVisible = true
  }

  handleRefresh = () => {
    this.getTransformInfo('send')
  }

  setTimeInterval = () => {
    this.clearTimer()
    this.timeInterval = workerTimers.setInterval(() => {
      this.getTransformInfo('send')
    }, 30000)
  }

  handleReload = async () => {
    state.reload = true
    this.setTimeInterval()
    await this.getTransformInfo('send')
    state.reload = false
  }
  handleCustomize = () => {
    this.openSetting()
  }

  /**
   * clickMenu
   */
  @Method()
  async clickMenu(menuName: string) {
    if (menuName === 'refresh') {
      this.handleRefresh()
    } else if (menuName === 'reload') {
      this.handleReload()
    } else if (menuName === 'customize') {
      this.handleCustomize()
    }
  }

  _checkApprove = (address: string): void => {
    if (!storage.getIsLogin()) return
    this.isApproved = false
    if (state.chain.chainId === 56 && address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
      this.isApproved = true
      return
    }
    this.checkApproveLoading = true
    checkTokenApprove(address)
      .then(res => {
        this.checkApproveLoading = false
        this.isApproved = res
      })
      .catch(_ => {
        this.checkApproveLoading = false
        this.isApproved = false
      })
  }

  handleTokenApprove = () => {
    if (state.chain.chainId === 56 && state.send.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
      this.isApproved = true
      return
    }
    this.tokenApproveLoading = true
    tokenApprove(state.send.address)
      .then(() => {
        this.isApproved = true
        this.tokenApproveLoading = false
      })
      .finally(_ => {
        this.tokenApproveLoading = false
      })
  }

  handleBalanceMax = () => {
    if (Number(this.balance) > 0) {
      let balance = this.balance
      if (
        state.chain.chainId === 56 &&
        state.send.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' &&
        Number(this.balance) > 0.01
      ) {
        balance = numberSub(null, balance, '0.01')
      }
      this.handleUpdateValue({ detail: balance }, 'send')
    }
  }

  handleUpdateValue(e, type) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      if (type === 'send') {
        this.sendAmount = e.detail
        state.sendAmount = e.detail
      } else {
        this.receiveAmount = e.detail
        state.receiveAmount = e.detail
      }
      this.getTransformInfo(type)
    }, 800)
  }

  handleWalletConnect = async () => {
    if (!checkEthereum()) {
      return
    }
    this.connectWalletLoading = true
    try {
      const account = await requestAccounts()
      this.setUserAddress(account)
      this.connectWalletLoading = false
    } catch (err) {
      this.connectWalletLoading = false
      const message = err.message || 'Connect error.'
      console.log('message', message)
    }
  }
  setUserAddress = (address: string) => {
    if (address) {
      storage.setIsLogin(true)
    }
    state.userAddress = address
  }

  handleNetworkConnect = () => {
    if (!checkEthereum()) {
      return
    }
    if (config.chainIds.length) {
      const chainId = config.chainIds[0]
      changeEthereumChainForPc(chainId)
        .then(() => {
          this.setNetworkInfo(chainId)
        })
        .catch(err => {
          const msg = err.message || 'Connect error.'
          console.log('error:', msg)
        })
    }
  }
  setNetworkInfo = (chainId: number): void => {
    const chainList = getChainList()
    const item = chainList.find(x => x.chainId === chainId)
    if (item) {
      state.chain = item
    } else {
      state.chain = { chainId: 0, chainName: '' }
    }
  }
  changeCoin = () => {
    state.loading = true
    state.circle = false
    let sendCopy = JSON.parse(JSON.stringify(state.send))
    let receiveCopy = JSON.parse(JSON.stringify(state.receive))
    state.send = receiveCopy
    state.receive = sendCopy
    this.sendAmount = ''
    this.receiveAmount = ''
    this.dodoRouterData.resAmount = '0'
    this._checkApprove(receiveCopy.address)
    this.getBalance()
  }

  componentDidLoad() {
    onChange('userAddress', val => {
      if (val) {
        this.getBalance()
        this._checkApprove(state.send.address)
      } else {
        this.balance = '0'
      }
    })
    onChange('chain', val => {
      if (val) {
        getUserAddress().then(userAddress => {
          if (userAddress && val.chainId && window['ethereum'].chainId == '0x38') {
            getFeePercentage().then(res => {
              this.feePercentage = res
            })
            this.getBalance()
            this._checkApprove(state.send.address)
          }
        })
      }
    })
    if (checkEthereum()) {
      getUserAddress().then(userAddress => {
        if (userAddress && state.chain.chainId && window['ethereum'].chainId == '0x38') {
          getFeePercentage().then(res => {
            this.feePercentage = res
          })
          this.getBalance()
          this._checkApprove(state.send.address)
        }
      })
    }
  }

  clearTimer() {
    if (this.timeInterval) {
      workerTimers.clearInterval(this.timeInterval)
      this.timeInterval = null
    }
  }

  getUseSourceLogo = name => {
    if (name.startsWith('pancake')) {
      return config.imgUrl + '/png/pancake.png'
    }
    if (name.startsWith('dodo')) {
      return config.imgUrl + '/png/dodo.png'
    }
    if (name.startsWith('0x')) {
      return config.imgUrl + '/png/0x.png'
    }
    if (name.startsWith('1inch')) {
      return config.imgUrl + '/png/1inch.png'
    }
    if (name.startsWith('paraSwap')) {
      return config.imgUrl + '/png/paraSwap.png'
    }
    return ''
  }

  getUseSourceText = name => {
    const text = ['pancake', 'dodo', '0x', '1inch', 'paraSwap']
    const find = text.find(item => name.includes(item))
    if (find) {
      return find
    }
    return ''
  }

  render() {
    return (
      <Fragment>
        <div class="swap-box flex flex-col items-center">
          <div class="grow">
            <div class="flex items-center justify-end text-right text-xs mb-1">
              <span>Balance: {this.balance}</span>
              <div class="balance-max" onClick={this.handleBalanceMax}>
                MAX
              </div>
            </div>
            <swap-input
              token={state.send}
              value={this.sendAmount}
              onUpdateValue={e => this.handleUpdateValue(e, 'send')}
              onOpenSearch={() => this._openSearch('send')}
            ></swap-input>
            <div class="flex items-center h-[26px] text-xs relative">
              <img
                onClick={this.changeCoin}
                class="icon cursor-pointer"
                src={config.imgUrl + '/icon/change.svg'}
                alt="change"
              />
              {Number(this.sendAmount) > 0 && Number(this.receiveAmount) > 0 ? (
                <span class="ml-[2px]">
                  1{state.send.symbol} = {this.dodoRouterData.resPricePerFromToken} {state.receive.symbol}
                </span>
              ) : null}
            </div>
            <swap-input
              token={state.receive}
              value={this.receiveAmount}
              onUpdateValue={e => this.handleUpdateValue(e, 'receive')}
              onOpenSearch={() => this._openSearch('receive')}
            ></swap-input>
            {Number(this.receiveAmount) > 0 ? (
              <div class="router-container mt-[15px] divide-y divide-[#43485E]">
                <div class="router-path h-[30px] flex justify-center items-center text-sm">
                  <span class="text-color">{state.send.symbol}</span>
                  <span class="text-color">&nbsp; &gt; &nbsp;</span>
                  <img class="source-logo" src={this.getUseSourceLogo(this.dodoRouterData.useSource)} alt="" />
                  <span>{this.getUseSourceText(this.dodoRouterData.useSource)}</span>
                  <span class="text-color">&nbsp; &gt; &nbsp;</span>
                  <span class="text-color">{state.receive.symbol}</span>
                </div>
                <div class="router-amount flex flex-col h-[60px] px-[10px] text-xs justify-around">
                  <div class="amount-item flex justify-between mt-1">
                    <span class="text-color">Minimum Received</span>
                    <span class="text-color">{this.dodoRouterData.resAmount}</span>
                  </div>
                  <div class="amount-item flex justify-between">
                    <span class="text-color">Received</span>
                    <span class="text-color">{state.receive.symbol}</span>
                  </div>
                  <div class="amount-item flex justify-between">
                    <span class="text-color">Price Impact</span>
                    <span class="text-color">{this.dodoRouterData.priceImpact}%</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <this.MyBottomButton />
        </div>

        <div class={`search-container fixed top-3 left-5 right-5 z-10 ${this.showSearch ? 'show' : 'hide'}`}>
          <search-tokens onSelected={this._selectToken} swapTokenType={this.swapTokenType}></search-tokens>
          <div class="bg-transparent mt-1 flex items-center justify-center">
            <xy-icon class="cursor-pointer" name="close" onClick={() => (this.showSearch = false)}></xy-icon>
          </div>
        </div>

        <deal-status-box
          visible={this.transformInfoVisible}
          send={state.send}
          receive={state.receive}
          swapData={this.swapData}
          onClose={() => {
            this.transformInfoVisible = false
            this.getTransformInfo()
            this.getBalance()
          }}
        ></deal-status-box>

        <swap-setting
          visible={this.settingVisible}
          slippage={this.slippage}
          onChangeSlippage={({ detail }) => {
            this.slippage = detail
            this.getTransformInfo()
          }}
          onClose={() => (this.settingVisible = false)}
        ></swap-setting>
      </Fragment>
    )
  }

  MyBottomButton = () => {
    if (!state.userAddress) {
      return (
        <bottom-button class="bottom-button" loading={this.connectWalletLoading} onClick={this.handleWalletConnect}>
          <xy-icon class="icon-wallet" slot="prefix" name="wallet"></xy-icon>
          Connect Wallet
        </bottom-button>
      )
    }
    if (!state.chain.chainName) {
      return (
        <bottom-button class="bottom-button" loading={this.connectWalletLoading} onClick={this.handleNetworkConnect}>
          Wrong Network
        </bottom-button>
      )
    }
    if (Number(this.balance) == 0 || Number(this.balance) < Number(this.sendAmount)) {
      return (
        <bottom-button class="bottom-button opacity-50 cursor-not-allowed pointer-events-none">
          Insufficient Balance
        </bottom-button>
      )
    } else if (this.isApproved || state.send.address == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
      return (
        <bottom-button
          class={this.sendAmount ? 'bottom-button' : 'bottom-button opacity-50 cursor-not-allowed pointer-events-none'}
          loading={this.getTransformInfoLoading}
          onClick={this.openTransformInfoBox}
        >
          <xy-icon class="icon-swap" slot="prefix" name="swap-m"></xy-icon>
          SWAP
        </bottom-button>
      )
    } else {
      return (
        <bottom-button
          class="bottom-button"
          loading={this.checkApproveLoading || this.tokenApproveLoading}
          onClick={this.handleTokenApprove}
        >
          <xy-icon class="icon-approve" slot="prefix" name="approve"></xy-icon>
          {this.checkApproveLoading ? 'CHECK APPROVE' : 'APPROVE'}
        </bottom-button>
      )
    }
  }
}
