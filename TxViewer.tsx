import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
  FlatList,
  Dimensions,
} from 'react-native';
import { StargateClient } from '@cosmjs/stargate';
import * as Notifications from 'expo-notifications';
import { LineChart } from 'react-native-chart-kit';

export default function TxViewer() {
  const [address, setAddress] = useState('');
  const [txs, setTxs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTxsByAddress = async () => {
    setLoading(true);
    setError(null);
    try {
      const client = await StargateClient.connect('https://rpc.cosmos.network');
      const result = await client.searchTx({ sentFromOrTo: address });
      if (!result || result.length === 0) {
        setError('No transactions found for this address.');
      } else {
        setTxs(result);
        sendNotification('Transactions Loaded', `Found ${result.length} transactions.`);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  };

  const parseMessage = (msg: any) => {
    switch (msg['@type']) {
      case '/cosmos.bank.v1beta1.MsgSend':
        return `Sent ${msg.amount[0].amount} ${msg.amount[0].denom} to ${msg.to_address}`;
      case '/cosmos.staking.v1beta1.MsgDelegate':
        return `Delegated ${msg.amount.amount} ${msg.amount.denom} to ${msg.validator_address}`;
      default:
        return 'Unknown transaction type';
    }
  };

  const renderTxItem = ({ item }: any) => {
    const msg = item.tx.body.messages[0];
    return (
      <View style={styles.txItem}>
        <Text style={styles.label}>Hash:</Text>
        <Text style={styles.value}>{item.hash}</Text>
        <Text style={styles.label}>Height:</Text>
        <Text style={styles.value}>{item.height}</Text>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{msg['@type']}</Text>
        <Text style={styles.label}>Details:</Text>
        <Text style={styles.value}>{parseMessage(msg)}</Text>
      </View>
    );
  };

  const chartData = {
    labels: txs.map((tx, i) => `#${i + 1}`),
    datasets: [{ data: txs.map(() => 1) }],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Cosmos Transaction Explorer</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter wallet address"
        placeholderTextColor="#94a3b8"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Fetch Transactions" onPress={fetchTxsByAddress} />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#facc15" />
          <Text style={styles.loading}>Fetching transactions...</Text>
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {!loading && txs.length > 0 && (
        <>
          <Text style={styles.subtitle}>📊 Transaction Volume</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#0f172a',
              backgroundGradientFrom: '#0f172a',
              backgroundGradientTo: '#0f172a',
              color: () => '#facc15',
              labelColor: () => '#94a3b8',
            }}
            style={{ marginVertical: 20 }}
          />

          <FlatList
            data={txs}
            keyExtractor={(item) => item.hash}
            renderItem={renderTxItem}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#facc15',
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 10,
    color: '#f8fafc',
    marginBottom: 10,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loading: {
    color: '#f8fafc',
    fontSize: 16,
    marginTop: 10,
  },
  error: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 10,
  },
  txItem: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 5,
  },
  value: {
    fontSize: 14,
    color: '#f8fafc',
  },
});    color: '#f8fafc',
    fontSize: 16,
    textAlign: 'center',
  },
  error: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
});
