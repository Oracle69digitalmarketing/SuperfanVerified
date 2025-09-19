// middleware/requireAdmin.js
import requireAuth from "./requireAuth.js";

const requireAdmin = (req, res, next) => {
  // First ensure the user is authenticated
  requireAuth(req, res, () => {
    // Then check if user is admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
};

export default requireAdmin;
