import React, { useEffect } from 'react';
import { WalletConnectProvider, useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletConnectProvider
      redirectUrl="superfanverified://"
      storageOptions={{ asyncStorage: AsyncStorage }}
    >
      <WalletSync>{children}</WalletSync>
    </WalletConnectProvider>
  );
}

const WalletSync = ({ children }: { children: React.ReactNode }) => {
  const connector = useWalletConnect();

  useEffect(() => {
    if (connector.connected) {
      const walletAddress = connector.accounts[0];
      const chainId = connector.chainId;

      db.transaction(tx => {
        // Create table with extended schema
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wallet_address TEXT UNIQUE,
            chain_id INTEGER,
            username TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );`,
          [],
          () => console.log('✅ Users table ready'),
          (_, error) => {
            console.error('❌ Table creation error:', error);
            return false;
          }
        );

        // Check for existing wallet before inserting
        tx.executeSql(
          'SELECT * FROM users WHERE wallet_address = ?;',
          [walletAddress],
          (_, { rows }) => {
            if (rows.length === 0) {
              tx.executeSql(
                'INSERT INTO users (wallet_address, chain_id) VALUES (?, ?);',
                [walletAddress, chainId],
                () => console.log('✅ Wallet saved:', walletAddress),
                (_, error) => {
                  console.error('❌ Wallet insert error:', error);
                  return false;
                }
              );
            } else {
              console.log('ℹ️ Wallet already exists:', walletAddress);
            }
          },
          (_, error) => {
            console.error('❌ Wallet lookup error:', error);
            return false;
          }
        );
      });
    }
  }, [connector.connected]);

  return <>{children}</>;
};
