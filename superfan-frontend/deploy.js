import { SigningCosmWasmClient, CosmWasmClient } from "cosmwasm";
import { DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import fs from "fs";
import "dotenv/config";

// ⚡ Config
const RPC_ENDPOINT = process.env.EXPO_PUBLIC_RPC_ENDPOINT || "https://rpc.xion-testnet-2.burnt.com:443";
const MNEMONIC = process.env.DEPLOYER_MNEMONIC; // put your wallet mnemonic in .env
const PREFIX = "xion";
const GAS = "auto";
const GAS_ADJUSTMENT = 1.3;
const FEES = { amount: [{ amount: "500", denom: "uxion" }], gas: "2000000" };

async function deploy() {
  const wallet = await DirectSecp256k1Wallet.fromMnemonic(MNEMONIC, { prefix: PREFIX });
  const [account] = await wallet.getAccounts();
  console.log(`🚀 Using wallet: ${account.address}`);

  const client = await SigningCosmWasmClient.connectWithSigner(RPC_ENDPOINT, wallet, {
    gasPrice: { denom: "uxion", amount: "0.025" },
    gasLimits: { upload: 2000000, init: 2000000, exec: 2000000 },
  });

  // --- Upload Treasury contract ---
  const treasuryWasm = fs.readFileSync("./artifacts/treasury.wasm");
  let uploadTreasury = await client.upload(account.address, treasuryWasm, FEES, "Upload Treasury");
  console.log("✅ Treasury Code ID:", uploadTreasury.codeId);

  let treasury = await client.instantiate(
    account.address,
    uploadTreasury.codeId,
    {}, // init msg if needed
    "treasury-instance",
    FEES,
    { admin: account.address }
  );
  console.log("🏦 Treasury Contract Address:", treasury.contractAddress);

  // --- Upload RUM contract ---
  const rumWasm = fs.readFileSync("./artifacts/rum.wasm");
  let uploadRum = await client.upload(account.address, rumWasm, FEES, "Upload RUM");
  console.log("✅ RUM Code ID:", uploadRum.codeId);

  let rum = await client.instantiate(
    account.address,
    uploadRum.codeId,
    {}, // init msg if needed
    "rum-instance",
    FEES,
    { admin: account.address }
  );
  console.log("🍷 RUM Contract Address:", rum.contractAddress);

  console.log("\n🎉 Deployment Complete!");
  console.log(`EXPO_PUBLIC_TREASURY_CONTRACT_ADDRESS="${treasury.contractAddress}"`);
  console.log(`EXPO_PUBLIC_RUM_CONTRACT_ADDRESS="${rum.contractAddress}"`);
}

deploy().catch(console.error);
