// src/components/WalletConnectButton.tsx
import React, { useState } from "react";
import { View, Button, Text, Alert } from "react-native";
import { useAbstraxion } from "@burnt-labs/abstraxion-react-native";
import axios from "axios";

export default function WalletConnectButton({ userId, onVerified }) {
  const { address, login, logout, client } = useAbstraxion();
  const [loading, setLoading] = useState(false);

  const handleXionVerify = async () => {
    if (!client || !address) return Alert.alert("Wallet not connected");
    setLoading(true);
    try {
      // 1️⃣ Fetch latest proof
      const { data: proofRes } = await axios.get(`/api/reclaim-proof/${userId}`);
      const proof = proofRes?.proof;
      if (!proof) throw new Error("No proof available. Complete Reclaim first.");

      // 2️⃣ Instantiate contract (if not exists)
      const CODE_ID = 1289; // XION RUM testnet contract
      const instantiateMsg = {
        verification_addr: process.env.EXPO_PUBLIC_RECLAIM_PROVIDER_ID,
        claim_key: "followers_count",
      };

      let contractAddress = process.env.EXPO_PUBLIC_RUM_CONTRACT_ADDRESS;
      if (!contractAddress) {
        const result = await client.instantiate(
          address,
          CODE_ID,
          instantiateMsg,
          "superfan-init",
          "auto"
        );
        contractAddress = result.contractAddress;
      }

      // 3️⃣ Execute update
      const executeMsg = { update: { value: { proof } } };
      await client.execute(address, contractAddress, executeMsg, "auto");

      // 4️⃣ Update backend
      await axios.post(`/api/xion/verify`, { userId, proof, contractAddress });

      Alert.alert("✅ Verified", "XION Dave verification successful!");
      if (onVerified) onVerified();
    } catch (err) {
      console.error("XION verification failed:", err);
      Alert.alert("❌ Verification Failed", err.message || "Check console");
    } finally {
      setLoading(false);
    }
  };

  const handleZkTlsVerify = async () => {
    setLoading(true);
    try {
      // 1️⃣ Trigger Reclaim proof
      const { data } = await axios.post(`/api/reclaim-verify`, { userId });
      if (!data?.verified) throw new Error("Proof failed. Complete Reclaim first.");

      // 2️⃣ Update backend
      await axios.post(`/api/zktls/verify`, { userId });

      Alert.alert("✅ Verified", "zkTLS verification successful!");
      if (onVerified) onVerified();
    } catch (err) {
      console.error("zkTLS verification failed:", err);
      Alert.alert("❌ Verification Failed", err.message || "Check console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {!address ? (
        <Button title="Connect Wallet" onPress={login} />
      ) : (
        <>
          <Text style={{ marginBottom: 8 }}>Wallet: {address}</Text>
          <Button title="Disconnect" onPress={logout} />

          {/* Verification options */}
          <View style={{ marginTop: 12 }}>
            <Button
              title={loading ? "Verifying XION..." : "Verify with XION Dave"}
              onPress={handleXionVerify}
              disabled={loading}
            />
          </View>
          <View style={{ marginTop: 12 }}>
            <Button
              title={loading ? "Verifying zkTLS..." : "Verify with zkTLS"}
              onPress={handleZkTlsVerify}
              disabled={loading}
            />
          </View>
        </>
      )}
    </View>
  );
}
