import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE || 'SuperfanUsers';
const SUPERFAN_SCORES_TABLE = process.env.SUPERFAN_SCORES_TABLE || 'SuperfanScores';

export const getLeaderboard = async (_req, res) => {
  // This function was based on the User model which is now removed.
  // I will implement a simplified version based on the SuperfanScores table.
  try {
    const command = new ScanCommand({
      TableName: SUPERFAN_SCORES_TABLE,
      Limit: 100,
    });
    const { Items } = await docClient.send(command);
    // The items need to be sorted by score
    const sortedItems = Items.sort((a, b) => b.score - a.score);
    res.json(sortedItems);
  } catch (err) {
    console.error('getLeaderboard error:', err);
    res.status(500).json({ error: 'getLeaderboard failed' });
  }
};

export const submitSuperfanScore = async (req, res) => {
  try {
    const { walletAddress, artist, score, proof, txHash } = req.body;

    if (!walletAddress || !artist || typeof score !== 'number')
      return res.status(400).json({ error: 'walletAddress, artist, and score are required' });

    const scoreId = nanoid();
    const scoreEntry = {
      id: scoreId,
      walletAddress,
      artist,
      score,
      proof,
      txHash,
      createdAt: new Date().toISOString(),
    };

    const putScoreCommand = new PutCommand({
      TableName: SUPERFAN_SCORES_TABLE,
      Item: scoreEntry,
    });
    await docClient.send(putScoreCommand);

    // Update user's points
    const getUserCommand = new GetCommand({
      TableName: USERS_TABLE,
      Key: { walletAddress },
    });
    const { Item: user } = await docClient.send(getUserCommand);

    if (user) {
      const updateUserCommand = new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { walletAddress },
        UpdateExpression: "set points = points + :score",
        ExpressionAttributeValues: {
          ":score": score,
        },
        ReturnValues: "ALL_NEW",
      });
      const { Attributes: updatedUser } = await docClient.send(updateUserCommand);
      res.json({ success: true, entry: scoreEntry, user: updatedUser });
    } else {
      const newUser = {
        walletAddress,
        points: score,
        fanTier: 'Bronze', // Default tier
        createdAt: new Date().toISOString(),
      };
      const putUserCommand = new PutCommand({
        TableName: USERS_TABLE,
        Item: newUser,
      });
      await docClient.send(putUserCommand);
      res.json({ success: true, entry: scoreEntry, user: newUser });
    }
  } catch (err) {
    console.error('submitSuperfanScore error:', err);
    res.status(500).json({ error: 'submitSuperfanScore failed' });
  }
};

export const getSuperfanScores = async (_req, res) => {
  try {
    const command = new ScanCommand({
      TableName: SUPERFAN_SCORES_TABLE,
      Limit: 100,
    });
    const { Items } = await docClient.send(command);
    const sortedItems = Items.sort((a, b) => b.score - a.score);

    // The fanTier is now part of the user item, so we need to fetch it.
    // This is inefficient, but for the hackathon it's acceptable.
    const populatedScores = await Promise.all(sortedItems.map(async (score) => {
        const getUserCommand = new GetCommand({
            TableName: USERS_TABLE,
            Key: { walletAddress: score.walletAddress },
        });
        const { Item: user } = await docClient.send(getUserCommand);
        return {
            ...score,
            fanTier: user ? user.fanTier : 'Bronze',
        };
    }));

    res.json(populatedScores);
  } catch (err) {
    console.error('getSuperfanScores error:', err);
    res.status(500).json({ error: 'getSuperfanScores failed' });
  }
};