import React from 'react';
import { ShieldCheck, Globe, Twitter, Github, ExternalLink, Cpu, Heart, Code2 } from 'lucide-react';
import { DAC_NETWORK, PROJECT_INFO } from '../config/dacChain';

interface FooterProps {
  onOpenNetworkModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenNetworkModal }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-amber-500/40 bg-slate-950 shrink-0">
                <img src="/assets/rdac_logo.jpg" alt="RDAC" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Read DAC
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-700 dark:text-amber-400">
                  RDAC
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Open Source
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              An open-source, read-only portfolio explorer built by the community for the DAC Interstellar Mainnet ecosystem.
            </p>
          </div>

          {/* Project & Ecosystem Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            {/* Project GitHub */}
            <a
              href={PROJECT_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors"
              title="View Source Code on GitHub"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* Project Twitter */}
            <a
              href={PROJECT_INFO.twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 font-semibold border border-sky-500/20 transition-colors"
              title="Follow @rdacfun on X"
            >
              <Twitter className="w-4 h-4 fill-current" />
              <span>@rdacfun</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            {/* Network Parameters Modal */}
            <button
              onClick={onOpenNetworkModal}
              className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Network Parameters</span>
            </button>

            {/* DAC Scan Explorer */}
            <a
              href={DAC_NETWORK.blockExplorerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <span>DacScan</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* DAC Official Site */}
            <a
              href={DAC_NETWORK.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>DAC Network</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Community & Safety Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              <strong>100% Read-Only & Community-Driven:</strong> Read DAC is an open-source, non-official community tool. No wallet connect or signatures are ever required.
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 shrink-0">
            <span className="flex items-center gap-1">
              <Code2 className="w-3 h-3 text-emerald-500" />
              <span>GPL/Apache-2.0</span>
            </span>
            <span>•</span>
            <span>Chain ID: 21892</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-600">
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current inline" />
            <span>for the DAC Interstellar Community.</span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={PROJECT_INFO.githubUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:underline hover:text-slate-600 dark:hover:text-slate-400"
            >
              Contribute on GitHub
            </a>
            <span>•</span>
            <a 
              href={PROJECT_INFO.twitterUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="hover:underline hover:text-slate-600 dark:hover:text-slate-400"
            >
              Follow Updates @rdacfun
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
