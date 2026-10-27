import { Router, type Request, type Response } from "express";
import * as fs from "fs";
import { Address } from "viem";
import {
  UniGasGuardianService,
  executeAeneidDerivativeRoyaltyFlow,
  REGISTRATION_RESULT_PATH,
  ROYALTY_POLICY_LAP,
  DEFAULT_COMMERCIAL_TERMS_ID,
  HERITAGE_TRUST_TX_HASH,
} from "../services/guardian";

export const guardianRouter = Router();

guardianRouter.get("/status", (_req: Request, res: Response) => {
  try {
    const guardian = new UniGasGuardianService();
    const saved = fs.existsSync(REGISTRATION_RESULT_PATH)
      ? JSON.parse(fs.readFileSync(REGISTRATION_RESULT_PATH, "utf8"))
      : {};
    res.status(200).json({
      ok: true,
      config: guardian.getConfig(),
      royaltyPolicyLap: ROYALTY_POLICY_LAP,
      defaultTermsId: DEFAULT_COMMERCIAL_TERMS_ID.toString(),
      heritageTrustTxHash: HERITAGE_TRUST_TX_HASH,
      registrationState: saved,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: msg });
  }
});

guardianRouter.post("/derivative-flow", async (req: Request, res: Response) => {
  try {
    const {
      parentIpId,
      spgNftContract,
      licenseTermsId,
      commercialRevSharePercent,
      royaltyPaymentAmountWip,
    } = req.body || {};

    const receipt = await executeAeneidDerivativeRoyaltyFlow({
      parentIpId: parentIpId as Address | undefined,
      spgNftContract: spgNftContract as Address | undefined,
      licenseTermsId: licenseTermsId ? BigInt(licenseTermsId) : undefined,
      commercialRevSharePercent: commercialRevSharePercent !== undefined ? Number(commercialRevSharePercent) : 10,
      royaltyPaymentAmountWip: royaltyPaymentAmountWip ? String(royaltyPaymentAmountWip) : "5",
    });

    res.status(200).json({ ok: true, receipt });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ ok: false, error: msg });
  }
});
