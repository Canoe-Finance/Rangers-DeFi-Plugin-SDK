// https://chainid.network/chains.json
export default [
  // eth main
  {
    name: 'Ethereum Mainnet',
    showName: 'Ethereum Mainnet',
    chain: 'ETH',
    icon: 'eth',
    rpc: [
      'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    ],
    faucets: [],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    infoURL: 'https://ethereum.org',
    shortName: 'eth',
    chainId: 1,
    networkId: 1,
    slip44: 60,
    ens: {
      registry: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    explorers: [{
      name: 'etherscan',
      url: 'https://etherscan.io',
      standard: 'EIP3091',
    }, ],
  },
  // eth test
  {
    name: 'Ethereum Testnet Ropsten',
    showName: 'Ethereum Testnet',
    chain: 'ETH',
    icon: 'eth',
    rpc: [
      'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    ],
    faucets: [
      'https://faucet.ropsten.be?${ADDRESS}',
    ],
    nativeCurrency: {
      name: 'Ropsten Ether',
      symbol: 'ROP',
      decimals: 18,
    },
    infoURL: 'https://github.com/ethereum/ropsten',
    shortName: 'rop',
    chainId: 3,
    networkId: 3,
    ens: {
      registry: '0x112234455c3a32fd11230c42e7bccd4a84e02010',
    },
  },
  // bsc main
  {
    name: 'Binance Smart Chain Mainnet',
    showName: 'Binance Mainnet',
    chain: 'BSC',
    icon: 'bsc',
    rpc: [
      'https://bsc-dataseed.binance.org',
      'https://bsc-dataseed1.binance.org',
      'https://bsc-dataseed2.binance.org',
      'https://bsc-dataseed3.binance.org',
      'https://bsc-dataseed4.binance.org',
      'https://bsc-dataseed1.defibit.io',
      'https://bsc-dataseed2.defibit.io',
      'https://bsc-dataseed3.defibit.io',
      'https://bsc-dataseed4.defibit.io',
      'https://bsc-dataseed1.ninicoin.io',
      'https://bsc-dataseed2.ninicoin.io',
      'https://bsc-dataseed3.ninicoin.io',
      'https://bsc-dataseed4.ninicoin.io',
      'wss://bsc-ws-node.nariox.org',
    ],
    faucets: [
      'https://free-online-app.com/faucet-for-eth-evm-chains/',
    ],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
    infoURL: 'https://www.binance.org',
    shortName: 'bnb',
    chainId: 56,
    networkId: 56,
    slip44: 714,
    explorers: [{
      name: 'bscscan',
      url: 'https://bscscan.com',
      standard: 'EIP3091',
    }, ],
  },
  // bsc test
  {
    name: 'Binance Smart Chain Testnet',
    showName: 'Binance Testnet',
    chain: 'BSC',
    icon: 'bsc',
    rpc: [
      'https://data-seed-prebsc-2-s2.binance.org:8545',
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
      'https://data-seed-prebsc-1-s2.binance.org:8545',
      'https://data-seed-prebsc-1-s3.binance.org:8545',
      'https://data-seed-prebsc-2-s3.binance.org:8545',
    ],
    faucets: [
      'https://testnet.binance.org/faucet-smart',
    ],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'tBNB',
      decimals: 18,
    },
    infoURL: 'https://testnet.binance.org/',
    shortName: 'bnbt',
    chainId: 97,
    networkId: 97,
    explorers: [{
      name: 'bscscan-testnet',
      url: 'https://testnet.bscscan.com',
      standard: 'EIP3091',
    }, ],
  },
  // Polygon main
  {
    "name": "Polygon Mainnet",
    "chain": "Polygon",
    "rpc": [
      "https://polygon-rpc.com/",
      "https://rpc-mainnet.matic.network",
      "https://matic-mainnet.chainstacklabs.com",
      "https://rpc-mainnet.maticvigil.com",
      "https://rpc-mainnet.matic.quiknode.pro",
      "https://matic-mainnet-full-rpc.bwarelabs.com"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    },
    "infoURL": "https://polygon.technology/",
    "shortName": "MATIC",
    "chainId": 137,
    "networkId": 137,
    "slip44": 966,
    "explorers": [{
      "name": "polygonscan",
      "url": "https://polygonscan.com",
      "standard": "EIP3091"
    }]
  },
  // Polygon test
  {
    "name": "Mumbai",
    "title": "Polygon Testnet Mumbai",
    "chain": "Polygon",
    "rpc": [
      "https://matic-mumbai.chainstacklabs.com",
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-testnet-archive-rpc.bwarelabs.com"
    ],
    "faucets": [
      "https://faucet.polygon.technology/"
    ],
    "nativeCurrency": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    },
    "infoURL": "https://polygon.technology/",
    "shortName": "maticmum",
    "chainId": 80001,
    "networkId": 80001,
    "explorers": [{
      "name": "polygonscan",
      "url": "https://mumbai.polygonscan.com",
      "standard": "EIP3091"
    }]
  },
  // Solana main
  {
    "name": "Neon EVM MainNet",
    "chain": "Solana",
    "rpc": [
      "https://proxy.mainnet.neonlabs.org/solana"
    ],
    "faucets": [],
    "nativeCurrency": {
      "name": "Neon",
      "symbol": "NEON",
      "decimals": 18
    },
    "infoURL": "https://neon-labs.org/",
    "shortName": "neonevm-mainnet",
    "chainId": 245022934,
    "networkId": 245022934
  },
  // Solana test
  {
    "name": "Neon EVM DevNet",
    "chain": "Solana",
    "rpc": [
      "https://proxy.devnet.neonlabs.org/solana"
    ],
    "faucets": [
      "https://neonswap.live/#/get-tokens"
    ],
    "nativeCurrency": {
      "name": "Neon",
      "symbol": "NEON",
      "decimals": 18
    },
    "infoURL": "https://neon-labs.org/",
    "shortName": "neonevm-devnet",
    "chainId": 245022926,
    "networkId": 245022926
  },

]
