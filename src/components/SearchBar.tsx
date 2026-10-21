import React, { useState, useEffect } from 'react';
import { Search, X, ClipboardPaste, ArrowRight, History, Sparkles } from 'lucide-react';
import { isValidEvmAddress, shortenAddress } from '../services/onchain';
import { SAMPLE_WALLETS } from '../config/dacChain';

interface SearchBarProps {
  currentAddress: string;
  onSearch: (address: string) => void;
  recentSearches: string[];
  onSelectRecent: (address: string) => void;
  onClearRecents: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  currentAddress,
  onSearch,
  recentSearches,
  onSelectRecent,
  onClearRecents,
}) => {
  const [inputValue, setInputValue] = useState(currentAddress);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(currentAddress);
  }, [currentAddress]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputValue.trim();

    if (!clean) {
      setErrorMsg('Please enter an EVM wallet address.');
      return;
    }

    if (!isValidEvmAddress(clean)) {
      setErrorMsg('Invalid EVM address format. Must begin with 0x followed by 40 hex digits.');
      return;
    }

    setErrorMsg(null);
    onSearch(clean);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const clean = text.trim();
      setInputValue(clean);
      if (isValidEvmAddress(clean)) {
        setErrorMsg(null);
        onSearch(clean);
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleClear = () => {
    setInputValue('');
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input Container */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center shadow-lg shadow-slate-200/50 dark:shadow-black/40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-slate-800 focus-within:border-amber-500 dark:focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all overflow-hidden">
          <div className="pl-4 sm:pl-5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="Enter DAC wallet address (0x...)"
            spellCheck={false}
            autoCapitalize="none"
            className="w-full py-3.5 sm:py-4 px-2 sm:px-3 text-xs sm:text-base bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none font-mono"
          />

          <div className="flex items-center gap-1 pr-1.5 sm:pr-3 shrink-0">
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 sm:p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {!inputValue && (
              <button
                type="button"
                onClick={handlePaste}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md shadow-amber-500/20 active:scale-98 transition-all shrink-0"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <p className="mt-2 text-xs sm:text-sm text-red-500 dark:text-red-400 font-medium pl-2 animate-fadeIn">
            ⚠️ {errorMsg}
          </p>
        )}
      </form>

      {/* Quick Sample Wallets */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 pt-1 text-[11px] sm:text-xs">
        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium shrink-0">
          <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
          <span>Samples:</span>
        </span>
        {SAMPLE_WALLETS.map((sample) => (
          <button
            key={sample.address}
            onClick={() => {
              setInputValue(sample.address);
              setErrorMsg(null);
              onSearch(sample.address);
            }}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 transition-all font-mono hover:scale-102"
            title={`${sample.label} - ${sample.note}`}
          >
            <span>{sample.label}</span>
            <span className="opacity-60 text-[10px]">({shortenAddress(sample.address, 3)})</span>
          </button>
        ))}
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-medium">
            <History className="w-3.5 h-3.5" />
            <span>Recents:</span>
          </span>
          {recentSearches.map((addr) => (
            <button
              key={addr}
              onClick={() => onSelectRecent(addr)}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono transition-colors"
            >
              {shortenAddress(addr, 4)}
            </button>
          ))}
          <button
            onClick={onClearRecents}
            className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline ml-1"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};
