import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import * as Sentry from "sentry-expo";
import AppNavigator from "./AppNavigator";
import {
  AbstraxionProvider,
  useAbstraxion,
} from "@burnt-labs/abstraxion-react-native";

// --- Local DB ---
const db = SQLite.openDatabase("fanbase.db");

// --- Deep Linking ---
const linking = {
  prefixes: ["superfanverified://"],
  config: {
    screens: {
      Home: "home",
      Staking: "staking",
      Governance: "governance",
      QRScanner: "qrscanner",
      Users: "users",
      Scans: "scans",
      VotingHistory: "voting-history",
      LeaderboardScreen: "leaderboard",
      EventCheckIn: {
        path: "event-checkin",
        parse: { event_id: (id: string) => `${id}` },
      },
    },
  },
};

// --- DB Setup ---
const setupDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        referral_code TEXT UNIQUE,
        referred_by TEXT,
        points INTEGER DEFAULT 0,
        rank INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log("✅ users table ready"),
      (_, error) => {
        console.error("❌ users table error:", error);
        Sentry.Native.captureException(error);
        return false;
      }
    );
  });
};

// --- Session Bootstrapper ---
const SessionBootstrap = () => {
  const { account, connect, disconnect } = useAbstraxion();

  useEffect(() => {
    console.log("🔗 Current account:", account);
    // Auto-connect flow can be added here if needed
  }, [account]);

  return null; // no UI, just manages session
};

// --- Root App ---
export default function App() {
  useEffect(() => {
    setupDatabase();
    LogBox.ignoreLogs(["Non-serializable values"]); // keep logs clean
  }, []);

  return (
    <AbstraxionProvider
      config={{
        appName: "SuperfanVerified",
        chainId: "xion-testnet-1", // change for mainnet later
      }}
    >
      <NavigationContainer linking={linking}>
        <SessionBootstrap />
        <AppNavigator />
      </NavigationContainer>
    </AbstraxionProvider>
  );
}
