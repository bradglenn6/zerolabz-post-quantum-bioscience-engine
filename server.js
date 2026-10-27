const express = require("express");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "8080", 10);

app.use(express.json());

const REGISTRATION_RESULT_PATH = "./registration-result.json";
const ROYALTY_POLICY_LAP = "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E";
const DEFAULT_COMMERCIAL_TERMS_ID = 2808n;
const HERITAGE_TRUST_TX_HASH = "0xe3b5395274f7cbed898ea8982014d103605df3ee808c2aa127b61a854317c430";

// Bind instantly to satisfy Cloud Run health checks immediately
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`[READY] ZeroLabz Guardian Service listening on port ${PORT}`);
});

app.get("/", (_req, res) => {
  res.status(200).json({ ok: true, service: "ZeroLabz Guardian & BioIP API", chainId: 1315 });
});

app.get("/api/guardian/status", (_req, res) => {
  try {
    const saved = fs.existsSync(REGISTRATION_RESULT_PATH)
      ? JSON.parse(fs.readFileSync(REGISTRATION_RESULT_PATH, "utf8"))
      : {};
    res.status(200).json({
      ok: true,
      config: { chain: "Story Protocol Aeneid Testnet (1315)", guardianAddress: process.env.GUARDIAN_ADDRESS || "Configured" },
      royaltyPolicyLap: ROYALTY_POLICY_LAP,
      defaultTermsId: DEFAULT_COMMERCIAL_TERMS_ID.toString(),
      heritageTrustTxHash: HERITAGE_TRUST_TX_HASH,
      registrationState: saved,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
});

app.post("/api/guardian/derivative-flow", async (req, res) => {
  try {
    // Lazy load heavy Web3 modules only when the endpoint is hit
    const { createWalletClient, http } = require("viem");
    const { privateKeyToAccount } = require("viem/accounts");
    const { aeneid } = require("@story-protocol/core-sdk");

    const { parentIpId, commercialRevSharePercent, royaltyPaymentAmountWip } = req.body || {};
    
    const mockReceipt = {
      success: true,
      chainId: 1315,
      parentIpId: parentIpId || "0xMockParentIpId",
      derivativeIpId: "0xMockDerivativeIpId",
      commercialRevSharePercent: commercialRevSharePercent ?? 10,
      royaltyPaymentWip: royaltyPaymentAmountWip || "5",
      transactions: {
        registerDerivative: { txHashes: ["0x7edfd33775dd8a94f5fa5a943b7e27159c9377335c256bdcc950ea7173e9dc05"] },
        payRoyaltyOnBehalf: { txHashes: ["0x7edfd33775dd8a94f5fa5a943b7e27159c9377335c256bdcc950ea7173e9dc05"] }
      }
    };

    fs.writeFileSync(REGISTRATION_RESULT_PATH, JSON.stringify({ latestDerivativeFlow: mockReceipt }, null, 2), "utf8");
    res.status(200).json({ ok: true, receipt: mockReceipt });
  } catch (err) {
    res.status(400).json({ ok: false, error: err instanceof Error ? err.message : String(err) });
  }
});
