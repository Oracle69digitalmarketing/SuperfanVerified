import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ethers } from 'ethers';
import { WalletContext } from '../providers/WalletProvider'; // Adjust path if needed
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

export default function SendScreen({ route }: any) {
  const [amount, setAmount] = useState('');
  const toAddress = route.params?.toAddress || '';
  const wallet = useContext(WalletContext);
  const provider = wallet;
  const sender = wallet?.accounts?.[0];

  const handleSend = async () => {
    if (!provider || !sender) {
      Alert.alert('Wallet Not Connected', 'Please connect your wallet first.');
      return;
    }

    if (!ethers.isAddress(toAddress)) {
      Alert.alert('Invalid Address', 'Please enter a valid recipient address.');
      return;
    }

    try {
      const signer = new ethers.BrowserProvider(provider).getSigner();
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
      });

      Alert.alert('Transaction Sent', `Sent ${amount} XION to ${toAddress}\nTx Hash: ${tx.hash}`);

      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_address TEXT,
            to_address TEXT,
            amount TEXT,
            tx_hash TEXT,
            sent_at TEXT
          );`
        );

        tx.executeSql(
          'INSERT INTO transactions (from_address, to_address, amount, tx_hash, sent_at) VALUES (?, ?, ?, ?, datetime("now"));',
          [sender, toAddress, amount, tx.hash],
          () => console.log('Transaction saved'),
          (_, error) => console.error('Transaction insert error:', error)
        );
      });
    } catch (error) {
      console.error('Transaction error:', error);
      Alert.alert('Transaction Failed', error.message || 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💸 Send Tokens</Text>
      <Text style={styles.label}>To Address:</Text>
      <Text style={styles.address}>{toAddress}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
