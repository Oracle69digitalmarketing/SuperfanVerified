import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE || 'SuperfanUsers';

export const createUser = async (req, res) => {
  try {
    const { walletAddress, name, referredBy } = req.body;
    if (!walletAddress) {
      return res.status(400).json({ error: 'walletAddress required' });
    }

    const getUserCommand = new GetCommand({
      TableName: USERS_TABLE,
      Key: { walletAddress },
    });
    let { Item: user } = await docClient.send(getUserCommand);

    if (!user) {
      const referralCode = nanoid(8);
      let referrer = null;
      if (referredBy) {
        // This is a simplified query. In a real application, you would need a secondary index on the referralCode.
        const scanCommand = new ScanCommand({
            TableName: USERS_TABLE,
            FilterExpression: "referralCode = :referralCode",
            ExpressionAttributeValues: {
                ":referralCode": referredBy,
            },
        });
        const { Items } = await docClient.send(scanCommand);
        if (Items && Items.length > 0) {
            referrer = Items[0];
        }
      }

      user = {
        walletAddress,
        name,
        referralCode,
        referredBy: referrer ? referrer.walletAddress : null,
        fanStreak: { current: 0, longest: 0, lastScanDate: null },
        fanTier: 'Bronze',
        points: 0,
        rewards: [],
        createdAt: new Date().toISOString(),
      };

      const putUserCommand = new PutCommand({
        TableName: USERS_TABLE,
        Item: user,
      });
      await docClient.send(putUserCommand);

    } else {
      if (name) {
        const updateUserCommand = new UpdateCommand({
            TableName: USERS_TABLE,
            Key: { walletAddress },
            UpdateExpression: "set #name = :name",
            ExpressionAttributeNames: {
                "#name": "name",
            },
            ExpressionAttributeValues: {
                ":name": name,
            },
            ReturnValues: "ALL_NEW",
        });
        const { Attributes } = await docClient.send(updateUserCommand);
        user = Attributes;
      }
    }

    res.json(user);
  } catch (err) {
    console.error('createUser error:', err);
    res.status(500).json({ error: 'createUser failed' });
  }
};

export const listUsers = async (_req, res) => {
  try {
    const command = new ScanCommand({
      TableName: USERS_TABLE,
      Limit: 200,
    });
    const { Items } = await docClient.send(command);
    res.json(Items);
  } catch (err) {
    console.error('listUsers error:', err);
    res.status(500).json({ error: 'listUsers failed' });
  }
};

export const handleUser = async (profile, provider) => {
    try {
        const walletAddress = profile.id;
        const name = profile.displayName || 'Unknown';

        const getUserCommand = new GetCommand({
            TableName: USERS_TABLE,
            Key: { walletAddress },
        });
        let { Item: user } = await docClient.send(getUserCommand);

        if (!user) {
            const referralCode = nanoid(8);
            user = {
                walletAddress,
                name,
                provider,
                providerId: profile.id,
                referralCode,
                fanStreak: { current: 0, longest: 0, lastScanDate: null },
                fanTier: 'Bronze',
                points: 0,
                rewards: [],
                createdAt: new Date().toISOString(),
            };
            const putUserCommand = new PutCommand({
                TableName: USERS_TABLE,
                Item: user,
            });
            await docClient.send(putUserCommand);
        }
        return user;
    } catch (err) {
        console.error(`handleUser error [${provider}]:`, err);
        return null;
    }
};