import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, ActivityIndicator } from 'react-native';
import * as SQLite from 'expo-sqlite';
import AppNavigator from './AppNavigator';
import { fetchUsers } from './apiService';

const db = SQLite.openDatabase('fanbase.db');

// 🧱 Setup local SQLite tables
const setupDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        points INTEGER DEFAULT 0,
        rank INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log('✅ users table ready'),
      (_, error) => {
        console.error('❌ users table error:', error);
        return false;
      }
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS fan_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        action_type TEXT,
        points_awarded INTEGER,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log('✅ fan_activity table ready'),
      (_, error) => {
        console.error('❌ fan_activity table error:', error);
        return false;
      }
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS referral_rewards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        referrer_id INTEGER,
        referred_user_id INTEGER,
        reward_type TEXT,
        reward_status TEXT DEFAULT 'pending',
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log('✅ referral_rewards table ready'),
      (_, error) => {
        console.error('❌ referral_rewards table error:', error);
        return false;
      }
    );
  });
};

// 🔗 Deep linking config
const linking = {
  prefixes: ['superfanverified://'],
  config: {
    screens: {
      Home: 'home',
      Staking: 'staking',
      Governance: 'governance',
      QRScanner: 'qrscanner',
      Users: 'users',
      Scans: 'scans',
      VotingHistory: 'voting-history',
      LeaderboardScreen: 'leaderboard',
      EventCheckIn: {
        path: 'event-checkin',
        parse: { event_id: id => `${id}` },
      },
    },
  },
};

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setupDatabase();

    fetchUsers()
      .then(data => {
        setUsers(data || []);
      })
      .catch(error => {
        console.error('❌ Failed to fetch users:', error);
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={{ marginTop: 10 }}>Loading SuperfanVerified...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <AppNavigator users={users} />
    </NavigationContainer>
  );
}
