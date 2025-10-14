import React, { useEffect, useState } from 'react';
import { Button, View, Text, Alert, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useAuthRequest, ResponseType } from 'expo-auth-session';
import Constants from 'expo-constants';
import { Buffer } from 'buffer';
import { useWallet } from './WalletProvider';

WebBrowser.maybeCompleteAuthSession();

const { spotifyClientId, spotifyClientSecret, backendUrl } = Constants.manifest.extra;

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

interface SpotifyAuthProps {
  onVerified: (artistName: string, fullData: any, proof: any, txHash: string) => void;
}

/**
 * @summary Handles the Spotify authentication and proof generation process.
 * @description This component guides the user through the Spotify OAuth flow, fetches their
 * top artist, generates a zkTLS proof of this data using the XION SDK, and submits the
 * proof to the XION blockchain.
 */
const SpotifyAuth: React.FC<SpotifyAuthProps> = ({ onVerified }) => {
  const { account, xionClient } = useWallet();
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
            fetchTopArtistAndProve(tokenData.access_token);
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

  /**
   * @summary Fetches the user's top artist, generates a proof, and submits it on-chain.
   * @description This function is called after a successful Spotify login. It fetches the user's
   * top artist from the Spotify API, generates a zkTLS proof of this data, and then submits
   * the proof to a smart contract on the XION blockchain.
   */
  const fetchTopArtistAndProve = async (token: string) => {
    if (!account || !xionClient) {
      Alert.alert('Wallet Not Connected', 'Please connect your wallet first.');
      return;
    }

    setLoading(true);
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

        // 1. Generate zkTLS proof using the XION SDK
        // This is a hypothetical function. The actual implementation will depend on the XION SDK's API.
        const proof = await xionClient.zk.tls.generateProof({
          url: 'https://api.spotify.com/v1/me/top/artists?limit=1',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Define the part of the response to prove
          proofData: {
            type: 'json',
            path: 'items[0].name',
          },
        });

        // 2. Submit the proof to the RUM contract
        const executeMsg = { update: { value: { proof } } };
        const result = await xionClient.execute(
          account?.bech32Address,
          process.env.EXPO_PUBLIC_RUM_CONTRACT_ADDRESS,
          executeMsg,
          "auto"
        );

        // 3. Pass everything back to parent
        onVerified(topArtistName, data, proof, result.transactionHash);
      } else {
        Alert.alert('No Top Artist', 'Could not find a top artist.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch top artist or generate proof.');
      console.error(error);
    } finally {
      setLoading(false);
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
          disabled={!request || !account}
          title={account ? "Connect with Spotify" : "Please Login First"}
          onPress={() => promptAsync()}
        />
      )}
    </View>
  );
};

export default SpotifyAuth;