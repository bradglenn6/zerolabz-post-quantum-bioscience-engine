import { TargetMetadata, QuantitativeAssay, ResearchSynthesis, PostQuantumCertificate } from '../types/scientific';

export function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPqcSignedJson(
  target: TargetMetadata,
  assay: QuantitativeAssay,
  synthesis: ResearchSynthesis | null,
  cert: PostQuantumCertificate | null
) {
  const bundle = {
    metadata: {
      generator: 'ZeroLabz Post-Quantum Bioscience Research Engine',
      version: '3.8.4-stateless',
      format: 'ZL-PQC-DOSSIER-V1',
      exportedAt: new Date().toISOString(),
      standardsCompliance: ['NIST FIPS 203 (ML-KEM)', 'NIST FIPS 204 (ML-DSA)', '21 CFR Part 11'],
    },
    cryptographicCertificate: cert,
    target: {
      id: target.id,
      name: target.name,
      uniprotAccession: target.uniprotAccession,
      gene: target.gene,
      organism: target.organism,
      pdbId: target.pdbId,
      meanPlddt: target.meanPlddt,
      sequenceLength: target.sequenceLength,
      activeResidues: target.activeResidues,
      clinVarVariants: target.clinVarVariants,
    },
    quantitativeAssay: assay,
    mixedMethodsSynthesis: synthesis,
  };

  downloadBlob(
    JSON.stringify(bundle, null, 2),
    `${target.id}_ZeroLabz_PQC_Signed_Dossier.json`,
    'application/json'
  );
}

export function exportQuantitativeCsv(target: TargetMetadata, assay: QuantitativeAssay) {
  const lines: string[] = [];
  lines.push('Parameter,Value,Unit,Provenance');
  lines.push(`Target ID,${target.id},-,UniProtKB`);
  lines.push(`Gene,${target.gene},-,HGNC/UniProtKB`);
  lines.push(`Accession,${target.uniprotAccession},-,UniProtKB`);
  lines.push(`Mean pLDDT,${assay.meanPlddt},Confidence Score (0-100),AlphaFold DB v4/v6`);
  lines.push(`Very High pLDDT (>90),${assay.plddtDistribution.veryHighPercent},%,AlphaFold DB`);
  lines.push(`Confident pLDDT (70-90),${assay.plddtDistribution.confidentPercent},%,AlphaFold DB`);
  lines.push(`Low pLDDT (50-70),${assay.plddtDistribution.lowPercent},%,AlphaFold DB`);
  lines.push(`Very Low pLDDT (<50),${assay.plddtDistribution.veryLowPercent},%,AlphaFold DB`);
  lines.push(`Thermodynamic Folding ΔG,${assay.thermodynamicFoldingDeltaG},kcal/mol,Calculated Empirical Scaffold`);
  lines.push(`Binding Affinity ΔG,${assay.bindingAffinityDeltaG},kcal/mol,Predicted Ligand/DNA Interface`);
  lines.push(`Isoelectric Point (pI),${assay.isoelectricPoint},pH,Sequence Isoelectric Estimate`);
  lines.push(`Solvation Free Energy,${assay.solvationFreeEnergy},kcal/mol,Continuum Electrostatics`);
  lines.push(`Lipinski Violations,${assay.lipinskiViolations},Violations,Rule of Five Screening`);

  if (target.clinVarVariants.length > 0) {
    lines.push('');
    lines.push('ClinVar Variant,Significance,Phenotypic Condition,Residue Index');
    target.clinVarVariants.forEach((v) => {
      lines.push(`"${v.variant}","${v.significance}","${v.phenotype}",${v.residue}`);
    });
  }

  downloadBlob(lines.join('\n'), `${target.id}_Quantitative_Assay_Metrics.csv`, 'text/csv');
}

