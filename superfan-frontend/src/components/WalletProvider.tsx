import React, { useEffect, useState, createContext, useContext } from 'react';
import { getSigningClient } from '@burnt-labs/xion-client';
import { Abstraxion, useAbstraxion } from '@burnt-labs/abstraxion-react-native';

// --- Context -- -
export const WalletContext = createContext<any>(null);
export const useWallet = () => useContext(WalletContext);

/**
 * @summary Provides wallet context to the application.
 * @description This component wraps the application and provides access to the user's XION wallet,
 * a signing client, and login/logout functions. It handles the initialization of the XION
 * SDK and checks for an existing session.
 */
export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const [abstraxion, setAbstraxion] = useState<any>(null);
  const [xionClient, setXionClient] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      // Initialize Abstraxion
      const newAbstraxion = new Abstraxion();
      setAbstraxion(newAbstraxion);

      // Check for existing account
      const existingAccount = await newAbstraxion.getAccount();
      if (existingAccount) {
        setAccount(existingAccount);
        const client = await getSigningClient("https://testnet-rpc.xion-api.com", existingAccount);
        setXionClient(client);
      }
    };
    init();
  }, []);

  /**
   * @summary Initiates the login process with the XION wallet.
   * @description This function uses the Abstraxion SDK to open the login modal and allow the
   * user to create or log in to their wallet. Once logged in, it sets the account and
   * creates a signing client.
   */
  const login = async () => {
    if (abstraxion) {
      const newAccount = await abstraxion.login();
      setAccount(newAccount);
      const client = await getSigningClient("https://testnet-rpc.xion-api.com", newAccount);
      setXionClient(client);
    }
  };

  /**
   * @summary Logs the user out of their XION wallet.
   * @description This function uses the Abstraxion SDK to log the user out and clears the
   * account and signing client from the state.
   */
  const logout = async () => {
    if (abstraxion) {
      await abstraxion.logout();
      setAccount(null);
      setXionClient(null);
    }
  };

  return (
    <WalletContext.Provider value={{ account, xionClient, login, logout }}>
      {children}
    </WalletContext.Provider>
  );
}