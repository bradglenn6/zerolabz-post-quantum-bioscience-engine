import { useState } from 'react';
import { UserSecurityProfile } from '../types/scientific';
import {
  Shield,
  Activity,
  FileCheck,
  Download,
  Menu,
  X,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  userProfile: UserSecurityProfile;
  clusterLatency: number;
  onOpenMfa: () => void;
  onOpenAuditLogs: () => void;
  onOpenCluster: () => void;
  onOpenExport: () => void;
}

export function Navbar({
  userProfile,
  clusterLatency,
  onOpenMfa,
  onOpenAuditLogs,
  onOpenCluster,
  onOpenExport,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-md border border-sky-400/30">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">ZeroLabz</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-semibold">
                POST-QUANTUM
              </span>
            </div>
            <div className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
              Stateless Bioscience Research Engine • ML-KEM-768
            </div>
          </div>
        </div>

        {/* Desktop Quick Telemetry & Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Serverless Cluster Latency Pill */}
          <button
            onClick={onOpenCluster}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-slate-300 transition-colors"
            title="Inspect Distributed Serverless Cluster Telemetry"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-bold">{clusterLatency}ms</span>
            <span className="text-slate-400 text-[11px]">Serverless Nodes</span>
          </button>

          {/* Post-Quantum Shield Indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-800/80 text-xs text-purple-200">
            <Lock className="w-3 h-3 text-purple-400" />
            <span className="font-mono text-[11px] font-semibold">NIST FIPS 203 PQC</span>
          </div>

          {/* MFA Clearance Status */}
          <button
            onClick={onOpenMfa}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span className="font-medium">{userProfile.clearanceLevel.replace('LEVEL_', 'Lvl ')}</span>
            <span className="text-[10px] bg-sky-950 text-sky-300 px-1 py-0.2 rounded font-mono">
              MFA OK
            </span>
          </button>

          {/* Audit Logs Button */}
          <button
            onClick={onOpenAuditLogs}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Audit Trail</span>
          </button>

          {/* Export Findings Action */}
          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Findings</span>
          </button>
        </div>

        {/* Mobile Action Buttons & Hamburger Toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenExport}
            className="p-1.5 rounded-md bg-sky-600 text-white text-xs"
            title="Export Findings"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-2 animate-fade-in text-xs">
          <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
            <span className="text-slate-400">Serverless Cluster Latency</span>
            <span className="font-mono text-emerald-400 font-bold">{clusterLatency}ms (Active)</span>
          </div>

          <div className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
            <span className="text-slate-400">Clearance Status</span>
            <span className="font-mono text-sky-400">{userProfile.clearanceLevel}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onOpenCluster();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-slate-800 rounded-lg text-slate-200 text-center font-medium flex items-center justify-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>Nodes Telemetry</span>
            </button>

            <button
              onClick={() => {
                onOpenAuditLogs();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-slate-800 rounded-lg text-slate-200 text-center font-medium flex items-center justify-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Audit Ledger</span>
            </button>

            <button
              onClick={() => {
                onOpenMfa();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-slate-800 rounded-lg text-slate-200 text-center font-medium flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>MFA Security</span>
            </button>

            <button
              onClick={() => {
                onOpenExport();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-sky-600 rounded-lg text-white text-center font-medium flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
