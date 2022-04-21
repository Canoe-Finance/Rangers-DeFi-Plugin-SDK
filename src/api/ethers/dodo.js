import InputDataDecoder from 'ethereum-input-data-decoder'
import { getContractSigner } from './index.js'
import metaDexABI from '../../abi/metaDexABI'
import dodoABI from '../../abi/dodoABI'

const contractAddress = '0x257Dc3a71607044F281B24c7A48A0a9D544e769D'
const projectId = 'ymg'

export const dodoSwap = ({ dodoData, fromAddress, toAddress, fromAmount }) => {
  const key = dodoData.data.substring(0, 10)
  const decoderData = decoder(dodoData.data)
  console.log('decoderData', decoderData)
  const params = {
    targetApproveAddr: dodoData.targetApproveAddr || dodoData.to,
    to: dodoData.to,
    fromAddress: fromAddress,
    toAddress: toAddress,
    fromAmount: fromAmount,
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
  const contract = getContractSigner(contractAddress, metaDexABI)
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
  console.log('body', body)
  return contract.dodoMixSwapOne(...body, { value: number })
}

export const dodoMixSwapTwo = ({ targetApproveAddr, to, fromAddress, toAddress, number, decoderData }) => {
  const contract = getContractSigner(contractAddress, metaDexABI)
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
  console.log('body', JSON.stringify(body))
  return contract.dodoMixSwapTwo(...body, { value: number })
}

export const dodoSwapV2ETHToToken = ({ targetApproveAddr, to, fromAddress, toAddress, number, decoderData }) => {
  const contract = getContractSigner(contractAddress, metaDexABI)
  const body = [
    projectId,
    toAddress,
    decoderData[0].value,
    decoderData[2].value,
    decoderData[3].value,
    decoderData[4].value,
  ]
  console.log('body', number, body)
  return contract.dodoSwapV2ETHToToken(...body, { value: number })
}

export const dodoSwapV2TokenToToken = ({ targetApproveAddr, to, fromAddress, toAddress, number, decoderData }) => {
  const contract = getContractSigner(contractAddress, metaDexABI)
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
  const contract = getContractSigner(contractAddress, metaDexABI)
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
  const contract = getContractSigner(contractAddress, metaDexABI)
  const body = [
    projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[4].value,
    decoderData[5].value,
    decoderData[6].value,
  ]
  console.log('body', body)
  return contract.dodoSwapV1(...body, { value: number })
}

export const dodoSwapV2TokenToETH = ({ targetApproveAddr, to, fromAddress, toAddress, number, decoderData }) => {
  const contract = getContractSigner(contractAddress, metaDexABI)
  const body = [
    projectId,
    [targetApproveAddr, to, fromAddress],
    decoderData[1].value,
    decoderData[3].value,
    decoderData[4].value,
    decoderData[5].value,
  ]
  console.log('body', body)
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
