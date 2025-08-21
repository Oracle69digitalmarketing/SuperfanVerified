#!/bin/bash

CHAIN_ID="cosmoshub-4"
NODE="https://rpc.cosmos.network:443"
WALLET="mywallet"

echo "🗳️ Fetching active governance proposals..."

PROPOSALS=$(gaiad query gov proposals --status voting_period --node $NODE --output json)

echo ""
echo "📋 Active Proposals:"
echo "$PROPOSALS" | jq -r '.proposals[] | 
  "🆔 Proposal ID: \(.proposal_id)\n📄 Title: \(.content.title)\n🗓️ Voting Ends: \(.voting_end_time)\n---"'

echo ""
read -p "Enter Proposal ID to vote on: " PROPOSAL_ID
read -p "Enter your vote (yes/no/abstain/no_with_veto): " VOTE

echo "🔐 Signing vote transaction..."
gaiad tx gov vote $PROPOSAL_ID $VOTE \
  --from $WALLET --chain-id $CHAIN_ID --node $NODE --gas auto --gas-adjustment 1.2 --fees 5000uatom -y

echo "✅ Vote submitted! Check your wallet for confirmation."
