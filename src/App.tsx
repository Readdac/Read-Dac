/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  SearchBar 
} from './components/SearchBar';
import { 
  WalletOverview 
} from './components/WalletOverview';
import { 
  TokenCard 
} from './components/TokenCard';
import { 
  NetworkModal 
} from './components/NetworkModal';
import { 
  Footer 
} from './components/Footer';
import { 
  DAC_NETWORK, 
  SAMPLE_WALLETS 
} from './config/dacChain';
import { 
  fetchWalletPortfolio, 
  isValidEvmAddress, 
  WalletOnchainData, 
  addDacNetworkToMetaMask 
} from './services/onchain';
import { 
  AlertCircle, 
  Layers, 
  RefreshCw, 
  PlusCircle, 
  Globe, 
  ShieldCheck, 
  ExternalLink,
  Cpu,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Theme state: light mode default, persist in localStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('rdac_theme');
      return stored === 'dark';
    }
    return false;
  });

  // Active searched wallet address
  const [address, setAddress] = useState<string>('');
  const [walletData, setWalletData] = useState<WalletOnchainData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Network modal state
  const [isNetworkModalOpen, setIsNetworkModalOpen] = useState<boolean>(false);

  // Toast / notification banner
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Recent searches saved in localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('rdac_recent_searches');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('rdac_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('rdac_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Extract address from URL pathname or hash (e.g. /0x8655... or #/0x8655...)
  const getAddressFromUrl = useCallback((): string | null => {
    if (typeof window === 'undefined') return null;

    // Check pathname: e.g. /0x123...
    const path = window.location.pathname.replace(/^\/+/, '');
    if (isValidEvmAddress(path)) {
      return path;
    }

    // Check hash: e.g. #/0x123...
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (isValidEvmAddress(hash)) {
      return hash;
    }

    // Check query param: ?address=0x123...
    const urlParams = new URLSearchParams(window.location.search);
    const qAddr = urlParams.get('address');
    if (qAddr && isValidEvmAddress(qAddr)) {
      return qAddr;
    }

    return null;
  }, []);

  // Fetch portfolio for a given address
  const loadAddressData = useCallback(async (targetAddress: string, updateUrl = true) => {
    const clean = targetAddress.trim();
    if (!isValidEvmAddress(clean)) {
      setErrorMessage('Invalid EVM address format. Expected 0x followed by 40 hex digits.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setAddress(clean);

    if (updateUrl && window.location.pathname !== `/${clean}`) {
      window.history.pushState({ address: clean }, '', `/${clean}`);
    }

    // Save to recents
    setRecentSearches((prev) => {
      const filtered = prev.filter((a) => a.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 5);
      localStorage.setItem('rdac_recent_searches', JSON.stringify(updated));
      return updated;
    });

    try {
      const data = await fetchWalletPortfolio(clean);
      setWalletData(data);
    } catch (err: unknown) {
      console.error('Error fetching portfolio:', err);
      const msg = err instanceof Error ? err.message : 'Failed to query DAC RPC';
      setErrorMessage(`RPC Fetch Error: ${msg}. Please check RPC connection.`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync initial address from URL on mount
  useEffect(() => {
    const initialAddress = getAddressFromUrl();
    if (initialAddress) {
      loadAddressData(initialAddress, false);
    }

    const handlePopState = () => {
      const popped = getAddressFromUrl();
      if (popped) {
        loadAddressData(popped, false);
      } else {
        setAddress('');
        setWalletData(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [getAddressFromUrl, loadAddressData]);

  // Refresh handler
  const handleRefresh = () => {
    if (address) {
      loadAddressData(address, false);
      showToast('Refreshing on-chain data...', 'info');
    } else {
      showToast('Enter an address to explore first', 'info');
    }
  };

  // Add to MetaMask handler
  const handleAddMetaMask = async () => {
    const res = await addDacNetworkToMetaMask();
    showToast(res.message, res.success ? 'success' : 'error');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleClearRecents = () => {
    setRecentSearches([]);
    localStorage.removeItem('rdac_recent_searches');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        onOpenNetworkModal={() => setIsNetworkModalOpen(true)}
        onAddMetaMask={handleAddMetaMask}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-20 right-4 z-50 animate-bounce duration-300">
            <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border ${
              toast.type === 'success'
                ? 'bg-emerald-500 text-white border-emerald-600'
                : toast.type === 'error'
                ? 'bg-red-500 text-white border-red-600'
                : 'bg-slate-900 text-amber-300 border-amber-500/30'
            }`}>
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* Hero & Search Section */}
        <section className="text-center space-y-4 sm:space-y-6 pt-1 sm:pt-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/25 max-w-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <span className="truncate">DAC Interstellar Mainnet • Read-Only Portfolio</span>
          </div>

          <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto px-1 sm:px-0">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Explore Wallets on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500">
                DAC Chain
              </span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto px-2">
              Fast, secure, read-only wallet explorer for DAC Interstellar Mainnet. Inspect native DACC balance, DIA achievements, IWB badges, and QBadges1 (QB1) with 100% security.
            </p>
          </div>

          {/* Search Bar Component */}
          <div className="pt-1 sm:pt-2">
            <SearchBar
              currentAddress={address}
              onSearch={(target) => loadAddressData(target, true)}
              recentSearches={recentSearches}
              onSelectRecent={(target) => loadAddressData(target, true)}
              onClearRecents={handleClearRecents}
            />
          </div>
        </section>

        {/* Error Notification */}
        {errorMessage && (
          <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to complete query</p>
              <p className="text-xs mt-0.5 opacity-90">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Loading Spinner Skeleton */}
        {isLoading && (
          <div className="max-w-4xl mx-auto text-center py-16 space-y-4">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Fetching Live On-Chain Data...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Querying {DAC_NETWORK.rpcUrl} for native DACC and badge collections
              </p>
            </div>
          </div>
        )}

        {/* Active Wallet View */}
        {!isLoading && walletData && (
          <div className="space-y-10 animate-fadeIn">
            {/* Wallet Overview & DACC Balance */}
            <WalletOverview data={walletData} />

            {/* Tracked Collections Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Tracked Collections & Badges
                    </h2>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {walletData.tokens.length} contracts
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Direct on-chain balance query for DIA, IWB, and QBadges1 (QB1) collections.
                  </p>
                </div>

                <button
                  onClick={() => setIsNetworkModalOpen(true)}
                  className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Network Info</span>
                </button>
              </div>

              {/* Collections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {walletData.tokens.map((tokenResult) => (
                  <TokenCard key={tokenResult.contract.id} tokenResult={tokenResult} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State / Welcome Preview when no address searched yet */}
        {!isLoading && !walletData && (
          <div className="max-w-4xl mx-auto mt-6 space-y-8">
            {/* DAC Network Info Feature Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white via-white to-amber-500/5 dark:from-slate-900 dark:via-slate-900 dark:to-amber-500/10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    Network Overview
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    DAC Interstellar Mainnet
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    High-performance EVM blockchain built for interstellar games, achievements, and decentralized missions.
                  </p>
                </div>

                <button
                  onClick={handleAddMetaMask}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 shadow-md shadow-amber-500/20 transition-all shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Network to MetaMask</span>
                </button>
              </div>

              {/* Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Chain ID</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {DAC_NETWORK.chainId}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Currency</span>
                  <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                    {DAC_NETWORK.currencySymbol}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 text-[11px] block">RPC Node</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 truncate block text-xs">
                    rpc.dachain.tech
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Explorer</span>
                  <a
                    href={DAC_NETWORK.blockExplorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 text-xs"
                  >
                    <span>dacscan.io</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Sample Addresses to click */}
              <div className="pt-2 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Quick Preview Wallets
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_WALLETS.slice(0, 2).map((sample) => (
                    <button
                      key={sample.address}
                      onClick={() => loadAddressData(sample.address, true)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 text-left transition-all hover:scale-[1.01] shadow-sm group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                          {sample.label}
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                          {sample.note}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-slate-500 dark:text-slate-400 mt-2 truncate">
                        {sample.address}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Network Modal */}
      <NetworkModal
        isOpen={isNetworkModalOpen}
        onClose={() => setIsNetworkModalOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenNetworkModal={() => setIsNetworkModalOpen(true)} />
    </div>
  );
}
