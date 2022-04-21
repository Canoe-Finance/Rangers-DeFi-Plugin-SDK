import { getContractSigner, getContract } from './index.js'
import { showEthersError } from 'utils/func'
import sendCoinABI from '../../abi/sendCoinABI'
import erc20ABI from '../../abi/erc20ABI'
import config from 'config'
import { state } from 'store'
import { isNumberGt } from 'utils/math'
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

export const getBalanceByToken = token => {
  const contract = getContract(token, erc20ABI)
  return contract.balanceOf(state.userAddress).then(res => {
    return formatUnits(res)
  })
}
