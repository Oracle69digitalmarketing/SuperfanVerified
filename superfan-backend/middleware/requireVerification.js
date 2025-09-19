// middleware/requireVerification.js
const requireVerification = (flag) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (!req.user[flag]) return res.status(403).json({ error: `Verification ${flag} required` });
  next();
};

export default requireVerification;
