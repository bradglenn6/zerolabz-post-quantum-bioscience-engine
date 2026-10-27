import { useState } from 'react';
import { TargetMetadata, QuantitativeAssay, ResearchSynthesis, PostQuantumCertificate } from '../types/scientific';
import {
  exportPqcSignedJson,
  exportQuantitativeCsv,
  exportBibtexCitations,
  generatePrintablePdfReport,
  downloadBlob,
} from '../services/exportService';
import {
  X,
  Download,
  FileText,
  FileCode,
  Table,
  Bookmark,
  Shield,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: TargetMetadata;
  assay: QuantitativeAssay;
  synthesis: ResearchSynthesis | null;
  certificate: PostQuantumCertificate | null;
  onLogAuditEvent: (action: string, details: string, severity: 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL') => void;
}

export function ExportModal({
  isOpen,
  onClose,
  target,
  assay,
  synthesis,
  certificate,
  onLogAuditEvent,
}: ExportModalProps) {
  const [encryptWithKyber, setEncryptWithKyber] = useState(true);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = (format: 'pdf' | 'json' | 'cif' | 'csv' | 'bibtex') => {
    setExportedFormat(format);

    if (format === 'pdf') {
      generatePrintablePdfReport(target, assay, synthesis, certificate);
      onLogAuditEvent('EXPORT_FINDINGS_PDF', `Exported publication preprint PDF report for ${target.id}`, 'INFO');
    } else if (format === 'json') {
      exportPqcSignedJson(target, assay, synthesis, certificate);
      onLogAuditEvent('EXPORT_FINDINGS_JSON', `Exported ZeroLabz PQC signed JSON bundle for ${target.id}`, 'INFO');
    } else if (format === 'cif') {
      // Download CIF coordinate placeholder or AlphaFold coordinates link
      const cifUrl = target.cifUrl || `https://alphafold.ebi.ac.uk/files/AF-${target.uniprotAccession}-F1-model_v6.cif`;
      const a = document.createElement('a');
      a.href = cifUrl;
      a.download = `AF-${target.uniprotAccession}-F1-model_v6.cif`;
      a.target = '_blank';
      a.click();
      onLogAuditEvent('EXPORT_STRUCTURE_CIF', `Downloaded 3D mmCIF coordinate file for ${target.id}`, 'INFO');
    } else if (format === 'csv') {
      exportQuantitativeCsv(target, assay);
      onLogAuditEvent('EXPORT_DATASET_CSV', `Exported quantitative assay metrics CSV for ${target.id}`, 'INFO');
    } else if (format === 'bibtex') {
      exportBibtexCitations(target, synthesis);
      onLogAuditEvent('EXPORT_BIBTEX_CITATIONS', `Exported BibTeX academic citations for ${target.id}`, 'INFO');
    }

    setTimeout(() => {
      setExportedFormat(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-950 border border-sky-800 rounded-xl text-sky-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Export Findings into Professional File Formats
              </h3>
              <p className="text-xs text-slate-400">
                Peer-Reviewed Layouts • Post-Quantum Cryptographic Proofs • Machine-Readable Datasets
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

        {/* Security Encapsulation Toggle Banner */}
        <div className="p-4 bg-purple-50 border-b border-purple-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-700" />
            <span className="text-purple-950 font-medium">
              Post-Quantum Integrity Envelope (Kyber-768 / Dilithium-3):
            </span>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={encryptWithKyber}
              onChange={(e) => setEncryptWithKyber(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500"
            />
            <span className="font-semibold text-purple-900 text-xs">Attach Digital Seal</span>
          </label>
        </div>

        {/* Export Formats Grid */}
        <div className="p-5 space-y-3">
          {/* Option 1: PDF Preprint */}
          <div className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  Publication Preprint PDF Report (.pdf)
                </div>
                <div className="text-[11px] text-slate-500">
                  Journal-style preprint layout with pLDDT plots, methods, and cryptographic seal.
                </div>
              </div>
            </div>
            <button
              onClick={() => handleExport('pdf')}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Generate PDF</span>
            </button>
          </div>

          {/* Option 2: JSON PQC Bundle */}
          <div className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  ZeroLabz Cryptographically-Signed JSON (.json)
                </div>
                <div className="text-[11px] text-slate-500">
                  Full structured research bundle with lattice public keys and Dilithium signature.
                </div>
              </div>
            </div>
            <button
              onClick={() => handleExport('json')}
              className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>

          {/* Option 3: mmCIF / PDB 3D Coordinates */}
          <div className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-sky-100 text-sky-700 rounded-lg">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  Macromolecular Coordinate File (.cif / .pdb)
                </div>
                <div className="text-[11px] text-slate-500">
                  Direct mmCIF atomic coordinate file for PyMOL, ChimeraX, or VMD.
                </div>
              </div>
            </div>
            <button
              onClick={() => handleExport('cif')}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download mmCIF</span>
            </button>
          </div>

          {/* Option 4: CSV Dataset */}
          <div className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-lg">
                <Table className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  Quantitative Metrics & Variant CSV (.csv)
                </div>
                <div className="text-[11px] text-slate-500">
                  Tabular pLDDT distributions, thermodynamic values, and ClinVar entries for Excel/R/Python.
                </div>
              </div>
            </div>
            <button
              onClick={() => handleExport('csv')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          {/* Option 5: BibTeX Citations */}
          <div className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-lg">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-xs sm:text-sm">
                  Academic Citations & Bibliography (.bib)
                </div>
                <div className="text-[11px] text-slate-500">
                  Complete BibTeX citations for LaTeX, Overleaf, Zotero, and Mendeley.
                </div>
              </div>
            </div>
            <button
              onClick={() => handleExport('bibtex')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .bib</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Target: {target.id} • {target.uniprotAccession}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
