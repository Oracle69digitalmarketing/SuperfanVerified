#!/bin/bash
# Script to create EAS secrets for SuperfanVerified frontend

# RUM contract address
eas secret:create \
  --name EXPO_PUBLIC_RUM_CONTRACT_ADDRESS \
  --value xion1qf8jtznwf0tykpg7e65gwafwp47rwxl4x2g2kldvv357s6frcjlsh2m24e

# Spotify client ID
eas secret:create \
  --name EXPO_PUBLIC_SPOTIFY_CLIENT_ID \
  --value <your-client-id>

# Spotify client secret
eas secret:create \
  --name EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET \
  --value <your-client-secret>
