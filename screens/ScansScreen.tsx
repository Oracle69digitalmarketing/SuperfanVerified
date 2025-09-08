import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { WalletContext } from '../providers/WalletProvider';

const db = SQLite.openDatabase('my-database.db');

// ✅ Use apiUrl from Expo config
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://superfan-backend.onrender.com";

const ScansScreen = () => {
  const [scans, setScans] = useState([]);
  const wallet = useContext(WalletContext);
  const walletAddress = wallet?.accounts?.[0];

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS scans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          raw_data TEXT,
          scanned_at TEXT,
          scanned_by TEXT,
          status TEXT
        );`
      );

      tx.executeSql(
        'SELECT * FROM scans ORDER BY scanned_at DESC;',
        [],
        (_, { rows }) => {
          setScans(rows._array);
        },
        (_, error) => console.error('Scan fetch error:', error)
      );
    });
  }, []);

  const verifyWithBackend = async (scan) => {
    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawData: scan.raw_data,
          wallet: walletAddress,
        }),
      });
      const result = await response.json();

      // Update status in DB
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE scans SET status = ? WHERE id = ?;',
          [result.verified ? "✅ Verified" : "❌ Not Valid", scan.id]
        );
      });

      // Update state
      setScans(scans.map(s =>
        s.id === scan.id ? { ...s, status: result.verified ? "✅ Verified" : "❌ Not Valid" } : s
      ));
    } catch (err) {
      console.error('Backend verify error:', err);
    }
  };

  // Auto-verify each scan if not yet verified
  useEffect(() => {
    scans.forEach(scan => {
      if (!scan.status) verifyWithBackend(scan);
    });
  }, [scans]);

  const renderItem = ({ item }) => {
    const isMine = item.scanned_by === walletAddress;
    return (
      <View style={[styles.scanItem, isMine && styles.highlight]}>
        <Text style={styles.dataText}>{item.raw_data}</Text>
        <Text style={styles.timestamp}>{item.scanned_at}</Text>
        {item.scanned_by && (
          <Text style={styles.byline}>
            Scanned by: {isMine ? 'You' : item.scanned_by}
          </Text>
        )}
        {item.status && (
          <Text style={styles.status}>{item.status}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Scanned QR Codes</Text>
      {walletAddress && <Text style={styles.meta}>Your Wallet: {walletAddress}</Text>}
      <FlatList
        data={scans}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    flex: 1,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 10,
  },
  scanItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#334155',
  },
  highlight: {
    borderColor: '#facc15',
    borderWidth: 2,
    borderRadius: 8,
  },
  dataText: {
    color: '#f8fafc',
    fontSize: 16,
  },
  timestamp: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  byline: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
  status: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22c55e', // green for ✅
  },
});

export default ScansScreen;    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  byline: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
    fontStyle: 'italic',
  },
});

export default ScansScreen;
