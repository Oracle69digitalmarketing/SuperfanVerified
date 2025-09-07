#!/bin/bash

CHAIN_ID="cosmoshub-4"
NODE="https://rpc.cosmos.network:443"
WALLET="mywallet"
DENOM="uatom"
AMOUNT="1000000" # 1 ATOM

function list_validators() {
  echo -e "\n📊 Top Validators:"
  VALIDATORS_JSON=$(gaiad query staking validators --node $NODE --output json)
  VALIDATORS=$(echo "$VALIDATORS_JSON" | jq -r '.validators[] | "\(.description.moniker) - \(.operator_address)"' | head -n 5)
  IFS=$'\n' read -rd '' -a val_array <<<"$VALIDATORS"
  for i in "${!val_array[@]}"; do
    echo "$((i+1)). ${val_array[$i]}"
  done
  echo ""
}

function delegate() {
  list_validators
  read -p "Choose a validator (1-${#val_array[@]}): " choice
  if [[ $choice -ge 1 && $choice -le ${#val_array[@]} ]]; then
    VALADDR=$(echo "${val_array[$((choice-1))]}" | awk '{print $NF}')
    MONIKER=$(echo "${val_array[$((choice-1))]}" | awk -F ' - ' '{print $1}')
    echo -e "\n✅ Selected: $MONIKER ($VALADDR)"
    read -p "Confirm staking 1 ATOM? (y/n): " confirm
    if [[ $confirm == "y" ]]; then
      gaiad tx staking delegate $VALADDR $AMOUNT$DENOM \
        --from $WALLET --chain-id $CHAIN_ID --node $NODE \
        --gas auto --gas-adjustment 1.2 --fees 5000$DENOM -y
      echo -e "\n🎉 Stake submitted!"
    else
      echo "❌ Staking cancelled."
    fi
  else
    echo "❌ Invalid choice."
  fi
}

function redelegate() {
  read -p "Enter source validator address: " SRC
  read -p "Enter destination validator address: " DST
  gaiad tx staking redelegate $SRC $DST $AMOUNT$DENOM \
    --from $WALLET --chain-id $CHAIN_ID --node $NODE \
    --gas auto --gas-adjustment 1.2 --fees 5000$DENOM -y
  echo -e "\n🔁 Redelegation submitted!"
}

function unstake() {
  read -p "Enter validator address to unstake from: " VAL
  gaiad tx staking undelegate $VAL $AMOUNT$DENOM \
    --from $WALLET --chain-id $CHAIN_ID --node $NODE \
    --gas auto --gas-adjustment 1.2 --fees 5000$DENOM -y
  echo -e "\n🧹 Unstaking submitted!"
}

function help_menu() {
  echo -e "\n🛠 Cosmos CLI Staking Tool"
  echo "Usage: ./cosmos.sh [command]"
  echo ""
  echo "Commands:"
  echo "  --list         List top validators"
  echo "  --delegate     Delegate 1 ATOM to a validator"
  echo "  --redelegate   Redelegate 1 ATOM to another validator"
  echo "  --unstake      Unstake 1 ATOM from a validator"
  echo "  --help         Show this help menu"
  echo ""
}

# Entry point
case "$1" in
  --list) list_validators ;;
  --delegate) delegate ;;
  --redelegate) redelegate ;;
  --unstake) unstake ;;
  --help|*) help_menu ;;
esac
