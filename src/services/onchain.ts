/**
 * On-chain RPC interaction service for DAC Interstellar Mainnet.
 * Completely read-only via standard JSON-RPC calls.
 */

import { DAC_NETWORK, TRACKED_CONTRACTS, TrackedContract } from '../config/dacChain';

export interface TokenBalanceResult {
  contract: TrackedContract;
  balance: bigint;
  formatted: string;
  hasTokens: boolean;
  status: 'success' | 'error';
  errorMessage?: string;
}

export interface WalletOnchainData {
  address: string;
  nativeBalanceWei: bigint;
  nativeBalanceFormatted: string;
  tokens: TokenBalanceResult[];
  lastUpdated: Date;
  blockNumber?: number;
}

/**
 * Validates whether a string is a standard 20-byte EVM hex address.
 */
export function isValidEvmAddress(address: string): boolean {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

/**
 * Shortens an EVM address for clean UI display (e.g. 0x8655...f589)
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  const clean = address.trim();
  if (clean.length <= chars * 2 + 2) return clean;
  return `${clean.substring(0, chars + 2)}...${clean.substring(clean.length - chars)}`;
}

/**
 * Formats a BigInt wei value to a human-readable token amount.
 */
export function formatUnits(amount: bigint, decimals = 18, maxDecimals = 6): string {
  const isNegative = amount < 0n;
  const absAmount = isNegative ? -amount : amount;
  
  const divisor = 10n ** BigInt(decimals);
  const integerPart = absAmount / divisor;
  const remainder = absAmount % divisor;

  if (remainder === 0n) {
    return `${isNegative ? '-' : ''}${integerPart.toLocaleString('en-US')}`;
  }

  let fraction = remainder.toString().padStart(decimals, '0');
  // Trim trailing zeros
  fraction = fraction.replace(/0+$/, '');
  if (fraction.length > maxDecimals) {
    fraction = fraction.slice(0, maxDecimals);
  }

  return `${isNegative ? '-' : ''}${integerPart.toLocaleString('en-US')}.${fraction}`;
}

/**
 * Low-level JSON-RPC client function.
 */
async function callRpc<T = unknown>(method: string, params: unknown[] = []): Promise<T> {
  const response = await fetch(DAC_NETWORK.rpcUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`RPC HTTP error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  if (json.error) {
    throw new Error(json.error.message || 'RPC Call returned error');
  }

  return json.result as T;
}

/**
 * Fetches the native DACC balance of a wallet address.
 */
export async function fetchNativeBalance(address: string): Promise<{ rawWei: bigint; formatted: string }> {
  try {
    const rawResult = await callRpc<string>('eth_getBalance', [address.trim(), 'latest']);
    const rawWei = BigInt(rawResult || '0x0');
    const formatted = formatUnits(rawWei, DAC_NETWORK.decimals, 6);
    return { rawWei, formatted };
  } catch (err) {
    console.error('Failed to fetch native DACC balance:', err);
    return { rawWei: 0n, formatted: '0.0' };
  }
}

/**
 * Fetches the latest block number on DAC Interstellar Mainnet.
 */
export async function fetchLatestBlockNumber(): Promise<number | undefined> {
  try {
    const hex = await callRpc<string>('eth_blockNumber', []);
    return parseInt(hex, 16);
  } catch {
    return undefined;
  }
}

/**
 * Queries balanceOf(address) for a given contract.
 * Standard ERC-721 / ERC-20 signature: 0x70a08231
 */
export async function fetchTokenBalance(
  contract: TrackedContract,
  walletAddress: string
): Promise<TokenBalanceResult> {
  try {
    const cleanAddress = walletAddress.trim().toLowerCase();
    const cleanContract = contract.contractAddress.trim();

    // 0x70a08231 + 32-byte address
    const callData = '0x70a08231' + cleanAddress.slice(2).padStart(64, '0');

    const resultHex = await callRpc<string>('eth_call', [
      {
        to: cleanContract,
        data: callData,
      },
      'latest',
    ]);

    const balance = BigInt(resultHex || '0x0');
    const formatted = contract.standard === 'ERC-20'
      ? formatUnits(balance, contract.decimals || 18, 4)
      : balance.toLocaleString('en-US');

    return {
      contract,
      balance,
      formatted,
      hasTokens: balance > 0n,
      status: 'success',
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`Failed to fetch balance for ${contract.name}:`, msg);
    return {
      contract,
      balance: 0n,
      formatted: '0',
      hasTokens: false,
      status: 'error',
      errorMessage: msg,
    };
  }
}

/**
 * Aggregates all on-chain data for a wallet address concurrently.
 */
export async function fetchWalletPortfolio(walletAddress: string): Promise<WalletOnchainData> {
  const clean = walletAddress.trim();
  if (!isValidEvmAddress(clean)) {
    throw new Error('Invalid EVM address format. Must be 0x followed by 40 hexadecimal characters.');
  }

  const [nativeRes, blockNumber, tokenResults] = await Promise.all([
    fetchNativeBalance(clean),
    fetchLatestBlockNumber(),
    Promise.all(TRACKED_CONTRACTS.map((contract) => fetchTokenBalance(contract, clean))),
  ]);

  return {
    address: clean,
    nativeBalanceWei: nativeRes.rawWei,
    nativeBalanceFormatted: nativeRes.formatted,
    tokens: tokenResults,
    lastUpdated: new Date(),
    blockNumber,
  };
}

/**
 * One-click helper to add DAC Interstellar Mainnet to MetaMask / EVM browser wallets.
 */
export async function addDacNetworkToMetaMask(): Promise<{
  success: boolean;
  message: string;
  alreadyAdded?: boolean;
}> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ethereum = (window as any).ethereum;

  if (!ethereum) {
    return {
      success: false,
      message: 'No Ethereum wallet (like MetaMask) was detected in your browser.',
    };
  }

  try {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: DAC_NETWORK.chainIdHex,
          chainName: DAC_NETWORK.name,
          rpcUrls: [DAC_NETWORK.rpcUrl],
          nativeCurrency: {
            name: DAC_NETWORK.currencyName,
            symbol: DAC_NETWORK.currencySymbol,
            decimals: DAC_NETWORK.decimals,
          },
          blockExplorerUrls: [DAC_NETWORK.blockExplorerUrl],
        },
      ],
    });

    return {
      success: true,
      message: `${DAC_NETWORK.name} was successfully added / switched in your wallet!`,
    };
  } catch (err: unknown) {
    const error = err as { code?: number; message?: string };
    if (error.code === 4001) {
      return {
        success: false,
        message: 'Network request rejected in wallet.',
      };
    }
    return {
      success: false,
      message: error.message || 'Failed to add network to wallet.',
    };
  }
}
