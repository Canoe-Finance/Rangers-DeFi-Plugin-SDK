export default {
  // bsc test
  97: {
    showName: 'BSC Testnet',
    chainId: 97,
    chainName: 'Binance Smart Chain Testnet',
    rpcUrls: [
      'https://data-seed-prebsc-2-s2.binance.org:8545',
      'https://data-seed-prebsc-1-s1.binance.org:8545',
      'https://data-seed-prebsc-2-s1.binance.org:8545',
      'https://data-seed-prebsc-1-s2.binance.org:8545',
      'https://data-seed-prebsc-1-s3.binance.org:8545',
      'https://data-seed-prebsc-2-s3.binance.org:8545',
    ],
    blockExplorerUrls: ['https://testnet.bscscan.com'],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'tBNB',
      decimals: 18,
    },
  },
  // bsc main
  56: {
    showName: 'BSC Mainnet',
    chainId: 56,
    chainName: 'Binance Smart Chain Mainnet',
    rpcUrls: [
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
    ],
    blockExplorerUrls: ['https://bscscan.com'],
    nativeCurrency: {
      name: 'Binance Chain Native Token',
      symbol: 'BNB',
      decimals: 18,
    },
  },

  // eth test
  3: {
    showName: 'ETH Testnet',
    chainId: 3,
    chainName: 'Ethereum Testnet Ropsten',
    rpcUrls: [
      'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    ],
    blockExplorerUrls: ['https://github.com/ethereum/ropsten'],
    nativeCurrency: {
      name: 'Ropsten Ether',
      symbol: 'ROP',
      decimals: 18,
    },
  },
  // eth main
  1: {
    showName: 'Ethereum Mainnet',
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    rpcUrls: [
      'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    ],
    blockExplorerUrls: ['https://etherscan.io'],
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
  },

  // solana test
  245022926: {
    showName: 'Solana Testnet',
    chainId: 245022926,
    chainName: 'Neon EVM DevNet',
    rpcUrls: [
      "https://proxy.devnet.neonlabs.org/solana"
    ],
    blockExplorerUrls: ['https://neon-labs.org/'],
    nativeCurrency: {
      name: 'Neon',
      symbol: 'NEON',
      decimals: 18,
    },
  },
  // solana main
  245022934: {
    showName: 'Solana Mainnet',
    chainId: 245022934,
    chainName: 'Neon EVM MainNet',
    rpcUrls: [
      "https://proxy.mainnet.neonlabs.org/solana"
    ],
    blockExplorerUrls: ['https://neon-labs.org/'],
    nativeCurrency: {
      name: 'Neon',
      symbol: 'NEON',
      decimals: 18,
    },
  },

  // polygon test
  80001: {
    showName: 'Polygon Testnet Mumbai',
    chainId: 80001,
    chainName: 'Mumbai',
    rpcUrls: [
      "https://matic-mumbai.chainstacklabs.com",
      "https://rpc-mumbai.maticvigil.com",
      "https://matic-testnet-archive-rpc.bwarelabs.com"
    ],
    blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  // polygon main
  137: {
    showName: 'Polygon Mainnet',
    chainId: 137,
    chainName: 'Polygon Mainnet',
    rpcUrls: [
      "https://polygon-rpc.com/",
      "https://rpc-mainnet.matic.network",
      "https://matic-mainnet.chainstacklabs.com",
      "https://rpc-mainnet.maticvigil.com",
      "https://rpc-mainnet.matic.quiknode.pro",
      "https://matic-mainnet-full-rpc.bwarelabs.com"
    ],
    blockExplorerUrls: ['https://polygonscan.com'],
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
}
