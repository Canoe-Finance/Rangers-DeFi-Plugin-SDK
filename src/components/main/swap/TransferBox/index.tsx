import { Component, h, State } from '@stencil/core'
import { utils, providers, constants, BigNumber } from 'ethers'
import { numberMul, numberSub } from 'utils/math'
import { state, onChange } from 'store'
import { changeEthereumChainForPc, checkEthereum, getUserAddress, requestAccounts } from 'api/ethereum'
import storage from 'utils/storage'
import { ICrossToken, TCrossType } from 'interface'
import config from 'config'
import { getChainList } from 'utils/func'
import { getBalanceByToken } from 'api/ethers/token'
import { getContract, getContractSigner } from 'api/ethers'
import crossAbi from 'abi/crossABI.json'
import sendCoinABI from 'abi/sendCoinABI.json'

@Component({
  tag: 'transfer-box',
  styleUrl: 'index.scss',
  shadow: true,
})
export class TransferBox {
  timeInterval = null
  timer: NodeJS.Timeout | null = null

  @State() showSearch: boolean = false
  @State() crossType: TCrossType = 'fromChain'
  @State() sendAmount: string = ''
  @State() receiveAmount: string = ''
  @State() balance: string = '0'
  @State() loading: boolean = false
  @State() allowance: string = '0'

  @State() fromChain: string = 'BSC'
  @State() toChain: string = 'Rangers'
  @State() token: ICrossToken = {
    toChainId: 2025,
    name: 'Rangers Protocol',
    symbol: 'RPG',
    decimals: 18,
    logoURI: 'https://g-dex.canoe.finance/assets/chain/RPG.svg',
    address: '0xc2098a8938119a52b1f7661893c0153a6cb116d5',
    tokenAddress: '0xaf2d1c5374ee99b167dd8567f2819c7567f1f1a0',
    contractAddress: '0xf9736ec3926703e85c843fc972bd89a7f8e827c0',
    isApprove: true,
    method: 'anySwapOutUnderlying',
    config: {
      fee: 0.001,
      minFee: 2.9,
      maxFee: 572,
      minAmount: 5.8,
      maxAmount: 3000000,
    },
  }
  @State() currentFee: number = 0
  @State() href: string = ''

  getCrossInfo() {
    if (
      Number(this.sendAmount) >= this.token.config.minAmount &&
      Number(this.sendAmount) <= this.token.config.maxAmount
    ) {
      const fee = numberMul(null, this.sendAmount, this.token.config.fee)
      const currentMaxFee = Math.max(fee, this.token.config.minFee)
      const currentMinFee = Math.min(currentMaxFee, this.token.config.maxFee)
      this.currentFee = currentMinFee
      const receiveAmount = numberSub(null, this.sendAmount, currentMinFee)
      this.receiveAmount = receiveAmount > 0 ? receiveAmount : ''
    } else {
      this.currentFee = 0
      this.receiveAmount = ''
    }
  }

