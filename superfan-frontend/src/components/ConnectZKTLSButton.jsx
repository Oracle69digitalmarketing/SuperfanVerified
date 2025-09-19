import { useState } from "react";
import { Alert, Button } from "react-native";
import axios from "axios";

export default function ConnectZKTLSButton({ userId, onVerified }) {
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      // 1️⃣ Trigger Reclaim proof flow
      const { data } = await axios.post(`/api/reclaim-verify`, { userId });
      if (!data?.verified) throw new Error("Proof failed. Make sure you complete Reclaim verification.");

      // 2️⃣ Update backend user record
      await axios.post(`/api/zktls/verify`, { userId });

      Alert.alert("✅ Verified", "zkTLS verification successful!");
      if (onVerified) onVerified();
    } catch (err) {
      console.error("zkTLS verification failed:", err);
      Alert.alert("❌ Verification Failed", err.message || "Check console for details");
    } finally {
      setLoading(false);
    }
  };

  return <Button title={loading ? "Verifying..." : "Verify zkTLS"} onPress={handleVerify} disabled={loading} />;
}
