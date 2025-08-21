import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function SendScreen({ route }: any) {
  const [amount, setAmount] = useState('');
  const toAddress = route.params?.toAddress || '';

  const handleSend = () => {
    // TODO: Connect to blockchain and send transaction
    Alert.alert('Transaction Sent', `Sent ${amount} XION to ${toAddress}`);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 5,
  },
  address: {
    fontSize: 14,
    color: '#f8fafc',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#facc15',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#0f172a',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