  handleUpdateValue(e) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.sendAmount = e.detail
      this.getCrossInfo()
    }, 200)
  }

  openSearch = (type: TCrossType) => {
    this.crossType = type
    this.showSearch = !this.showSearch
  }

  getBalance = () => {
    if (storage.getIsLogin()) {
      getBalanceByToken(this.token.address, this.token.decimals).then(res => {
        this.balance = res
      })
    }
  }

  handleBalanceMax = () => {
    if (Number(this.balance) > 0) {
      let balance = this.balance
      if (
        state.chain.chainId === 56 &&
        this.token.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' &&
        Number(this.balance) > 0.01
      ) {
        balance = numberSub(null, balance, '0.01')
      }
      this.handleUpdateValue({ detail: balance })
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

  handleWalletConnect = async () => {
    if (!checkEthereum()) {
      return
    }
    this.loading = true
    try {
      const account = await requestAccounts()
      this.setUserAddress(account)
      this.loading = false
    } catch (err) {
      this.loading = false
      const message = err.message || 'Connect error.'
      console.log('message', message)
    }
  }

  handleTransfer = async () => {
    try {
      this.loading = true
      const contract = getContractSigner(this.token.contractAddress, crossAbi)
      const method = this.token.method
      const amount = utils.parseUnits(this.sendAmount, this.token.decimals)
      if (method == 'anySwapOutNative') {
        const tx = await contract.anySwapOutNative(this.token.tokenAddress, state.userAddress, this.token.toChainId, {
          value: amount,
        })
        await tx.wait()
        this.getBalance()
      } else if (method == 'anySwapOutUnderlying') {
        const toChainId = BigNumber.from(this.token.toChainId)
        const currentLimit = await contract.estimateGas.anySwapOutUnderlying(
          this.token.tokenAddress,
          state.userAddress,
          amount,
          toChainId,
        )
        const gasLimit = utils.hexlify(currentLimit.add(currentLimit.div(20)))
        const provider = new providers.Web3Provider(window['ethereum'])
        const currentGasPrice = await provider.getGasPrice()
        const gasPrice = utils.hexlify(currentGasPrice.add(currentGasPrice.div(20)))
        const tx = await contract.anySwapOutUnderlying(this.token.tokenAddress, state.userAddress, amount, toChainId, {
          gasLimit,
          gasPrice,
        })
        await tx.wait()
        this.getBalance()
        this.href = 'https://bscscan.com/tx/' + tx.hash
      } else if (method == 'anySwapOut') {
        const currentLimit = await contract.estimateGas.anySwapOut(
          this.token.tokenAddress,
          state.userAddress,
          amount,
          this.token.toChainId,
        )
        const gasLimit = utils.hexlify(currentLimit.add(currentLimit.div(20)))
        const provider = new providers.Web3Provider(window['ethereum'])
        const currentGasPrice = await provider.getGasPrice()
        const gasPrice = utils.hexlify(currentGasPrice.add(currentGasPrice.div(20)))
        const tx = await contract.anySwapOut(this.token.tokenAddress, state.userAddress, amount, this.token.toChainId, {
          gasLimit,
          gasPrice,
        })
        await tx.wait()
        this.getBalance()
      } else if (method == 'transfer') {
        const provider = new providers.Web3Provider(window['ethereum'])
        const signer = provider.getSigner()
        const tx = await signer.sendTransaction({
          to: this.token.contractAddress,
          value: amount,
        })
        await tx.wait()
        this.getBalance()
        this.href = 'https://bscscan.com/tx/' + tx.hash
      }
      this.sendAmount = ''
      this.receiveAmount = ''
      this.currentFee = 0
      this.loading = false
      setTimeout(() => {
        this.href = ''
      }, 10000)
    } catch (err) {
      console.error(err)
      this.loading = false
    }
  }

  checkApprove = async (address: string) => {
    if (!storage.getIsLogin()) return
    this.loading = true
    const contract = getContract(this.token.address, sendCoinABI)
    const res = await contract.allowance(address, this.token.contractAddress).catch(_ => {
      this.loading = false
      this.allowance = '0'
    })
    this.loading = false
    this.allowance = res.toString()
  }

  handleApprove = async () => {
    this.loading = true
    const contract = getContractSigner(this.token.address, sendCoinABI)
    const tx = await contract.approve(this.token.contractAddress, constants.MaxUint256).catch(_ => {
      this.loading = false
    })
    await tx.wait()
    this.loading = false
    this.allowance = constants.MaxUint256.toString()
  }

  componentDidLoad() {
    onChange('userAddress', val => {
      if (val) {
        this.getBalance()
        this.checkApprove(val)
      } else {
        this.balance = '0'
      }
    })
    onChange('chain', val => {
      if (val) {
        getUserAddress().then(userAddress => {
          if (userAddress && val.chainId && window['ethereum'].chainId == '0x38') {
            this.getBalance()
            this.checkApprove(userAddress)
          }
        })
      }
    })
    if (checkEthereum()) {
      getUserAddress().then(userAddress => {
        if (userAddress && state.chain.chainId && window['ethereum'].chainId == '0x38') {
          this.getBalance()
          this.checkApprove(userAddress)
        }
      })
    }
  }

  handleSelect = async ({ detail }) => {
    this.fromChain = detail.fromChain
    this.toChain = detail.toChain
    this.token = detail.token
    this.showSearch = false
    this.sendAmount = ''
    this.receiveAmount = ''
    this.getBalance()
  }

  render() {
    return (
      <section class="relative h-full">
        <div class="transfer-box flex flex-col text-xs">
          <div class="flex-1">
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center">
                <label>From</label>
                <div
                  class="chain-select flex items-center has-right-arrow"
                  onClick={() => this.openSearch('fromChain')}
                >
                  <img src={`${config.imgUrl}/chain/${this.fromChain}.svg`} alt="" />
                  <span>{this.fromChain}</span>
                </div>
              </div>
              <div class="flex items-center">
                <span>Balance: {this.balance}</span>
                <div class="balance-max" onClick={this.handleBalanceMax}>
                  MAX
                </div>
              </div>
            </div>
            <swap-input
              token={this.token}
              value={this.sendAmount}
              onUpdateValue={e => this.handleUpdateValue(e)}
              onOpenSearch={() => this.openSearch('token')}
            ></swap-input>
            <div class="flex items-center my-2 relative pl-6">
              <div class="absolute line">
                <i></i>
              </div>
              <label>To</label>
              <div class="chain-select flex items-center has-right-arrow" onClick={() => this.openSearch('toChain')}>
                <img src={`${config.imgUrl}/chain/${this.toChain}.svg`} alt="" />
                <span>{this.toChain}</span>
              </div>
            </div>
            <swap-input
              token={this.token}
              value={this.receiveAmount}
              readonly
              onOpenSearch={() => this.openSearch('token')}
            ></swap-input>
            <div class="router-container mt-[8px]">
              <div class="router-amount flex flex-col h-[60px] px-[10px] text-xs justify-around">
                <div class="amount-item flex justify-between mt-1">
                  <span class="text-color">Cross-chain Range</span>
                  <span class="text-color">
                    {this.token.config.minAmount} ~ {this.token.config.maxAmount} {this.token.symbol}
                  </span>
                </div>
                <div class="amount-item flex justify-between">
                  <span class="text-color">Bridge Rate</span>
                  <span class="text-color">
                    {this.token.config.fee * 100}% on {this.fromChain}
                  </span>
                </div>
                <div class="amount-item flex justify-between">
                  <span class="text-color">Fee</span>
                  <span class="text-color">
                    {this.currentFee} {this.token.symbol}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <this.MyBottomButton />
        </div>

        <div class={`search-container absolute top-3 left-5 right-5 z-10 ${this.showSearch ? 'show' : 'hide'}`}>
          <search-cross
            onSelected={this.handleSelect}
            crossType={this.crossType}
            fromChain={this.fromChain}
            toChain={this.toChain}
            token={this.token}
          ></search-cross>
          <div class="bg-transparent mt-1 flex items-center justify-center">
            <xy-icon class="cursor-pointer" name="close" onClick={() => (this.showSearch = false)}></xy-icon>
          </div>
        </div>
      </section>
    )
  }

  MyBottomButton = () => {
    if (!state.userAddress) {
      return (
        <bottom-button class="bottom-button" loading={this.loading} onClick={this.handleWalletConnect}>
          <xy-icon class="icon-wallet" slot="prefix" name="wallet"></xy-icon>
          Connect Wallet
        </bottom-button>
      )
    }
    if (!state.chain.chainName) {
      return (
        <bottom-button class="bottom-button" loading={this.loading} onClick={this.handleNetworkConnect}>
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
    }
    if (this.token.isApprove && Number(this.sendAmount) > Number(this.allowance)) {
      return (
        <bottom-button class="bottom-button" loading={this.loading} onClick={this.handleApprove}>
          Approve
        </bottom-button>
      )
    }
    if (this.href) {
      return (
        <a href={this.href} class="no-underline" target="_blank" rel="noopener noreferrer">
          <bottom-button class="bottom-button">
            <xy-icon class="icon-swap" slot="prefix" name="check"></xy-icon>
            View detail
          </bottom-button>
        </a>
      )
    } else {
      return (
        <bottom-button
          class={this.sendAmount ? 'bottom-button' : 'bottom-button opacity-50 cursor-not-allowed pointer-events-none'}
          disabled={Number(this.receiveAmount) <= 0}
          loading={this.loading}
          onClick={this.handleTransfer}
        >
          <xy-icon class="icon-swap" slot="prefix" name="transfer"></xy-icon>
          Transfer
        </bottom-button>
      )
    }
  }
}
