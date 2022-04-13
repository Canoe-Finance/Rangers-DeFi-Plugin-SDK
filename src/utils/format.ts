export const formatAddress = (address: string, num = 6) => {
  const len = address.length
  if (len <= num * 2) {
    return address
  }
  return address.substring(0, num) + '...' + address.substring(len - num + 2, len)
}
