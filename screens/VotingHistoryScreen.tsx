import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

const VotingHistoryScreen = () => {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS votes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          proposal_id TEXT,
          voted_at TEXT
        );`
      );

      tx.executeSql(
        `SELECT votes.*, users.wallet_address 
         FROM votes 
         LEFT JOIN users ON votes.user_id = users.id 
         ORDER BY voted_at DESC;`,
        [],
        (_, { rows }) => {
          setVotes(rows._array);
        },
        (_, error) => {
          console.error('Vote fetch error:', error);
        }
      );
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.proposal}>🗳️ Proposal: {item.proposal_id}</Text>
      <Text style={styles.wallet}>👛 Voter: {item.wallet_address || 'Unknown'}</Text>
      <Text style={styles.time}>🕒 Voted at: {item.voted_at}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗂️ Voting History</Text>
      <FlatList
        data={votes}
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
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  proposal: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wallet: {
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

export default VotingHistoryScreen;
