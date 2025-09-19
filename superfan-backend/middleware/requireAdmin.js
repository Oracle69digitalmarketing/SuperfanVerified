// middleware/requireAdmin.js
import requireAuth from "./requireAuth.js";

const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
};

export default requireAdmin;
