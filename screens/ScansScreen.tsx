import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

const ScansScreen = () => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM scans ORDER BY scanned_at DESC;',
        [],
        (_, { rows }) => {
          setScans(rows._array);
        },
        (_, error) => {
          console.error('Scan fetch error:', error);
        }
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Scanned QR Codes</Text>
      <FlatList
        data={scans}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.scanItem}>
            <Text style={styles.dataText}>{item.raw_data}</Text>
            <Text style={styles.timestamp}>{item.scanned_at}</Text>
          </View>
        )}
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
  scanItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#334155',
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
});

export default ScansScreen;
