import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WalletContext } from '../providers/WalletProvider';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = Constants.expoConfig.extra.apiUrl;

const HomeScreen = () => {
  const navigation = useNavigation();
  const wallet = useContext(WalletContext);
  const walletAddress = wallet?.accounts?.[0];

  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("auth_token");
        const savedUser = await AsyncStorage.getItem("auth_user");
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUsername(savedUser);
          console.log("🔑 Session restored:", savedUser);
        }
      } catch (err) {
        console.error("❌ Session restore failed:", err);
      }
    };
    loadSession();
  }, []);

  // Wallet connect + Auth
  const handleConnect = async () => {
    try {
      setLoading(true);
      await wallet.connect();

      if (wallet?.accounts?.[0]) {
        const res = await fetch(`${API_URL}/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet: wallet.accounts[0] }),
        });
        const data = await res.json();

        if (data.success) {
          setUsername(data.username || null);
          setToken(data.token);

          // Persist session
          await AsyncStorage.setItem("auth_token", data.token);
          await AsyncStorage.setItem("auth_user", data.username || wallet.accounts[0]);

          console.log("✅ Auth success & saved:", data);
        } else {
          Alert.alert("Auth Failed", data.message || "Could not authenticate wallet.");
        }
      }
    } catch (err) {
      console.error("❌ Wallet connect error:", err);
      Alert.alert("Error", "Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleDisconnect = async () => {
    try {
      wallet.disconnect?.();
      setUsername(null);
      setToken(null);

      await AsyncStorage.removeItem("auth_token");
      await AsyncStorage.removeItem("auth_user");

      console.log("👋 Logged out");
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  const requireWallet = (screen: string) => {
    if (!token) {
      alert('Please connect your wallet to access this feature.');
    } else {
      navigation.navigate(screen as never);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome {username ? username : "Guest"} 👑
      </Text>

      {!token ? (
        <TouchableOpacity style={styles.connectBtn} onPress={handleConnect}>
          {loading ? (
            <ActivityIndicator color="#facc15" />
          ) : (
            <Text style={styles.connectText}>🔑 Connect Wallet</Text>
          )}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.disconnectBtn} onPress={handleDisconnect}>
          <Text style={styles.disconnectText}>❌ Disconnect</Text>
        </TouchableOpacity>
      )}

      {/* Features */}
      <TouchableOpacity style={styles.button} onPress={() => requireWallet('Staking')}>
        <Text style={styles.buttonText}>🪙 Stake Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => requireWallet('Governance')}>
        <Text style={styles.buttonText}>🗳️ Vote on Proposals</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => requireWallet('QRScanner')}>
        <Text style={styles.buttonText}>📷 Scan QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => requireWallet('Users')}>
        <Text style={styles.buttonText}>👥 View Local Users</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => requireWallet('Scans')}>
        <Text style={styles.buttonText}>📋 View Scanned QR Codes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => requireWallet('LeaderboardScreen')}>
        <Text style={styles.buttonText}>🏆 Fan Leaderboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => requireWallet('VotingHistory')}>
        <Text style={styles.buttonText}>🗂️ View Voting History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => requireWallet('EventCheckIn')}>
        <Text style={styles.buttonText}>🎟️ Event Check-In Tracker</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, color: '#facc15', marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  connectBtn: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginBottom: 30, width: '100%', alignItems: 'center' },
  connectText: { color: '#facc15', fontSize: 18 },
  disconnectBtn: { backgroundColor: '#991b1b', padding: 15, borderRadius: 10, marginBottom: 30, width: '100%', alignItems: 'center' },
  disconnectText: { color: '#f8fafc', fontSize: 16 },
  button: { backgroundColor: '#1e293b', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, marginVertical: 10, width: '100%' },
  buttonText: { color: '#f8fafc', fontSize: 16, textAlign: 'center' },
});

export default HomeScreen;
