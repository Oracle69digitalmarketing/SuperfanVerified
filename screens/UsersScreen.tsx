import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Swipeable } from 'react-native-gesture-handler';

const db = SQLite.openDatabase('my-database.db');

const PAGE_SIZE = 10;

const UsersScreen = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = () => {
    setRefreshing(true);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users ORDER BY id DESC;',
        [],
        (_, { rows }) => {
          const data = rows._array;
          setAllUsers(data);
          setUsers(data.slice(0, PAGE_SIZE));
          setPage(1);
          setLoading(false);
          setRefreshing(false);
        },
        (_, error) => {
          console.error('Select error:', error);
          setLoading(false);
          setRefreshing(false);
        }
      );
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = text => {
    setSearch(text);
    const filtered = allUsers.filter(user =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
    setUsers(filtered.slice(0, PAGE_SIZE));
    setPage(1);
  };

  const loadMore = () => {
    const start = page * PAGE_SIZE;
    const nextPage = allUsers.slice(0, start + PAGE_SIZE);
    setUsers(nextPage);
    setPage(prev => prev + 1);
  };

  const deleteUser = id => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM users WHERE id = ?;',
        [id],
        () => {
          fetchUsers();
        },
        (_, error) => {
          console.error('Delete error:', error);
        }
      );
    });
  };

  const renderRightActions = (item) => (
    <View style={styles.deleteBox}>
      <Text
        style={styles.deleteText}
        onPress={() =>
          Alert.alert('Delete User', `Delete ${item.name}?`, [
            { text: 'Cancel' },
            { text: 'Delete', onPress: () => deleteUser(item.id) },
          ])
        }
      >
        Delete
      </Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.userCard}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userDetails}>
          Age: {item.age} | Wallet: {item.wallet_address} | Chain ID: {item.chain_id}
        </Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Users</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search by name..."
        value={search}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : users.length === 0 ? (
        <Text style={styles.emptyText}>No users found.</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
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
    padding: 20,
    marginTop: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  userCard: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
  deleteBox: {
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UsersScreen;
