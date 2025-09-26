import express from "express";
import { OAuthService } from "../services/oauthService.js";
import { oauthProviders } from "../config/oauthProviders.js";

const router = express.Router();

/**
 * Dynamic OAuth callback
 * POST /auth/:provider/callback { code }
 */
router.post("/:provider/callback", async (req, res) => {
  try {
    const { provider } = req.params;
    const { code } = req.body;

    if (!oauthProviders[provider]) {
      return res.status(400).json({ error: `Unsupported provider: ${provider}` });
    }

    const oauth = new OAuthService(oauthProviders[provider]);
    const result = await oauth.authenticate(code);

    res.json(result);
  } catch (err) {
    console.error(`❌ ${req.params.provider} OAuth failed:`, err.response?.data || err.message);
    res.status(500).json({ error: "OAuth flow failed" });
  }
});

export default router;