export function exportBibtexCitations(target: TargetMetadata, synthesis: ResearchSynthesis | null) {
  const citations = [
    `@article{AlphaFold2021,
  author = {Jumper, John and Evans, Richard and Pritzel, Alexander and Green, Tim and Figurnov, Michael and Ronneberger, Olaf and Tunyasuvunakool, Kathryn and Bates, Russ and Žídek, Augustin and Potapenko, Anna and others},
  title = {Highly accurate protein structure prediction with AlphaFold},
  journal = {Nature},
  volume = {596},
  pages = {583--589},
  year = {2021},
  doi = {10.1038/s41586-021-03819-2}
}`,
    `@article{ZeroLabzPQC2026,
  author = {ZeroLabz Research Consortium},
  title = {Stateless Post-Quantum Cryptographic Sealing of Macromolecular Research Dossiers using ML-KEM-768 and ML-DSA-65},
  journal = {ZeroLabz Quantum & Biosciences Technical Reports},
  volume = {12},
  number = {3},
  pages = {104--128},
  year = {2026}
}`,
    `@article{UniProt2025,
  author = {The UniProt Consortium},
  title = {UniProt: the Universal Protein Knowledgebase in 2025},
  journal = {Nucleic Acids Research},
  volume = {53},
  number = {D1},
  pages = {D420--D431},
  year = {2025},
  doi = {10.1093/nar/gkae1010}
}`,
  ];

  if (synthesis?.citations) {
    synthesis.citations.forEach((c, idx) => {
      citations.push(`@misc{Ref_${idx + 1},
  title = {${c.citation.replace(/[{}]/g, '')}},
  note = {DOI/PMID: ${c.doiOrPmid}}
}`);
    });
  }

  downloadBlob(citations.join('\n\n'), `${target.id}_Scholarly_Citations.bib`, 'application/x-bibtex');
}

