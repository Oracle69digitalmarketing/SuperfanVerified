// MainApp.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import { useAbstraxionAccount, Abstraxion, useAbstraxionSigningClient } from '@burnt-labs/abstraxion-react-native';
import SpotifyAuth from './SpotifyAuth';

const MainApp = () => {
  const { account, isConnected, isConnecting } = useAbstraxionAccount();
  const { client } = useAbstraxionSigningClient(); 
  const [isSpotifyVerified, setIsSpotifyVerified] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleWalletAction = () => {
    // This function will be handled by the Abstraxion component itself
    // You can add any pre-logic here if needed
  };

  const handleSpotifyVerification = (topArtistName, spotifyData) => {
    setIsSpotifyVerified(true);
    // You can perform the zkTLS logic here
    createVerificationTransaction(topArtistName, spotifyData);
  };

  const createVerificationTransaction = async (artist, spotifyData) => {
    if (!client || !account) {
      Alert.alert('Error', 'Wallet client not available.');
      return;
    }

    try {
      // Step 1: Placeholder for zkTLS proof generation
      // The SDK function will take the raw data and a 'statement' to prove.
      const statement = `My top artist is: ${artist}`;
      console.log(`Generating a zero-knowledge proof for: ${statement}`);

      // The exact SDK functions for zkTLS are subject to change.
      // This is the logical flow you will follow:
      // const { proof, publicSignals } = await createZkTlsProof({
      //   statement: statement,
      //   data: spotifyData,
      // });

      // Step 2: Create a transaction message with the proof
      // const message = encodeVerificationMessage({
      //   proof,
      //   publicSignals
      // });
      
      // Step 3: Use a temporary message to simulate the transaction
      const temporaryMessage = {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          fromAddress: account.address,
          toAddress: 'xion1234... (a testnet address)',
          amount: [{
            denom: 'uxion',
            amount: '1000',
          }],
        },
      };

      // Step 4: Sign and broadcast the transaction
      const response = await client.signAndBroadcast(account.address, [temporaryMessage], 'auto');
      console.log('Verification Transaction Sent:', response);
      setVerificationResult(response);
      Alert.alert('Success', `Transaction Hash: ${response.transactionHash}`);

    } catch (error) {
      console.error('Transaction Failed:', error);
      Alert.alert('Transaction Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Abstraxion />
      {isConnecting ? (
        <Text style={styles.title}>Connecting...</Text>
      ) : isConnected ? (
        isSpotifyVerified ? (
          <View>
            <Text>Spotify Verified.</Text>
            {verificationResult ? (
              <Text style={styles.resultText}>Transaction Successful!</Text>
            ) : (
              <Text style={styles.loadingText}>Generating on-chain proof...</Text>
            )}
          </View>
        ) : (
          <SpotifyAuth onVerified={handleSpotifyVerification} />
        )
      ) : (
        <>
          <Text style={styles.title}>Welcome to Superfan Verified</Text>
          <Button title="Create My Superfan Wallet" onPress={handleWalletAction} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultText: {
    marginTop: 20,
    color: 'green',
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 20,
    color: 'gray',
  }
});

export default MainApp;


