#!/bin/bash

CHAIN_ID="cosmoshub-4"
NODE="https://rpc.cosmos.network:443"
WALLET="mywallet"
DENOM="uatom"
EXPORT_FILE=""
TESTNET=false
TELEGRAM_ALERT=false

# Optional flags
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --export) EXPORT_FILE="$2"; shift ;;
    --testnet) TESTNET=true ;;
    --notify) TELEGRAM_ALERT=true ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
  shift
done

echo "📅 Timestamp: $(date)"
echo "🗳️ Fetching active governance proposals from $CHAIN_ID..."

PROPOSALS_JSON=$(gaiad query gov proposals --status voting_period --node $NODE --output json 2>/dev/null)

if [ -z "$PROPOSALS_JSON" ] || [ "$(echo "$PROPOSALS_JSON" | jq '.proposals | length')" -eq 0 ]; then
  echo "❌ No active proposals found or failed to fetch."
  exit 1
fi

echo ""
echo "📋 Active Proposals:"
echo "$PROPOSALS_JSON" | jq -r '.proposals[] | 
  "🆔 Proposal ID: \(.proposal_id)\n📄 Title: \(.content.title)\n🗓️ Voting Ends: \(.voting_end_time)\n---"'

# Export to file if requested
if [ -n "$EXPORT_FILE" ]; then
  echo "$PROPOSALS_JSON" | jq '.' > "$EXPORT_FILE"
  echo "📁 Proposals exported to $EXPORT_FILE"
fi

echo ""
read -p "Enter Proposal ID to vote on: " PROPOSAL_ID

# Validate proposal ID exists
VALID_ID=$(echo "$PROPOSALS_JSON" | jq -r --arg id "$PROPOSAL_ID" '.proposals[] | select(.proposal_id == ($id | tonumber)) | .proposal_id')
if [ -z "$VALID_ID" ]; then
  echo "❌ Invalid Proposal ID."
  exit 1
fi

read -p "Enter your vote (yes/no/abstain/no_with_veto): " VOTE

# Validate vote option
case "$VOTE" in
  yes|no|abstain|no_with_veto) ;;
  *) echo "❌ Invalid vote option."; exit 1 ;;
esac

# Show proposal summary
TITLE=$(echo "$PROPOSALS_JSON" | jq -r --arg id "$PROPOSAL_ID" '.proposals[] | select(.proposal_id == ($id | tonumber)) | .content.title')
END_TIME=$(echo "$PROPOSALS_JSON" | jq -r --arg id "$PROPOSAL_ID" '.proposals[] | select(.proposal_id == ($id | tonumber)) | .voting_end_time')

echo ""
echo "📝 Summary:"
echo "Proposal ID: $PROPOSAL_ID"
echo "Title: $TITLE"
echo "Voting Ends: $END_TIME"
echo "Your Vote: $VOTE"

# Optional: Preview current vote tally
echo ""
echo "📊 Current Vote Tally:"
TALLY=$(gaiad query gov tally $PROPOSAL_ID --node $NODE --output json 2>/dev/null)
echo "$TALLY" | jq -r '"👍 Yes: \(.yes)\n👎 No: \(.no)\n🤷 Abstain: \(.abstain)\n🚫 No with Veto: \(.no_with_veto)"'

echo ""
read -p "Confirm and sign transaction? (y/n): " CONFIRM
if [[ "$CONFIRM" == "y" ]]; then
  echo "🔐 Signing vote transaction..."

  if $TESTNET; then
    echo "🧪 Testnet mode enabled. Transaction will not be broadcast."
    echo "gaiad tx gov vote $PROPOSAL_ID $VOTE --from $WALLET --chain-id $CHAIN_ID --node $NODE --dry-run"
  else
    gaiad tx gov vote $PROPOSAL_ID $VOTE \
      --from $WALLET --chain-id $CHAIN_ID --node $NODE \
      --gas auto --gas-adjustment 1.2 --fees 5000$DENOM -y
    echo "✅ Vote submitted! Check your wallet for confirmation."
  fi

  # Optional: Telegram alert stub
  if $TELEGRAM_ALERT; then
    echo "📨 Sending Telegram alert... (stub)"
    # curl -s -X POST "https://api.telegram.org/bot<token>/sendMessage" \
    #   -d chat_id="<chat_id>" -d text="Voted '$VOTE' on Proposal $PROPOSAL_ID: $TITLE"
  fi
else
  echo "❌ Vote cancelled."
fi
