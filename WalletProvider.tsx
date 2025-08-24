import React, { useEffect } from 'react';
import { WalletConnectProvider, useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletConnectProvider
      redirectUrl={'superfanverified://'}
      storageOptions={{ asyncStorage: AsyncStorage }}
    >
      <WalletSync>{children}</WalletSync>
    </WalletConnectProvider>
  );
}

// 🔄 Sync wallet info to SQLite
const WalletSync = ({ children }: { children: React.ReactNode }) => {
  const connector = useWalletConnect();

  useEffect(() => {
    if (connector.connected) {
      const walletAddress = connector.accounts[0];
      const chainId = connector.chainId;

      db.transaction(tx => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wallet_address TEXT,
            chain_id INTEGER
          );`
        );

        tx.executeSql(
          'INSERT INTO users (wallet_address, chain_id) VALUES (?, ?);',
          [walletAddress, chainId],
          (_, result) => {
            console.log('Wallet saved to DB:', walletAddress);
          },
          (_, error) => {
            console.error('Wallet insert error:', error);
          }
        );
      });
    }
  }, [connector.connected]);

  return <>{children}</>;
};
