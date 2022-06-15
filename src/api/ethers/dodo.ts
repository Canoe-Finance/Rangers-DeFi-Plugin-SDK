import InputDataDecoder from 'ethereum-input-data-decoder'
import { providers, utils } from 'ethers'
import { getContractSigner, getContract } from './index'
import metaDexABI from '../../abi/metaDexABI.json'
import metaDex2ABI from '../../abi/metaDex2ABI.json'
import dodoABI from '../../abi/dodoABI.json'
// import { toBigNumberString } from './utils'
import config from 'config'

const getGas = async () => {
  const provider = new providers.Web3Provider(window['ethereum'])
  return await provider.getGasPrice()
}

export const getFeePercentage = async () => {
  const contract = getContract(config.feeContractAddress, metaDex2ABI)
  const projectFee = (await contract.projectFee(config.projectId)) || 0
  const treasuryFee = (await contract.treasuryFee()) || 0
  // const free = Number(toBigNumberString(projectFee)) + Number(toBigNumberString(treasuryFee))
  return ((10000 - projectFee) * (10000 - treasuryFee)) / 100000000
}

export const dodoSwap = async ({ dodoData, fromAddress, toAddress, fromAmount }) => {
  const key = dodoData.data.substring(0, 10)
  const decoderData = decoder(dodoData.data)
  const options = fromAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? { value: fromAmount } : null
  const params = {
    targetApproveAddr: dodoData.targetApproveAddr || dodoData.to,
    to: dodoData.to,
    fromAddress,
    toAddress,
    fromAmount,
    options: options,
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

export const dodoMixSwapOne = async ({ targetApproveAddr, to, fromAddress, toAddress, options, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    config.projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[4].value,
    decoderData[5].value,
    decoderData[6].value,
    decoderData[7].value,
    decoderData[8].value,
  ]
  return contract.estimateGas
    .dodoMixSwapOne(...body)
    .then(async gasLimit => {
      options = {
        ...options,
        gasLimit,
        gasPrice: await getGas(),
      }
      return contract.dodoMixSwapOne(...body, options)
    })
    .catch(async _err => {
      options = {
        ...options,
        gasLimit: utils.hexlify(1000000),
        gasPrice: await getGas(),
      }
      return contract.dodoMixSwapOne(...body, options)
    })
}

export const dodoMixSwapTwo = async ({ targetApproveAddr, to, fromAddress, toAddress, options, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    config.projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[4].value,
    decoderData[5].value,
    decoderData[6].value,
    decoderData[7].value,
    decoderData[8].value,
  ]
  return contract.estimateGas
    .dodoMixSwapTwo(...body)
    .then(async gasLimit => {
      options = {
        ...options,
        gasLimit,
        gasPrice: await getGas(),
      }
      return contract.dodoMixSwapTwo(...body, options)
    })
    .catch(async _err => {
      options = {
        ...options,
        gasLimit: utils.hexlify(1000000),
        gasPrice: await getGas(),
      }
      return contract.dodoMixSwapTwo(...body, options)
    })
}

export const dodoSwapV2ETHToToken = async ({ to, options, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    config.projectId,
    to,
    decoderData[0].value,
    decoderData[2].value,
    decoderData[3].value,
    decoderData[4].value,
  ]
  return contract.estimateGas
    .dodoSwapV2ETHToToken(...body)
    .then(async gasLimit => {
      options = {
        ...options,
        gasLimit,
        gasPrice: await getGas(),
      }
      return contract.dodoSwapV2ETHToToken(...body, options)
    })
    .catch(async _err => {
      options = {
        ...options,
        gasLimit: utils.hexlify(1000000),
        gasPrice: await getGas(),
      }
      return contract.dodoSwapV2ETHToToken(...body, options)
    })
}

export const dodoSwapV2TokenToToken = async ({
  targetApproveAddr,
  to,
  fromAddress,
  toAddress,
  options,
  decoderData,
}) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    config.projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[4].value,
    decoderData[5].value,
    decoderData[6].value,
  ]
  return contract.estimateGas
    .dodoSwapV2TokenToToken(...body)
    .then(async gasLimit => {
      options = {
        ...options,
        gasLimit,
        gasPrice: await getGas(),
      }
      return contract.dodoSwapV2TokenToToken(...body, options)
    })
    .catch(async _err => {
      options = {
        ...options,
        gasLimit: utils.hexlify(1000000),
        gasPrice: await getGas(),
      }
      return contract.dodoSwapV2TokenToToken(...body, options)
    })
}

export const externalSwap = async ({ targetApproveAddr, to, fromAddress, toAddress, options, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    config.projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[3].value,
    decoderData[4].value,
    decoderData[6].value,
    decoderData[7].value,
  ]
  return contract.estimateGas
    .externalSwap(...body)
    .then(async gasLimit => {
      options = {
        ...options,
        gasLimit,
        gasPrice: await getGas(),
      }
      return contract.externalSwap(...body, options)
    })
    .catch(async _err => {
      options = {
        ...options,
        gasLimit: utils.hexlify(1000000),
        gasPrice: await getGas(),
      }
      return contract.externalSwap(...body, options)
    })
}

export const dodoSwapV1 = async ({ targetApproveAddr, to, fromAddress, toAddress, options, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    config.projectId,
    [targetApproveAddr, to, fromAddress, toAddress],
    decoderData[2].value,
    decoderData[4].value,
    decoderData[5].value,
    decoderData[6].value,
  ]
  return contract.estimateGas
    .dodoSwapV1(...body)
    .then(async gasLimit => {
      options = {
        ...options,
        gasLimit,
        gasPrice: await getGas(),
      }
      return contract.dodoSwapV1(...body, options)
    })
    .catch(async _err => {
      options = {
        ...options,
        gasLimit: utils.hexlify(1000000),
        gasPrice: await getGas(),
      }
      return contract.dodoSwapV1(...body, options)
    })
}

export const dodoSwapV2TokenToETH = async ({ targetApproveAddr, to, fromAddress, options, decoderData }) => {
  const contract = getContractSigner(config.agencyContract, metaDexABI)
  const body = [
    config.projectId,
    [targetApproveAddr, to, fromAddress],
    decoderData[1].value,
    decoderData[3].value,
    decoderData[4].value,
    decoderData[5].value,
  ]
  return contract.estimateGas
    .dodoSwapV2TokenToETH(...body)
    .then(async gasLimit => {
      options = {
        ...options,
        gasLimit,
        gasPrice: await getGas(),
      }
      return contract.dodoSwapV2TokenToETH(...body, options)
    })
    .catch(async _err => {
      options = {
        ...options,
        gasLimit: utils.hexlify(1000000),
        gasPrice: await getGas(),
      }
      return contract.dodoSwapV2TokenToETH(...body, options)
    })
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
