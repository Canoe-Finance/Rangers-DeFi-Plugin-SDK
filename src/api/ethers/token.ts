import { ethers } from 'ethers'

import { getContractSigner, getContract } from './index.js'
import { showEthersError } from 'utils/func'
import sendCoinABI from '../../abi/sendCoinABI.json'
import config from 'config'
import { state } from 'store'
import { formatNumber, isNumberGt } from 'utils/math'
import { toBigNumberString, formatUnits } from './utils'

export const checkTokenApprove = token => {
  const contract = getContract(token, sendCoinABI)
  return contract
    .allowance(state.userAddress, config.agencyContract)
    .then(res => {
      return isNumberGt(toBigNumberString(res), 0)
    })
    .catch(err => {
      showEthersError(err)
      return Promise.reject(err)
    })
}
export const tokenApprove = token => {
  const contract = getContractSigner(token, sendCoinABI)
  return contract.approve(config.agencyContract, (Math.pow(2, 256) - 1).toString(16)).catch(err => {
    showEthersError(err)
    return Promise.reject(err)
  })
}

export const getBalanceByToken = async (token, decimals) => {
  if (token == '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') {
    const provider = new ethers.providers.Web3Provider(window['ethereum'])
    const data = await provider.getBalance(window['ethereum'].selectedAddress)
    return data.gt(0) ? formatNumber(ethers.utils.formatEther(data)) : '0'
  }
  const contract = getContract(token, sendCoinABI)
  return contract.balanceOf(state.userAddress).then(res => {
    return res > 0 ? formatNumber(formatUnits(res, decimals)) : '0'
  })
}
