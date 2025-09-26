#!/bin/bash

# ---- Spotify ----
eas secret:create --name EXPO_PUBLIC_SPOTIFY_CLIENT_ID --value 46fff09224634943846be66c31394555

# ---- Google ----
eas secret:create --name EXPO_PUBLIC_GOOGLE_CLIENT_ID --value 172315192975-t9i7cormbb7ulmgcb99i3jdmrkgphc1g.apps.googleusercontent.com

# ---- Facebook ----
eas secret:create --name EXPO_PUBLIC_FACEBOOK_APP_ID --value 1364017365148309

# ---- Twitter ----
eas secret:create --name EXPO_PUBLIC_TWITTER_CONSUMER_KEY --value LuP7Hcre4Wn3xVfdxQmlUKk0N

# ---- Reclaim Provider ----
eas secret:create --name EXPO_PUBLIC_RECLAIM_PROVIDER_ID --value 0xE11e72D9D5f0593304CfD7D2feF95Ab54d245ae4
