import React, { useEffect, useState, createContext } from 'react';
import { WalletConnectProvider, useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('my-database.db');

// 👇 Create a context we can consume anywhere
export const WalletContext = createContext(null);

export default function WalletProvider({ children }) {
  return (
    <WalletConnectProvider
      redirectUrl="superfanverified://"
      storageOptions={{ asyncStorage: AsyncStorage }}
    >
      <WalletSync>{children}</WalletSync>
    </WalletConnectProvider>
  );
}

const WalletSync = ({ children }) => {
  const connector = useWalletConnect();
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    if (connector.connected) {
      const walletAddress = connector.accounts[0];
      const chainId = connector.chainId;

      setWallet({ accounts: [walletAddress], chainId }); // 👈 makes it available to QRScanner, Scans, etc.

      db.transaction(tx => {
        // Create users table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            wallet_address TEXT UNIQUE,
            chain_id INTEGER,
            username TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          );`
        );

        // Insert or skip if exists
        tx.executeSql(
          'INSERT OR IGNORE INTO users (wallet_address, chain_id) VALUES (?, ?);',
          [walletAddress, chainId],
          () => console.log('✅ Wallet saved:', walletAddress),
          (_, error) => {
            console.error('❌ Wallet insert error:', error);
            return false;
          }
        );
      });
    }
  }, [connector.connected]);

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
};
