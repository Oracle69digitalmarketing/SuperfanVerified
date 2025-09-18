import { instantiateRUM, submitProofToRUM } from "@burnt-labs/xion-client-wrapper";

export const pushProofToXion = async (user, proof) => {
  const client = await getSigningClient();
  const account = { bech32Address: user.walletAddress };
  return await submitProofToRUM(account, client, proof);
};
