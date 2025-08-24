import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import * as SQLite from 'expo-sqlite';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking'; // ✅ Added for deep linking
import { NavigationContainer } from '@react-navigation/native'; // ✅ Added for linking

import WalletProvider from './WalletProvider';
import AppNavigator from './AppNavigator';

enableScreens(); // Improves performance for navigation

// ✅ Linking configuration
const linking = {
  prefixes: ['superfanverified://'],
  config: {
    screens: {
      Home: 'home',
      QRScanner: 'scan',
      Users: 'users',
      Scans: 'scans',
      LeaderboardScreen: 'leaderboard',
      EventCheckIn: {
        path: 'event-checkin',
        parse: {
          event_id: id => `${id}`, // ✅ Supports ?event_id=E001
        },
      },
      VotingHistory: 'voting-history',
      // Add more screens as needed
    },
  },
};

// Initialize Sentry only if DSN is available
const sentryDsn = Constants.expoConfig?.extra?.sentryDsn;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    enableInExpoDevelopment: true,
    debug: true,
  });
}

const db = SQLite.openDatabase('my-database.db');

export default function App() {
  useEffect(() => {
    db.transaction(
      tx => {
        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT, age INTEGER);"
        );
        tx.executeSql(
          "INSERT INTO users (name, age) VALUES (?, ?);",
          ['Alice', 25]
        );
      },
      error => {
        console.error("SQLite transaction error:", error);
        Sentry.Native.captureException(error);
      }
    );
  }, []);

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
        }
      );
    });
  };

  return (
    <WalletProvider>
      <NavigationContainer linking={linking}> {/* ✅ Wrap with linking */}
        <View style={{ flex: 1 }}>
          <AppNavigator />
          <Button title="Show Users in Console" onPress={fetchUsers} />
        </View>
      </NavigationContainer>
    </WalletProvider>
  );
}}
