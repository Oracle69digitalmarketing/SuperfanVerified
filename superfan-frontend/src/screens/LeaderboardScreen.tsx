import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import { useWallet } from '../components/WalletProvider'; // Corrected path
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const { account } = useWallet(); // Use account from our new WalletProvider
  const walletAddress = account?.bech32Address;

  useEffect(() => {
    const loadSuperfanScores = async () => {
      try {
        const res = await fetch(`${API_URL}/leaderboard/superfan-top`);
        const scores = await res.json();

        const formatted = scores.map((entry: any) => ({
          id: entry._id,
          wallet_address: entry.walletAddress,
          artist: entry.artist,
          points: entry.score,
        }));

        setLeaderboard(formatted);
      } catch (err) {
        console.error('Superfan leaderboard fetch failed:', err);
      }
    };

    loadSuperfanScores();
  }, []);

  const handleMintBadge = async (tier: string) => {
    if (!walletAddress) return;

    try {
      const res = await fetch(`${API_URL}/api/nft/mint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, tier }),
      });
      const data = await res.json();
      if (res.ok) {
        Alert.alert('Success', `You have minted the ${tier} badge!`);
      } else {
        throw new Error(data.error || 'Failed to mint badge');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => {
    const isCurrentUser = item.wallet_address === walletAddress;
    return (
      <View style={[styles.item, isCurrentUser && styles.highlight]}>
        <Text style={styles.rank}>#{index + 1}</Text>
        <View style={styles.details}>
          <Text style={styles.name}>{item.wallet_address || 'Unnamed Fan'}</Text>
          <Text style={styles.points}>Superfan Coins: {item.points}</Text>
          <Text style={styles.breakdown}>Artist: {item.artist} | Tier: {item.fanTier}</Text>
          {isCurrentUser && (
            <Button title={`Mint ${item.fanTier} Badge`} onPress={() => handleMintBadge(item.fanTier)} />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Superfan Leaderboard</Text>
      {walletAddress && <Text style={styles.meta}>Your Wallet: {walletAddress}</Text>}
      <FlatList
        data={leaderboard}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
  },
  highlight: {
    borderColor: '#facc15',
    borderWidth: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#facc15',
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  points: {
    fontSize: 14,
    color: '#f8fafc',
  },
  breakdown: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});

export default LeaderboardScreen;