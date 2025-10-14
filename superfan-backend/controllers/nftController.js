import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { generateAiArt, uploadToIpfs } from '../services/aiArtService.js';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE || 'SuperfanUsers';

// This is a mock function to simulate the interaction with the XION blockchain.
const mintOnXion = async (owner, tokenId, tokenUri) => {
  console.log(`--- SIMULATING NFT MINT ON XION ---`);
  console.log(`Owner: ${owner}`);
  console.log(`Token ID: ${tokenId}`);
  console.log(`Token URI: ${tokenUri}`);
  console.log(`---------------------------------`);
  return `tx_${Math.random().toString(36).slice(2)}`;
};

export const mintNFT = async (req, res) => {
  try {
    const { walletAddress, tier, artist } = req.body;

    if (!walletAddress || !tier || !artist) {
      return res.status(400).json({ error: 'walletAddress, tier, and artist are required' });
    }

    const getUserCommand = new GetCommand({
      TableName: USERS_TABLE,
      Key: { walletAddress },
    });
    const { Item: user } = await docClient.send(getUserCommand);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.rewards && user.rewards.includes(`NFT-Badge-${tier}`)) {
      return res.status(400).json({ error: `You have already minted the ${tier} badge` });
    }

    // 1. Generate AI Art
    const artPrompt = `A futuristic, abstract piece of digital art inspired by the music of ${artist}`;
    const imageUrl = await generateAiArt(artPrompt);

    // 2. Upload to IPFS (simulated)
    const imageIpfsHash = await uploadToIpfs(imageUrl);

    // 3. Create NFT Metadata
    const metadata = {
      name: `Superfan Badge - ${tier}`,
      description: `A unique badge awarded to ${user.name || walletAddress} for their dedication to ${artist}.`,
      image: imageIpfsHash,
      attributes: [
        { trait_type: 'Tier', value: tier },
        { trait_type: 'Artist', value: artist },
      ],
    };

    // 4. Upload metadata to IPFS (simulated)
    const metadataIpfsHash = await uploadToIpfs(JSON.stringify(metadata));

    // 5. Mint the NFT
    const tokenId = `${tier}-${user.walletAddress}`;
    const txHash = await mintOnXion(walletAddress, tokenId, metadataIpfsHash);

    // 6. Add the badge to the user's rewards
    const updateUserCommand = new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { walletAddress },
        UpdateExpression: "set #rewards = list_append(if_not_exists(#rewards, :empty_list), :reward)",
        ExpressionAttributeNames: {
            "#rewards": "rewards",
        },
        ExpressionAttributeValues: {
            ":reward": [`NFT-Badge-${tier}`],
            ":empty_list": [],
        },
    });
    await docClient.send(updateUserCommand);

    res.json({ success: true, txHash, tokenUri: metadataIpfsHash });
  } catch (err) {
    console.error('mintNFT error:', err);
    res.status(500).json({ error: 'NFT minting failed' });
  }
};