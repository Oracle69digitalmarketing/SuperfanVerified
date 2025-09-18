import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import * as SQLite from 'expo-sqlite';
import dayjs from 'dayjs';
import { useFocusEffect } from '@react-navigation/native';
import { WalletContext } from '../context/WalletContext';

const db = SQLite.openDatabase('superfan.db');

const EventCheckInScreen = ({ route }) => {
  const { event_id } = route.params || {};
  const { user_id } = useContext(WalletContext);
  const [checkIns, setCheckIns] = useState([]);

  const query = event_id
    ? `SELECT * FROM scans WHERE event_id = ? ORDER BY scanned_at DESC;`
    : `SELECT * FROM scans ORDER BY scanned_at DESC;`;
  const params = event_id ? [event_id] : [];

  const fetchCheckIns = () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS scans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_id TEXT,
          fan_id TEXT,
          scanned_at TEXT
        );`
      );
      tx.executeSql(
        query,
        params,
        (_, { rows }) => setCheckIns(rows._array),
        (_, error) => console.error('Check-in fetch error:', error)
      );
    });
  };

  // Fetch on mount
  useEffect(() => {
    fetchCheckIns();
  }, [event_id]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchCheckIns();
    }, [event_id])
  );

  // Optional: simulate adding a check-in (for testing)
  const addCheckIn = () => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO scans (event_id, fan_id, scanned_at) VALUES (?, ?, ?);`,
        [event_id || 'default-event', user_id, new Date().toISOString()],
        () => {
          console.log('Check-in added');
          fetchCheckIns();
        },
        (_, error) => console.error('Insert error:', error)
      );
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.fan}>Fan: {item.fan_id}</Text>
      <Text style={styles.event}>Event: {item.event_id}</Text>
      <Text style={styles.time}>
        🕒 Checked in: {dayjs(item.scanned_at).format('MMM D, YYYY h:mm A')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {checkIns.length === 0 && (
        <Text style={styles.emptyMessage}>
          No check-ins yet for this event.
        </Text>
      )}
      <FlatList
        data={checkIns}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
      <Button title="Add Test Check-In" onPress={addCheckIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  fan: { fontSize: 16, fontWeight: '500' },
  event: { fontSize: 14, color: '#64748b' },
  time: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  emptyMessage: { textAlign: 'center', color: '#94a3b8', marginTop: 20 },
});

export default EventCheckInScreen;
