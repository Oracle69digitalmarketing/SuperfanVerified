import { Alert } from "react-native";
import { getSigningClient } from "@burnt-labs/xion-client";

export const instantiateRUM = async (account, client) => {
  try {
    const instantiateMsg = {
      verification_addr: "xion1qf8jtznwf0tykpg7e65gwafwp47rwxl4x2g2kldvv357s6frcjlsh2m24e",
      claim_key: "followers_count",
    };

    const CODE_ID = 1289; // Testnet RUM contract
    const result = await client.instantiate(
      account?.bech32Address,
      CODE_ID,
      instantiateMsg,
      "superfan-init",
      "auto"
    );

    console.log("RUM contract instantiated:", result);
    Alert.alert("✅ Success", "RUM contract instantiated!");
    return result.contractAddress;
  } catch (error) {
    console.error("❌ RUM instantiation error:", error);
    throw error;
  }
};

export const submitProofToRUM = async (account, client, proof) => {
  try {
    const executeMsg = { update: { value: { proof } } };

    const result = await client.execute(
      account?.bech32Address,
      process.env.EXPO_PUBLIC_RUM_CONTRACT_ADDRESS,
      executeMsg,
      "auto"
    );

    console.log("Proof submitted:", result);
    return result;
  } catch (error) {
    console.error("❌ Proof submission failed:", error);
    throw error;
  }
};
