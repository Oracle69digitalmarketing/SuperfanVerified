import React, { useState } from "react";
import { Button, Alert } from "react-native";
import { getSigningClient } from "@burnt-labs/xion-client";
import { submitProofToRUM } from "../services/xionService";

export default function ConnectXionDaveButton({ userId, onVerified }) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const client = await getSigningClient();
      // Fetch zkTLS proof from backend
      const proofRes = await fetch(`/api/proof/${userId}`);
      const proofData = await proofRes.json();

      await submitProofToRUM(client.accounts[0], client, proofData.proof);

      Alert.alert("✅ Verified with XION Dave!");
      onVerified();
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return <Button title={loading ? "Verifying..." : "Verify with XION Dave"} onPress={handleVerify} />;
}
