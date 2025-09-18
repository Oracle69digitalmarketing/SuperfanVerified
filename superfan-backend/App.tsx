import React, { useEffect } from 'react';
import { View, Button, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import * as Sentry from 'sentry-expo';
import AppNavigator from './AppNavigator';
import { WalletProvider } from './providers/WalletProvider'; // Adjust path if needed

const db = SQLite.openDatabase('fanbase.db');

// 🔧 Deep linking config
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
        parse: { event_id: (id: string) => `${id}` },
      },
    },
  },
};

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
        Sentry.Native.captureException(error);
        return false;
      }
    );
  });
};

// 🧪 Debug utility
const fetchUsers = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM users;',
      [],
      (_, { rows }) => {
        console.log('Users:', rows._array);
      },
      (_, error) => {
        console.error('Select error:', error);
        Sentry.Native.captureException(error);
        return false;
      }
    );
  });
};

export default function App(): JSX.Element {
  useEffect(() => {
    setupDatabase();
    LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
  }, []);

  return (
    <WalletProvider>
      <NavigationContainer linking={linking}>
        <View style={{ flex: 1 }}>
          <AppNavigator />
          <Button title="Show Users in Console" onPress={fetchUsers} />
        </View>
      </NavigationContainer>
    </WalletProvider>
  );
}
