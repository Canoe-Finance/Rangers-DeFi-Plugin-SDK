import { ethers } from 'ethers'

export const getContractSigner = (address, abi) => {
  const provider = new ethers.providers.Web3Provider(window['ethereum'])
  const contract = new ethers.Contract(address, abi, provider)
  const signer = provider.getSigner()
  return contract.connect(signer)
}
export const getContract = (address, abi) => {
  const provider = new ethers.providers.Web3Provider(window['ethereum'])
  return new ethers.Contract(address, abi, provider)
}
