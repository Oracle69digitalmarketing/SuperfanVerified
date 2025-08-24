import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

const EventCheckInScreen = () => {
  const [checkIns, setCheckIns] = useState([]);
  const route = useRoute();
  const { event_id, user_id, referrer } = route.params || {}; // ✅ Deep link params

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS scans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_id TEXT,
          fan_id TEXT,
          scanned_at TEXT
        );`
      );

      const query = event_id
        ? `SELECT * FROM scans WHERE event_id = ? ORDER BY scanned_at DESC;`
        : `SELECT * FROM scans ORDER BY scanned_at DESC;`;

      const params = event_id ? [event_id] : [];

      tx.executeSql(
        query,
        params,
        (_, { rows }) => {
          setCheckIns(rows._array);
        },
        (_, error) => {
          console.error('Check-in fetch error:', error);
        }
      );
    });
  }, [event_id]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.event}>📍 Event: {item.event_id}</Text>
      <Text style={styles.fan}>🧑‍🎤 Fan: {item.fan_id}</Text>
      <Text style={styles.time}>🕒 Checked in: {item.scanned_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎟️ Event Check-In Tracker</Text>
      {event_id && <Text style={styles.meta}>Event ID: {event_id}</Text>}
      {user_id && <Text style={styles.meta}>User ID: {user_id}</Text>}
      {referrer && <Text style={styles.meta}>Referred by: {referrer}</Text>}
      <FlatList
        data={checkIns}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#facc15',
    marginBottom: 10,
  },
  meta: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 5,
  },
  item: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  event: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fan: {
    color: '#f8fafc',
    fontSize: 14,
    marginTop: 4,
  },
  time: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
});

export default EventCheckInScreen;
