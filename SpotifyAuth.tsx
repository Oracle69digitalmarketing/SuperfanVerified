// SpotifyAuth.tsx
import React, { useEffect, useState } from 'react';
import { Button, View, Text, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest, ResponseType } from 'expo-auth-session';
import Constants from 'expo-constants';
import { Buffer } from 'buffer';

WebBrowser.maybeCompleteAuthSession();

// Get API keys from a secure source
const { spotifyClientId, spotifyClientSecret } = Constants.manifest.extra;

// Use the official Spotify endpoints
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

const SpotifyAuth = ({ onVerified }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: spotifyClientId,
      scopes: ['user-top-read'],
      usePKCE: false,
      responseType: ResponseType.Code,
      redirectUri: 'exp://127.0.0.1:8081',
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      const getToken = async () => {
        const base64Auth = Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64');
        
        try {
          const tokenResponse = await fetch(discovery.tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${base64Auth}`
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=exp://127.0.0.1:8081`,
          });

          const tokenData = await tokenResponse.json();
          if (tokenData.access_token) {
            setAccessToken(tokenData.access_token);
            fetchTopArtist(tokenData.access_token);
          }
        } catch (error) {
          Alert.alert('Authentication Error', 'Failed to get access token.');
          console.error(error);
        }
      };
      getToken();
    }
  }, [response]);

  const fetchTopArtist = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=1', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const topArtistName = data.items[0].name;
        Alert.alert('Top Artist Found', `Your top artist is: ${topArtistName}`);
        onVerified(topArtistName, data); // Pass the full data object and artist name
      } else {
        Alert.alert('No Top Artist', 'Could not find a top artist. You may need to listen to music first.');
      }
    } catch (error) {
      Alert.alert('API Error', 'Failed to fetch top artist data.');
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {accessToken ? (
        <Text>Spotify Account Connected!</Text>
      ) : (
        <Button
          disabled={!request}
          title="Connect with Spotify"
          onPress={() => promptAsync()}
        />
      )}
    </View>
  );
};

export default SpotifyAuth;

