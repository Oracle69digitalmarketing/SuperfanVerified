import User from "../models/User.js";

/**
 * Mark user as XION Dave verified
 */
export const verifyXionDave = async (req, res) => {
  try {
    const { userId, proof, contractAddress } = req.body;
    if (!userId || !proof) return res.status(400).json({ error: "Missing parameters" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.xionDaveVerified = true;
    user.daveProofId = proof;
    user.rumContractAddress = contractAddress;
    await user.save();

    res.json({ success: true, message: "XION Dave verified" });
  } catch (err) {
    console.error("verifyXionDave error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};

/**
 * Mark user as zkTLS verified
 */
export const verifyZKTLS = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.zktlsVerified = true;
    await user.save();

    res.json({ success: true, message: "zkTLS verified" });
  } catch (err) {
    console.error("verifyZKTLS error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};
