import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Prince 👑</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Staking')}>
        <Text style={styles.buttonText}>🪙 Stake Now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Governance')}>
        <Text style={styles.buttonText}>🗳️ Vote on Proposals</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QRScanner')}>
        <Text style={styles.buttonText}>📷 Scan QR</Text>
      </TouchableOpacity>

      {/* ✅ New Button to View Users */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Users')}>
        <Text style={styles.buttonText}>👥 View Local Users</Text>
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
    marginBottom: 40,
    fontWeight: 'bold',
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
