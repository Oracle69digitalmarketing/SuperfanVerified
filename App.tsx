import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import * as SQLite from 'expo-sqlite';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';

import WalletProvider from './WalletProvider';
import AppNavigator from './AppNavigator';

enableScreens(); // Improves performance for navigation

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
      },
      () => {
        // ✅ Read data after insert
        fetchUsers();
      }
    );
  }, []);

  // 🔍 Read users from DB
  const fetchUsers = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM users;',
        [],
        (_, { rows }) => {
          console.log('Users:', rows._array); // You can display this in UI later
        },
        (_, error) => {
          console.error('Select error:', error);
          Sentry.Native.captureException(error);
        }
      );
    });
  };

  // 🧹 Optional: Clear all users (for testing)
  const clearUsers = () => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM users;',
        [],
        () => console.log('All users deleted'),
        (_, error) => {
          console.error('Delete error:', error);
          Sentry.Native.captureException(error);
        }
      );
    });
  };

  return (
    <WalletProvider>
      <AppNavigator />
    </WalletProvider>
  );
}
