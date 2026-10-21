import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  PlusCircle, 
  ExternalLink, 
  Globe, 
  Twitter, 
  Cpu, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { DAC_NETWORK } from '../config/dacChain';
import { addDacNetworkToMetaMask } from '../services/onchain';

interface NetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NetworkModal: React.FC<NetworkModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAddMetaMask = async () => {
    setIsAdding(true);
    setStatusMessage(null);
    try {
      const res = await addDacNetworkToMetaMask();
      setStatusMessage({
        text: res.message,
        type: res.success ? 'success' : 'error',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusMessage({ text: msg, type: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  const networkFields = [
    { key: 'name', label: 'Network Name', value: DAC_NETWORK.name },
    { key: 'rpc', label: 'Default RPC URL', value: DAC_NETWORK.rpcUrl },
    { key: 'chainId', label: 'Chain ID', value: String(DAC_NETWORK.chainId) },
    { key: 'symbol', label: 'Currency Symbol', value: DAC_NETWORK.currencySymbol },
    { key: 'explorer', label: 'Block Explorer URL', value: DAC_NETWORK.blockExplorerUrl },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                DAC Network Parameters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official EVM configuration for DAC Interstellar Mainnet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add to MetaMask CTA */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-amber-400/5 border border-amber-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
              One-Click Wallet Setup
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
              MetaMask / EVM
            </span>
          </div>
          <button
            onClick={handleAddMetaMask}
            disabled={isAdding}
            className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isAdding ? 'Requesting in Wallet...' : 'Add DAC Network to MetaMask'}</span>
          </button>

          {statusMessage && (
            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' 
                : 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/30'
            }`}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Manual Configuration Fields */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Manual Network Settings
          </p>

          <div className="space-y-2 text-xs">
            {networkFields.map((field) => (
              <div 
                key={field.key}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800"
              >
                <div className="truncate pr-2">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">
                    {field.label}
                  </span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate block">
                    {field.value}
                  </span>
                </div>

                <button
                  onClick={() => copyToClipboard(field.key, field.value)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors shrink-0"
                  title={`Copy ${field.label}`}
                >
                  {copiedKey === field.key ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Network Resources */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span className="font-medium">Network Resources:</span>
          <div className="flex items-center gap-3">
            <a
              href={DAC_NETWORK.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-amber-500 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>dachain.tech</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <a
              href={DAC_NETWORK.blockExplorerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-amber-500 transition-colors"
            >
              <span>dacscan.io</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