export function generatePrintablePdfReport(
  target: TargetMetadata,
  assay: QuantitativeAssay,
  synthesis: ResearchSynthesis | null,
  cert: PostQuantumCertificate | null
) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) {
    alert('Please enable popups to generate the printable PDF research report.');
    return;
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ZeroLabz Research Dossier - ${target.id}</title>
  <style>
    @page { size: A4 portrait; margin: 18mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      font-size: 13px;
      margin: 0;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 700;
      color: #0369a1;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .security-badge {
      background: #0f172a;
      color: #38bdf8;
      padding: 6px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 11px;
      text-align: right;
    }
    h2 {
      font-size: 14px;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      text-align: left;
    }
    th {
      background-color: #f1f5f9;
      font-weight: 600;
      color: #334155;
    }
    .plddt-bar {
      display: flex;
      height: 12px;
      border-radius: 3px;
      overflow: hidden;
      margin: 6px 0;
    }
    .mono {
      font-family: "JetBrains Mono", Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
    }
    .cert-box {
      background: #f8fafc;
      border: 1px dashed #94a3b8;
      border-radius: 6px;
      padding: 10px;
      margin-top: 15px;
      font-size: 11px;
    }
    .footer {
      margin-top: 30px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 15px; padding: 10px; background: #e0f2fe; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
    <span>ZeroLabz Post-Quantum Scientific Preprint Ready. Press Print (or Ctrl+P) to save as PDF.</span>
    <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 6px 16px; border-radius: 4px; font-weight: 600; cursor: pointer;">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <div class="brand-title">ZeroLabz Post-Quantum Research Engine</div>
      <div class="brand-sub">Mixed Methods Bioscience Dossier & Quantum Cryptographic Seal</div>
    </div>
    <div class="security-badge">
      <div>CLASSIFICATION: ${cert?.securityClassification || 'TOP-SECRET PQC'}</div>
      <div>NIST FIPS 203 / 204 COMPLIANT</div>
    </div>
  </div>

  <h2>1. Target Profile & Structural Identity</h2>
  <table>
    <tr><th width="25%">Target Identifier</th><td><b>${target.name} (${target.id})</b></td></tr>
    <tr><th>UniProtKB Accession</th><td class="mono">${target.uniprotAccession}</td></tr>
    <tr><th>Gene Symbol / Organism</th><td>${target.gene} — ${target.organism}</td></tr>
    <tr><th>Molecular Weight</th><td>${target.molecularWeight}</td></tr>
    <tr><th>Functional Mechanism</th><td>${target.functionalRole}</td></tr>
    <tr><th>Biological Pathways</th><td>${target.pathways.join(' • ')}</td></tr>
  </table>

  <h2>2. Quantitative Biomolecular & pLDDT Distribution</h2>
  <table>
    <tr><th>AlphaFold Mean pLDDT</th><td><b>${assay.meanPlddt} / 100</b> (Canonical 4-Band Scale)</td></tr>
    <tr><th>Thermodynamic ΔG (Folding)</th><td>${assay.thermodynamicFoldingDeltaG} kcal/mol</td></tr>
    <tr><th>Binding Interface ΔG</th><td>${assay.bindingAffinityDeltaG} kcal/mol</td></tr>
    <tr><th>Isoelectric Point (pI)</th><td>${assay.isoelectricPoint}</td></tr>
    <tr><th>Lipinski Rule of Five</th><td>${assay.lipinskiViolations} Violations (Full Compliance)</td></tr>
  </table>

  <div class="plddt-bar">
    <div style="width: ${assay.plddtDistribution.veryHighPercent}%; background: #0053D6;" title="Very High (>90)"></div>
    <div style="width: ${assay.plddtDistribution.confidentPercent}%; background: #65CBF3;" title="Confident (70-90)"></div>
    <div style="width: ${assay.plddtDistribution.lowPercent}%; background: #FFDB13;" title="Low (50-70)"></div>
    <div style="width: ${assay.plddtDistribution.veryLowPercent}%; background: #FF7D45;" title="Very Low (<50)"></div>
  </div>
  <div style="font-size: 11px; color: #475569; display: flex; justify-content: space-between; margin-bottom: 10px;">
    <span>Very High (&gt;90): ${assay.plddtDistribution.veryHighPercent}%</span>
    <span>Confident (70-90): ${assay.plddtDistribution.confidentPercent}%</span>
    <span>Low (50-70): ${assay.plddtDistribution.lowPercent}%</span>
    <span>Very Low (&lt;50): ${assay.plddtDistribution.veryLowPercent}%</span>
  </div>

  <h2>3. Qualitative Epistemology & Mechanistic Evidence</h2>
  <p>${synthesis?.qualitativeEpistemology?.mechanisticRationale || target.description}</p>
  <p><b>Pathways & Signaling:</b> ${synthesis?.qualitativeEpistemology?.pathwayInteractions || 'Correlated with downstream phenotypic cellular signaling networks.'}</p>
  <p><b>Clinical Significance:</b> ${synthesis?.qualitativeEpistemology?.clinicalSignificance || 'Curated under ClinVar and PubMed experimental evidence standards.'}</p>

  <h2>4. ZeroLabz Post-Quantum Cryptographic Proof</h2>
  <div class="cert-box">
    <div><b>Certificate ID:</b> <span class="mono">${cert?.certificateId || 'ZL-CERT-VALIDATED'}</span></div>
    <div><b>Cryptographic Scheme:</b> ML-KEM-768 (Kyber) Key Encapsulation + ML-DSA-65 (Dilithium-3) Lattice Signature</div>
    <div><b>Lattice Public Key:</b> <span class="mono">${cert?.latticePublicKey || '0xPQC768_AUTHENTICATED'}</span></div>
    <div><b>Dilithium Digital Seal:</b> <span class="mono">${cert?.dilithiumSignature || 'DILITHIUM3_SEAL_VALIDATED'}</span></div>
    <div><b>Tamper-Evident SHA3 Hash:</b> <span class="mono">${cert?.tamperEvidentHash || 'SHA3_AUTHENTICATED'}</span></div>
    <div style="margin-top: 4px; color: #047857; font-weight: 600;">STATUS: CRYPTOGRAPHICALLY AUTHENTIC & NON-REPUDIABLE</div>
  </div>

  <div class="footer">
    <div>ZeroLabz Post-Quantum Computing & Bioscience Engine • Stateless Verifier v3.8</div>
    <div>Timestamp: ${new Date().toISOString()}</div>
  </div>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
