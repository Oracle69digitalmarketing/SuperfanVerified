import React from 'react';
import { Button, Text, View } from 'react-native';
import { useWallet } from './WalletProvider';

export function LoginButton() {
  const { account, login, logout } = useWallet();

  return (
    <View>
      {account ? (
        <View>
          <Text>Welcome, {account.bech32Address}</Text>
          <Button title="Logout" onPress={logout} />
        </View>
      ) : (
        <Button title="Login with XION" onPress={login} />
      )}
    </View>
  );
}
