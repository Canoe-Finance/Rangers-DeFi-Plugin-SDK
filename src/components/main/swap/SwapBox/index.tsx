import { Component, Method, h, Fragment, Prop, State, Watch } from '@stencil/core'
import * as workerTimers from 'worker-timers'
import { state } from 'store'
import { getDodoData } from 'api/axios'
import { parseUnits } from 'api/ethers/utils'
import { IDodoRouterRes } from 'interface'
import { checkTokenApprove, tokenApprove, getBalanceByToken } from 'api/ethers/token'
import { checkEthereum, requestAccounts } from 'api/ethereum/index'
import storage from 'utils/storage'

@Component({
  tag: 'swap-box',
  styleUrl: 'index.scss',
  shadow: true,
})
export class SwapBox {
  @State() changeIcon: string = '../../../../assets/icon/change.svg'
  @State() slippage: number = 0.5
  @State() tokens = []
  @State() swapTokenType: string = 'send'
  @State() balance: string = '0'
  @State() receiveAmount = 0
  @State() sendAmount = 0
  @State() swapData = {}
  @State() showSearch: boolean = false
  @State() timeInterval: number
  @Watch('sendAmount')
  watchSendAmount(value) {
    if (value == 0) {
      workerTimers.clearInterval(this.timeInterval)
    } else {
      this.setTimeInterval()
    }
  }
  @Prop() dodoRouterData: IDodoRouterRes = {
    type: 'send',
    useSource: '',
    priceImpact: 0,
    resPricePerToToken: 0,
    resPricePerFromToken: 0,
    resAmount: 0,
  }
  _openSearch = (type: string) => {
    this.swapTokenType = type
    this.showSearch = !this.showSearch
  }
  getBalance = () => {
    getBalanceByToken(state.send.address).then(res => {
      this.balance = res
    })
  }

  _selectToken = async ({ detail }) => {
    console.log(detail)
    if (this.swapTokenType === 'send') {
      state.send = detail
      this.getBalance()
      this._checkApprove(detail.address)
    } else {
      state.receive = detail
    }
    this.showSearch = false
    this.getTransformInfo()
  }

  @State() getTransformInfoLoading: boolean = false
  getTransformInfo = async (type: string = 'send') => {
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
        const resAmount = data.resAmount
        if (type === 'send') {
          this.receiveAmount = resAmount
          this.dodoRouterData = {
            type: 'send',
            useSource: data.useSource,
            priceImpact: data.priceImpact,
            resPricePerToToken: data.resPricePerToToken,
            resPricePerFromToken: data.resPricePerFromToken,
            resAmount: resAmount,
          }
        } else {
          this.sendAmount = resAmount
          this.dodoRouterData = {
            type: 'receive',
            useSource: data.useSource,
            priceImpact: data.priceImpact,
            resPricePerToToken: data.resPricePerFromToken,
            resPricePerFromToken: data.resPricePerToToken,
            resAmount: resAmount,
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
      })
      .catch(_ => {
        this.getTransformInfoLoading = false
      })
  }

  @State() transformInfoVisible: boolean = false
  openTransformInfoBox = async () => {
    try {
      await this.getTransformInfo()
      this.transformInfoVisible = true
    } catch (e) {}
  }

  @State() settingVisible: boolean = false
  openSetting = () => {
    this.settingVisible = true
  }

  handleRefresh = () => {
    this._swapInputBlur('send')
  }

  setTimeInterval = () => {
    this.timeInterval = workerTimers.setInterval(() => {
      this._swapInputBlur('send')
    }, 30000)
  }

