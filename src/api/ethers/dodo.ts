import InputDataDecoder from 'ethereum-input-data-decoder'
import { getContractSigner, getContract } from './index'
import metaDexABI from '../../abi/metaDexABI.json'
import metaDex2ABI from '../../abi/metaDex2ABI.json'
import dodoABI from '../../abi/dodoABI.json'
import { toBigNumberString } from './utils'
import config from 'config'

// metadex asset search contract
const contract2Address = '0xFdab977F215436FF8ec79AbF3A598f7e8766b1dA'
// TODO: change this from canoe-dex
const projectId = 'ymg'

export const getFeePercentage = async () => {
  const contract = getContract(contract2Address, metaDex2ABI)
  const projectFee = (await contract.projectFee(projectId)) || 0
  const treasuryFee = (await contract.treasuryFee()) || 0
  const free = Number(toBigNumberString(projectFee)) + Number(toBigNumberString(treasuryFee))
  return (100 - free) / 100
}

export const dodoSwap = ({ dodoData, fromAddress, toAddress, fromAmount, number }) => {
  const key = dodoData.data.substring(0, 10)
  const decoderData = decoder(dodoData.data)
  const params = {
    targetApproveAddr: dodoData.targetApproveAddr || dodoData.to,
    to: dodoData.to,
    fromAddress,
    toAddress,
    fromAmount,
    number,
    decoderData: getDataObj(decoderData),
  }
  if (key === '0x7617b389') {
    return dodoMixSwapOne(params)
  } else if (key === '0x23c38fa3') {
    return dodoMixSwapTwo(params)
  } else if (key === '0x5028bb95') {
    return dodoSwapV2ETHToToken(params)
  } else if (key === '0xf87dc1b7') {
    return dodoSwapV2TokenToToken(params)
  } else if (key === '0x54bacd13') {
    return externalSwap(params)
  } else if (key === '0x0dd4ebd9') {
    return dodoSwapV1(params)
  } else if (key === '0x1e6d24c2') {
    return dodoSwapV2TokenToETH(params)
  }
}

export const dodoMixSwapOne = ({ targetApproveAddr, to, fromAddress, toAddress, number, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[4].value,
    decoderData[5].value,
    decoderData[6].value,
    decoderData[7].value,
    decoderData[8].value,
  ]
  return contract.dodoMixSwapOne(...body, { value: number })
}

export const dodoMixSwapTwo = ({ targetApproveAddr, to, fromAddress, toAddress, number, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[4].value,
    decoderData[5].value,
    decoderData[6].value,
    decoderData[7].value,
    decoderData[8].value,
  ]
  return contract.dodoMixSwapTwo(...body, { value: number })
}

export const dodoSwapV2ETHToToken = ({ toAddress, number, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    projectId,
    toAddress,
    decoderData[0].value,
    decoderData[2].value,
    decoderData[3].value,
    decoderData[4].value,
  ]
  return contract.dodoSwapV2ETHToToken(...body, { value: number })
}

export const dodoSwapV2TokenToToken = ({ targetApproveAddr, to, fromAddress, toAddress, number, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[4].value,
    decoderData[5].value,
    decoderData[6].value,
  ]
  return contract.dodoSwapV2TokenToToken(...body, { value: number })
}

export const externalSwap = ({ targetApproveAddr, to, fromAddress, toAddress, number, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[3].value,
    decoderData[4].value,
    decoderData[6].value,
    decoderData[7].value,
  ]
  return contract.externalSwap(...body, { value: number })
}

export const dodoSwapV1 = ({ targetApproveAddr, to, fromAddress, toAddress, number, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[4].value,
    decoderData[5].value,
    decoderData[6].value,
  ]
  return contract.dodoSwapV1(...body, { value: number })
}

export const dodoSwapV2TokenToETH = ({ targetApproveAddr, to, fromAddress, number, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    projectId,
    [targetApproveAddr, to, fromAddress],
    decoderData[1].value,
    decoderData[3].value,
    decoderData[4].value,
    decoderData[5].value,
  ]
  return contract.dodoSwapV2TokenToETH(...body, { value: number })
}

// utils
const getDataObj = data => {
  const { names, inputs, types } = data
  let arr = []
  for (let i = 0; i < names.length; i++) {
    const name = names[i]
    const type = types[i]
    let input = inputs[i]
    if (type === 'address') {
      input = `0x${input}`
    } else if (type === 'address[]') {
      input = input.map(x => `0x${x}`)
    } else if (type === 'uint256') {
      input = input._hex
    }
    arr.push({
      name,
      type,
      value: input,
    })
  }
  return arr
}

const decoder = data => {
  const decoder = new InputDataDecoder(dodoABI)
  return decoder.decodeData(data)
}
