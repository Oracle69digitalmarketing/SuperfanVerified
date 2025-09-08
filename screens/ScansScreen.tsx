import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import Constants from 'expo-constants';
import { WalletContext } from '../providers/WalletProvider';

const db = SQLite.openDatabase('my-database.db');
const API_URL = Constants.expoConfig.extra.apiUrl; // from app.config.js

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
        (_, { rows }) => setScans(rows._array),
        (_, error) => console.error('Scan fetch error:', error)
      );
    });
  }, []);

  const sendToBackend = async (scanData) => {
    try {
      const res = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawData: scanData,
          wallet: walletAddress,
        }),
      });
      const result = await res.json();
      console.log('✅ Verified with backend:', result);
      return result.status || 'unknown';
    } catch (err) {
      console.error('❌ Backend error:', err);
      return 'error';
    }
  };

  // Call this when you get a new scan
  const handleNewScan = async (scanData) => {
    const status = await sendToBackend(scanData);
    const timestamp = new Date().toISOString();

    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO scans (raw_data, scanned_at, scanned_by, status) 
         VALUES (?, ?, ?, ?);`,
        [scanData, timestamp, walletAddress, status],
        (_, result) => {
          console.log('Saved scan with status:', status);
          setScans(prev => [
            { id: result.insertId, raw_data: scanData, scanned_at: timestamp, scanned_by: walletAddress, status },
            ...prev,
          ]);
        },
        (_, error) => console.error('DB insert error:', error)
      );
    });

    if (status === 'verified') {
      Alert.alert('✅ Verified', 'This scan is authentic');
    } else {
      Alert.alert('⚠️ Not Verified', 'Could not confirm this scan');
    }
  };

  const renderItem = ({ item }) => {
    const isMine = item.scanned_by === walletAddress;
    return (
      <View style={[styles.scanItem, isMine && styles.highlight]}>
        <Text style={styles.dataText}>{item.raw_data}</Text>
        <Text style={styles.timestamp}>{item.scanned_at}</Text>
        <Text style={{ color: item.status === 'verified' ? 'lime' : 'tomato' }}>
          Status: {item.status || 'unknown'}
        </Text>
        {item.scanned_by && (
          <Text style={styles.byline}>
            Scanned by: {isMine ? 'You' : item.scanned_by}
          </Text>
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
});

export default ScansScreen;
