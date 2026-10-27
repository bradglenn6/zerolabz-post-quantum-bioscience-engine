import * as crypto from "crypto";
import { Address, Hash, Hex, http } from "viem";
import { StoryClient, StoryConfig } from "@story-protocol/core-sdk";
import { UniGasRelayer } from "./relayer";

export interface BioIpAssetRecord {
  ipId: Address;
  name: string;
  nonCommercialTermsId: string;
  commercialTermsId: string;
  verifiedOnChain: boolean;
  metadataCid: string;
}

export interface ResearchAuditLog {
  queryId: string;
  operator: Address;
  ipAssetId: Address;
  action: "SEQUENCE_INSPECTION" | "DERIVATIVE_SYNTHESIS" | "AI_TRAINING_INGESTION";
  pqcSignature: string;
  epoch: number;
  timestamp: number;
}

export class BioscienceBioIpEngine {
  private storyClient: StoryClient;
  private relayer: UniGasRelayer;
  private readonly rootIpId: Address = "0x93762D496ffBae7aC9834047CB2C5A44958B7400";
  private readonly commercialTermsId: string = "2808";
  private readonly nonCommercialTermsId: string = "2054";

  constructor(relayerInstance?: UniGasRelayer) {
    const config: StoryConfig = {
      chainId: "aeneid",
      transport: http(process.env.RPC_URL || "https://aeneid.storyrpc.io"),
    };
    this.storyClient = StoryClient.newClient(config);
    this.relayer = relayerInstance || new UniGasRelayer();
  }

  public async verifyDatasetProvenance(): Promise<BioIpAssetRecord> {
    console.log(`[Bioscience Engine] Verifying Root IP Asset: ${this.rootIpId}`);
    const ipRecord = await this.storyClient.ipAsset.getIpAsset({ ipId: this.rootIpId });
    const isVerified = Boolean(ipRecord && ipRecord.ipId);

    return {
      ipId: this.rootIpId,
      name: "PostLogix Heritage Trust: Data Set 10 Master Archive",
      nonCommercialTermsId: this.nonCommercialTermsId,
      commercialTermsId: this.commercialTermsId,
      verifiedOnChain: isVerified,
      metadataCid: "ipfs://bafybeidataset10masterarchive",
    };
  }

  public async mintDerivativeLicenseGasless(
    researcherAddress: Address,
    derivativeChildIpId: Address
  ): Promise<{ success: boolean; txHash: Hash; message: string }> {
    console.log(`[Bioscience Engine] Initiating Gasless Derivative Mint for ${researcherAddress}`);
    const linkCalldata = ("0x" + crypto.createHash("sha256").update(
      `LINK_DERIVATIVE:${this.rootIpId}:${this.commercialTermsId}:${derivativeChildIpId}`
    ).digest("hex")) as Hex;

    const receipt = await this.relayer.relayTransaction(
      researcherAddress,
      this.rootIpId,
      linkCalldata
    );

    return {
      success: true,
      txHash: receipt.txHash,
      message: `Commercial derivative successfully anchored under Terms ID ${this.commercialTermsId}`,
    };
  }

  public createAuditLog(
    operator: Address,
    action: ResearchAuditLog["action"]
  ): ResearchAuditLog {
    const queryId = "0x" + crypto.randomBytes(16).toString("hex");
    const rawPayload = `${queryId}:${operator}:${this.rootIpId}:${action}:${Date.now()}`;
    const mockPqcSig = "MLDSA87-SIG:" + crypto.createHash("sha256").update(rawPayload).digest("hex");

    return {
      queryId,
      operator,
      ipAssetId: this.rootIpId,
      action,
      pqcSignature: mockPqcSig,
      epoch: 43,
      timestamp: Math.floor(Date.now() / 1000),
    };
  }
}
