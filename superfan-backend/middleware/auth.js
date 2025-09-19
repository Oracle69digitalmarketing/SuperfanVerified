// middleware/auth.js
import User from "../models/User.js";

/**
 * Middleware: require a specific verification flag
 * Example: requireVerification("xionDaveVerified")
 */
export const requireVerification = (flag) => async (req, res, next) => {
  try {
    const user = req.user; // assume passport sets req.user
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    // fetch fresh user data
    const dbUser = await User.findById(user._id);
    if (!dbUser) return res.status(404).json({ error: "User not found" });

    if (!dbUser[flag]) {
      return res.status(403).json({
        error: `Access denied. ${flag} required.`,
      });
    }

    next();
  } catch (err) {
    console.error("Verification middleware error:", err);
    res.status(500).json({ error: "Server error in verification check" });
  }
};

/**
 * Middleware: require minimum fan tier
 * Example: requireFanTier("Silver")
 */
export const requireFanTier = (tier) => async (req, res, next) => {
  try {
    const tierLevels = ["Bronze", "Silver", "Gold", "Legend"];
    const requiredIndex = tierLevels.indexOf(tier);
    if (requiredIndex === -1) throw new Error("Invalid fan tier requirement");

    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const dbUser = await User.findById(user._id);
    if (!dbUser) return res.status(404).json({ error: "User not found" });

    const userIndex = tierLevels.indexOf(dbUser.fanTier);
    if (userIndex < requiredIndex) {
      return res.status(403).json({
        error: `Access denied. Minimum fan tier required: ${tier}`,
      });
    }

    next();
  } catch (err) {
    console.error("Fan tier middleware error:", err);
    res.status(500).json({ error: "Server error in fan tier check" });
  }
};
