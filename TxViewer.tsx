import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StargateClient } from '@cosmjs/stargate';

export default function TxViewer({ route }: any) {
  const { hash } = route.params;
  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const client = await StargateClient.connect('https://rpc.cosmos.network'); // Replace with your chain RPC
        const result = await client.getTx(hash);
        setTx(result);
      } catch (error) {
        console.error('Failed to fetch transaction:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTx();
  }, [hash]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#facc15" />
        <Text style={styles.loading}>Loading transaction...</Text>
      </View>
    );
  }

  if (!tx) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Transaction not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Transaction Details</Text>
      <Text style={styles.label}>Hash:</Text>
      <Text style={styles.value}>{tx.hash}</Text>
      <Text style={styles.label}>Height:</Text>
      <Text style={styles.value}>{tx.height}</Text>
      <Text style={styles.label}>Type:</Text>
      <Text style={styles.value}>{tx.tx.body.messages[0]['@type']}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    justifyContent: 'center',
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
    marginTop: 10,
  },
  value: {
    fontSize: 14,
    color: '#f8fafc',
  },
  loading: {
    marginTop: 20,
    color: '#f8fafc',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
});
