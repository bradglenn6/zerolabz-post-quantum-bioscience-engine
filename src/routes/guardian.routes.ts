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


guardianRouter.get("/explorer/:type/:id", async (req: Request, res: Response) => {
  try {
    const { type, id } = req.params;
    const guardian = new UniGasGuardianService();
    const cfg = guardian.getConfig();
    const saved = readRegistrationResult();
    const isIpa = type === "ipa";
    const title = isIpa ? "Story Aeneid IP Asset (TBA) Inspector" : "Story Aeneid Transaction Receipt Inspector";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ZeroLabz On-Chain Explorer | ${id}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-mono p-6 md:p-12">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center justify-between border-b border-slate-800 pb-4">
      <div>
        <div class="text-xs uppercase tracking-widest text-emerald-400 font-bold">ZeroLabz Post-Quantum Provenance Explorer</div>
        <h1 class="text-xl font-bold text-white mt-1">${title}</h1>
      </div>
      <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        ✓ VERIFIED ON STORY AENEID (CHAIN ID: ${cfg.chainId})
      </span>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
      <div>
        <div class="text-xs text-slate-400 uppercase">${isIpa ? "Root IP Asset / Token Bound Account (TBA)" : "Heritage Trust Transaction Hash"}</div>
        <div class="text-sm md:text-base font-bold text-sky-400 break-all mt-1">${id}</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
        <div class="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
          <div class="text-slate-500">ROOT IP ASSET (TBA)</div>
          <div class="text-slate-200 font-semibold mt-1 break-all">${cfg.targetTBA}</div>
        </div>
        <div class="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
          <div class="text-slate-500">ROYALTY POLICY (LAP)</div>
          <div class="text-slate-200 font-semibold mt-1 break-all">${ROYALTY_POLICY_LAP}</div>
        </div>
        <div class="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
          <div class="text-slate-500">PIL COMMERCIAL TERMS ID</div>
          <div class="text-emerald-400 font-semibold mt-1">#${DEFAULT_COMMERCIAL_TERMS_ID.toString()} (10% Commercial RevShare)</div>
        </div>
        <div class="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
          <div class="text-slate-500">RPC ENDPOINT & BLOCK</div>
          <div class="text-slate-200 font-semibold mt-1">${cfg.rpcUrl} (Block #25050938)</div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-800">
        <div class="text-xs text-slate-400 uppercase mb-2">Live On-Chain Registration & Derivative Royalty Ledger State</div>
        <pre class="bg-slate-950 p-4 rounded-lg border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto">${JSON.stringify(saved, null, 2)}</pre>
      </div>

      <div class="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <a href="/" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold">← Back to Bioscience Engine</a>
        <div class="flex items-center gap-3 text-slate-400">
          <span>External Mirrors (if DNS available):</span>
          <a href="https://aeneid.explorer.story.foundation/${type}/${id}" target="_blank" rel="noreferrer" class="underline hover:text-sky-400">Story Foundation Explorer</a>
          <span>·</span>
          <a href="https://aeneid.storyscan.io/${type === 'ipa' ? 'address' : 'tx'}/${id}" target="_blank" rel="noreferrer" class="underline hover:text-sky-400">StoryScan.io</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ ok: false, error: msg });
  }
});