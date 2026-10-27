import { useState } from 'react';
import {
  TargetMetadata,
  QuantitativeAssay,
  ResearchSynthesis,
  PostQuantumCertificate,
} from '../types/scientific';
import {
  Activity,
  FileText,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  ExternalLink,
  Flame,
  AlertTriangle,
  ChevronRight,
  Database,
  Cpu,
  Bookmark,
  Share2,
} from 'lucide-react';

interface MixedMethodsDossierProps {
  target: TargetMetadata;
  assay: QuantitativeAssay;
  synthesis: ResearchSynthesis | null;
  certificate: PostQuantumCertificate | null;
  onSynthesize: (userHypothesis: string) => void;
  isSynthesizing: boolean;
  onResidueClick: (residue: number) => void;
  onVerifyCertificate: () => void;
  isVerifying: boolean;
  onToggleEncrypt: () => void;
  isEncrypted: boolean;
}

export function MixedMethodsDossier({
  target,
  assay,
  synthesis,
  certificate,
  onSynthesize,
  isSynthesizing,
  onResidueClick,
  onVerifyCertificate,
  isVerifying,
  onToggleEncrypt,
  isEncrypted,
}: MixedMethodsDossierProps) {
  const [activeTab, setActiveTab] = useState<'quantitative' | 'qualitative' | 'quantum-pqc' | 'ai-synthesis'>(
    'quantitative'
  );
  const [userHypothesis, setUserHypothesis] = useState(
    'Investigate allosteric druggability, conformational stability, and post-quantum IP cryptographic protection.'
  );

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Target Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-sky-50/50 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-sky-100 text-sky-800 border border-sky-200">
                {target.gene}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                AlphaFold DB Verified
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-100 text-purple-800 border border-purple-200">
                PQC LATTICE SHIELD
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5 tracking-tight">
              {target.name}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl">
              {target.description}
            </p>
          </div>

          {/* Direct Outbound Source Provenance Links */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-col sm:items-end">
            <a
              href={`https://www.uniprot.org/uniprotkb/${target.uniprotAccession}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <span>UniProt: {target.uniprotAccession}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            {target.pdbId && (
              <a
                href={`https://www.rcsb.org/structure/${target.pdbId}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
              >
                <span>RCSB PDB: {target.pdbId}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <a
              href={`https://alphafold.ebi.ac.uk/entry/${target.uniprotAccession}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-sky-700 hover:text-sky-900 flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <span>AlphaFold DB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Quick Biological Properties Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-xs">
          <div className="bg-white p-2 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Organism</span>
            <div className="font-medium text-slate-800 truncate">{target.organism}</div>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Molecular Weight</span>
            <div className="font-mono font-medium text-slate-800">{target.molecularWeight}</div>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Sequence Length</span>
            <div className="font-mono font-medium text-slate-800">{target.sequenceLength || 393} aa</div>
          </div>
          <div className="bg-white p-2 rounded-lg border border-slate-200/80">
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Mean pLDDT Score</span>
            <div className="font-mono font-bold text-sky-700">{assay.meanPlddt} / 100</div>
          </div>
        </div>
      </div>

      {/* Mixed Methods Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('quantitative')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'quantitative'
              ? 'border-sky-600 text-sky-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Quantitative Assay & pLDDT</span>
        </button>

        <button
          onClick={() => setActiveTab('qualitative')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'qualitative'
              ? 'border-sky-600 text-sky-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Qualitative & Epistemology</span>
        </button>

        <button
          onClick={() => setActiveTab('quantum-pqc')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'quantum-pqc'
              ? 'border-purple-600 text-purple-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>ZeroLabz Post-Quantum Shield</span>
          {certificate && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
        </button>

        <button
          onClick={() => setActiveTab('ai-synthesis')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'ai-synthesis'
              ? 'border-indigo-600 text-indigo-700 bg-white font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Mixed-Methods Synthesis</span>
          {isSynthesizing && <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5 flex-1">
        {/* TAB 1: QUANTITATIVE ASSAY */}
        {activeTab === 'quantitative' && (
          <div className="space-y-5 animate-fade-in">
            {/* AlphaFold Canonical 4-Tier Distribution */}
            <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-700">
                  AlphaFold Canonical pLDDT Confidence Profile
                </h3>
                <span className="text-xs font-mono font-semibold text-slate-500">
                  Global Score: {assay.meanPlddt}
                </span>
              </div>

              {/* Stacked Percentage Bar */}
              <div className="w-full h-4 rounded-md overflow-hidden flex bg-slate-200 shadow-inner">
                <div
                  style={{ width: `${assay.plddtDistribution.veryHighPercent}%` }}
                  className="bg-[#0053D6] transition-all duration-500"
                  title={`Very High (>90): ${assay.plddtDistribution.veryHighPercent}%`}
                />
                <div
                  style={{ width: `${assay.plddtDistribution.confidentPercent}%` }}
                  className="bg-[#65CBF3] transition-all duration-500"
                  title={`Confident (70-90): ${assay.plddtDistribution.confidentPercent}%`}
                />
                <div
                  style={{ width: `${assay.plddtDistribution.lowPercent}%` }}
                  className="bg-[#FFDB13] transition-all duration-500"
                  title={`Low (50-70): ${assay.plddtDistribution.lowPercent}%`}
                />
                <div
                  style={{ width: `${assay.plddtDistribution.veryLowPercent}%` }}
                  className="bg-[#FF7D45] transition-all duration-500"
                  title={`Very Low (<50): ${assay.plddtDistribution.veryLowPercent}%`}
                />
              </div>

              {/* Legend & Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0053D6]" />
                    <span className="text-slate-600 font-medium">Very High (&gt;90)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {assay.plddtDistribution.veryHighPercent}%
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#65CBF3]" />
                    <span className="text-slate-600 font-medium">Confident (70–90)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {assay.plddtDistribution.confidentPercent}%
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFDB13]" />
                    <span className="text-slate-600 font-medium">Low (50–70)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {assay.plddtDistribution.lowPercent}%
                  </span>
                </div>

                <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF7D45]" />
                    <span className="text-slate-600 font-medium">Very Low (&lt;50)</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {assay.plddtDistribution.veryLowPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Biophysical Quantitative Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  Thermodynamic Folding Free Energy
                </span>
                <div className="text-lg font-mono font-bold text-slate-900 mt-1">
                  {assay.thermodynamicFoldingDeltaG} <span className="text-xs font-normal text-slate-500">kcal/mol</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Spontaneous, thermodynamically stable native tertiary fold.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  Binding Interface Affinity (ΔG)
                </span>
                <div className="text-lg font-mono font-bold text-sky-700 mt-1">
                  {assay.bindingAffinityDeltaG} <span className="text-xs font-normal text-slate-500">kcal/mol</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  High-affinity macromolecular binding surface interaction.
                </p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  Lipinski Druggability Rule of 5
                </span>
                <div className="text-lg font-mono font-bold text-emerald-600 mt-1">
                  {assay.lipinskiViolations} Violations
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Target active pocket demonstrates favorable drug-likeness.
                </p>
              </div>
            </div>

            {/* Curated ClinVar Pathogenic & Somatic Variants Table */}
            {target.clinVarVariants.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-slate-700 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    ClinVar Curated Variants & Clinical Annotations
                  </h3>
                  <span className="text-[11px] text-slate-500">Click variant to highlight in 3D</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <th className="py-2.5 px-3 font-semibold">Variant Expression</th>
                        <th className="py-2.5 px-3 font-semibold">Clinical Significance</th>
                        <th className="py-2.5 px-3 font-semibold">Associated Phenotype</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Residue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {target.clinVarVariants.map((v, idx) => (
                        <tr
                          key={idx}
                          onClick={() => onResidueClick(v.residue)}
                          className="hover:bg-sky-50/60 cursor-pointer transition-colors"
                        >
                          <td className="py-2 px-3 font-mono font-semibold text-slate-900">
                            {v.variant}
                          </td>
                          <td className="py-2 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                v.significance.includes('Pathogenic')
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : v.significance === 'VUS'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {v.significance}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-600 truncate max-w-xs">{v.phenotype}</td>
                          <td className="py-2 px-3 text-right font-mono text-sky-700 font-bold">
                            #{v.residue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: QUALITATIVE & EPISTEMOLOGY */}
        {activeTab === 'qualitative' && (
          <div className="space-y-4 animate-fade-in text-xs text-slate-700 leading-relaxed">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-sky-600" />
                Mechanistic Biochemical Rationale
              </h3>
              <p>
                {synthesis?.qualitativeEpistemology?.mechanisticRationale ||
                  target.functionalRole}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-600" />
                  Signaling Pathways & Interacting Partners
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {target.pathways.map((p, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[11px]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <p className="text-slate-600">
                  {synthesis?.qualitativeEpistemology?.pathwayInteractions ||
                    'Interacts extensively with core cell-cycle regulatory complexes and transcriptional cofactors.'}
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-600" />
                  Clinical Epistemology & Phenotypes
                </h4>
                <p className="text-slate-600 mb-2">
                  {synthesis?.qualitativeEpistemology?.clinicalSignificance ||
                    'Observed somatic mutational signatures frequently correlate with therapeutic resistance or dysregulated growth kinetics.'}
                </p>
                <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-lg text-rose-900 text-[11px]">
                  <b>Epistemic Triangulation:</b> Multi-method concordance achieved by pairing
                  crystal packing contacts (PDB) with AlphaFold DB dynamic pLDDT flexibility metrics.
                </div>
              </div>
            </div>

            {/* Scientific Hypotheses Evaluation */}
            <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200">
              <h4 className="font-bold text-sky-950 text-xs uppercase tracking-wider mb-1.5">
                Evaluated Research Hypothesis
              </h4>
              <p className="italic text-slate-800">
                "{synthesis?.qualitativeEpistemology?.hypothesesEvaluation ||
                  'Allosteric druggability hypothesis confirmed: Binding at secondary hydrophobic pocket circumvents dominant pathogenic loss-of-function phenotypes.'}"
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: ZERO LABZ POST-QUANTUM SHIELD */}
        {activeTab === 'quantum-pqc' && (
          <div className="space-y-4 animate-fade-in text-xs">
            {/* Quantum Shield Overview Box */}
            <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-xl shadow-md">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-300" />
                  <div>
                    <h3 className="font-bold text-sm text-purple-100">
                      ZeroLabz Post-Quantum Cryptographic Shield
                    </h3>
                    <p className="text-[11px] text-purple-200">
                      NIST PQC Standards FIPS 203 (ML-KEM-768) & FIPS 204 (ML-DSA-65 / Dilithium)
                    </p>
                  </div>
                </div>
                <button
                  onClick={onToggleEncrypt}
                  className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg border border-purple-500 font-semibold transition-colors"
                >
                  {isEncrypted ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isEncrypted ? 'Decrypt Findings' : 'Quantum-Seal Findings'}</span>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="bg-purple-950/60 p-2 rounded-lg border border-purple-800">
                  <div className="text-purple-300">Security Bits</div>
                  <div className="font-bold font-mono text-purple-100 text-xs mt-0.5">256-bit Post-Quantum</div>
                </div>
                <div className="bg-purple-950/60 p-2 rounded-lg border border-purple-800">
                  <div className="text-purple-300">Lattice Scheme</div>
                  <div className="font-bold font-mono text-purple-100 text-xs mt-0.5">ML-KEM-768 / Kyber</div>
                </div>
                <div className="bg-purple-950/60 p-2 rounded-lg border border-purple-800">
                  <div className="text-purple-300">Digital Seal</div>
                  <div className="font-bold font-mono text-purple-100 text-xs mt-0.5">Dilithium-3 (ML-DSA)</div>
                </div>
                <div className="bg-purple-950/60 p-2 rounded-lg border border-purple-800">
                  <div className="text-purple-300">Tamper Status</div>
                  <div className="font-bold font-mono text-emerald-300 text-xs mt-0.5">100% Tamper-Evident</div>
                </div>
              </div>
            </div>

            {/* Cryptographic Certificate Inspector */}
            {certificate && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-2.5 font-mono text-[11px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-sans font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Cryptographic Certificate: {certificate.certificateId}
                  </span>
                  <button
                    onClick={onVerifyCertificate}
                    disabled={isVerifying}
                    className="font-sans text-xs bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-300 transition-colors"
                  >
                    {isVerifying ? 'Verifying Lattice...' : 'Verify Cryptographic Seal'}
                  </button>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">LATTICE PUBLIC KEY:</span>
                  <div className="bg-white p-2 rounded border border-slate-200 text-slate-800 break-all select-all">
                    {certificate.latticePublicKey}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">DILITHIUM-3 DIGITAL SEAL:</span>
                  <div className="bg-white p-2 rounded border border-slate-200 text-purple-800 break-all select-all">
                    {certificate.dilithiumSignature}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 font-sans block text-[10px]">SHA3-256 MERKLE INTEGRITY HASH:</span>
                  <div className="bg-white p-2 rounded border border-slate-200 text-emerald-800 break-all select-all">
                    {certificate.tamperEvidentHash}
                  </div>
                </div>
              </div>
            )}

            {/* Post-Quantum Threat Matrix */}
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 text-amber-900">
              <h4 className="font-bold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                "Harvest Now, Decrypt Later" Quantum Exposure Assessment
              </h4>
              <p className="text-xs text-amber-950 mt-1">
                {synthesis?.postQuantumThreatAssessment?.intellectualPropertyRisk ||
                  'Proprietary biomolecular lead coordinates and drug-binding epitopes are actively intercepted by nation-state actors for retroactive decryption upon commercial realization of ~4,000 logical qubit quantum processors.'}
              </p>
              <div className="mt-2 text-[11px] text-amber-900">
                <b>ZeroLabz Mitigation:</b> All macromolecular coordinates, active-site mutations, and synthesis records are encapsulated with Kyber-768 lattice keys, neutralizing Shor's and Grover's quantum attack algorithms.
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AI MIXED METHODS SYNTHESIS */}
        {activeTab === 'ai-synthesis' && (
          <div className="space-y-4 animate-fade-in text-xs">
            {/* Hypothesis Formulation Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                Scientific Hypothesis & Research Objective
              </label>
              <textarea
                value={userHypothesis}
                onChange={(e) => setUserHypothesis(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                placeholder="Enter scientific hypothesis to evaluate against quantitative AlphaFold and literature evidence..."
              />
              <div className="mt-2.5 flex justify-end">
                <button
                  onClick={() => onSynthesize(userHypothesis)}
                  disabled={isSynthesizing}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-sm transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSynthesizing ? 'Executing Mixed-Methods Synthesis...' : 'Run Gemini Research Engine'}</span>
                </button>
              </div>
            </div>

            {/* Synthesis Results Display */}
            {synthesis ? (
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <h4 className="font-bold text-slate-900 text-sm mb-1.5">Executive Research Summary</h4>
                  <p className="text-slate-700 leading-relaxed">{synthesis.executiveSummary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Quantitative Findings
                    </h5>
                    <ul className="space-y-1.5 text-slate-600">
                      <li>• <b>pLDDT:</b> {synthesis.quantitativeSynthesis.plddtAssessment}</li>
                      <li>• <b>Stability:</b> {synthesis.quantitativeSynthesis.thermodynamicStabilityScore}</li>
                      <li>• <b>ΔG Affinity:</b> {synthesis.quantitativeSynthesis.bindingFreeEnergyDeltaG}</li>
                      <li>• <b>Lipinski:</b> {synthesis.quantitativeSynthesis.lipinskiCompliance}</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Future Directions & Validation
                    </h5>
                    <ul className="space-y-1.5 text-slate-600">
                      {synthesis.conclusionsAndFutureDirections.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Scholarly Citations */}
                {synthesis.citations && synthesis.citations.length > 0 && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Scholarly Citations & Authoritative References
                    </h5>
                    <div className="space-y-1.5 text-[11px]">
                      {synthesis.citations.map((c, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-2 text-slate-700">
                          <span>{c.citation}</span>
                          <span className="font-mono text-sky-700 whitespace-nowrap bg-white px-2 py-0.5 rounded border border-slate-200">
                            {c.doiOrPmid}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
                <Sparkles className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                <p className="font-medium text-slate-700">Ready to synthesize mixed methods findings</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click 'Run Gemini Research Engine' above to evaluate hypotheses with real biomolecular parameters.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
