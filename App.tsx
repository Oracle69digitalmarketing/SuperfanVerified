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

// Initialize Sentry
Sentry.init({
  dsn: Constants.expoConfig?.extra?.sentryDsn,
  enableInExpoDevelopment: true,
  debug: true,
});

const db = SQLite.openDatabase('my-database.db');

export default function App() {
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY NOT NULL, name TEXT, age INTEGER);"
      );
      tx.executeSql(
        "INSERT INTO users (name, age) VALUES (?, ?);",
        ['Alice', 25]
      );
    });
  }, []);

  return (
    <WalletProvider>
      <AppNavigator />
    </WalletProvider>
  );
}
