import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { openDatabase } from 'expo-sqlite';

const db = openDatabase('yourDatabaseName.db');

const LeaderboardScreen = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = () => {
    db.transaction(tx => {
      tx.executeSql(
        `
        SELECT 
          users.id,
          users.name,
          users.walletConnected,
          COUNT(scans.id) AS scanCount,
          (
            SELECT COUNT(*) 
            FROM votes 
            WHERE votes.userId = users.id
          ) AS voteCount
        FROM users
        LEFT JOIN scans ON scans.userId = users.id
        GROUP BY users.id
        `,
        [],
        (_, { rows }) => {
          const data = rows._array.map(user => ({
            ...user,
            points: user.scanCount + (user.walletConnected ? 5 : 0) + (user.voteCount * 2)
          })).sort((a, b) => b.points - a.points);

          setLeaderboard(data);
        },
        (_, error) => {
          console.error('Error fetching leaderboard:', error);
        }
      );
    });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.item}>
      <Text style={styles.rank}>#{index + 1}</Text>
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text>Points: {item.points}</Text>
        <Text>Scans: {item.scanCount} | Votes: {item.voteCount} | Wallet: {item.walletConnected ? '✅' : '❌'}</Text>
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { flexDirection: 'row', marginBottom: 15, alignItems: 'center' },
  rank: { fontSize: 18, fontWeight: 'bold', width: 40 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600' },
});

export default LeaderboardScreen;
