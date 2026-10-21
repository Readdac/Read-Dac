/**
 * DAC Interstellar Mainnet Configuration & Tracked Contracts
 * 
 * To add a new contract or token to the Read DAC (RDAC) explorer:
 * Simply append an object to the `TRACKED_CONTRACTS` array below with its
 * address, standard (ERC-721, ERC-20, etc.), symbol, and asset image.
 */

export interface NetworkConfig {
  name: string;
  shortName: string;
  rpcUrl: string;
  chainId: number;
  chainIdHex: string;
  currencySymbol: string;
  currencyName: string;
  decimals: number;
  blockExplorerUrl: string;
  websiteUrl: string;
}

export type TokenStandard = 'ERC-721' | 'ERC-20' | 'ERC-1155';

export interface TrackedContract {
  id: string;
  name: string;
  symbol: string;
  contractAddress: string;
  standard: TokenStandard;
  decimals?: number; // for ERC-20
  explorerUrl: string;
  image: string;
  category: string;
  badgeLabel: string;
  description: string;
  isSoulbound?: boolean;
}

export interface ProjectInfo {
  name: string;
  shortName: string;
  twitterUrl: string;
  githubUrl: string;
  isCommunityProject: boolean;
  isOpenSource: boolean;
}

export const PROJECT_INFO: ProjectInfo = {
  name: 'Read DAC',
  shortName: 'RDAC',
  twitterUrl: 'https://x.com/rdacfun',
  githubUrl: 'https://github.com/Readdac/Read-Dac',
  isCommunityProject: true,
  isOpenSource: true,
};

export const DAC_NETWORK: NetworkConfig = {
  name: 'DAC Interstellar Mainnet',
  shortName: 'DAC Chain',
  rpcUrl: 'https://rpc.dachain.tech',
  chainId: 21892,
  chainIdHex: '0x5584',
  currencySymbol: 'DACC',
  currencyName: 'DAC Coin',
  decimals: 18,
  blockExplorerUrl: 'https://dacscan.io',
  websiteUrl: 'https://dachain.tech/',
};

/**
 * List of contracts queried for each wallet address.
 * You can easily add new contracts here.
 */
export const TRACKED_CONTRACTS: TrackedContract[] = [
  {
    id: 'dia-achievement',
    name: 'DAC Interstellar Achievement',
    symbol: 'DIA',
    contractAddress: '0x1c0b6DFA5168968570094Da9c3551005b11B625B',
    standard: 'ERC-721',
    explorerUrl: 'https://dacscan.io/token/0x1c0b6DFA5168968570094Da9c3551005b11B625B',
    image: '/assets/dia.png',
    category: 'Achievement Collection',
    badgeLabel: 'Soulbound Achievement',
    description: 'DAC Interstellar Achievement token recognizing key ecosystem and interstellar milestones.',
    isSoulbound: true,
  },
  {
    id: 'iwb-weekly-badge',
    name: 'Interstellar Weekly Badge',
    symbol: 'IWB',
    contractAddress: '0xB49644e8d8CE036663562f4Fd8ac4054f90EE497',
    standard: 'ERC-721',
    explorerUrl: 'https://dacscan.io/token/0xB49644e8d8CE036663562f4Fd8ac4054f90EE497',
    image: '/assets/week.png',
    category: 'Weekly Missions',
    badgeLabel: 'Weekly Badge',
    description: 'Weekly interstellar mission and quest badge on the DAC Interstellar Mainnet.',
    isSoulbound: false,
  },
];

/**
 * Curated list of active example addresses on DAC Interstellar Mainnet
 * for 1-click preview and testing by users.
 */
export const SAMPLE_WALLETS = [
  {
    label: 'Active Badge Holder',
    address: '0x8655Df35818F348EA4e371A613e73677d816f589',
    note: 'Holds 70+ DIA, IWB & DACC',
  },
  {
    label: 'Community Member',
    address: '0x3b7f435652175D952A687c82cf18ccAF0f0ef67C',
    note: 'Active on DAC Mainnet',
  },
  {
    label: 'DIA Contract Address',
    address: '0x1c0b6DFA5168968570094Da9c3551005b11B625B',
    note: 'Contract inspector',
  },
];
