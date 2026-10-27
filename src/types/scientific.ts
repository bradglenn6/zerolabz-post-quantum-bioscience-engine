export type PlddtCategory = 'very-high' | 'confident' | 'low' | 'very-low';

export interface TargetMetadata {
  id: string;
  name: string;
  uniprotAccession: string;
  gene: string;
  organism: string;
  category: 'protein' | 'complex' | 'small-molecule';
  pdbId?: string;
  pubchemCid?: number;
  smiles?: string;
  molecularWeight: string;
  description: string;
  functionalRole: string;
  pathways: string[];
  clinVarVariants: {
    variant: string;
    significance: 'Pathogenic' | 'Likely Pathogenic' | 'VUS' | 'Benign';
    phenotype: string;
    residue: number;
  }[];
  activeResidues: number[];
  meanPlddt: number;
  sequenceLength: number;
  sequence: string;
  cifUrl?: string;
}

export interface QuantitativeAssay {
  meanPlddt: number;
  plddtDistribution: {
    veryHighPercent: number; // >90
    confidentPercent: number; // 70-90
    lowPercent: number; // 50-70
    veryLowPercent: number; // <50
  };
  thermodynamicFoldingDeltaG: number; // kcal/mol
  bindingAffinityDeltaG: number; // kcal/mol
  isoelectricPoint: number;
  solvationFreeEnergy: number; // kcal/mol
  lipinskiViolations: number;
  logP?: number;
  rotatableBonds?: number;
  polarSurfaceArea?: number; // A^2
}

export interface QualitativeEvidence {
  mechanisticRationale: string;
  pathwayInteractions: string;
  clinicalSignificance: string;
  epistemicTriangulation: string;
  hypothesesEvaluation: string;
}

export interface PostQuantumThreatAssessment {
  intellectualPropertyRisk: string;
  quantumHarvestNowDecryptLaterVulnerability: string;
  recommendedMitigation: string;
}

export interface ResearchSynthesis {
  executiveSummary: string;
  quantitativeSynthesis: {
    plddtAssessment: string;
    thermodynamicStabilityScore: string;
    bindingFreeEnergyDeltaG: string;
    lipinskiCompliance: string;
    keyResidues: string[];
  };
  qualitativeEpistemology: QualitativeEvidence;
  postQuantumThreatAssessment: PostQuantumThreatAssessment;
  conclusionsAndFutureDirections: string[];
  citations: Array<{ citation: string; doiOrPmid: string }>;
}

export interface PostQuantumCertificate {
  certificateId: string;
  targetId: string;
  algorithm: 'NIST ML-KEM-768 + ML-DSA-65 (Dilithium-3)';
  latticePublicKey: string;
  dilithiumSignature: string;
  kyberCiphertext: string;
  tamperEvidentHash: string;
  issuedAt: string;
  securityClassification: 'RESTRICTED BIOMEDICAL INTELLECTUAL PROPERTY' | 'TOP-SECRET QUANTUM FINDING' | 'CONFIDENTIAL ASSAY';
  securityBits: 256;
  verified: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: string;
  action: string;
  targetId: string;
  details: string;
  severity: 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';
  postQuantumSignature: string;
  prevHash: string;
  entryHash: string;
}

export interface ServerlessWorkerNode {
  id: string;
  region: string;
  provider: string;
  status: 'ONLINE' | 'ACTIVE' | 'BALANCING';
  latencyMs: number;
  cpuLoadPercent: number;
  memoryUsageMb: number;
  requestsPerSec: number;
  quantumEntropyRate: number;
  activeHandshakes: number;
}

export interface UserSecurityProfile {
  email: string;
  name: string;
  role: string;
  clearanceLevel: 'LEVEL_1_GUEST' | 'LEVEL_2_ANALYST' | 'LEVEL_3_INVESTIGATOR' | 'LEVEL_4_TOP_SECRET';
  mfaEnabled: boolean;
  mfaVerified: boolean;
  totpSecret: string;
  quantumRecoveryToken: string;
  sessionToken: string;
}