  handleReload = () => {
    this._swapInputBlur('send')
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

  // approve
  @State() isApproved: boolean = false
  @State() checkApproveLoading: boolean = false
  _checkApprove = (address: string): void => {
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
  @State() tokenApproveLoading: boolean = false
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

  getBottomButton = () => {
    if (!state.userAddress) {
      return (
        <bottom-button class="bottom-button" loading={this.connectWalletLoading} onClick={this.handleWalletConnect}>
          <xy-icon class="icon-wallet" slot="prefix" name="wallet"></xy-icon>
          Connect Wallet
        </bottom-button>
      )
    } else {
      if (this.isApproved) {
        if (this.balance == '0') {
          return (
            <bottom-button class="bottom-button opacity-50 cursor-not-allowed pointer-events-none">
              Insufficient Balance
            </bottom-button>
          )
        } else {
          return (
            <bottom-button
              class={
                this.sendAmount == 0
                  ? 'bottom-button opacity-50 cursor-not-allowed pointer-events-none'
                  : 'bottom-button'
              }
              loading={this.getTransformInfoLoading}
              onClick={this.openTransformInfoBox}
            >
              <xy-icon class="icon-swap" slot="prefix" name="swap-m"></xy-icon>
              SWAP
            </bottom-button>
          )
        }
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

  debounce(func, timeout = 300) {
    let timer
    return (...args) => {
      if (!timer) {
        func.apply(this, args)
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        timer = undefined
      }, timeout)
    }
  }
  _swapInputBlur = type => {
    this.debounce(this.getTransformInfo(type))
  }

  @State() connectWalletLoading: boolean = false
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
  changeCoin = () => {
    let sendCopy = JSON.parse(JSON.stringify(state.send))
    let receiveCopy = JSON.parse(JSON.stringify(state.receive))
    state.send = receiveCopy
    state.receive = sendCopy
    this.sendAmount = 0
    this.receiveAmount = 0
    this.dodoRouterData.resAmount = 0
  }

  disconnectedCallback() {
    workerTimers.clearInterval(this.timeInterval)
  }
  render() {
    return (
      <Fragment>
        <div class="swap-box flex flex-col items-center">
          <div class="grow">
            <swap-input
              token={state.send}
              value={this.sendAmount}
              // onTokenBlur={() => this._swapInputBlur('send')}
              onUpdateValue={e => {
                this.sendAmount = e.detail
                state.sendAmount = e.detail
                this._swapInputBlur('send')
              }}
              onOpenSearch={() => this._openSearch('send')}
            ></swap-input>
            <div class="flex items-center justify-end h-[26px] text-[12px] relative">
              <img
                onClick={this.changeCoin}
                class="icon absolute left-0 cursor-pointer"
                src={this.changeIcon}
                alt="change"
              />
              {this.dodoRouterData.resAmount ? (
                <span>
                  1{state.send.symbol} = {this.dodoRouterData.resPricePerFromToken} {state.receive.symbol}
                </span>
              ) : null}
              <span>Balance {this.balance}</span>
              {/* <span class="flex items-center bg-[#323645] text-color ml-[4px]">MAX</span> */}
            </div>
            <swap-input
              token={state.receive}
              value={this.receiveAmount}
              // onTokenBlur={() => this._swapInputBlur('receive')}
              onUpdateValue={e => {
                this.receiveAmount = e.detail
                state.receiveAmount = e.detail
                this._swapInputBlur('receive')
              }}
              onOpenSearch={() => this._openSearch('receive')}
            ></swap-input>
            {this.receiveAmount ? (
              <div class="router-container mt-[15px] divide-y divide-[#43485E]">
                <div class="router-path h-[30px] flex justify-center items-center text-sm">
                  <span class="text-color">{state.send.symbol}</span>
                  <span class="text-color"> &gt; </span>
                  <span>{this.dodoRouterData.useSource}</span>
                  <span class="text-color"> &gt; </span>
                  <span class="text-color">{state.receive.symbol}</span>
                </div>
                <div class="router-amount flex flex-col h-[60px] px-[10px] text-xs justify-around">
                  <div class="amount-item flex justify-between">
                    <span class="text-color">
                      {this.dodoRouterData.type === 'send' ? 'Minimum Received' : 'Maximum sold'}
                    </span>
                    <span class="text-color">{this.dodoRouterData.resAmount}</span>
                  </div>
                  <div class="amount-item flex justify-between">
                    <span class="text-color">{this.dodoRouterData.type === 'send' ? 'Received' : 'Sold'}</span>
                    <span class="text-color">
                      {this.dodoRouterData.type === 'send' ? state.receive.symbol : state.send.symbol}
                    </span>
                  </div>
                  <div class="amount-item flex justify-between">
                    <span class="text-color">Price Impact</span>
                    <span class="text-color">{this.dodoRouterData.priceImpact}</span>
                  </div>
                </div>
              </div>
            ) : null}
            {/* <bottom-button class="bottom-button" onClick={this.getTransformInfo}>
            <xy-icon class="icon-wallet" slot="prefix" name="wallet"></xy-icon>
            Test
          </bottom-button> */}
          </div>
          {this.getBottomButton()}
        </div>

        <div class={`search-container fixed top-5 bottom-5 left-5 right-5 z-10 ${this.showSearch ? 'show' : 'hide'}`}>
          <search-tokens onSelected={this._selectToken}></search-tokens>
        </div>

        <deal-status-box
          visible={this.transformInfoVisible}
          send={state.send}
          receive={state.receive}
          swapData={this.swapData}
          onClose={() => (this.transformInfoVisible = false)}
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
}
