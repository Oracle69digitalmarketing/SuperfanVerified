import { useState } from "react";
import { Alert, Button } from "react-native";
import { getSigningClient } from "@burnt-labs/xion-client";
import axios from "axios";

export default function ConnectXionDaveButton({ userId, onVerified }) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // 1️⃣ Connect wallet & signing client
      const client = await getSigningClient();
      const account = client?.accounts?.[0];
      if (!account) throw new Error("Wallet not connected");

      // 2️⃣ Fetch latest Reclaim proof for user
      const { data: proofRes } = await axios.get(`/api/reclaim-proof/${userId}`);
      const proof = proofRes?.proof;
      if (!proof) throw new Error("No proof available. Complete Reclaim verification first.");

      // 3️⃣ Submit proof to RUM contract on XION
      const instantiateMsg = {
        verification_addr: process.env.EXPO_PUBLIC_RECLAIM_PROVIDER_ID,
        claim_key: "followers_count",
      };
      const CODE_ID = 1289; // XION RUM testnet contract

      // Check if contract already exists for user
      let contractAddress = process.env.EXPO_PUBLIC_RUM_CONTRACT_ADDRESS;
      if (!contractAddress) {
        const result = await client.instantiate(account.bech32Address, CODE_ID, instantiateMsg, "superfan-init", "auto");
        contractAddress = result.contractAddress;
      }

      const executeMsg = { update: { value: { proof } } };
      await client.execute(account.bech32Address, contractAddress, executeMsg, "auto");

      // 4️⃣ Update backend user record
      await axios.post(`/api/xion/verify`, { userId, proof, contractAddress });

      Alert.alert("✅ Verified", "XION Dave verification successful!");
      if (onVerified) onVerified();
    } catch (err) {
      console.error("XION verification failed:", err);
      Alert.alert("❌ Verification Failed", err.message || "Check console for details");
    } finally {
      setLoading(false);
    }
  };

  return <Button title={loading ? "Verifying..." : "Verify with XION Dave"} onPress={handleVerify} disabled={loading} />;
}
