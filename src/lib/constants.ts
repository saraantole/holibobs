import { Address } from 'viem';
import { isSandbox } from './utils';

export const token = {
  mainnet: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address, // USDC
  testnet: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as Address,
};

export const vaultAddress = {
  mainnet: '0x6B5a5c55E9dD4bb502Ce25bBfbaA49b69cf7E4dd' as Address,
  testnet: '0x513cd9e4d06e86acfda1c5e7b93c4a3400d240d7' as Address,
};

export const prizePoolAddress = {
  mainnet: '0x45b2010d8a4f08b53c9fa7544c51dfd9733732cb' as Address,
  testnet: '0xcb514c0847a9eb30aaa05fc290ddb40afdd44bdb' as Address,
};

// Addresses
export const CONTRACTS = {
  token: isSandbox ? token.testnet : token.mainnet,
  vault: isSandbox ? vaultAddress.testnet : vaultAddress.mainnet,
  prizePool: isSandbox ? prizePoolAddress.testnet : prizePoolAddress.mainnet,
} as const;

// Chain configs
const baseSepoliaChain = {
  id: 84532,
  name: 'base-sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
};

export const baseChain = {
  id: 8453,
  name: 'base',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
  },
  testnet: false,
};

export const CHAIN = isSandbox ? baseSepoliaChain : baseChain;
