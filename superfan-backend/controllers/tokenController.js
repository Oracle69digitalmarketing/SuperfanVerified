// controllers/tokenController.js
import { v4 as uuidv4 } from 'uuid';
import RefreshToken from '../models/RefreshToken.js';
import User from '../models/User.js';
import { signAccessToken } from '../utils/jwt.js';

const daysToMs = (days) => days * 24 * 60 * 60 * 1000;

export const createTokensForUser = async (user) => {
  const accessToken = signAccessToken({ sub: user._id, provider: user.provider });
  const refreshTokenValue = uuidv4();
  const expiresAt = new Date(
    Date.now() + daysToMs(parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '30'))
  );

  const r = await RefreshToken.create({ token: refreshTokenValue, user: user._id, expiresAt });
  return { accessToken, refreshToken: r.token, expiresAt };
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ success: false, message: 'refreshToken required' });

    const stored = await RefreshToken.findOne({ token: refreshToken }).populate('user');
    if (!stored || stored.revoked)
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    if (new Date() > stored.expiresAt)
      return res.status(401).json({ success: false, message: 'Expired refresh token' });

    // rotate: create new refresh token, revoke old
    const newRefreshValue = uuidv4();
    const newExpires = new Date(
      Date.now() + daysToMs(parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '30'))
    );

    stored.revoked = true;
    stored.replacedBy = newRefreshValue;
    await stored.save();

    const newStored = await RefreshToken.create({
      token: newRefreshValue,
      user: stored.user._id,
      expiresAt: newExpires
    });

    const accessToken = signAccessToken({ sub: stored.user._id, provider: stored.user.provider });

    return res.json({
      success: true,
      accessToken,
      refreshToken: newStored.token,
      expiresAt: newStored.expiresAt
    });
  } catch (err) {
    console.error('refresh error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const revoke = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ success: false, message: 'refreshToken required' });

    const stored = await RefreshToken.findOne({ token: refreshToken });
    if (stored) {
      stored.revoked = true;
      await stored.save();
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('revoke error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
