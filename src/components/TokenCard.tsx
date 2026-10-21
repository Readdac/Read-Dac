import React, { useState } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Award, 
  Maximize2, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { TokenBalanceResult } from '../services/onchain';
import { shortenAddress } from '../services/onchain';

interface TokenCardProps {
  tokenResult: TokenBalanceResult;
}

export const TokenCard: React.FC<TokenCardProps> = ({ tokenResult }) => {
  const { contract, formatted, hasTokens, status } = tokenResult;
  const [copied, setCopied] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);

  const handleCopyContract = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(contract.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div 
        className={`group relative flex flex-col justify-between rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border transition-all duration-300 shadow-lg ${
          hasTokens 
            ? 'border-amber-500/40 dark:border-amber-500/40 shadow-amber-500/5 dark:shadow-amber-500/10 ring-1 ring-amber-500/20' 
            : 'border-slate-200/90 dark:border-slate-800 shadow-slate-200/40 dark:shadow-black/30'
        }`}
      >
        <div>
          {/* Header Row: Category Badge & Status */}
          <div className="flex items-center justify-between gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>{contract.badgeLabel}</span>
            </span>

            {hasTokens ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Holder</span>
              </span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Not Owned
              </span>
            )}
          </div>

          {/* Asset Image Showcase */}
          <div className="relative mb-6 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 flex items-center justify-center border border-slate-800 shadow-inner overflow-hidden aspect-square sm:aspect-[4/3]">
            {/* Subtle radial backdrop effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_70%)] pointer-events-none" />

            <img
              src={contract.image}
              alt={contract.name}
              className="max-h-48 sm:max-h-56 max-w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => setShowImagePreview(true)}
              title="Click to view full image"
            />

            <button
              onClick={() => setShowImagePreview(true)}
              className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white/70 hover:text-white backdrop-blur-sm transition-colors"
              title="Enlarge image"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title & Metadata */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {contract.name}
              </h2>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {contract.symbol}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {contract.description}
            </p>
          </div>
        </div>

        {/* Bottom Section: Balance & Contract Info */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
          {/* Balance Display */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Wallet Balance
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-2xl font-extrabold font-mono tracking-tight ${
                  hasTokens 
                    ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {formatted}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {contract.symbol}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {contract.standard}
              </span>
            </div>
          </div>

          {/* Contract Address & Explorer Link */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400 gap-2">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-slate-400">Contract:</span>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                {shortenAddress(contract.contractAddress, 4)}
              </span>
              <button
                onClick={handleCopyContract}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-colors"
                title="Copy contract address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <a
              href={contract.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline shrink-0 font-sans font-medium"
            >
              <span>Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Lightbox / Image Preview Modal */}
      {showImagePreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowImagePreview(false)}
        >
          <div 
            className="relative max-w-lg w-full p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative p-6 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center">
              <img
                src={contract.image}
                alt={contract.name}
                className="max-h-80 w-auto object-contain drop-shadow-2xl"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{contract.name} ({contract.symbol})</h3>
              <p className="text-xs text-slate-400 mt-1">{contract.description}</p>
            </div>
            <button
              onClick={() => setShowImagePreview(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </>
  );
};
