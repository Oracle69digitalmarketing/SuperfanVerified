#!/bin/bash

# ====== Superfan Backend Launcher ======

# 1. Check if ngrok is running
NGROK_TUNNEL=$(curl --silent http://127.0.0.1:4040/api/tunnels | grep -Po '"public_url":"\Khttps://[^"]+')

if [ -z "$NGROK_TUNNEL" ]; then
    echo "Ngrok is not running. Please start ngrok first:"
    echo "  ngrok http 5000"
    exit 1
fi

echo "Detected ngrok URL: $NGROK_TUNNEL"

# 2. Update .env with the current ngrok URL
sed -i "s|SPOTIFY_CALLBACK_URL=.*|SPOTIFY_CALLBACK_URL=${NGROK_TUNNEL}/auth/spotify/callback|" .env
sed -i "s|GOOGLE_CALLBACK_URL=.*|GOOGLE_CALLBACK_URL=${NGROK_TUNNEL}/auth/google/callback|" .env
sed -i "s|FACEBOOK_CALLBACK_URL=.*|FACEBOOK_CALLBACK_URL=${NGROK_TUNNEL}/auth/facebook/callback|" .env
sed -i "s|TWITTER_CALLBACK_URL=.*|TWITTER_CALLBACK_URL=${NGROK_TUNNEL}/auth/twitter/callback|" .env

echo ".env file updated with latest ngrok URLs."

# 3. Start the backend
echo "Starting Superfan backend..."
node app.js
