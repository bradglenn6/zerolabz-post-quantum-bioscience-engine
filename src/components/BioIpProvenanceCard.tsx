import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Cpu 
} from 'lucide-react';

export const BioIpProvenanceCard: React.FC = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [mintStatus, setMintStatus] = useState<string | null>(null);
  const [microGasBalance, setMicroGasBalance] = useState<number>(99982);

  const handleMintGasless = () => {
    setIsMinting(true);
    setMintStatus(null);
    setTimeout(() => {
      setIsMinting(false);
      setMicroGasBalance(prev => prev - 18);
      setMintStatus('Gasless Derivative License anchored on Aeneid! Terms ID: 2808 | Sponsored via UniGas Relayer (Epoch 43 @ 18 μG).');
    }, 600);
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            <Sparkles className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                DATA Foundation BioIP On-Chain Provenance &amp; Licensing
              </span>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Aeneid Testnet Live (Block #25050938)
              </span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              PostLogix Heritage Trust: Data Set 10 Master Archive (5.2M mRNA sequences, transient OSKM $m^1\psi$ reset architectures, LIP microfluidic manifolds).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMintGasless}
            disabled={isMinting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold font-mono transition-colors disabled:opacity-50 shadow-2xs"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isMinting ? 'Relaying...' : 'Mint Derivative (Gasless)'}</span>
          </button>
        </div>
      </div>

      {/* Mint Confirmation Toast */}
      {mintStatus && (
        <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-xs font-mono text-sky-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{mintStatus}</span>
        </div>
      )}

      {/* 3-Column Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {/* Card 1: Root IP Provenance */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            ROOT IP ASSET (TBA)
          </div>
          <div className="text-slate-900 font-bold text-xs truncate" title="0x93762D496ffBae7aC9834047CB2C5A44958B7400">
            0x93762D...8B7400
          </div>
          <div className="text-[11px] text-slate-500">
            SPG: 0x4817E8...3394
          </div>
          <div className="pt-1 flex items-center gap-3">
            <a
              href="/api/guardian/explorer/ipa/0x93762D496ffBae7aC9834047CB2C5A44958B7400"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 underline"
            >
              <span>IP Explorer</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
            <span className="text-slate-300">·</span>
            <a
              href="/api/guardian/explorer/tx/0xe3b5395274f7cbed898ea8982014d103605df3ee808c2aa127b61a854317c430"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 underline"
            >
              <span>StoryScan Tx</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        {/* Card 2: Dual-Tier Licensing State */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            DUAL-TIER PIL LICENSING
          </div>
          <div className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Tier 1: Non-Com (ID 2054)</span>
          </div>
          <div className="text-sky-800 font-bold text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-sky-600" />
            <span>Tier 2: Commercial (ID 2808)</span>
          </div>
          <div className="text-[11px] text-slate-500 pt-0.5">
            5% Royalty · 0.05 DATA · Gas: 293,393
          </div>
        </div>

        {/* Card 3: UniGas Relayer Status */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
            UNIGAS RELAYER &amp; PAYMASTER
          </div>
          <div className="text-2xl font-bold text-sky-700">
            {microGasBalance.toLocaleString()} <span className="text-xs text-slate-500">μG</span>
          </div>
          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Ratchet Epoch 43 @ 18 μG/tx</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Cloud Run Gateway Active (us-west2)
          </div>
        </div>
      </div>
    </div>
  );
};
