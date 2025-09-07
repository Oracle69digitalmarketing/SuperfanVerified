#!/bin/bash

CHAIN_ID="cosmoshub-4"
NODE="https://rpc.cosmos.network:443"
TOP_N=3
EXPORT_FILE=""
USE_FZF=false

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --top) TOP_N="$2"; shift ;;
    --export) EXPORT_FILE="$2"; shift ;;
    --fzf) USE_FZF=true ;;
    *) echo "❌ Unknown option: $1"; exit 1 ;;
  esac
  shift
done

echo "📅 Timestamp: $(date)"
echo "🔗 Chain: $CHAIN_ID"
echo "📊 Fetching validator analytics..."

VALIDATORS=$(gaiad query staking validators --node $NODE --output json 2>/dev/null)

if [ -z "$VALIDATORS" ]; then
  echo "❌ Failed to fetch validators. Check gaiad installation or network."
  exit 1
fi

TOTAL=$(echo "$VALIDATORS" | jq '.validators | length')
echo "✅ Total Validators: $TOTAL"
echo ""

echo "🔍 Top $TOP_N Validators by Total Staked:"
OUTPUT=$(echo "$VALIDATORS" | jq -r --argjson n "$TOP_N" '
  .validators | sort_by(.tokens | tonumber) | reverse | .[:$n][] |
  [.description.moniker, .operator_address, .commission.commission_rates.rate, .tokens, .status] |
  @tsv
')

# Format output
echo -e "Moniker\tAddress\tCommission\tStaked\tStatus" > /tmp/validators.txt
echo "$OUTPUT" >> /tmp/validators.txt
column -t -s $'\t' /tmp/validators.txt

# Export to file if requested
if [ -n "$EXPORT_FILE" ]; then
  cp /tmp/validators.txt "$EXPORT_FILE"
  echo "📁 Exported to $EXPORT_FILE"
fi

# Interactive search
if $USE_FZF; then
  echo ""
  echo "🔎 Launching interactive search..."
  cat /tmp/validators.txt | fzf
fi
