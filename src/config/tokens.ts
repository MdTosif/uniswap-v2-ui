export interface Token {
  address: `0x${string}` | 'native';
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
  isNative?: boolean;
}

/** Sentinel address used for native gas tokens (ETH, MATIC, BNB …) */
export const NATIVE_ADDRESS = 'native' as const;

// ─── Token Lists Per Chain ────────────────────────────────────────────────────

const ETH_NATIVE: Token = {
  address: NATIVE_ADDRESS,
  symbol: 'ETH',
  name: 'Ether',
  decimals: 18,
  chainId: 1,
  isNative: true,
  logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
};

export const TOKENS: Record<number, Token[]> = {
  // Ethereum Mainnet
  1: [
    { ...ETH_NATIVE, chainId: 1 },
    { address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', name: 'USD Coin', decimals: 6, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', name: 'Tether USD', decimals: 6, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
    { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', name: 'Wrapped Bitcoin', decimals: 8, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png' },
    { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI', name: 'Uniswap', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png' },
    { address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', symbol: 'LINK', name: 'ChainLink Token', decimals: 18, chainId: 1, logoURI: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
  ],
  // Sepolia
  11155111: [
    { address: NATIVE_ADDRESS, symbol: 'ETH', name: 'Ether', decimals: 18, chainId: 11155111, isNative: true, logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, chainId: 11155111, logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', symbol: 'USDC', name: 'USD Coin', decimals: 6, chainId: 11155111, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  ],
  // Polygon
  137: [
    { address: NATIVE_ADDRESS, symbol: 'MATIC', name: 'Polygon', decimals: 18, chainId: 137, isNative: true, logoURI: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
    { address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', symbol: 'WMATIC', name: 'Wrapped Matic', decimals: 18, chainId: 137, logoURI: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
    { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', name: 'USD Coin', decimals: 6, chainId: 137, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', name: 'Tether USD', decimals: 6, chainId: 137, logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, chainId: 137, logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, chainId: 137, logoURI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
  ],
  // BNB Smart Chain
  56: [
    { address: NATIVE_ADDRESS, symbol: 'BNB', name: 'BNB', decimals: 18, chainId: 56, isNative: true, logoURI: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
    { address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', symbol: 'WBNB', name: 'Wrapped BNB', decimals: 18, chainId: 56, logoURI: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
    { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT', name: 'Tether USD', decimals: 18, chainId: 56, logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', symbol: 'BUSD', name: 'Binance USD', decimals: 18, chainId: 56, logoURI: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png' },
    { address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', symbol: 'ETH', name: 'Ethereum Token', decimals: 18, chainId: 56, logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC', name: 'USD Coin', decimals: 18, chainId: 56, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  ],
  // Arbitrum One
  42161: [
    { address: NATIVE_ADDRESS, symbol: 'ETH', name: 'Ether', decimals: 18, chainId: 42161, isNative: true, logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, chainId: 42161, logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', symbol: 'USDC', name: 'USD Coin', decimals: 6, chainId: 42161, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', symbol: 'USDT', name: 'Tether USD', decimals: 6, chainId: 42161, logoURI: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
    { address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, chainId: 42161, logoURI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
  ],
  // Base
  8453: [
    { address: NATIVE_ADDRESS, symbol: 'ETH', name: 'Ether', decimals: 18, chainId: 8453, isNative: true, logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { address: '0x4200000000000000000000000000000000000006', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, chainId: 8453, logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', symbol: 'USDC', name: 'USD Coin', decimals: 6, chainId: 8453, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
    { address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18, chainId: 8453, logoURI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png' },
  ],
  // Hoodi testnet
  560048: [
    { address: NATIVE_ADDRESS, symbol: 'ETH', name: 'Ether', decimals: 18, chainId: 560048, isNative: true, logoURI: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
    { address: '0x15a35CbEF19fce41BCA5Fa86e5F90be37b03AFE8', symbol: 'WETH', name: 'Wrapped Ether', decimals: 18, chainId: 560048, logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
    { address: '0x1d603d0E376DbB58A7C720971EDF6c2223093F76', symbol: 'MTK', name: 'My Token (Hoodi)', decimals: 18, chainId: 560048, logoURI: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  ],
};

export const POPULAR_POOLS: Record<number, { token0: string; token1: string; label: string }[]> = {
  1: [
    { token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', label: 'WETH / USDC' },
    { token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', label: 'WETH / USDT' },
    { token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0x6B175474E89094C44Da98b954EedeAC495271d0F', label: 'WETH / DAI' },
    { token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', label: 'WETH / WBTC' },
    { token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', label: 'WETH / UNI' },
  ],
  137: [
    { token0: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', token1: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', label: 'WMATIC / USDC' },
    { token0: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', token1: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', label: 'WMATIC / USDT' },
    { token0: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', token1: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', label: 'WETH / USDC' },
  ],
  56: [
    { token0: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', token1: '0x55d398326f99059fF775485246999027B3197955', label: 'WBNB / USDT' },
    { token0: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', token1: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', label: 'WBNB / BUSD' },
    { token0: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', token1: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', label: 'WBNB / USDC' },
  ],
  42161: [
    { token0: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', token1: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', label: 'WETH / USDC' },
    { token0: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', token1: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', label: 'WETH / USDT' },
  ],
  8453: [
    { token0: '0x4200000000000000000000000000000000000006', token1: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', label: 'WETH / USDC' },
  ],
  // Hoodi
  560048: [
    { token0: '0x15a35CbEF19fce41BCA5Fa86e5F90be37b03AFE8', token1: '0x1d603d0E376DbB58A7C720971EDF6c2223093F76', label: 'WETH / USDC' },
  ],
};
