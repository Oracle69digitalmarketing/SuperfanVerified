#!/bin/bash

CHAIN_ID="cosmoshub-4"
NODE="https://rpc.cosmos.network:443"
WALLET="mywallet"
AMOUNT="1000000" # 1 ATOM in uatom
DENOM="uatom"

echo "🚀 Cosmos Staking Dashboard"
echo "🔍 Fetching top validators..."

VALIDATORS=$(gaiad query staking validators --node $NODE --output json | jq -r '.validators[] | "\(.description.moniker) - \(.operator_address)"' | head -n 5)

echo ""
echo "📊 Top Validators:"
IFS=$'\n' read -rd '' -a val_array <<<"$VALIDATORS"
for i in "${!val_array[@]}"; do
  echo "$((i+1)). ${val_array[$i]}"
done

echo ""
read -p "Choose a validator (1-${#val_array[@]}): " choice

if [[ $choice -ge 1 && $choice -le ${#val_array[@]} ]]; then
  VAL_ADDR=$(echo "${val_array[$((choice-1))]}" | awk '{print $NF}')
  echo "✅ Selected: $VAL_ADDR"
  read -p "Confirm staking 1 ATOM? (y/n): " confirm
  if [[ $confirm == "y" ]]; then
    gaiad tx staking delegate $VAL_ADDR $AMOUNT$DENOM \
      --from $WALLET --chain-id $CHAIN_ID --node $NODE --gas auto --gas-adjustment 1.2 --fees 5000$DENOM -y
    echo "🎉 Stake submitted! Check your wallet for confirmation."
  else
    echo "❌ Staking cancelled."
  fi
else
  echo "❌ Invalid choice."
fi
