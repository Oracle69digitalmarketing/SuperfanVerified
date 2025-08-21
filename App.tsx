import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import WalletProvider from './WalletProvider';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { fetchBalance, fetchTransactions } from './utils/xionClient';

function AppContent() {
  const connector = useWalletConnect();
  const [balance, setBalance] = useState('');
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState([]);

  const connectWallet = async () => {
    try {
      if (!connector.connected) {
        await connector.connect();
      }
      const addr = connector.accounts[0];
      setAddress(addr);
      const bal = await fetchBalance(addr);
      setBalance(bal);
      const txs = await fetchTransactions(addr);
      setTransactions(txs);
    } catch (e) {
      console.warn('Wallet connection failed:', e);
    }
  };

  // Safe fallback config
  let rpcUrl = 'https://rpc.testnet.xion.dev';
  let chainId = 42069;
  if (Constants?.expoConfig?.extra) {
    rpcUrl = Constants.expoConfig.extra.RPC_URL ?? rpcUrl;
    chainId = Constants.expoConfig.extra.CHAIN_ID ?? chainId;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🚀 XION Dashboard</Text>
      {connector.connected ? (
        <>
          <Text style={styles.label}>Wallet Address:</Text>
          <Text style={styles.value}>{address}</Text>
          <Text style={styles.label}>Balance:</Text>
          <Text style={styles.value}>{balance} XION</Text>

          <Text style={styles.label}>📜 Recent Transactions:</Text>
          {transactions.length === 0 ? (
            <Text style={styles.value}>No transactions found.</Text>
          ) : (
            transactions.map((tx) => (
              <View key={tx.hash} style={styles.txCard}>
                <Text style={styles.txType}>🔁 {tx.type}</Text>
                <Text style={styles.txDetail}>Height: {tx.height}</Text>
                <Text style={styles.txDetail}>Date: {tx.date}</Text>
              </View>
            ))
          )}
        </>
      ) : (
        <Text style={styles.connect} onPress={connectWallet}>
          🔌 Tap to Connect Wallet
        </Text>
      )}
      <Text style={styles.footer}>RPC: {rpcUrl}</Text>
      <Text style={styles.footer}>Chain ID: {chainId}</Text>
    </ScrollView>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0d1117',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#58a6ff',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    color: '#c9d1d9',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#8b949e',
  },
  connect: {
    fontSize: 18,
    color: '#58a6ff',
    marginVertical: 20,
  },
  footer: {
    fontSize: 12,
    color: '#444c56',
    marginTop: 30,
  },
  txCard: {
    backgroundColor: '#161b22',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: '100%',
  },
  txType: {
    fontSize: 16,
    color: '#c9d1d9',
    fontWeight: 'bold',
  },
  txDetail: {
    fontSize: 14,
    color: '#8b949e',
  },
});
