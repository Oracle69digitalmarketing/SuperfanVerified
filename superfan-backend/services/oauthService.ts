import axios from "axios";
import jwt from "jsonwebtoken";

/**
 * Generic OAuth service for Superfan
 */
export class OAuthService {
  constructor(config) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.tokenUrl = config.tokenUrl;
    this.profileUrl = config.profileUrl;
    this.scope = config.scope || "";
    this.provider = config.provider;
  }

  async getTokens(code) {
    const payload = {
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: "authorization_code",
    };

    const res = await axios.post(
      this.tokenUrl,
      new URLSearchParams(payload).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return res.data; // { access_token, refresh_token, expires_in, ... }
  }

  async getProfile(accessToken) {
    const res = await axios.get(this.profileUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.data;
  }

  generateJWT(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        provider: this.provider,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  async authenticate(code) {
    const tokens = await this.getTokens(code);
    const profile = await this.getProfile(tokens.access_token);

    // TODO: upsert user into DB
    const user = {
      id: profile.id || profile.sub,
      email: profile.email || null,
      name: profile.name || profile.display_name,
    };

    const jwtToken = this.generateJWT(user);

    return { user, jwtToken, provider: this.provider };
  }
}
