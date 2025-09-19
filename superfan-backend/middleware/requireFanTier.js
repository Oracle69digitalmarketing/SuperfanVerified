// middleware/requireFanTier.js
const tiers = ["Bronze", "Silver", "Gold", "Legend"];

const requireFanTier = (minTier) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const userTierIndex = tiers.indexOf(req.user.fanTier);
  const minTierIndex = tiers.indexOf(minTier);

  if (userTierIndex < minTierIndex) {
    return res.status(403).json({ error: `Requires ${minTier} tier or higher` });
  }

  next();
};

export default requireFanTier;
