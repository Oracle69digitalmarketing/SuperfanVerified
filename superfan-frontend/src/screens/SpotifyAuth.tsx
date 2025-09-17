import React, { useEffect, useState } from 'react';
import { Button, View, Text, Alert, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest, ResponseType } from 'expo-auth-session';
import Constants from 'expo-constants';
import { Buffer } from 'buffer';

WebBrowser.maybeCompleteAuthSession();

const { spotifyClientId, spotifyClientSecret, backendUrl, walletAddress } = Constants.manifest.extra;

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

interface SpotifyAuthProps {
  onVerified: (artistName: string, fullData: any, proof: any, txHash: string) => void;
}

const SpotifyAuth: React.FC<SpotifyAuthProps> = ({ onVerified }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirectUri = Constants.manifest?.scheme
    ? `${Constants.manifest.scheme}://redirect`
    : 'exp://127.0.0.1:8081';

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: spotifyClientId,
      scopes: ['user-top-read'],
      usePKCE: false,
      responseType: ResponseType.Code,
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      const getToken = async () => {
        setLoading(true);
        const base64Auth = Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString('base64');

        try {
          const tokenResponse = await fetch(discovery.tokenEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${base64Auth}`,
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
          });

          const tokenData = await tokenResponse.json();
          if (tokenData.access_token) {
            setAccessToken(tokenData.access_token);
            fetchTopArtist(tokenData.access_token);
          } else {
            throw new Error('No access token returned');
          }
        } catch (error) {
          Alert.alert('Authentication Error', 'Failed to get access token.');
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      getToken();
    }
  }, [response]);

  const fetchTopArtist = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=1', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const topArtistName = data.items[0].name;
        Alert.alert('Top Artist Found', `Your top artist is: ${topArtistName}`);

        // 🔐 Trigger zkTLS proof generation
        const proofResponse = await fetch(`${backendUrl}/generate-proof`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            walletAddress,
            topArtists: data.items.map((artist: any) => artist.name),
            targetArtist: topArtistName,
          }),
        });

        const { proof, txHash } = await proofResponse.json();

        // 🔗 Pass everything back to parent
        onVerified(topArtistName, data, proof, txHash);
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
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : accessToken ? (
        <Text>✅ Spotify Account Connected</Text>
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
