#!/bin/bash

CHAIN_ID="cosmoshub-4"
NODE="https://rpc.cosmos.network:443"

echo "📊 Fetching validator analytics..."
VALIDATORS=$(gaiad query staking validators --node $NODE --output json)

echo ""
echo "🔍 Top 3 Validators:"
echo "$VALIDATORS" | jq -r '.validators[:3][] | 
  "🧑‍💼 \(.description.moniker)\n🔗 Address: \(.operator_address)\n💰 Commission: \(.commission.commission_rates.rate)\n📦 Total Staked: \(.tokens)\n🚦 Status: \(.status)\n---"'
