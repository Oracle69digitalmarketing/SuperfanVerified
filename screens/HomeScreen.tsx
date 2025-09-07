import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WalletContext } from '../providers/WalletProvider'; // Adjust path as needed

const HomeScreen = () => {
  const navigation = useNavigation();
  const wallet = useContext(WalletContext);
  const walletAddress = wallet?.accounts?.[0];

  const requireWallet = (screen: string) => {
    if (!wallet?.connected) {
      alert('Please connect your wallet to access this feature.');
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Prince 👑</Text>
      {walletAddress && <Text style={styles.wallet}>Connected Wallet: {walletAddress}</Text>}

      <TouchableOpacity style={styles.button} onPress={() => requireWallet('Staking')}>
        <Text style={styles.buttonText}>🪙 Stake Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => requireWallet('Governance')}>
        <Text style={styles.buttonText}>🗳️ Vote on Proposals</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QRScanner')}>
        <Text style={styles.buttonText}>📷 Scan QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Users')}>
        <Text style={styles.buttonText}>👥 View Local Users</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scans')}>
        <Text style={styles.buttonText}>📋 View Scanned QR Codes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LeaderboardScreen')}>
        <Text style={styles.buttonText}>🏆 Fan Leaderboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VotingHistory')}>
        <Text style={styles.buttonText}>🗂️ View Voting History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EventCheckIn')}>
        <Text style={styles.buttonText}>🎟️ Event Check-In Tracker</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: '#facc15',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  wallet: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1e293b',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: '#f8fafc',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default HomeScreen;
