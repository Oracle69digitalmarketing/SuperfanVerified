import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import * as Sentry from "sentry-expo";
import AppNavigator from "./AppNavigator";
import { AbstraxionProvider, useAbstraxion } from "@burnt-labs/abstraxion-react-native";

// Local DB
const db = SQLite.openDatabase("fanbase.db");

// Deep linking
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

// DB Setup
const setupDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        wallet_address TEXT UNIQUE,
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

// Insert or update logged-in user
const upsertUser = (walletAddress: string) => {
  if (!walletAddress) return;
  db.transaction((tx) => {
    tx.executeSql(
      `INSERT OR IGNORE INTO users (username, email, wallet_address, points, rank) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        `user_${walletAddress.slice(0, 6)}`, // placeholder username
        `${walletAddress}@superfan.io`,     // placeholder email
        walletAddress,
        0,
        0,
      ],
      () => console.log(`✅ User ${walletAddress} upserted`),
      (_, error) => {
        console.error("❌ upsert error:", error);
        Sentry.Native.captureException(error);
        return false;
      }
    );
  });
};

// Wrapper to sync Abstraxion login with SQLite
function AuthSync() {
  const { address } = useAbstraxion();

  useEffect(() => {
    if (address) {
      console.log("🔑 Logged in wallet:", address);
      upsertUser(address);
    }
  }, [address]);

  return null; // nothing to render
}

export default function App() {
  useEffect(() => {
    setupDatabase();
  }, []);

  return (
    <AbstraxionProvider config={{ appName: "SuperfanVerified" }}>
      <AuthSync />
      <NavigationContainer linking={linking}>
        <AppNavigator />
      </NavigationContainer>
    </AbstraxionProvider>
  );
}
