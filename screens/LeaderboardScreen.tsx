import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `
        CREATE TABLE IF NOT EXISTS votes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          proposal_id TEXT,
          voted_at TEXT
        );
        `
      );

      tx.executeSql(
        `
        SELECT 
          users.id,
          users.wallet_address,
          users.chain_id,
          COUNT(DISTINCT scans.id) AS scanCount,
          (
            SELECT COUNT(*) FROM votes WHERE votes.user_id = users.id
          ) AS voteCount
        FROM users
        LEFT JOIN scans ON scans.raw_data LIKE '%' || users.wallet_address || '%'
        GROUP BY users.id;
        `,
        [],
        (_, { rows }) => {
          const data = rows._array.map(user => ({
            ...user,
            points: user.scanCount + 5 + (user.voteCount * 2), // +5 for wallet connection
          })).sort((a, b) => b.points - a.points);

          setLeaderboard(data);
        },
        (_, error) => {
          console.error('Leaderboard query error:', error);
        }
      );
    });
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <View style={styles.details}>
        <Text style={styles.name}>{item.wallet_address || 'Unnamed Fan'}</Text>
        <Text style={styles.points}>Points: {item.points}</Text>
        <Text style={styles.breakdown}>
          Scans: {item.scanCount} | Votes: {item.voteCount} | Chain: {item.chain_id}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Fan Leaderboard</Text>
      <FlatList
        data={leaderboard}
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
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 10,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#facc15',
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  points: {
    fontSize: 14,
    color: '#f8fafc',
  },
  breakdown: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});

export default LeaderboardScreen;
