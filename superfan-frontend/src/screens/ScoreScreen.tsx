import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Image, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const XION_EXPLORER_URL = 'https://testnet.xion.explorers.guru/transaction'; // Example explorer URL

const ScoreScreen = () => {
  const route = useRoute();
  const { artistName, proof, txHash, walletAddress } = route.params as {
    artistName: string;
    proof: any;
    txHash: string;
    walletAddress: string;
  };

  const superfanScore = proof.valid ? 100 : 0;
  const nftImageUrl = `https://source.unsplash.com/500x500/?${encodeURIComponent(artistName)}`; // Placeholder for the NFT image

  useEffect(() => {
    if (walletAddress && artistName && typeof superfanScore === 'number') {
      fetch(`${API_URL}/leaderboard/submit-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          artist: artistName,
          score: superfanScore,
        }),
      }).catch(err => console.error('❌ Score submission failed:', err));
    }
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎧 I'm a verified ${artistName} superfan with a score of ${superfanScore}! Check out my on-chain proof: ${XION_EXPLORER_URL}/${txHash}`,
      });
    } catch (error) {
      console.error('❌ Share failed:', error);
    }
  };

  const handleViewTransaction = () => {
    Linking.openURL(`${XION_EXPLORER_URL}/${txHash}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Verification Complete!</Text>
      
      <View style={styles.nftContainer}>
        <Image source={{ uri: nftImageUrl }} style={styles.nftImage} />
        <Text style={styles.nftTitle}>Superfan Badge: {artistName}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Artist: <Text style={styles.value}>{artistName}</Text></Text>
        <Text style={styles.label}>Superfan Score: <Text style={styles.value}>{superfanScore}</Text></Text>
        <Text style={styles.label}>zkTLS Proof: <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{proof.zkProof}</Text></Text>
        <TouchableOpacity onPress={handleViewTransaction}>
          <Text style={styles.label}>Transaction: <Text style={[styles.value, styles.link]}>{txHash}</Text></Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share Your Badge</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: 20,
  },
  nftContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#1e293b',
    borderRadius: 15,
    padding: 20,
    width: '100%',
  },
  nftImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  nftTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  detailsContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 10,
  },
  value: {
    color: '#f8fafc',
    fontWeight: '600',
  },
  link: {
    color: '#facc15',
    textDecorationLine: 'underline',
  },
  shareButton: {
    backgroundColor: '#facc15',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  shareButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScoreScreen;