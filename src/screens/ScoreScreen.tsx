import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const ScoreScreen = () => {
  const route = useRoute();
  const { artistName, proof, txHash, walletAddress } = route.params as {
    artistName: string;
    proof: any;
    txHash: string;
    walletAddress: string;
  };

  const superfanScore = proof.valid ? 100 : 0;

  useEffect(() => {
    if (walletAddress && artistName && typeof superfanScore === 'number') {
      fetch(`${API_URL}/leaderboard/submit`, {
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
        message: `🎧 I'm a verified ${artistName} superfan with a score of ${superfanScore}! zkTLS proof: ${proof.zkProof}`,
      });
    } catch (error) {
      console.error('❌ Share failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Superfan Score</Text>
      <Text style={styles.label}>Artist: {artistName}</Text>
      <Text style={styles.label}>Score: {superfanScore}</Text>
      <Text style={styles.label}>zkTLS Proof: {proof.zkProof}</Text>
      <Text style={styles.label}>Transaction Hash: {txHash}</Text>

      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Text style={styles.shareText}>📤 Share Your Score</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, color: '#facc15', marginBottom: 20, fontWeight: 'bold' },
  label: { fontSize: 16, color: '#f8fafc', marginBottom: 10 },
  shareBtn: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginTop: 20 },
  shareText: { color: '#facc15', fontSize: 16 },
});

export default ScoreScreen;
