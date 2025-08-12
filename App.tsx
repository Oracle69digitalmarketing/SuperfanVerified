// App.tsx
import React from 'react';
import { AbstraxionProvider } from '@burnt-labs/abstraxion-react-native';
import MainApp from './MainApp';

const App = () => {
  const config = {
    rpcUrl: 'https://rpc.xion-testnet-2.burnt.com:443',
    chainId: 'xion-testnet-2'
  };

  return (
    <AbstraxionProvider config={config}>
      <MainApp />
    </AbstraxionProvider>
  );
};

export default App;

