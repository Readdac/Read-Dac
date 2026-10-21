import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Coins, 
  Layers, 
  Clock, 
  Box, 
  Share2 
} from 'lucide-react';
import { DAC_NETWORK } from '../config/dacChain';
import { WalletOnchainData, shortenAddress } from '../services/onchain';

interface WalletOverviewProps {
  data: WalletOnchainData;
}

export const WalletOverview: React.FC<WalletOverviewProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const totalTokensOwned = data.tokens.reduce((acc, curr) => acc + (curr.hasTokens ? Number(curr.balance) : 0), 0);
  const collectionsWithBalance = data.tokens.filter(t => t.hasTokens).length;

  return (
    <div className="space-y-6">
      {/* Wallet Banner Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/40 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Identity & Address */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live On-Chain Data
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                Read-Only
              </span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Inspected Wallet Address
              </p>
              <div className="flex items-center gap-2 mt-1">
                <h1 className="text-lg sm:text-2xl font-mono font-bold text-slate-900 dark:text-white break-all">
                  {data.address}
                </h1>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                title="Copy wallet address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Address!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                title="Copy shareable link"
              >
                {shareCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{shareCopied ? 'Link Copied!' : 'Share Portfolio'}</span>
              </button>

              <a
                href={`${DAC_NETWORK.blockExplorerUrl}/address/${data.address}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View on DacScan</span>
              </a>
            </div>
          </div>

          {/* Read-Only Guarantee Box */}
          <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 max-w-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Safe & Non-Custodial
                </p>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Read DAC is purely read-only. We do not prompt for signatures, transactions, or secret keys.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Balance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Native Currency Card (DACC) */}
        <div className="md:col-span-1 rounded-2xl p-5 bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-transparent dark:from-amber-500/20 dark:via-slate-900 dark:to-slate-900 border border-amber-500/30 dark:border-amber-500/30 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Native Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                {data.nativeBalanceFormatted}
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
                {DAC_NETWORK.currencySymbol}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {DAC_NETWORK.currencyName} ({DAC_NETWORK.shortName})
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>Precision: 18 Decimals</span>
            <a 
              href={`${DAC_NETWORK.blockExplorerUrl}/address/${data.address}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              Verify <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Collections Overview */}
        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              NFT Badges Held
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                {totalTokensOwned}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                items total
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Across {collectionsWithBalance} of {data.tokens.length} tracked collections
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>DIA & IWB Collections</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {collectionsWithBalance > 0 ? 'Holder Active' : 'No badges yet'}
            </span>
          </div>
        </div>

        {/* Network State & Synced Block */}
        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Network Status
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-white">
                {data.blockNumber ? `#${data.blockNumber.toLocaleString()}` : 'Syncing...'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              DAC Interstellar Mainnet (Chain 21892)
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{data.lastUpdated.toLocaleTimeString()}</span>
            </span>
            <span className="text-emerald-500 font-medium">RPC Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
