// App.tsx
import './globals'; // This must be the very first import
import React from 'react';
import { AbstraxionProvider } from '@burnt-labs/abstraxion-react-native';
import MainApp from './MainApp';
import Constants from 'expo-constants';

const App = () => {
  const config = {
    rpcUrl: Constants.expoConfig?.extra?.RPC_URL,
    chainId: Constants.expoConfig?.extra?.CHAIN_ID
  };

  return (
    <AbstraxionProvider config={config}>
      <MainApp />
    </AbstraxionProvider>
  );
};

export default App;
