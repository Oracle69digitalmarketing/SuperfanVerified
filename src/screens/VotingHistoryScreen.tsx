import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');
const PAGE_SIZE = 10;

const VotingHistoryScreen = () => {
  const [votes, setVotes] = useState([]);
  const [allVotes, setAllVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchVotes = () => {
    setRefreshing(true);
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
          const data = rows._array;
          setAllVotes(data);
          setVotes(data.slice(0, PAGE_SIZE));
          setPage(1);
          setLoading(false);
          setRefreshing(false);
        },
        (_, error) => {
          console.error('Vote fetch error:', error);
          setLoading(false);
          setRefreshing(false);
        }
      );
    });
  };

  useEffect(() => {
    fetchVotes();
  }, []);

  const handleSearch = text => {
    setSearch(text);
    const filtered = allVotes.filter(
      vote =>
        vote.proposal_id.toLowerCase().includes(text.toLowerCase()) ||
        (vote.wallet_address || '').toLowerCase().includes(text.toLowerCase())
    );
    setVotes(filtered.slice(0, PAGE_SIZE));
    setPage(1);
  };

  const loadMore = () => {
    const start = page * PAGE_SIZE;
    const nextPage = allVotes
      .filter(
        vote =>
          vote.proposal_id.toLowerCase().includes(search.toLowerCase()) ||
          (vote.wallet_address || '').toLowerCase().includes(search.toLowerCase())
      )
      .slice(0, start + PAGE_SIZE);
    setVotes(nextPage);
    setPage(prev => prev + 1);
  };

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

      <TextInput
        style={styles.searchInput}
        placeholder="Search by proposal or wallet..."
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#facc15" />
      ) : votes.length === 0 ? (
        <Text style={styles.emptyText}>No votes found.</Text>
      ) : (
        <FlatList
          data={votes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchVotes} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
        />
      )}
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
  searchInput: {
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
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
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default VotingHistoryScreen;
