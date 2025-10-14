import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { signAccessToken } from '../utils/jwt.js';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const REFRESH_TOKENS_TABLE = process.env.REFRESH_TOKENS_TABLE || 'SuperfanRefreshTokens';
const USERS_TABLE = process.env.USERS_TABLE || 'SuperfanUsers';

const daysToMs = (days) => days * 24 * 60 * 60 * 1000;

export const createTokensForUser = async (user) => {
  const accessToken = signAccessToken({ sub: user.walletAddress, provider: user.provider });
  const refreshTokenValue = uuidv4();
  const expiresAt = new Date(
    Date.now() + daysToMs(parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '30'))
  );

  const refreshToken = {
    token: refreshTokenValue,
    userId: user.walletAddress,
    expiresAt: expiresAt.toISOString(),
  };

  const putTokenCommand = new PutCommand({
    TableName: REFRESH_TOKENS_TABLE,
    Item: refreshToken,
  });
  await docClient.send(putTokenCommand);

  return { accessToken, refreshToken: refreshTokenValue, expiresAt };
};

export { createTokensForUser as createToken };

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ success: false, message: 'refreshToken required' });

    const getTokenCommand = new GetCommand({
      TableName: REFRESH_TOKENS_TABLE,
      Key: { token: refreshToken },
    });
    const { Item: storedToken } = await docClient.send(getTokenCommand);

    if (!storedToken || storedToken.revoked)
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    if (new Date() > new Date(storedToken.expiresAt))
      return res.status(401).json({ success: false, message: 'Expired refresh token' });

    // Rotate token
    const newRefreshTokenValue = uuidv4();
    const newExpires = new Date(
      Date.now() + daysToMs(parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '30'))
    );

    const revokeTokenCommand = new UpdateCommand({
        TableName: REFRESH_TOKENS_TABLE,
        Key: { token: refreshToken },
        UpdateExpression: "set revoked = :revoked, replacedBy = :replacedBy",
        ExpressionAttributeValues: {
            ":revoked": true,
            ":replacedBy": newRefreshTokenValue,
        },
    });
    await docClient.send(revokeTokenCommand);

    const newRefreshToken = {
        token: newRefreshTokenValue,
        userId: storedToken.userId,
        expiresAt: newExpires.toISOString(),
    };
    const putTokenCommand = new PutCommand({
        TableName: REFRESH_TOKENS_TABLE,
        Item: newRefreshToken,
    });
    await docClient.send(putTokenCommand);

    const getUserCommand = new GetCommand({
        TableName: USERS_TABLE,
        Key: { walletAddress: storedToken.userId },
    });
    const { Item: user } = await docClient.send(getUserCommand);

    const accessToken = signAccessToken({ sub: user.walletAddress, provider: user.provider });

    return res.json({
      success: true,
      accessToken,
      refreshToken: newRefreshTokenValue,
      expiresAt: newExpires.toISOString(),
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

    const revokeTokenCommand = new UpdateCommand({
        TableName: REFRESH_TOKENS_TABLE,
        Key: { token: refreshToken },
        UpdateExpression: "set revoked = :revoked",
        ExpressionAttributeValues: {
            ":revoked": true,
        },
    });
    await docClient.send(revokeTokenCommand);

    return res.json({ success: true });
  } catch (err) {
    console.error('revoke error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};