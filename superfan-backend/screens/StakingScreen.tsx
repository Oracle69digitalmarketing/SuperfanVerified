import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { WalletContext } from '../providers/WalletProvider'; // Adjust path as needed
import * as SQLite from 'expo-sqlite';
// import { SigningStargateClient } from '@cosmjs/stargate'; // Uncomment if using Cosmos SDK

const db = SQLite.openDatabase('my-database.db');

const validators = [
  { id: '1', name: 'Validator One', apr: '12.5%', commission: '5%', address: 'cosmosvaloper1...' },
  { id: '2', name: 'Validator Two', apr: '10.2%', commission: '3%', address: 'cosmosvaloper2...' },
  { id: '3', name: 'Validator Three', apr: '8.9%', commission: '2%', address: 'cosmosvaloper3...' },
];

const StakingScreen = () => {
  const [selectedValidator, setSelectedValidator] = useState(null);
  const [amount, setAmount] = useState('');
  const wallet = useContext(WalletContext);
  const walletAddress = wallet?.accounts?.[0];

  const handleStake = async () => {
    if (!wallet?.connected || !walletAddress) {
      Alert.alert('Wallet Not Connected', 'Please connect your wallet first.');
      return;
    }

    if (!selectedValidator || !amount) {
      Alert.alert('Missing Info', 'Please select a validator and enter an amount.');
      return;
    }

    try {
      // Replace with actual staking logic using your chain’s SDK
      // Example for Cosmos:
      // const client = await SigningStargateClient.connectWithSigner(rpcUrl, signer);
      // await client.delegateTokens(walletAddress, selectedValidator.address, amountInMicroDenom, denom);

      Alert.alert('Stake Confirmed', `Staked ${amount} to ${selectedValidator.name}`);

      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS staking (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_address TEXT,
            validator_name TEXT,
            validator_address TEXT,
            amount TEXT,
            staked_at TEXT
          );`
        );

        tx.executeSql(
          'INSERT INTO staking (user_address, validator_name, validator_address, amount, staked_at) VALUES (?, ?, ?, ?, datetime("now"));',
          [walletAddress, selectedValidator.name, selectedValidator.address, amount],
          () => console.log('Stake saved'),
          (_, error) => console.error('Stake insert error:', error)
        );
      });
    } catch (error) {
      console.error('Staking error:', error);
      Alert.alert('Staking Failed', error.message || 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💸 Stake Your Tokens</Text>
      {walletAddress && <Text style={styles.meta}>Your Wallet: {walletAddress}</Text>}

      <FlatList
        data={validators}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.validatorCard,
              selectedValidator?.id === item.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedValidator(item)}
          >
            <Text style={styles.validatorName}>{item.name}</Text>
            <Text style={styles.validatorDetails}>APR: {item.apr} | Commission: {item.commission}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedValidator && (
        <View style={styles.stakeSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount to stake"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity style={styles.stakeButton} onPress={handleStake}>
            <Text style={styles.stakeButtonText}>Confirm Stake</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  title: { fontSize: 24, color: '#facc15', fontWeight: 'bold', marginBottom: 20 },
  meta: { fontSize: 14, color: '#94a3b8', marginBottom: 10 },
  validatorCard: { backgroundColor: '#1e293b', padding: 15, borderRadius: 10, marginBottom: 10 },
  selectedCard: { borderColor: '#facc15', borderWidth: 2 },
  validatorName: { fontSize: 18, color: '#f8fafc' },
  validatorDetails: { fontSize: 14, color: '#94a3b8' },
  stakeSection: { marginTop: 20 },
  input: { backgroundColor: '#334155', color: '#f8fafc', padding: 10, borderRadius: 8, marginBottom: 10 },
  stakeButton: { backgroundColor: '#facc15', padding: 15, borderRadius: 10 },
  stakeButtonText: { color: '#0f172a', fontSize: 16, textAlign: 'center', fontWeight: 'bold' },
});

export default StakingScreen;
