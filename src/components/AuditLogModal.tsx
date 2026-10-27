import { useState } from 'react';
import { AuditLogEntry } from '../types/scientific';
import { downloadBlob } from '../services/exportService';
import {
  X,
  FileCheck,
  Search,
  Filter,
  Download,
  ShieldCheck,
  AlertCircle,
  Info,
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface AuditLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AuditLogEntry[];
  ledgerRootHash: string;
}

export function AuditLogModal({
  isOpen,
  onClose,
  logs,
  ledgerRootHash,
}: AuditLogModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL'>('ALL');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchesSearch =
      searchTerm === '' ||
      log.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleExportCsv = () => {
    const lines = [
      'ID,Timestamp,User,Role,Action,Target,Severity,PostQuantumSignature,EntryHash,PrevHash,Details',
    ];
    filteredLogs.forEach((l) => {
      lines.push(
        `"${l.id}","${l.timestamp}","${l.userEmail}","${l.userRole}","${l.action}","${l.targetId}","${l.severity}","${l.postQuantumSignature}","${l.entryHash}","${l.prevHash}","${l.details.replace(/"/g, '""')}"`
      );
    });
    downloadBlob(lines.join('\n'), `ZeroLabz_Compliance_Audit_Trail_${Date.now()}.csv`, 'text/csv');
  };

  const handleExportJson = () => {
    const exportBundle = {
      standard: '21 CFR Part 11 & NIST FIPS 203 Post-Quantum Audit Compliance',
      exportedAt: new Date().toISOString(),
      ledgerRootHash,
      totalEntries: filteredLogs.length,
      logs: filteredLogs,
    };
    downloadBlob(
      JSON.stringify(exportBundle, null, 2),
      `ZeroLabz_Compliance_Audit_Trail_${Date.now()}.json`,
      'application/json'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-950 border border-sky-800 rounded-xl text-sky-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Comprehensive Cryptographic Audit Ledger
              </h3>
              <p className="text-xs text-slate-400">
                100% Tamper-Evident • SHA3-256 Hash Chained • 21 CFR Part 11 & HIPAA Compliant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ledger Root Hash & Standards Ribbon */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-600 font-medium">Merkle Root Hash:</span>
            <span className="font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold truncate max-w-xs sm:max-w-md">
              {ledgerRootHash}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 px-2.5 py-1 rounded border border-slate-300 text-slate-700 font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV Ledger</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 px-2.5 py-1 rounded text-white font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON Proof</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, action, target ID or details..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-semibold">Severity:</span>
            {(['ALL', 'INFO', 'NOTICE', 'WARNING', 'CRITICAL'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  severityFilter === sev
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Log Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">User & Role</th>
                <th className="py-2.5 px-3 font-semibold">Action</th>
                <th className="py-2.5 px-3 font-semibold">Target</th>
                <th className="py-2.5 px-3 font-semibold">Severity</th>
                <th className="py-2.5 px-3 font-semibold">PQC Signature / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {log.timestamp.slice(11, 19)}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-slate-800">{log.userEmail}</div>
                    <div className="text-[10px] text-slate-400">{log.userRole}</div>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-sky-700 font-bold whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                    {log.targetId}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        log.severity === 'CRITICAL'
                          ? 'bg-red-100 text-red-800'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : log.severity === 'NOTICE'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <div>{log.details}</div>
                    <div className="font-mono text-[10px] text-purple-700 mt-0.5">
                      {log.postQuantumSignature}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredLogs.length} audit entries • All transactions immutable</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
}
