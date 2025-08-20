// App.tsx
import './globals'; // This must be the very first import
import React, { useEffect } from 'react';
import * as Updates from 'expo-updates';
import LogRocket from '@logrocket/react-native';
import Constants from 'expo-constants';
import { AbstraxionProvider } from '@burnt-labs/abstraxion-react-native';
import MainApp from './MainApp';

const App = () => {
  useEffect(() => {
    LogRocket.init('0k70xf/superfanverified', {
      updateId: Updates.isEmbeddedLaunch ? null : Updates.updateId,
      expoChannel: Updates.channel,
    });
  }, []);

  const config = {
    rpcUrl: Constants.expoConfig.extra.RPC_URL,
    chainId: Constants.expoConfig.extra.CHAIN_ID
  };

  return (
    <AbstraxionProvider config={config}>
      <MainApp />
    </AbstraxionProvider>
  );
};

export default App;
