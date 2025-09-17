import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useWallet } from '../providers/WalletProvider';

const ScanDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { scans } = useWallet();

  const { id } = route.params as { id: number };
  const scan = scans.find((s) => s.id === id);

  if (!scan) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>⚠️ Scan not found.</Text>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔍 Scan Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Raw Data:</Text>
        <Text style={styles.value}>{scan.raw_data}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Wallet:</Text>
        <Text style={styles.value}>{scan.scanned_by || 'Unknown'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Timestamp:</Text>
        <Text style={styles.value}>{scan.scanned_at}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            scan.status === 'verified'
              ? styles.success
              : scan.status === 'failed'
              ? styles.error
              : styles.pending,
          ]}
        >
          {scan.status}
        </Text>
      </View>

      {scan.metadata && (
        <View style={styles.card}>
          <Text style={styles.label}>Metadata:</Text>
          <Text style={styles.value}>{JSON.stringify(scan.metadata, null, 2)}</Text>
        </View>
      )}

      <Button title="Back to Scans" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f172a' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#facc15' },
  card: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: '600', color: '#94a3b8' },
  value: { fontSize: 16, color: '#f8fafc', marginTop: 4 },
  success: { color: '#22c55e' },
  error: { color: '#ef4444' },
  pending: { color: '#facc15' },
});

export default ScanDetailsScreen;
