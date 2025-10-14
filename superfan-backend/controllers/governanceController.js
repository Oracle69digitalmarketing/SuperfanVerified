import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { nanoid } from "nanoid";

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

const USERS_TABLE = process.env.USERS_TABLE || 'SuperfanUsers';
const PROPOSALS_TABLE = process.env.PROPOSALS_TABLE || 'SuperfanProposals';

// Mock functions for XION interaction
const createProposalOnXion = async (title, description) => {
  console.log(`--- SIMULATING PROPOSAL CREATION ON XION ---`);
  console.log(`Title: ${title}`);
  console.log(`Description: ${description}`);
  console.log(`------------------------------------------`);
  return `prop_${Math.random().toString(36).slice(2)}`;
};

const voteOnXion = async (proposalId, vote) => {
  console.log(`--- SIMULATING VOTE ON XION ---`);
  console.log(`Proposal ID: ${proposalId}`);
  console.log(`Vote: ${vote}`);
  console.log(`-----------------------------`);
  return `tx_${Math.random().toString(36).slice(2)}`;
};

export const createProposal = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { walletAddress } = req.user;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const getUserCommand = new GetCommand({
      TableName: USERS_TABLE,
      Key: { walletAddress },
    });
    const { Item: user } = await docClient.send(getUserCommand);

    if (!user || user.fanTier !== 'Legend') {
      return res.status(403).json({ error: 'Only Legend tier fans can create proposals' });
    }

    const proposalIdOnChain = await createProposalOnXion(title, description);
    const proposalId = nanoid();
    const newProposal = {
      id: proposalId,
      title,
      description,
      proposer: walletAddress,
      proposalIdOnChain,
      yesVotes: 0,
      noVotes: 0,
      voters: [],
      createdAt: new Date().toISOString(),
    };

    const putProposalCommand = new PutCommand({
      TableName: PROPOSALS_TABLE,
      Item: newProposal,
    });
    await docClient.send(putProposalCommand);

    res.json({ success: true, proposal: newProposal });
  } catch (err) {
    console.error('createProposal error:', err);
    res.status(500).json({ error: 'Failed to create proposal' });
  }
};

export const getProposals = async (req, res) => {
  try {
    const command = new ScanCommand({
      TableName: PROPOSALS_TABLE,
    });
    const { Items } = await docClient.send(command);
    res.json(Items);
  } catch (err) {
    console.error('getProposals error:', err);
    res.status(500).json({ error: 'Failed to get proposals' });
  }
};

export const voteOnProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { vote } = req.body;
    const { walletAddress } = req.user;

    if (typeof vote !== 'boolean') {
      return res.status(400).json({ error: 'Vote must be a boolean' });
    }

    const getProposalCommand = new GetCommand({
      TableName: PROPOSALS_TABLE,
      Key: { id },
    });
    const { Item: proposal } = await docClient.send(getProposalCommand);

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' });
    }

    if (proposal.voters && proposal.voters.includes(walletAddress)) {
        return res.status(400).json({ error: 'You have already voted on this proposal' });
    }

    const txHash = await voteOnXion(proposal.proposalIdOnChain, vote);

    const updateExpression = vote ? "set yesVotes = yesVotes + :val" : "set noVotes = noVotes + :val";
    const addVoterExpression = "set #voters = list_append(if_not_exists(#voters, :empty_list), :voter)";

    const updateUserCommand = new UpdateCommand({
        TableName: PROPOSALS_TABLE,
        Key: { id },
        UpdateExpression: `${updateExpression}, ${addVoterExpression}`,
        ExpressionAttributeNames: {
            "#voters": "voters",
        },
        ExpressionAttributeValues: {
            ":val": 1,
            ":voter": [walletAddress],
            ":empty_list": [],
        },
        ReturnValues: "ALL_NEW",
    });

    const { Attributes: updatedProposal } = await docClient.send(updateUserCommand);

    res.json({ success: true, proposal: updatedProposal });
  } catch (err) {
    console.error('voteOnProposal error:', err);
    res.status(500).json({ error: 'Failed to vote on proposal' });
  }
};