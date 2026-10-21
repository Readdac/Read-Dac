import React from 'react';
import { 
  Sun, 
  Moon, 
  RotateCw, 
  PlusCircle, 
  ShieldCheck 
} from 'lucide-react';
import { DAC_NETWORK } from '../config/dacChain';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  onOpenNetworkModal: () => void;
  onAddMetaMask: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onRefresh,
  isLoading,
  onOpenNetworkModal,
  onAddMetaMask,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Gold Logo - single row, non-wrapping on mobile */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <a href="/" className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none">
            <div className="relative w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl overflow-hidden ring-2 ring-amber-500/50 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform bg-slate-950 shrink-0">
              <img 
                src="/assets/rdac_logo.jpg" 
                alt="Read DAC Emblem" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                Read DAC
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                <ShieldCheck className="w-3 h-3" />
                Read-Only
              </span>
            </div>
          </a>
        </div>

        {/* Right Actions & Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Network Pill (visible on md+) */}
          <button
            onClick={onOpenNetworkModal}
            title="View DAC Mainnet Details"
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold">{DAC_NETWORK.shortName}</span>
            <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px]">(21892)</span>
          </button>

          {/* Add Network to MetaMask Button */}
          <button
            onClick={onAddMetaMask}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 shadow-sm shadow-amber-500/25 transition-all focus:outline-none whitespace-nowrap shrink-0"
            title="Add DAC Interstellar Mainnet to your Web3 wallet"
          >
            <PlusCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Add Network</span>
            <span className="sm:hidden text-[11px]">Add DAC</span>
          </button>

          {/* Refresh on-chain data button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50 shrink-0"
            title="Refresh on-chain balances"
            aria-label="Refresh balances"
          >
            <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
          </button>

          {/* Dark / Light Mode Switch */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
