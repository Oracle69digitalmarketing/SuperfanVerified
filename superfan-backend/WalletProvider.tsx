import React, { useEffect, useState, createContext, useContext } from 'react';
import { WalletConnectProvider, useWalletConnect } from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';

const db = SQLite.openDatabase('my-database.db');

// --- Context ---
export const WalletContext = createContext<any>(null);
export const useWallet = () => useContext(WalletContext);

// --- Provider Wrapper ---
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

// --- Core Wallet Sync ---
const WalletSync = ({ children }: { children: React.ReactNode }) => {
  const connector = useWalletConnect();
  const [wallet, setWallet] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);

  // Create tables once
  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          wallet_address TEXT UNIQUE,
          chain_id INTEGER,
          username TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS scans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          raw_data TEXT,
          scanned_at TEXT DEFAULT CURRENT_TIMESTAMP,
          scanned_by TEXT,
          status TEXT DEFAULT 'pending'
        );`
      );
    });
  }, []);

  // On wallet connect
  useEffect(() => {
    if (connector.connected) {
      const walletAddress = connector.accounts[0];
      const chainId = connector.chainId;
      setWallet({ address: walletAddress, chainId });

      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR IGNORE INTO users (wallet_address, chain_id) VALUES (?, ?);',
          [walletAddress, chainId]
        );
      });

      loadScans(walletAddress);
    }
  }, [connector.connected]);

  // --- DB ops ---
  const loadScans = (walletAddress: string) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM scans WHERE scanned_by = ? ORDER BY scanned_at DESC;',
        [walletAddress],
        (_, { rows }) => setScans(rows._array)
      );
    });
  };

  const addScan = async (data: string) => {
    if (!wallet?.address) return;
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO scans (raw_data, scanned_by) VALUES (?, ?);',
        [data, wallet.address],
        (_, result) => {
          console.log('✅ Scan inserted:', data);
          loadScans(wallet.address);
        }
      );
    });

    // Push to backend
    try {
      await axios.post('https://your-backend.com/api/scans', {
        wallet: wallet.address,
        raw_data: data,
      });
    } catch (err) {
      console.warn('⚠️ Backend sync failed:', err.message);
    }
  };

  const refreshScans = async () => {
    if (!wallet?.address) return;
    try {
      const { data } = await axios.get(
        `https://your-backend.com/api/scans?wallet=${wallet.address}`
      );

      // Update local DB statuses
      data.forEach((scan: any) => {
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE scans SET status = ? WHERE raw_data = ? AND scanned_by = ?;',
            [scan.status, scan.raw_data, wallet.address]
          );
        });
      });

      loadScans(wallet.address);
    } catch (err) {
      console.warn('⚠️ Refresh failed:', err.message);
    }
  };

  return (
    <WalletContext.Provider value={{ wallet, scans, addScan, refreshScans }}>
      {children}
    </WalletContext.Provider>
  );
};
